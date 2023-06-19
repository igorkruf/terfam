//Роут добавления новости в базу (с загрузкой афиши)
import multer from "multer";
let storagePosterNews = multer.diskStorage({
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
const uploadPosterNews = multer({
  storage: storagePosterNews,
  fileFilter: fileFilter,
});
let posterNews = uploadPosterNews.fields([{ name: "posternews" }]);
export default posterNews;
/////////////////////////////////////////////////////////////////////////
