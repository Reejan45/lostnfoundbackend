const express = require("express");

require("./config/database");
const bodyParser = require("body-parser");
const lostItemRoutes = require("./routes/lostitem");
const founditem_routes = require("./routes/founditem");
const auth_routes = require("./routes/auth");

const {
  handleResourceNotFound,
  handleServerError,
} = require("./middleware/error");

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.use("/api/lostitems", lostItemRoutes);
// Found Items endpoint
app.use("/api/findings", founditem_routes);

// User signup signin endpoint
app.use(auth_routes);

app.use(handleResourceNotFound);

app.use(handleServerError);

app.listen(8000, () => {
  console.log("Server started.");
});
