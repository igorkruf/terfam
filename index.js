import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// import TelegramBot from "node-telegram-bot-api";

import express from "express";
let app = express();
//import TelegramBot from "node-telegram-bot-api";
//Определим корневую папку
import __dirname from "./__dirname.js";
console.log(__dirname);
app.use(express.static(`${__dirname}/public/`));

//////////////////////////////////////////////////
//Подключаем шаблонизатор
import expressHandlebars from "express-handlebars";
const handlebars = expressHandlebars.create({
  defaultLayout: "main",
  extname: "hbs",
  // helpers: myHelpers,
});
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
//JSON.parse+ JSON.strinlyfy
app.use(express.json());
//Подключаем библиотеку cookie-parser(для считывания установленной куки при авторизации)
import cookieParser from "cookie-parser";
import expressSession from "express-session";
let secret = "inspection";
app.use(cookieParser());

//Подключаем библиотеку expressSession

app.use(
  expressSession({
    secret: secret,
  })
);
//Подгружаем mongoose и коннектимся к базе forum
import mongoose from "mongoose";

const dbConnect = async () => {
  mongoose.connect(process.env.DB_CONN);
};
dbConnect()
  .then(() => {
    console.log("Успешно подключились к базе terfam");
  })
  .catch((error) => {
    console.log("ошибка при подключении к базе данных");
    setTimeout(dbConnect, 5000);
    // return console.error(error);
  });

import adminRouter from "./routes/admin.js";
import mainRouter from "./routes/main.js";
////////////////////
app.use("/admin", adminRouter);
app.use("/", mainRouter);

// app.get("/", function (req, res) {
//   res.render("index", {
//     title: "Тэст telegrammbot",
//     // listemployees: myData.listemployees,
//     // services: myData.services,
//     // faqs: myData.faqs,
//   });
// });
// app.get("/page/", function (req, res) {
//   res.render("page", { text: "<b>aaa</b>" });
// });
app.use(function (req, res) {
  res.status(404).send("not found");
});
app.listen(3003, function () {
  console.log("running");
});
