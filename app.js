console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");

// MongoDB chaqirish
// const db = require("./server").db();
// const mongodb = require("mongodb");

// 1 Kirish code lar
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: session code
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         cookie: 
//         {maxAge: 100 * 60 * 30, //for 30minutes 
//     },
//     store: store,
//     resave: true,
//     saveUninitialised: true,
//  } )
//  );

// 3 views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/shop", router_bssr);
app.use("/", router);

module.exports = app;
