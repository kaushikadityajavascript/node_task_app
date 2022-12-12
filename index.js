const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./models/index");
const app = express();

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/task", require("./routes/task"));

app.listen(3000, () => {
  console.log("App will run on port 3000");
});
