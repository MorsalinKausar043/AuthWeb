require("dotenv").config();
const express = require('express');
const path = require("path");
require("./db/db");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 8001;
const router = require("./router");
const AuthUser = require("./models/conn");

// middleware link
const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// middleware
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(express.static(staticPath));
app.use(router);
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);



// app.listen
app.listen(port , () => console.log(`express server port ${port}`))
