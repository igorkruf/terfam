import express from "express";
import adminController from "../controllers/adminController.js";
import posterServices from "./multer/services.js"; //хранилище афиш сервисов
import posterNews from "./multer/news.js"; //хранилище афиш новостей
import fotoGallery from "./multer/fotogallery.js"; //для фотогаллерей
const adminRouter = express.Router();
adminRouter.get("/", adminController.panel);
////////////////////////////////////////////////
adminRouter.get("/addservice", adminController.formAddService);
adminRouter.post("/addservice", posterServices, adminController.addService);

//////////////////////////////////////////////////////
adminRouter.get("/addnews", adminController.formaddnews);
adminRouter.post("/addnews", posterNews, adminController.addNews); //+подгружаем афишу новости(multer)
adminRouter.delete("/delnews/:id", adminController.delNews);
adminRouter.get("/listnews", adminController.getListNews);
adminRouter.put("/savechangesnews", adminController.saveChangesNews);
adminRouter.get("/login", adminController.login);
adminRouter.post("/login", adminController.loginIn);
adminRouter.get("/category", adminController.getCategory);
adminRouter.post("/category", adminController.addCategory);
adminRouter.put("/category", adminController.saveChangesCategory);
adminRouter.delete("/category/:id", adminController.delCategory);
adminRouter.post("/getformeditcategory", adminController.getFormEditCategory);
adminRouter.get("/service", adminController.getListServices);

adminRouter.post("/getformeditservice", adminController.getFormEditService);
adminRouter.put(
  "/savechangesservice",
  posterServices,
  adminController.saveChangesService
);
adminRouter.delete("/service/:id", adminController.delServices);
adminRouter.get(
  "/galleryservice/:idservice",
  adminController.getGalleryService
);
adminRouter.delete("/galleryservice", adminController.delGalleryItem);
adminRouter.post(
  "/addingalleryservice",
  fotoGallery,
  adminController.addInGalleryService
);
adminRouter.get("/videoservice/:idservice", adminController.getVideoService);
adminRouter.post("/videoservice", adminController.addVideoService);
adminRouter.delete("/videoservice/:idservice", adminController.delVideoService)
adminRouter.delete("/delregistration/:id", adminController.delRegistration);
adminRouter.get("/listtariffes", adminController.getListTariffes);
adminRouter.post("/addtariff", adminController.addTariff);
adminRouter.delete("/deltariff/:id", adminController.delTariff);
adminRouter.get("/edittariff/:id", adminController.getFormEditTariff);
adminRouter.put("/edittariff", adminController.saveChangesTariff);
adminRouter.get("/listtype", adminController.getListTypes);
adminRouter.post("/addtypeservice", adminController.addTypeService);
adminRouter.delete("/deltypeservice/:id", adminController.delTypeService);
adminRouter.get("/edittypeservice/:id", adminController.getFormEditTypeService);
adminRouter.put("/edittypeservice/:id", adminController.saveChangesType);

export default adminRouter;
