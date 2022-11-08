//Схемы документов
import fs from "fs/promises";
import __dirname from "../__dirname.js";
import News from "../models/new.js";
import Category from "../models/category.js";
import Service from "../models/service.js";
import Helpers from "../_helpers.js";

import { DateTime } from "luxon";

// import { to, necessary } from "../_services.js";
export default {
  main: async (req, res) => {
    let listServices = await Service.find({}).lean();
    console.log(listServices);
    let listCategory = await Category.find({}).lean();
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
      title: "Территория семьи",
      listCategory: listCategory,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
      },
      // main: true,
    });
    //   }
  },
  getListNews: async (req, res) => {
    console.log("проверяем есть ли в базе объявления!!!");
    let listCategory = await Category.find({}).lean();
    let listNews = await News.find({}).lean();
    console.log(listNews);
    if (listNews.length > 0) {
      res.render("listnews", {
        listNews: listNews,
        listCategory: listCategory,
        layout: "main",
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
      });
    }
  },
  getAboutService: async (req, res) => {
    let listCategory = await Category.find({}).lean();
    console.log(`О сервисе: ${req.params.idservice}`);
    let selectedService = await Service.findById(req.params.idservice).lean();
    console.log(selectedService);
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
    /////////////////////////////
    res.render("index", {
      //       necessary: necessary,
      listCategory: listCategory,
      title: selectedService.nameService,
      idService: idService,
      selectedservice: selectedService,
      galleryService: files,
      kolVo: kolVo,
      aboutService: true,
      helpers: {
        toUpperCase: Helpers.toUpperCase,
      },
      layout: "main",
    });
  },
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
};
