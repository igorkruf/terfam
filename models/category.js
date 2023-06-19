import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    nameCategory: {
      type: String,
      required: true,
    },
    ageCategory: {
      type: String,
    },
  },

  {
    collection: "category",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const category = mongoose.model("category", newSchema);
export default category;
