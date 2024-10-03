const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3003;

let invoiceData = null;

// Middleware to parse JSON requests
app.use(express.json()); // To parse JSON bodies

// Serve static files (like images, CSS, JS) from 'src/web/static'
app.use("/static", express.static(path.join(__dirname, "src/web/static")));

// Serve the React app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/web/templates/index.html"));
});

// API route to fetch invoice data
app.get("/api/invoice", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/rnd/invoice.json");
    res.json(response.data); // Send the fetched data to the client
    invoiceData = response.data;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    if (error.response) {
      res
        .status(error.response.status)
        .send("Error ", error.response.statusText);
    } else if (error.request) {
      res.status(500).send("No response from the server :(( Try again later!");
    } else {
      res.status(500).send("Error fetching invoice data");
    }
  }
});

// API route to add item to the invoice
app.post("/api/invoice/add", (req, res) => {
  try {
    if (!invoiceData) {
      return res.status(400).send("No invoice data found to update");
    }
    const newItem = req.body;
    if (
      !newItem.description ||
      !newItem.price ||
      typeof newItem.price !== "number"
    ) {
      res.status(400).send("Invalid lineItems format");
    }
    if (invoiceData.lineItems.some((item) => item.id == newItem.id)) {
      return res.status(400).json({ error: "Duplicate Item ID found" });
    }
    invoiceData.lineItems.push(newItem);
    res.status(200).json(invoiceData);
    console.log("invoice updated");
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).send("Error updating invoice");
  }
});

// API route to remove item from the invoice
app.post("/api/invoice/remove", (req, res) => {
  try {
    if (!invoiceData) {
      return res.status(400).send("No invoice data found to update");
    }
    const removedItem = req.body;
    console.log(removedItem);
    invoiceData.lineItems.filter((item) => item.id == removedItem.id);
    res.status(200).json(invoiceData);
    console.log("invoice updated");
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).send("Error removing item");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
