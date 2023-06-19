import fs from "fs/promises";
import { DateTime } from "luxon";

import Service from "./models/service.js";
import Tariff from "./models/tariff.js";

export default {
  getTimeRegistrationFromId: (timeId) => {
    return grafInspection[timeId];
  },
  getWeekDay: (dateFromDb) => {
    let date = new Date(dateFromDb);
    let formatedDate = DateTime.fromJSDate(date)
      .setLocale("ru")
      .toFormat("cccc, dd LLL ");

    return formatedDate;
  },
  getSrcPosterService: async (idService) => {
    //let bbb = await fs.access(`public/upload/portfolio/${idPortfolioItem}.jpg`);
    //return idPortfolioItem;
    ///////////////////////////////////////////////////////////
    let srcPosterService = "";
    try {
      await fs.access(`public/upload/img/services/${idService}.jpg`);
      console.log("can access");
      srcPosterService = `public/upload/img/services/${idService}.jpg`;
    } catch {
      console.error("cannot access");
      srcPosterService = `public/upload/img/services/smalllogo_fon.jpg`;
    }
    ///////////////////////////////////////////////////////////////////
    // return "gfgfgfgfg";

    return srcPosterService;
  },
  getListServicesByCategory: async (idCategory) => {
    let listServices = Service.find({}).lean();
    let listServicesByCategory = [];
    listServices.forEach((elem) => {
      if (elem.categoryService.includes(idCategory)) {
        listServicesByCategory.push(elem);
      }
    });
    return listServicesByCategory;
  },
  toUpperCase: (str) => {
    let STR = str.toUpperCase();
    return STR;
  },
  // //Блок цена для "About Service"
  // getTariffService: async (idTariff) => {
  //   let tariff = await Tariff.findById(idTariff);
  //   return tariff;
  // },
  getFormatedPrice: (price) => {
    let intPrice = Math.ceil(price); //Округляем всегда в большую сторону до целого числа
    let txtPrice = String(intPrice); //Приводим к строке
    let arrPrice = txtPrice.split("");
    arrPrice.reverse();
    let arrFormatedPrice = [];

    arrPrice.forEach((elem, i) => {
      arrFormatedPrice.push(elem);
      if ((i + 1) % 3 == 0) {
        arrFormatedPrice.push(" ");
      }
    });
    let formatedPrice = arrFormatedPrice.reverse().join("");
    // for (let i=0; i<arrPrice.length; i++){

    // }
    return formatedPrice;
  },

  //Хэлпер сравнения id typeService выбранного... c id всех видов услуг
  eqIdType: function (a, b) {
    let aa = JSON.stringify(a);
    let bb = JSON.stringify(b);
    return aa == bb;
  },
  //Хэлпер сравнения индекса слайда если первый (0) то отобразить сначала добавить класс "slide_visible"

  ifFirst: (index) => {
    if (index == 0) {
      return true;
    } else {
      return false;
    }
  },
  ifListSlides: (listSlides) => {
    if (listSlides.length > 0) {
      return true;
    }
    return false;
  },
  ///////////////////////////////////////////////////////////
  //Для правильной вставки видео с youtube

  getUrlCoverVideoService: (url) => {
    let regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
    let match = url.match(regexp);
    let idVideo = match[1];
    return `https://i.ytimg.com/vi/${idVideo}/maxresdefault.jpg`;

  },
  getUrlEmbedVideoService: (url) => {
    let regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
    let match = url.match(regexp);
    let idVideo = match[1];
    return `https://www.youtube.com/embed/${idVideo}`;

  },
  getNameService: async (idService) => {
    let nameService = await Service.findById(idService);
    return nameService;





  }
};

