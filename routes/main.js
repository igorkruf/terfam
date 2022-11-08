import express from "express";
import mainController from "../controllers/mainController.js";
const mineRouter = express.Router();
mineRouter.get("/", mainController.main);
mineRouter.get("/service/:idservice", mainController.getAboutService);
mineRouter.get(
  "/service/category/:idcategory",
  mainController.getListServicesByCategory
);
mineRouter.get("/listnews", mainController.getListNewsInnerHtml);
mineRouter.get("/news", mainController.getListNews);

export default mineRouter;
