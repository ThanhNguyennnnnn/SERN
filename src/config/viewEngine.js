import  express  from "express";

let configViewEngine = (app) => {
    // arrow function
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs"); // tuong tu jps cua java
    app.set("views", "./src/views");
}

module.exports = configViewEngine;