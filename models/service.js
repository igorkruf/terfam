import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    typeService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "typeservice",
    },
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
    //Ниже приведен правильный код(схема)
    // posts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Story'
    //   }
    // ]
    colorService: {
      type: String,
    },
    tariffesService: {
      type: Array,
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
