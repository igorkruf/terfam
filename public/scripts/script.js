console.log("подключили скрипты");
//Для всплывающих подсказок

let start = async function () {
  let headerLogo = document.querySelector(".header__logo");
  headerLogo.addEventListener("click", () => {
    console.log("www");
    window.location.href = "/";
  });
  let mainContent = document.querySelector(".main");
  let listServices = document.querySelector("[data-listservices]");
  let listServicesItem = document.querySelector("[data-aboutservice]");
  let aboutService = document.querySelector("[data-aboutservice]");
  let listCategoryInnerhtml = document.querySelectorAll(
    ".menu__item-innerhtml"
  );

  let listTypeAdvServicesInnerhtml = document.querySelectorAll(
    ".menu__item_adv-innerhtml"
  );

  for (let i = 0; i < listTypeAdvServicesInnerhtml.length; i++) {
    listTypeAdvServicesInnerhtml[i].addEventListener("click", function () {
      console.log("wwwwwwwwwwwwwwwwwwwwwwwwww");
      window.location.href = `/services/type/${this.dataset.idtypeservice}`;
    });
  }

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
    //Переход на услугу из слайдера для мобильных устройств
    let listMobileSliderItem = document.querySelectorAll(".mobile-slideritem");
    listMobileSliderItem.forEach((elem) => {
      elem.addEventListener("click", function () {
        window.location.href = `/service/${this.firstElementChild.value}`;
      });
    });
    let slider = listServices.querySelector(".slider");
    if (slider) {
      //проверяем есть ли блок .slider (у нас он только на гланой странице ) если есть то выполняем следующий код
      let startSliderId = setInterval(startSlider, 5000);

      let listSlides = document.querySelectorAll(".slide");
      for (let i = 0; i < listSlides.length; i++) {
        listSlides[i].addEventListener("mouseover", () => {
          clearInterval(startSliderId);
        });
        listSlides[i].addEventListener("mouseout", () => {
          startSliderId = setInterval(startSlider, 5000);
        });
        let btnToLeft = listSlides[i].querySelector(".btn-to_left");
        let btnToRight = listSlides[i].querySelector(".btn-to_right");
        //Клик по кнопке в лево
        btnToLeft.addEventListener("click", function (event) {
          event.stopPropagation();
          listSlides.forEach((el) => {
            el.classList.remove("slide_visible");
          });
          if (i == 0) {
            listSlides[listSlides.length - 1].classList.add("slide_visible");
          } else {
            listSlides[i].previousElementSibling.classList.add("slide_visible");
          }
        });
        //Клик по кнопке в право
        btnToRight.addEventListener("click", function () {
          listSlides.forEach((el) => {
            el.classList.remove("slide_visible");
          });
          if (i == listSlides.length - 1) {
            listSlides[0].classList.add("slide_visible");
          } else {
            listSlides[i].nextElementSibling.classList.add("slide_visible");
          }
        });
        //Переход на страницу услуги
        let nameService = listSlides[i].querySelector(
          ".slider-item__about_name"
        );
        let idService = nameService.firstElementChild.value;
        nameService.addEventListener("click", () => {
          window.location.href = `/service/${idService}`;
        });
        //Переход на список услуг данного типа
        let nameTypeService = listSlides[i].querySelector(
          ".slider-item__about_type"
        );
        let idTypeService = nameTypeService.firstElementChild.value;
        nameTypeService.addEventListener("click", () => {
          window.location.href = `/services/type/${idTypeService}`;
        });
      }
      function startSlider() {
        let visibleSlide = document.querySelector(".slide_visible");
        let btnToRight = visibleSlide.querySelector(".btn-to_right");
        btnToRight.click();
      }
    }
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
  /////////////////////////////////

  if (aboutService) {
    let aboutserviceHelpBtn = aboutService.querySelector(
      ".aboutservice__help-btn"
    );
    aboutserviceHelpBtn.addEventListener("click", async function () {
      console.log("Кликнули на кнопке записи");
      let idService = this.previousElementSibling.value;
      console.log(`sss:${idService}`);
      let response = await fetch(`/message/${idService}`, {
        method: "GET",
      });
      let result = await response.text();
      console.log(result);
      document.querySelector(".modal_content").innerHTML = result;
      wrapmodal.classList.add("visible");
      //Отправка на почту
      let formMessageVariantEmail = document.querySelector(
        ".form-message__variant_email"
      );
      formMessageVariantEmail.addEventListener("click", async function () {
        this.firstElementChild.lastElementChild.innerHTML = "";
        let nameService =
          document.querySelector(".form-message").dataset.formmessage;
        console.log(nameService);
        let name = document.querySelector(".form-message__input_name");
        name.addEventListener("input", function () {
          proverkaFormMessage(this);
        });
        let tel = document.querySelector(".form-message__input_tel");
        tel.addEventListener("input", function () {
          proverkaFormMessage(this);
        });
        let text = document.querySelector(".form-message__input_text");
        text.addEventListener("input", function () {
          proverkaFormMessage(this);
        });
        if (name.value == "") {
          name.classList.add("form-message__input_error");
          name.focus();
        } else if (tel.value == "") {
          tel.classList.add("form-message__input_error");
          tel.focus();
        } else if (text.value == "") {
          text.classList.add("form-message__input_error");
          text.focus();
        } else {
          this.firstElementChild.lastElementChild.classList.remove(
            "form-message__loader_hidden"
          );
          let response = await fetch("/message/on-email", {
            method: "POST",
            body: JSON.stringify({
              name: name.value,
              tel: tel.value,
              text: text.value,
              nameservice: nameService,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          let result = await response.json();
          if (result.itog == 1) {
            this.firstElementChild.lastElementChild.classList.add(
              "form-message__loader_hidden"
            );
            this.firstElementChild.lastElementChild.innerHTML =
              "Сообщение отправлено! ";
            this.firstElementChild.onclick = (event) => {
              this.firstElementChild.lastElementChild.innerHTML =
                "Для повторной отправки закрой это окно ";
              event.stopPropagation(); //после успешной отправки отключаем всплытие события клик тем самым не будут отправляться повторно
            };
          } else {
            this.firstElementChild.lastElementChild.innerHTML =
              "Ошибка! Попробуй ещё раз";
          }
        }
      });
      //отправим на whatsapp
      let formMessageVariantWtsp = document.querySelector(
        ".form-message__variant_wtsp"
      );
      formMessageVariantWtsp.addEventListener("click", () => {
        let text = document.querySelector(".form-message__input_text").value;
        text = text.replace(/<\/?[a-zA-Z]+>/gi, ""); //удаляем все теги
        let uri = `https://wa.me/79122672982?text=${text}`;
        window.location.href = encodeURI(uri);
      });
    });

    let detailPriceService = aboutService.querySelector(".detailPrice");
    let idService = detailPriceService.previousElementSibling.value;
    detailPriceService.addEventListener("click", async () => {
      let response = await fetch(`/detailprice/${idService}`, {
        method: "GET",
      });
      let result = await response.text();

      document.querySelector(".modal_content").innerHTML = result;
      wrapmodal.classList.add("visible");
    });
  }
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

  if (document.querySelector('[data-videoservice]')) {
    let videos = document.querySelectorAll('.video');
    videos.forEach(function (elem) {
      elem.classList.add('video_enabled');
      setupVideo(elem);

    })
  };
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
function proverkaFormMessage(elem) {
  if (elem.value == "") {
    elem.classList.add("form-message__input_error");
  } else {
    elem.classList.remove("form-message__input_error");
  }
}
//Видео ролики из youtube для сервиса
function setupVideo(block_video) {
  let link = block_video.querySelector('.video__link');
  let media = block_video.querySelector('.urlEmbedVideoService').value;
  let button = block_video.querySelector('.video__button');


  block_video.addEventListener('click', () => {
    let iframe = createIframe(media);

    link.remove();
    button.remove();
    block_video.appendChild(iframe);
  });

  link.removeAttribute('href');

}

function createIframe(urlEmbedVideoService) {
  let iframe = document.createElement('iframe');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('src', generateURL(urlEmbedVideoService));
  iframe.setAttribute('frameborder', '0');
  iframe.classList.add('video__media');
  return iframe;
}

function generateURL(media) {
  let query = '?rel="0"&listType=user_uploads&showinfo=0&autoplay=1';
  return media + query;
}
////////////////////////////////////////////////////////////////////////////////////////////////
