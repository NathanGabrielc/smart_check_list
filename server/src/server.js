const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const listRoutes = require("./routes/listRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", listRoutes);
app.use("/api", itemRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
