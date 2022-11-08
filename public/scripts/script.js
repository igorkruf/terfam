console.log("подключили скрипты");
//Для всплывающих подсказок

let start = async function () {
  let mainContent = document.querySelector(".main");
  let listServices = document.querySelector("[data-listservices]");
  let listServicesItem = document.querySelector("[data-aboutservice]");
  let listCategoryInnerhtml = document.querySelectorAll(
    ".menu__item-innerhtml"
  );
  let menuItems = document.querySelectorAll(".menu__item");
  menuItems.forEach((elem) => {
    elem.addEventListener("click", function () {
      menuItems.forEach((elem) => {
        elem.classList.remove("selmenuitem");
      });
      this.classList.add("selmenuitem");
    });
  });
  listCategoryInnerhtml.forEach((elem) => {
    elem.addEventListener("click", async function () {
      let response = await fetch(
        `/service/category/${this.dataset.idcategory}`,
        {
          method: "GET",
        }
      );
      let result = await response.text();
      //Меняем строку в адресной строке
      let url = "/";
      window.history.pushState({}, "", url);
      /////////////////////////////////////////
      console.log(result);
      mainContent.innerHTML = result;
      closeMainMenu(wrapmainmenu, mainMenu, menuItems);
    });
  });
  //Если выбрали список услуг(главная страница)
  if (listServices) {
    let listServicesItem = listServices.querySelectorAll(".listservices__item");

    console.log(listServicesItem);
  }
  /////////////////////////////////////////////
  let headerHamburgermenu = document.querySelector(".header_hamburgermenu");
  let wrapmainmenu = document.querySelector(".wrapmainmenu");
  let mainMenu = document.querySelector(".mainmenu");
  headerHamburgermenu.addEventListener("click", () => {
    console.log("ssssssssssssss");
    // document.body.style.overflow = "hidden";
    // document.body.style.width = "calc(100% - 17px)"; //для устранения дергания при удалении полосы прокрутки
    wrapmainmenu.classList.add("visible");
    mainMenu.classList.add("mainmenu-visible");
    // if (mainMenu.classList.contains("mainmenu-visible")) {
    //   mainMenu.addEventListener("animationend", () => {
    //     console.log("анимация главного меню завершена");
    menuItems.forEach((elem, i) => {
      setTimeout(() => {
        elem.classList.add("menu__item_loaded");
      }, 300 * i);
    });
    //   });
    // }
  });
  let closeMainMenuBtn = document.querySelector(".nav__closebtn");
  closeMainMenuBtn.addEventListener("click", () => {
    closeMainMenu(wrapmainmenu, mainMenu, menuItems);
  });
  wrapmainmenu.addEventListener("click", () => {
    closeMainMenu(wrapmainmenu, mainMenu, menuItems);
  });

  mainMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  ///////////////////////////////////////////////
  let wrapmodal = document.querySelector(".wrapmodal");
  wrapmodal.addEventListener("click", function (event) {
    console.log(event.target);
    this.classList.remove("visible");
  });
  let modal = document.querySelector(".modal");
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  //Закрытие по клику на крестике в модальном окне редактирования объявления
  let modalcloseeditnews = document.querySelector("#closenews");
  modalcloseeditnews.addEventListener("click", () => {
    wrapmodal.classList.remove("visible");
  });

  //intersection observe
  const optionsIORazdel = {
    rootMargin: "-100px",
    threshold: 0,
  };
  //Если загружен список новостей
  let listNews = document.querySelector("[data-listnews]");
  if (listNews) {
    let listImges = listNews.querySelectorAll(".listnews__item-img");
    listImges.forEach((elem) => {
      //Проверяем есть или нет Poster у новости и если нет подгружаем стандартный ...
      elem.addEventListener("error", function () {
        this.src = "/uploads/img/news/smalllogo_fon.jpg";
      });
    });
  }
  //Проверяем есть ли в базе объявления(при условии что куки с именем visited нет)
  //console.log(document.cookie);
  if (document.cookie.indexOf("visitedterfam") == -1) {
    console.log("показываем новости терфам");
    ///////////////////////////////////////////////////////
    let resGetListNews = await fetch("/listnews", {
      method: "GET",
    });
    let result = await resGetListNews.text();
    console.log(result);
    document.querySelector(".modal_content").innerHTML = result;
    //Если загружен список новостей в модальное окно
    let listNewsFetch = document.querySelector("[data-listnewsfetch]");
    if (listNewsFetch) {
      let listImgesFetch = listNewsFetch.querySelectorAll(
        ".listnewsfetch__item-img"
      );
      listImgesFetch.forEach((elem) => {
        //Проверяем есть или нет Poster у новости и если нет подгружаем стандартный ...
        elem.addEventListener("error", function () {
          this.src = "/uploads/img/news/smalllogo_fon.jpg";
        });
      });
    }
    setTimeout(() => {
      wrapmodal.classList.add("visible");
      document.cookie = "visitedterfam=1; max-age=3600";
    }, 1000);
  } else {
    console.log("уже показали новости");
  }
  ////////////////////////////////////////////////////////////
  //}
};

//Запускаем функцию start только после того как браузер полностью построен DOM HTML страницы .
document.addEventListener("DOMContentLoaded", start);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //прокрутка по клику на пункт меню до раздела с data-razdel=""
// function scrollingtorazdel(namerazdel) {
//   console.log(namerazdel);
//   let razdel = document.querySelector(`[data-razdel=${namerazdel}]`);
//   let y = razdel.getBoundingClientRect().y;
//   let otstupTop = y - 100;
//   window.scrollBy({
//     top: otstupTop,
//     behavior: "smooth",
//   });
// }
// //активация ссылки на раздел при прокрутке контента страницы
// function activatedNavLink(navlink) {
//   nl.forEach((elem) => {
//     elem.classList.remove("active");
//   });
//   navlink.classList.add("active");
// }
function closeMainMenu(wrapmainmenu, mainMenu, menuItems) {
  mainMenu.classList.remove("mainmenu-visible");
  mainMenu.classList.add("mainmenu-unvisible");

  mainMenu.addEventListener("animationend", () => {
    console.log("анимация закончена");

    if (mainMenu.classList.contains("mainmenu-unvisible")) {
      menuItems.forEach((elem) => {
        elem.classList.remove("menu__item_loaded");
      });
      mainMenu.classList.remove("mainmenu-unvisible");
      document.body.style.width = "100%"; //для удаления дергания при добавлении полосы прокрутки
      document.body.style.overflow = "auto";
      wrapmainmenu.classList.remove("visible");
    }
  });
}
