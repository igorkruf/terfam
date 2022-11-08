import fs from "fs/promises";
import { DateTime } from "luxon";

import Service from "./models/service.js";
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
};
