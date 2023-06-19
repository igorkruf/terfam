//Схемы документов
//import { JSDOM } from "jsdom";
//Для телеграмм бота////////////////////////
import TelegramBot from "node-telegram-bot-api";

/////////////////////////////////////////////
//import telegramHtml from "../_telegram_html.js";
import fetch from "node-fetch";
import fs from "fs/promises";
import __dirname from "../__dirname.js";
import News from "../models/new.js";
import Category from "../models/category.js";
import Service from "../models/service.js";
import Tariff from "../models/tariff.js";
import Type from "../models/typeservice.js";
import Video from "../models/video.js";
import Helpers from "../_helpers.js";

import sharp from "sharp"; //для работы над файлами изображений
//import { DateTime } from "luxon";
import md5 from "md5";

// import User from "../models/user.js";
// import jwt from "jsonwebtoken";
// const TOKEN_KEY = "inspection";
// const password = process.env.ADMIN_PASSWORD;

//let hashPassword = md5(process.env.ADMIN_PASSWORD);

export default {
  saveChangesNews: (req, res) => {
    console.log(`Изменяем объявление${req.body.idNews}`);
    console.log(req.body.idNews);
    console.log(req.body.textNews);
    News.updateOne(
      { _id: req.body.idNews },
      { textNew: req.body.textNews },
      function (err, result) {
        if (err) return console.log(err);
        //console.log(result);
        if (result.modifiedCount > 0) {
          res.json({ itog: "Ok" });
        }
      }
    );
  },

  formaddnews: (req, res) => {
    console.log("форма добавления новости node ");
    res.render("admin", {
      title: "Добавление объявления",
      addNews: true,
      layout: "admin",
    });
  },
  addNews: (req, res) => {
    console.log("Добавляем объявление");
    console.log(req.body);
    console.log(req.files);

    let addnews = new News({
      textNew: req.body.textnews,
    });
    addnews.save(function (err) {
      if (err) {
        console.log(err);
        res.status(201).json({
          message:
            "Ошибка при добавлении объявления в базу (скорее всего не набрал текст) Попробуй ещё раз",
        });
      } else {
        //console.log(req.host);
        let host = req.hostname;
        let protocol = req.protocol;
        let posternews = `https://terfam.ru/uploads/img/news/smalllogo_fon.jpg`;
        console.log(host);
        console.log(protocol);
        if (req.files.posternews) {
          console.log("есть афиша");
          //сохраняем афишу если выбрали
          (async () => {
            await sharp(req.files.posternews[0].path)
              .resize({
                width: 300,
                height: 300,
                fit: "inside",
              })
              .jpeg()
              .toFile(
                `${__dirname}/public/uploads/img/news/${addnews._id}.jpg`
              );
            fs.unlink(req.files.posternews[0].path);
            // posternews=`${addnews._id}.jpg`;
            posternews = `https://terfam.ru/uploads/img/news/${addnews._id}.jpg`;
          })();
        }
        //если афишу не выбрали
        else {
          console.log("без афишы");
          // posternews='smalllogo_fon.jpg';
        }
        console.log("Сохранен объект", addnews);

        (async () => {
          /////////////////////////////////////
          //let ans = JSON.stringify({ ans: "No" });
          const token = process.env.TOKEN_TELEGRAM_BOT_CHIVIC;
          //const bot = new TelegramBot(token, { polling: { interval: 1000 } });
          const bot = new TelegramBot(token, {});
          let keyboard = JSON.stringify({
            inline_keyboard: [
              [{ text: "Все объявления", url: "https://terfam/news" }],
            ],
          });
          let options = {
            caption: addnews.textNew,
            parse_mode: "HTML",
            // reply_markup: keyboard,
          };
          setTimeout(() => {
            bot.sendPhoto("@terfam111", posternews, options);
          }, 3000);

          //
          //console.log(process.env.TOKEN_TELEGRAM_BOT_CHIVIC);
          // let readStream = await fs.readFile("public/img/logo_main.png"); //считаем
          // let form = new URLSearchParams();
          // form.append("photo", readStream);
          // const response = await fetch(
          //   `https://api.telegram.org/bot5423966717:AAEPnbDgoixH55_8u3cHQl3Vymg5pjpvpR4/sendPhoto?chat_id=@terfam111`,
          //   {
          //     method: "POST",
          //     body: form,
          //   }
          // );
          // const body = await response.json();
          // console.log(body);

          // const response = await fetch(
          //   `https://api.telegram.org/bot5423966717:AAEPnbDgoixH55_8u3cHQl3Vymg5pjpvpR4/sendMessage?chat_id=@terfam111&text=${addnews.textNew}&parse_mode=HTML&reply_markup=${keyboard}`
          // );
          // const body = await response.text();
          // console.log(body);
          /////////////////////////////
        })();
        // let response = await fetch(
        //   "https://api.telegram.org/bot5423966717:AAEPnbDgoixH55_8u3cHQl3Vymg5pjpvpR4/sendMessage?chat_id=@terfam111&text=www"
        // );
        // // ////////////////////////////////////////////////////
        // const token = "5423966717:AAEPnbDgoixH55_8u3cHQl3Vymg5pjpvpR4";
        // const bot = new TelegramBot(token, { polling: true });
        // // bot.on("message", (msg) => {
        // //   console.log(msg.chat.id);
        // //   const chatId = msg.chat.id;
        // bot.sendMessage(-1001723150093, addnews.textNew);
        // // });
        // // /////////////////////////////////////////////////////////////////////
        res.status(200).json({
          message: "Объявление успешно добавлено в базу",
        });
      }
    });
  },

  getListNews: async (req, res) => {
    console.log("Получаем список объявлений");
    let listNews = await News.find({}).lean();
    //console.log(listNews);
    res.render("admin", {
      title: "Список объявлений",
      listNews: listNews,
      getListNews: true,
      layout: "admin",
    });
  },
  delNews: (req, res) => {
    console.log(req.params.id);
    News.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        fs.access(`${__dirname}/public/uploads/img/news/${req.params.id}.jpg`) //
          .then(() => {
            fs.unlink(
              `${__dirname}/public/uploads/img/news/${req.params.id}.jpg`
            );
          })
          .catch(() => {
            console.error("Can not be accessed");
            // fs.mkdir(`${_dirname}/public/upload/portfolio`, {
            // recursive: true,
            // });
          });
        res.json({ del: "Ok" });
      }
    });
  },
  panel: (req, res, next) => {
    console.log("главная админ");
    // console.log(req.cookies.hash);
    // console.log(req.signedCookies);
    const password = process.env.ADMIN_PASSWORD;
    //console.log(password);
    let hashPassword = md5(password);
    //console.log(access);
    //////////////////////////////////////////////////
    if (req.cookies.hash == hashPassword) {
      req.session.access = 1;
      console.log("header authorization есть");
      res.render("admin", {
        title: "Красноуфимск",
        layout: "admin",
      });
    } else {
      //   console.log("dfdshgsdfghkj");
      delete req.session.access;
      res.render("formlogin", {
        title: "Ввод пароля",
        layout: "login",
      });
    }
    // //////////////////////////////////////////////////////////////////////
    // jwt.verify(
    //   req.headers.authorization.split(" ")[1],
    //   TOKEN_KEY,
    //   (err, payload) => {
    //     if (err) {
    //       console.log("Ошибка при проверке токена");
    //       res.redirect("/admin/login");
    //     } else {
    //       console.log(payload);
    //       res.redirect("/admin/panel");
    //     }
    //   }
    // );
  },

  login: (req, res) => {
    console.log("принял хэш");

    res.render("admin", {
      title: "Авторизация11111 техосмотр Красноуфимск",
      layout: "admin",
    });
  },
  loginIn: (req, res) => {
    const password = process.env.ADMIN_PASSWORD;
    let hashPassword = md5(password);

    console.log(req.body.password);
    if (md5(req.body.password) == hashPassword) {
      console.log("Вы админ!!!");
      let hash = md5(req.body.password);
      res.clearCookie("to-registration");
      res.cookie("hash", hash);
      res.send();
      // res.json({
      //   token: jwt.sign({ hash: hash }, TOKEN_KEY),
      // });
    } else {
      console.log("Пароль не верен");
      res.status(201).send();
      //res.send();
    }
  },
  getCategory: async (req, res) => {
    if (req.session.access == 1) {
      let listCategory = await Category.find({}).sort({ _id: -1 }).lean();
      res.render("admin", {
        title: "Возрастные категории",

        // grafInspection: grafInspection,
        //listRegistrationItems: listRegistrationAdmin,
        listCategory: listCategory,
        getListCategory: true,

        helpers: {
          // getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
          // getWeekDay: Helpers.getWeekDay,
        },
        layout: "admin",
      });
    } else {
      res.redirect("/admin");
    }
  },
  addCategory: async (req, res) => {
    console.log("добавляем возрастную категорию");
    console.log(req.body);
    let addcategory = new Category({
      nameCategory: req.body.nameCategory,
      ageCategory: req.body.ageCategory,
    });

    addcategory.save(function (err, newcategory) {
      if (err) {
        console.log(err);
        res.status(201).json({
          massege: "Ошибка при добавлении категории",
        });
      } else {
        console.log(newcategory);
        res.status(200).json({
          massege: "Категория добавлена",
        });
      }
    });
  },
  getFormEditCategory: async (req, res) => {
    console.log(
      `загружаем форму редактирования категории в модальное окно: ${req.body.idCategory}`
    );
    let selectedCategory = await Category.findById(req.body.idCategory).lean();
    console.log(selectedCategory);
    res.render("fetchpartial", {
      selectedCategory: selectedCategory,
      getFormEditCategory: true,
      helpers: {
        // getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
        // getWeekDay: Helpers.getWeekDay,
      },
      layout: "fetch",
    });
  },
  saveChangesCategory: async (req, res) => {
    console.log(req.body);
    console.log(`изменяем категорию id:${req.body.idCategory}`);
    console.log(`имя категории: ${req.body.nameCategory}`);
    console.log(`возраст категории: ${req.body.ageCategory}`);
    let result = await Category.updateOne(
      { _id: req.body.idCategory },
      { nameCategory: req.body.nameCategory, ageCategory: req.body.ageCategory }
    );

    console.log(result);
    if (result.modifiedCount > 0) {
      res.json({ itog: "Ok" });
    }
  },
  delCategory: async (req, res) => {
    console.log(`удаляем категорию: ${req.params.id}`);

    let listServices = await Service.find({}).lean();
    console.log("ddddddddddddddddddddddddddddddddddddddddd");
    //проверяем массив с возрастными категориями каждого сервиса и удаляем из него id удаленной категории
    for (let i = 0; i < listServices.length; i++) {
      let newCategoryService = listServices[i].categoryService.filter((el) => {
        if (el != req.params.id) {
          return true;
        } else {
          return false;
        }
      });
      await Service.updateOne(
        { _id: listServices[i]._id.toString() },
        {
          categoryService: newCategoryService,
        }
      );
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    Category.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ del: "Ok" });
      }
    });
  },
  //Услуги
  formAddService: async (req, res) => {
    let listCategory = await Category.find({}).lean();
    let listTariffes = await Tariff.find({})
      .sort([["priceTariff", "1"]])
      .lean();
    let listTypes = await Type.find({}).lean();
    res.render("admin", {
      title: "Добавление услуги",
      listCategory: listCategory,
      listTariffes: listTariffes,
      listTypes: listTypes,
      formAddService: true,
      helpers: {
        // getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
        // getWeekDay: Helpers.getWeekDay,
      },
      layout: "admin",
    });
  },
  addService: async (req, res) => {
    console.log("Добавляем сервис");
    //console.log(req.files.posterService);
    let addService = new Service({
      typeService: req.body.typeService,
      nameService: req.body.nameService,
      aboutService: req.body.aboutService,
      categoryService: req.body.categoryService,
      tariffesService: req.body.tariffesService,
      colorService: req.body.colorService,
    });
    addService.save(function (err) {
      if (err) {
        console.log(err);
        res.status(201).json({
          message:
            "Ошибка при добавлении услуги в базу (скорее всего не набрал текст) Попробуй ещё раз",
        });
      } else {
        //////////////////////////////////
        if (req.files.posterService) {
          console.log("есть афиша");
          //сохраняем афишу если выбрали
          (async () => {
            await sharp(req.files.posterService[0].path)
              .resize({
                width: 600,
                height: 900,
                fit: "inside",
              })
              .jpeg()
              .toFile(`public/uploads/img/services/${addService._id}.jpg`);
            fs.unlink(req.files.posterService[0].path);
            // posternews=`${addnews._id}.jpg`;
          })();
        }
        //если афишу не выбрали
        else {
          console.log("без афишы");
          // posternews='smalllogo_fon.jpg';
        }
        /////////////////////////////////
        res.status(200).json({
          code: 1,
          message: "Сервис успешно добавлен в базу",
        });
      }
    });
  },
  getListServices: async (req, res) => {
    if (req.session.access == 1) {
      let listServices = await Service.find({}).lean();
      console.log(listServices);
      ///////////////////////////////////////////////////////
      res.render("admin", {
        title: "Список услуг",
        listServices: listServices,
        getListService: true,
        helpers: {
          getSrcPosterService: Helpers.getSrcPosterService,
        },
        layout: "admin",
      });
      ////////////////////////////////////////////////
    } else {
      res.redirect("/admin");
    }
  },
  getFormEditService: async (req, res) => {
    console.log(
      `загружаем форму редактирования сервиса в модальное окно: ${req.body.idService}`
    );
    //let listCategory = await Category.find({}).sort({ _id: -1 }).lean();
    let listCategory = await Category.find({}).lean();
    let listTariffes = await Tariff.find({})
      .sort([["priceTariff", "1"]])
      .lean();
    let listTypes = await Type.find({}).lean();
    let selectedService = await Service.findById(req.body.idService)
      .populate("typeService")
      .lean();
    let posterSelectedService;
    //Если загружали постер сервиса
    try {
      await fs.access(
        `${__dirname}/public/uploads/img/services/${req.body.idService}.jpg`
      );
      posterSelectedService = `/uploads/img/services/${req.body.idService}.jpg`;
    } catch {
      posterSelectedService = `/img/smalllogo.png`;
    }
    console.log(posterSelectedService);
    console.log(selectedService);
    res.render("fetchpartial", {
      listTypes: listTypes,
      listCategory: listCategory,
      listTariffes: listTariffes,
      selectedService: selectedService,
      posterSelectedService: posterSelectedService,
      getFormEditService: true,
      helpers: {
        eqIdType: Helpers.eqIdType,
      },
      layout: "fetch",
    });
  },
  saveChangesService: async (req, res) => {
    console.log(
      `сохраняем изменения в услуге req.body.idService ${req.body.idService}`
    );
    console.log("Проверка!!!");
    console.log(req.body.categoryService);
    console.log(req.body.tariffesService);
    //DataForm - смотри скрипт на стороне клиента иногда не задаётся в моём случае если не выбран не один тариф и ни одна возрастная категория поэтому проверяем
    let categoryService = []; // на тот случай если req.body.categoryService==undefined
    if (typeof req.body.categoryService !== "undefined") {
      categoryService = req.body.categoryService;
    }
    let tariffesService = []; // на тот случай если req.body.tariffesService==undefined

    if (typeof req.body.tariffesService !== "undefined") {
      tariffesService = req.body.tariffesService;
    }
    ////////////////////////////////////////////////////////
    console.log(req.files);
    //Если не сменили афишу услуги (не выбран файл изображения) то не переписываем файл
    if (req.files.posterService) {
      (async () => {
        await sharp(req.files.posterService[0].path)
          .resize({
            width: 600,
            height: 900,
            fit: "inside",
          })
          .jpeg()
          .toFile(
            `${__dirname}/public/uploads/img/services/${req.body.idService}.jpg`
          );
        fs.unlink(req.files.posterService[0].path);
        // posternews=`${addnews._id}.jpg`;
      })();
    }
    try {
      let result = await Service.updateOne(
        { _id: req.body.idService },
        {
          typeService: req.body.idTypeService,
          nameService: req.body.nameService,
          aboutService: req.body.aboutService,
          categoryService: categoryService,
          tariffesService: tariffesService,
          colorService: req.body.colorService,
        }
      );

      res.json({ status: "ok" });
    } catch {
      res.json({ status: "error" });
    }
  },
  /////////////////////////////////
  delServices: async (req, res) => {
    console.log(`удаляем услугу ${req.params.id}`);
    Service.findByIdAndDelete(req.params.id, async function (err, doc) {
      if (err) return console.log(err);
      try {
        await fs.access(
          `${__dirname}/public/uploads/img/services/${req.params.id}.jpg`
        );
        fs.unlink(
          `${__dirname}/public/uploads/img/services/${req.params.id}.jpg`
        );
        console.log("poster удалён");
      } catch {
        console.error("poster does not exists");
      }
      try {
        await fs.access(
          `${__dirname}/public/uploads/img/services/gallery/${req.params.id}`
        );
        fs.rm(
          `${__dirname}/public/uploads/img/services/gallery/${req.params.id}`,
          { recursive: true }
        );
        console.log("галерея удалена");
      } catch {
        console.error("gallery does not exists");
      }

      console.log("Удалена услуга", doc);
      res.json({ status: "ok" });
    });
  },
  //////////////////////////////
  getGalleryService: async (req, res) => {
    if (req.session.access == 1) {
      console.log(`id service:${req.params.idservice}`);
      //Если каталога нет то создаем его (где находятся фотографии услуги)
      try {
        await fs.access(
          `${__dirname}/public/uploads/img/services/gallery/${req.params.idservice}`
        );
      } catch {
        await fs.mkdir(
          `${__dirname}/public/uploads/img/services/gallery/${req.params.idservice}`
        );
      }

      let files = await fs.readdir(
        `${__dirname}/public/uploads/img/services/gallery/${req.params.idservice}`,
        "utf8"
      );
      files.forEach((file) => {
        console.log(file);
      });

      res.render("fetchpartial", {
        idService: req.params.idservice,
        galleryService: files,
        getGalleryService: true,
        helpers: {
          // getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
          // getWeekDay: Helpers.getWeekDay,
        },
        layout: "fetch",
      });
    } else {
      res.redirect("/admin");
    }
  },
  addInGalleryService: async (req, res) => {
    console.log(req.body.idService);
    console.log(req.files.fotoGallery);
    if (req.files.fotoGallery) {
      console.log("есть что добавить в галерею");
      //сохраняем афишу если выбрали
      let allSaveItem = []; //Пустой массив промисов

      //создадим функцию возвращающую промис
      let saveItemGallery = (idService, path, name) => {
        return new Promise((resolve) => {
          sharp(path)
            .resize({
              width: 1000,
              height: 600,
              fit: "inside",
            })
            //     //.jpeg()
            .toFile(`public/uploads/img/services/gallery/${idService}/${name}`)
            .then(() => {
              fs.unlink(path);
              resolve();
            });
        });
      };
      ///////////////////////
      req.files.fotoGallery.forEach((elem) => {
        allSaveItem.push(
          saveItemGallery(req.body.idService, elem.path, elem.originalname)
        );
      });
      Promise.all(allSaveItem)
        .then(() => {
          res.json({ status: "ok" });
        })
        .catch((error) => console.log(error));
      // setTimeout(() => {
      //   res.json({ status: "ok" });
      // }, 2000);
    }
  },
  /////////////////
  delGalleryItem: async (req, res) => {
    console.log(`${__dirname}${req.body.pathDelItem}`);
    try {
      await fs.access(`${__dirname}/public/${req.body.pathDelItem}`);

      fs.unlink(`${__dirname}/public/${req.body.pathDelItem}`);
      console.log("успешно удалено из галереи");

      res.json({ status: "ok" });
    } catch {
      console.log("нет этого в галерее");
    }
  },

  /////////////////////////////////////////////
  getVideoService: async (req, res) => {
    console.log(`Получаем список видео с помощью контроллера id service:${req.params.idservice}`);
    let serviceById = await Service.findById(req.params.idservice, ['nameService']).lean();
    console.log(serviceById);
    let listVideoService = await Video.find({ idServiceVideo: req.params.idservice }).lean();
    console.log(listVideoService);
    res.render("fetchpartial", {
      nameService: serviceById.nameService,
      idService: req.params.idservice,
      listVideoService: listVideoService,
      getVideoService: true,
      helpers: {
        getUrlCoverVideoService: Helpers.getUrlCoverVideoService,

      },
      layout: "fetch",
    });

  },

  addVideoService: async (req, res) => {
    let idService = req.body.idServiceVideo;
    let addVideoService = new Video({
      idServiceVideo: idService,
      urlVideo: req.body.videoUrl,
      nameVideo: req.body.videoName
    });
    addVideoService.save(async function (err, newVideoService) {
      if (err) {
        console.log(err);
        res.json({
          itog: "0",
          massege: "Ошибка при добавлении video",
        });
      } else {
        // let serviceById = await Service.findById(idService, ['nameService']).lean();
        // console.log(serviceById);
        // let listVideoService = await Video.find({ idServiceVideo: idService }).lean();
        // res.render("fetchpartial", {
        //   nameService: serviceById.nameService,
        //   idService: idService,
        //   listVideoService: listVideoService,
        //   getVideoService: true,
        //   helpers: {
        //     getUrlCoverVideoService: Helpers.getUrlCoverVideoService,

        //   },
        //   layout: "fetch",
        // });
        // console.log(newVideoService);
        // // res.status(200).json({
        // //   massege: "Тариф добавлен",
        // // });
        let urlCover = Helpers.getUrlCoverVideoService(req.body.videoUrl);
        console.log(urlCover);
        res.json({

          itog: "1",
          urlCover: urlCover,
          _id: newVideoService._id
        });
      }
    });

  },
  delVideoService: async (req, res) => {
    console.log(req.params.idservice);
    // console.log(`Удаляем cссылку на видео с youtube: ${req.params.id}`);
    Video.deleteOne({ _id: req.params.idservice }, async function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      res.json({ del: 1 });
    });


  },
  /////////////////////////////////////////////
  getListTariffes: async (req, res) => {
    console.log("список тарифов");
    let listTariffes = await Tariff.find({})
      .populate("typeServiceTariff")
      .sort([["priceTariff", "1"]])
      .lean();
    let listTypes = await Type.find({}).lean();
    console.log(listTariffes);
    res.render("admin", {
      title: "Список тарифов",
      getListTariff: true,
      listTypes: listTypes,
      listTariffes: listTariffes,
      helpers: {
        //getSrcPosterService: Helpers.getSrcPosterService,
      },
      layout: "admin",
    });
  },
  addTariff: async (req, res) => {
    console.log("добавление тарифа");
    let nameTariff = req.body.nameTariff;
    let priceTariff = Number(req.body.priceTariff);
    let lessonsTariff = Number(req.body.lessonsTariff);
    let typeServiceTariff = req.body.typeServiceTariff;
    let addTariff = new Tariff({
      typeServiceTariff: typeServiceTariff,
      nameTariff: nameTariff,
      priceTariff: priceTariff,
      lessonsTariff: lessonsTariff,
    });

    addTariff.save(function (err, newTariff) {
      if (err) {
        console.log(err);
        res.json({
          itog: "0",
          massege: "Ошибка при добавлении тарифа",
        });
      } else {
        console.log(newTariff);
        // res.status(200).json({
        //   massege: "Тариф добавлен",
        // });
        res.json({
          itog: "1",
          massege: "Тариф добавлен",
        });
      }
    });
  },
  delTariff: async (req, res) => {
    // console.log(`Удаляем тариф: ${req.params.id}`);
    Tariff.deleteOne({ _id: req.params.id }, async function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        //Удаляем id удалённого тарифа из массива тарифов каждого сервиса
        let listServices = await Service.find({}).lean();
        console.log("ddddddddddddddddddddddddddddddddddddddddd");
        console.log(listServices);

        //проверяем массив с тарифами каждого сервиса и удаляем из него id удаленного тарифа
        for (let i = 0; i < listServices.length; i++) {
          let newTariffesService = listServices[i].tariffesService.filter(
            (el) => {
              if (el != req.params.id) {
                return true;
              } else {
                return false;
              }
            }
          );
          await Service.updateOne(
            { _id: listServices[i]._id.toString() },
            {
              tariffesService: newTariffesService,
            }
          );
        }

        res.json({ del: "Ok" });
      }
    });
  },
  getFormEditTariff: async (req, res) => {
    console.log("редактируем тариф");
    console.log(req.params.id);
    let listTypes = await Type.find({}).lean();
    let tariff = await Tariff.findById(req.params.id)
      .populate("typeServiceTariff")
      .lean();
    console.log(tariff);
    ///////////////////////////////////////////////////////
    res.render("fetchpartial", {
      title: "Редактирование тарифа",
      getFormEditTariff: true,
      listTypes: listTypes,
      tariff: tariff,
      getFormEditTariff: true,
      helpers: {
        eqIdType: Helpers.eqIdType,
      },
      layout: "fetch",
    });
    ////////////////////////////////////////////////
  },
  saveChangesTariff: async (req, res) => {
    console.log("sohranyaem tariff");
    console.log(req.body);
    let idTariff = req.body.editIdTariff;
    let typeServiceTariff = req.body.editTypeServiceTariff;
    let nameTariff = req.body.editNameTariff;
    let priceTariff = Number(req.body.editPriceTariff);
    let lessonsTariff = Number(req.body.editLessonsTariff);
    let result = await Tariff.updateOne(
      { _id: idTariff },
      {
        typeServiceTariff: typeServiceTariff,
        nameTariff: nameTariff,
        priceTariff: priceTariff,
        lessonsTariff: lessonsTariff,
      }
    );

    console.log(result);
    if (result.modifiedCount > 0) {
      res.json({ code: 1 });
    }
  },
  ///////////////////
  getListTypes: async (req, res) => {
    console.log("Список видов услуг");
    let listTypes = await Type.find({}).lean();
    console.log(listTypes);
    res.render("admin", {
      title: "Виды услуг",
      listTypes: listTypes,
      getListType: true,
      helpers: {},
      layout: "admin",
    });
  },
  addTypeService: async (req, res) => {
    console.log("Добавляем вид услуги");
    console.log(req.body.nameType);
    let addType = new Type({
      nameTypeService: req.body.nameType,
    });

    addType.save(function (err, newType) {
      if (err) {
        console.log(err);
        res.status(201).json({
          massege: "Ошибка при добавлении вида услуги",
          code: 0,
        });
      } else {
        console.log(newType);
        res.status(200).json({
          massege: "Вид услуги добавлен",
          code: 1,
        });
      }
    });
  },
  delTypeService: async (req, res) => {
    console.log(req.params.id);

    let listServices = await Service.find({
      typeService: req.params.id,
    }).lean(); //Выбираем услуги где typeService= удаляемому виду услуг
    console.log(listServices);
    for (let i = 0; i < listServices.length; i++) {
      let id = listServices[i]._id.toString();
      await Service.findByIdAndUpdate(id, {
        typeService: "000000000000000000000000",
      });
    }
    let listTariffes = await Tariff.find({
      typeServiceTariff: req.params.id,
    }).lean();
    for (let i = 0; i < listTariffes.length; i++) {
      let id = listTariffes[i]._id.toString();
      await Tariff.findByIdAndUpdate(id, {
        typeServiceTariff: "000000000000000000000000",
      });
      //   listTariffes[i].typeService = "";
    }
    ///////////////////////////////////////////////////////////////////
    Type.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ massege: "Вид услуги успешно удалён!", code: 1 });
      } else {
        res.json({ massege: "Ошибка при удалении вида услуг!", code: 0 });
      }
    });
  },
  getFormEditTypeService: async (req, res) => {
    console.log("форма редактирования вида услуг");
    let typeService = await Type.findById(req.params.id).lean();
    res.render("fetchpartial", {
      title: "Редактирование вида сервиса",
      typeService: typeService,
      getFormEditTypeService: true,
      helpers: {
        //eqIdType: Helpers.eqIdType,
      },
      layout: "fetch",
    });
  },
  saveChangesType: async (req, res) => {
    console.log("сохраняем изменения вида услуг");
    let result = await Type.updateOne(
      { _id: req.params.id },
      {
        nameTypeService: req.body.nameType,
      }
    );

    console.log(result);
    if (result.modifiedCount > 0) {
      res.json({ code: 1 });
    }
  },
  /////////////////////////
  getListRegistration: async (req, res) => {
    if (req.session.access == 1) {
      registrationItem.deleteMany(
        { dateRegistration: { $lt: new Date() } },
        function (err, result) {
          if (err) return console.log(err);

          console.log(result);
        }
      );
      // //Сформируем нужный нам массив (обратившись к базе данных один раз)
      let listRegistrationAdmin = [];
      let listDateRegistration = []; //для фильтрации

      // // 1. Выберем все записи из коллекции РЕГИСТРАЦИЯ
      let listRegistration = await registrationItem.find({}).lean();

      //2. Генерируем массив дат (на которые есть записи)
      listRegistration.forEach((elem) => {
        console.log(elem.dateRegistration);
        if (
          !listDateRegistration.includes(elem.dateRegistration.toISOString())
        ) {
          console.log(
            `нет в массиве даты - ${elem.dateRegistration.toISOString()}`
          );
          listDateRegistration.push(elem.dateRegistration.toISOString());
        }
      });
      console.log(listDateRegistration);

      listDateRegistration.forEach((element) => {
        let itog = {};
        let finalListRegistrationDay = [];
        listRegistration.forEach((el) => {
          if (el.dateRegistration.toISOString() == element) {
            finalListRegistrationDay.push(el);
          }
        });
        itog["items"] = finalListRegistrationDay;
        itog["date_registration"] = element;
        listRegistrationAdmin.push(itog);
      });
      console.log(listRegistrationAdmin);
      // /////////////////////////////////////////////////////////////////////////////////////////////
      //
      // let itog = []; //массив занятого времени выбранной даты

      // let listRegistrationDate = await registrationItem.distinct(
      //   "dateRegistration"
      // );
      // console.log(listRegistrationDate);
      ////////////////////////////////////////////////////////////
      // for (let registrationDate of listRegistrationDate) {
      //   let dayRegistration = {};
      //   let listRegistrationDateItems = await registrationItem
      //     .find({
      //       dateRegistration: registrationDate,
      //     })
      //     .lean();
      //   let formatedDate = DateTime.fromJSDate(registrationDate)
      //     .setLocale("ru")
      //     .toFormat("cccc, dd LLL ");
      //   dayRegistration["date"] = formatedDate;
      //   dayRegistration["items"] = listRegistrationDateItems;
      //   itog.push(dayRegistration);
      // }
      // console.log(itog);
      /////////////////////////////////////////////////////////////////////////////////
      // await Promise.all(
      //   listRegistrationDate.map(async (element) => {
      //     let dayRegistration = {};
      //     let listRegistrationDateItems = await registrationItem
      //       .find({
      //         dateRegistration: element,
      //       })
      //       .lean();
      //     let formatedDate = DateTime.fromJSDate(element)
      //       .setLocale("ru")
      //       .toFormat("cccc, dd LLL ");
      //     dayRegistration["date"] = formatedDate;

      //     dayRegistration["items"] = listRegistrationDateItems;
      //     itog.push(dayRegistration);
      //   })
      // );

      // console.log(itog);
      // //console.log(req.session.access);
      ///////////////////////////////////////////////////////
      res.render("admin", {
        title: "Список зарегистрированных",
        ggg: "5555555555",
        // grafInspection: grafInspection,
        listRegistrationItems: listRegistrationAdmin,
        getListRegistration: true,
        helpers: {
          getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
          getWeekDay: Helpers.getWeekDay,
        },
        layout: "admin",
      });
      ////////////////////////////////////////////////
    } else {
      res.redirect("/admin");
    }
  },
  delRegistration: (req, res) => {
    console.log(`Удаляем регистрацию: ${req.params.id}`);
    registrationItem.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ del: "Ok" });
      }
    });
  },
  // // addUser: async (req, res) => {
  //   //console.log(req.body);
  //   //let itogPassword = passwordHash.generate(req.body.pwdUser);
  //   let itogPassword = md5(req.body.pwdUser);
  //   let user = new User({
  //     userName: req.body.nameUser,
  //     userLogin: req.body.loginUser,
  //     userPassword: itogPassword,
  //   });
  //   user.save(function (err, newuser) {
  //     if (err) {
  //       console.log(err);
  //       //Если err.code == 11000 (есть уже пара логин: пароль)то
  //       if (err.code == 11000) {
  //         res.json({ code: 2 });
  //       } else {
  //         console.log(err.code);
  //         res.json({ code: 0 });
  //       }
  //     } else {
  //       //console.log(newuser);
  //       res.json({
  //         code: 1,
  //         token: jwt.sign({ id: newuser._id }, TOKEN_KEY),
  //         user: newuser,
  //       });
  //     }
  //   });
  //   //console.log(`newUser: ${newUser}`);
  // if (/^\S+$/.test(req.body.loginUser) && /^\S+$/.test(req.body.pwdUser)) {
  // } else {
  //   res.json({ massege: "Логин и пароль не должны содержать пробелы!!!" });
  // }
  // const user =new User({

  // })
  // console.log(`добавляем пользователя: ${user}`);
  // },
};
