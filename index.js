const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3003;

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
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    res.status(500).send("Error fetching invoice data");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
