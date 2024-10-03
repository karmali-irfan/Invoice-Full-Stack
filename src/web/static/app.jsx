"use strict";

const InvoiceHeader = ({ createdAt, dueAt }) => {
  return (
    <tr className="top">
      <td colSpan="2">
        <table>
          <tbody>
            <tr>
              <td className="title">
                <img
                  src="/static/images/cai_logo.svg"
                  style={{ width: "100%", maxWidth: "300px" }}
                  alt="Logo"
                />
              </td>
              <td>
                Invoice #: 39291 <br />
                Created: {new Date(createdAt).toLocaleDateString()} <br />
                Due: {new Date(dueAt).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
};

const Address = ({ company, fullName, email }) => {
  return (
    <tr className="information">
      <td colSpan="2">
        <table>
          <tbody>
            <tr>
              <td>
                CollectAI GmbH.
                <br />
                20457 Hamburg
                <br />
                Hamburg, Germany
              </td>
              <td>
                {company}
                <br />
                {fullName} <br />
                {email}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
};

const Items = ({ lineItems, handleRemoveItem }) => {
  return (
    <React.Fragment>
      <tr className="heading">
        <td>Item</td>
        <td>Price</td>
      </tr>

      {lineItems.map((item, key) => (
        <tr className="item last" key={key}>
          <td>
            <button
              className="icon-button"
              onClick={() => handleRemoveItem(item)}
            >
              <span className="material-icons">remove_circle_outline</span>
            </button>
            {item.description}
          </td>
          <td>${item.price.toFixed(2)}</td>
        </tr>
      ))}
    </React.Fragment>
  );
};

const AddItem = ({ setDescription, setPrice, setAddItem, error }) => {
  return (
    <tr className="item last">
      <td>
        <button className="icon-button" onClick={() => setAddItem(false)}>
          <span className="material-icons">remove_circle_outline</span>
        </button>
        <input
          type="text"
          placeholder="Description"
          onBlur={(e) => setDescription(e.target.value.trim())}
          onKeyDown={(e) => e.key == "Enter" && setDescription(e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          placeholder="Price"
          onBlur={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && setPrice(e.target.value)}
        />
      </td>
    </tr>
  );
};

const Invoice = () => {
  const [data, setData] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [addItem, setAddItem] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const postAddItem = async (updatedData) => {
    try {
      const response = await axios.post(
        "http://localhost:3003/api/invoice/add",
        updatedData,
        { withCredentials: true }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error updating invoice:", error);
      setError(error);
    }
  };

  const postRemoveItem = async (removedItem) => {
    try {
      const response = await axios.post(
        "http://localhost:3003/api/invoice/remove",
        removedItem,
        {
          withCredentials: true,
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error);
    }
  };

  const handleRemoveItem = async (removedItem) => {
    console.log(removedItem);
    const check = await postRemoveItem(removedItem);
    if (check) {
      console.log("Item successfully removed");
      const updatedData = {
        ...data,
        lineItems: data.lineItems.filter((item) => item.id !== removedItem.id),
      };
      setData(updatedData);
    }
  };

  const handleAddItem = async () => {
    setAddItem(false);
    const newItem = {
      description: description,
      price: Number(price),
      id: uuid.v4(),
    };
    const check = await postAddItem(newItem);
    if (check) {
      console.log("Invoice updated:");
      const updatedData = {
        ...data,
        lineItems: [...data.lineItems, newItem],
      };
      setDescription("");
      setPrice("");
      setData(updatedData);
    }
  };
  React.useEffect(() => {
    if (price && description) {
      handleAddItem();
    }
  }, [price, description]);

  React.useEffect(() => {
    axios
      .get("http://localhost:3003/api/invoice", { withCredentials: true })
      .then((response) => {
        response.data.lineItems = response.data.lineItems.map((item) => ({
          ...item,
          id: uuid.v4(),
        }));
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, []);

  if (error) {
    if (error.response && error.response.data) {
      return <div>{error.response.data}</div>;
    }
    return <div>{error.message}</div>;
    return <Invoice />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <table cellPadding="0" cellSpacing="0">
        <tbody>
          <InvoiceHeader createdAt={data.createdAt} dueAt={data.dueAt} />
          <Address
            company={data.company}
            fullName={data.fullName}
            email={data.email}
          />
          <Items
            lineItems={data.lineItems}
            handleRemoveItem={handleRemoveItem}
          />
          {addItem && (
            <AddItem
              setDescription={setDescription}
              setPrice={setPrice}
              setAddItem={setAddItem}
              error={error}
            />
          )}

          {/* Add Item Row */}
          <tr className="item last">
            <td>
              <button className="icon-button" onClick={() => setAddItem(true)}>
                <span className="material-icons">add_circle_outline</span>
              </button>
              Add Item
            </td>
            <td></td>
          </tr>

          {/* Total */}
          <tr className="total">
            <td></td>
            <td>
              Total: $
              {data.lineItems
                .reduce((total, item) => total + item.price, 0)
                .toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

// Render the Invoice component to the DOM
ReactDOM.render(<Invoice />, document.getElementById("invoice"));
