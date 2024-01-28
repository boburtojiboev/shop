console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); 
const store =  new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions"
});

// MongoDB chaqirish
// const db = require("./server").db();
// const mongodb = require("mongodb");

// 1 Kirish code lar
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2: session code 
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: 
        {maxAge: 1000 * 60 * 30, //for 30minutes 
    },
    store: store,
    resave: true,
    saveUninitialized: true,
 } )
 );
 app.use(function(req, res, next){
    res.locals.member = req.session.member;
    next(); 
 });

// 3 views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/shop", router_bssr);
app.use("/", router);

module.exports = app;
