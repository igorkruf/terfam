//Роут добавления новости в базу (с загрузкой афиши)
import multer from "multer";
let storagePosterServices = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});
let fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadPosterServices = multer({
  storage: storagePosterServices,
  fileFilter: fileFilter,
});
let posterService = uploadPosterServices.fields([{ name: "posterService" }]);
export default posterService;
/////////////////////////////////////////////////////////////////////////
