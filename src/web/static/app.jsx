"use strict";

// checking...
const Invoice = () => {
  const [data, setData] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [addItem, setAddItem] = React.useState(false);

  const handleRemoveItem = (id) => {
    setData({
      ...data,
      lineItems: data.lineItems.filter((item) => item.id !== id),
    });
  };

  React.useEffect(() => {
    if (price && description) {
      handleAddItem();
    }
  }, [price, description]);

  const handleAddItem = () => {
    setAddItem(false);
    const newItem = {
      description: description,
      price: Number(price),
      id: uuid.v4(),
    };
    setDescription("");
    setPrice("");
    setData({ ...data, lineItems: [...data.lineItems, newItem] });
  };

  React.useEffect(() => {
    axios
      .get("http://localhost:3003/api/invoice", { withCredentials: true })
      .then((response) => {
        response.data.lineItems = response.data.lineItems.map((item) => ({
          ...item, // Spread the existing properties of the item
          id: uuid.v4(), // Add a new id property with the index as its value
        }));
        setData(response.data);
      })
      .catch((error) => {
        console.log("Data fetch failed", error);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <table cellPadding="0" cellSpacing="0">
        <tbody>
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
                      Created: {new Date(
                        data.createdAt
                      ).toLocaleDateString()}{" "}
                      <br />
                      Due: {new Date(data.dueAt).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

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
                      {data.company}
                      <br />
                      {data.fullName} <br />
                      {data.email}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr className="heading">
            <td>Item</td>
            <td>Price</td>
          </tr>

          {data.lineItems.map((item, key) => (
            <tr className="item last" key={key}>
              <td>
                <button
                  className="icon-button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <span className="material-icons">remove_circle_outline</span>
                </button>
                {item.description}
              </td>
              {/* <td>${item.price.toFixed(2)}</td> */}
              <td>${item.price}</td>
            </tr>
          ))}

          {addItem == true && (
            <tr className="item last">
              <td>
                <button
                  className="icon-button"
                  onClick={() => setAddItem(false)}
                >
                  <span className="material-icons">remove_circle_outline</span>
                </button>
                <input
                  type="text"
                  placeholder="Description"
                  onBlur={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) =>
                    e.key == "Enter" && setDescription(e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Price"
                  onBlur={(e) => setPrice(e.target.value)}
                  onKeyDown={(e) =>
                    e.key == "Enter" && setPrice(e.target.value)
                  }
                />
              </td>
            </tr>
          )}

          <tr className="item last">
            <td>
              <button className="icon-button" onClick={() => setAddItem(true)}>
                <span className="material-icons">add_circle_outline</span>
              </button>
              Add Item
            </td>
            <td></td>
          </tr>

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
