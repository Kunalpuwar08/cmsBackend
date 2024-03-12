const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("The server is running at PORT " + PORT));
