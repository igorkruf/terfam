//Схемы документов
import fs from "fs/promises";
import __dirname from "../__dirname.js";
import News from "../models/new.js";
import Category from "../models/category.js";
import Service from "../models/service.js";
import Video from "../models/video.js";
import Helpers from "../_helpers.js";
import Tariff from "../models/tariff.js";
import Type from "../models/typeservice.js";
import { DateTime } from "luxon";
import { triggerAsyncId } from "async_hooks";
import nodemailer from "nodemailer";
//Удаляем все тэги при отправке сообщений на почту или в whatsapp (стр 274)
let removeTags = (htmlstr) => {
  return htmlstr.replace(/<\/?[a-zA-Z]+>/gi, "");
};
//////////////////////////////////////////////////
// import { to, necessary } from "../_services.js";
export default {
  main: async (req, res) => {
    let listServices = await Service.find({}).populate("typeService").lean();
    console.log(listServices);
    let listCategory = await Category.find({}).lean();
    let listTypeService = await Type.find({}).lean();
    let listTypeAdvServices = listTypeService.slice(1);
    // let listTypeService = await Type.find({}).lean();
    //Выбираем для слайдера услуги (второй или третий тип)
    let listSlides = listServices.filter(function (elem) {
      if (
        elem.typeService._id.toString() != listTypeService[0]._id.toString()
      ) {
        return true;
      } else {
        return false;
      }
    });

    // let listTypeAdvServices = listTypeService.slice(1); //удаляем из массива типов услуг первый элемент (в нашем случае развивающие услуги)

    console.log(listCategory);
    listCategory.forEach((elem) => {
      let listServiceByCategory = [];
      listServices.forEach((elemServices) => {
        if (elemServices.categoryService.includes(elem._id.toString())) {
          listServiceByCategory.push(elemServices);
        }
      });
      elem.listServices = listServiceByCategory;
    });
    console.log(listCategory);
    res.render("index", {
      //       necessary: necessary,
      listTypeAdvServices: listTypeAdvServices,
      listSlides: listSlides,
      mainPage: true,
      title: "Территория семьи",
      listCategory: listCategory,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
        ifFirst: Helpers.ifFirst,
        ifListSlides: Helpers.ifListSlides, //Проверяем длинну масива слайдов на "больше нуля" есть хотябы один слайд
      },
      // main: true,
    });
    //   }
  },
  getListNews: async (req, res) => {
    console.log("проверяем есть ли в базе объявления!!!");
    let listTypeService = await Type.find({}).lean();
    let listTypeAdvServices = listTypeService.slice(1);

    let listCategory = await Category.find({}).lean();
    let listNews = await News.find({}).lean();
    console.log(listNews);
    if (listNews.length > 0) {
      res.render("listnews", {
        listTypeAdvServices: listTypeAdvServices,
        titlePartMenu: "Наши новости",
        listNews: listNews,
        listCategory: listCategory,
        layout: "main",
        helpers: {
          toUpperCase: Helpers.toUpperCase,
          // getTariffService: Helpers.getTariffService,
          getFormatedPrice: Helpers.getFormatedPrice,
        },
      });
      //   res.json(listNews);
    }
  },
  getListNewsInnerHtml: async (req, res) => {
    console.log("проверяем есть ли в базе объявления!!! innerHTML");

    let listNewsFetch = await News.find({}).lean();
    console.log(listNewsFetch);
    if (listNewsFetch.length > 0) {
      res.render("listnewsfetch", {
        listNews: listNewsFetch,
        layout: "fetch",
        helpers: {
          toUpperCase: Helpers.toUpperCase,
          // getTariffService: Helpers.getTariffService,
          getFormatedPrice: Helpers.getFormatedPrice,
        },
      });
    }
  },
  getAboutService: async (req, res) => {
    let listCategory = await Category.find({}).lean();
    console.log(`О сервисе: ${req.params.idservice}`);
    let selectedService = await Service.findById(req.params.idservice).lean();
    console.log(selectedService);
    let listVideoService = await Video.find({ idServiceVideo: req.params.idservice }).lean();
    let listTypeService = await Type.find({}).lean();
    let listTypeAdvServices = listTypeService.slice(1);
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
    console.log(files);
    let kolVo = files.length;
    console.log(kolVo);
    let idService = selectedService._id.toString();
    //Получаем массив объектов(тарифов услуги)
    let arrayListTariffes = [];
    for (let i = 0; i < selectedService.tariffesService.length; i++) {
      let tariff = await Tariff.findById(
        selectedService.tariffesService[i]
      ).lean();
      arrayListTariffes.push(tariff);
    }
    //Вычисляем минимальную стоимость занятия услуги
    let minPrice = 1000000;
    if (arrayListTariffes.length > 0) {
      for (let i = 0; i < arrayListTariffes.length; i++) {
        let tariff = await Tariff.findById(arrayListTariffes[i]).lean();
        let pl = tariff.priceTariff / tariff.lessonsTariff;
        console.log(pl);
        if (pl < minPrice) {
          minPrice = pl;
        }
      }
    } else {
      minPrice = 0;
    }

    /////////////////////////////
    res.render("index", {
      //       necessary: necessary,
      listTypeAdvServices: listTypeAdvServices, //для меню
      listCategory: listCategory,
      title: selectedService.nameService,
      idService: idService,
      selectedservice: selectedService,
      listTariffesService: arrayListTariffes,
      minPriceService: minPrice,
      galleryService: files,
      listVideoService: listVideoService,
      kolVo: kolVo, //Колличество фотографий в галерее услуги(для css grid )
      aboutService: true,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
        // getTariffService: Helpers.getTariffService,
        getFormatedPrice: Helpers.getFormatedPrice,
        getUrlCoverVideoService: Helpers.getUrlCoverVideoService,
        getUrlEmbedVideoService: Helpers.getUrlEmbedVideoService,
      },
      layout: "main",
    });
  },
  //Собираем массив объектов(тарифов сервиса) и innerHTML их в модальное окно
  getDetailPriceService: async (req, res) => {
    console.log(req.params.id);
    let service = await Service.findById(req.params.id).lean();
    let listTariffes = service.tariffesService;
    let arrayListTariffes = [];
    for (let i = 0; i < listTariffes.length; i++) {
      let tariff = await Tariff.findById(listTariffes[i]).lean();
      arrayListTariffes.push(tariff);
    }
    console.log(arrayListTariffes);
    ///////////////////////////////////////////////////////
    res.render("fetchpartial", {
      title: "Список тарифов",
      getListTariffesService: true,
      arrayListTariffes: arrayListTariffes,
      selectedService: service,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
        getFormatedPrice: Helpers.getFormatedPrice,
      },
      layout: "fetch",
    });
    ////////////////////////////////////////////////
  },
  ////////////////////////////////////////////////////////////////////////////
  getListServicesByCategory: async (req, res) => {
    console.log(req.params.idcategory);
    let selectedCategory = await Category.findById(
      req.params.idcategory
    ).lean();
    console.log(selectedCategory);
    let listService = await Service.find({}).lean();
    let selectedServiceByCategory = [];
    listService.forEach((elem) => {
      if (elem.categoryService.includes(selectedCategory._id.toString())) {
        selectedServiceByCategory.push(elem);
      }
    });
    res.render("servicesbycategory", {
      //       necessary: necessary,

      selectedCategory: selectedCategory,
      selectedServiceByCategory: selectedServiceByCategory,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
      },
      layout: "fetch",
    });
  },
  getListServicesByType: async (req, res) => {
    let listTypeService = await Type.find({}).lean();
    let listTypeAdvServices = listTypeService.slice(1);
    // let listTypeService = await Type.find({}).lean();
    // let listTypeAdvServices = listTypeService.slice(1); //Удаляем первый тип услуг(в нашем случае развивающие услуги)
    let listCategory = await Category.find({}).lean();
    console.log(`Список сервисов данного типа: ${req.params.id}`);
    let listServicesByType = await Service.find({
      typeService: req.params.id,
    }).lean();
    let typeService = await Type.findById({ _id: req.params.id }).lean();

    res.render("servicesbytype", {
      //       necessary: necessary,
      mainPage: false,
      listTypeAdvServices: listTypeAdvServices,
      listCategory: listCategory,
      nameTypeService: typeService.nameTypeService,
      listServicesByType: listServicesByType,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
      },
      layout: "main",
    });
  },
  getFormMessage: async (req, res) => {
    console.log(`Запрос на получение формы сообщения:${req.params.idservice}`);
    let selectedService = await Service.findById(req.params.idservice).lean();
    res.render("formmessage", {
      //       necessary: necessary,
      getFormMessage: true,
      selectedService: selectedService,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
      },
      layout: "fetch",
    });
  },
  postMessageOnEmail: async (req, res) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_LOGIN, //'это почта gmail вида login@gmail.com
        pass: process.env.GMAIL_PASSWORD, //это пароль приложения
      },
    });
    let nameService = req.body.nameservice;
    let youName = removeTags(req.body.name);
    let youTel = removeTags(req.body.tel);
    let youMessage = removeTags(req.body.text);
    let sendMessage = await transporter.sendMail({
      from: '"С сайта terfam.ru" <terfam66@gmail.com>',
      to: "lika.575@yandex.ru",
      subject: `Вопросы по услуге - ${nameService}`,
      html: `<p>Меня зовут: <b>${youName}</b></p> <p>Мой телефон: <b>${youTel}</b></p> <p>Мой вопрос: ${youMessage}</p>`,
    });
    console.log(sendMessage.accepted[0]);
    if (sendMessage.accepted[0] == "lika.575@yandex.ru") {
      res.json({ itog: 1 });
    } else {
      res.json({ itog: 0 });
    }
  },
};
