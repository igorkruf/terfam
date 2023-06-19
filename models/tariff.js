import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    typeServiceTariff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "typeservice",
    },
    nameTariff: {
      type: String,
      required: true,
    },
    priceTariff: {
      type: Number,
      require: true,
    },
    lessonsTariff: {
      type: Number,
      default: 1,
    },
  },

  {
    collection: "tariffes",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const Tariff = mongoose.model("Tariff", newSchema);
export default Tariff;
