import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
    {
        idServiceVideo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        nameVideo: {
            type: String,
            required: true,
        },
        urlVideo: {
            type: String,
            required: true,
        },


    },

    {
        collection: "videos",
        versionKey: false,
    }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const Video = mongoose.model("Video", newSchema);
export default Video;
