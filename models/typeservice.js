import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    nameTypeService: {
      type: String,
      required: true,
    },
  },

  {
    collection: "typeservice",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const typeService = mongoose.model("typeservice", newSchema);
export default typeService;
