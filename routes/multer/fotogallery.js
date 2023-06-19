//Роут добавления новости в базу (с загрузкой афиши)
import multer from "multer";
let storageFotoGallery = multer.diskStorage({
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
const uploadFotoGallery = multer({
  storage: storageFotoGallery,
  fileFilter: fileFilter,
});
let fotoGallery = uploadFotoGallery.fields([{ name: "fotoGallery" }]);
export default fotoGallery;
/////////////////////////////////////////////////////////////////////////
