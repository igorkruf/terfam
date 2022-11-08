import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    nameService: {
      type: String,
      required: true,
    },
    aboutService: {
      type: String,
      required: true,
    },
    categoryService: {
      type: Array,
    },
    colorService: {
      type: String,
    },
  },

  {
    collection: "services",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const Service = mongoose.model("Service", newSchema);
export default Service;
