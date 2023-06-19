console.log("подключили скрипты Админпанели");
//Определяем новый промис (возвращает массив выбранных возрастных категорий сервиса )
let selected = (list) => {
  return new Promise((resolve, reject) => {
    let selected = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked === true) {
        selected.push(list[i].value);
      }
    }
    // list.forEach((elem) => {
    //   if (elem.checked === true) {
    //     selected.push(elem.value);
    //   }
    // });
    resolve(selected);
  });
};
// //Определяем новый промис (возвращает массив выбранных тарифов сервиса )
// let selectedTariffService = (listTariff) => {
//   return new Promise((resolve, reject) => {
//     let selectedTariffService = [];
//     listTariff.forEach((elem) => {
//       if (elem.checked === true) {
//         selectedTariffService.push(elem.value);
//       }
//     });
//     resolve(selectedTariffService);
//   });
// };
// для форматирования даты
let DateTime = luxon.DateTime;

//let fd = DateTime.fromJSDate(ddd).setLocale("ru").toFormat("yyyy LLL dd");
//let fd = DateTime.fromISO(ddd).setLocale("ru").toFormat("yyyy LLL dd");
//console.log(fd);
let start = function () {
  //Для всплывающих подсказок
  let tooltip = document.querySelector(".tooltip");

  //для datepicker
  //исли выбран пункт меню Рабочий календарь
  let rabCalendar = document.querySelector(".formAddCalendarItem");

  if (rabCalendar) {
    //CalendarItem
    let listCalendarItemMenudel = document.querySelectorAll(
      ".listCalendar__item-menudel"
    );
    listCalendarItemMenudel.forEach(function (elem) {
      elem.addEventListener("click", function () {
        console.log("кликнули по корзине");
        let id = this.lastElementChild.value;
        console.log(this.firstElementChild);
        console.log(this.lastElementChild);
        this.firstElementChild.classList.toggle("del__confirm-visible");

        this.querySelector(".delcalendaritem").addEventListener(
          "click",
          async function () {
            let response = await fetch(`/admin/delcalendaritem/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            if (response.status == 200) {
              tooltip.classList.add("tooltip-good");
              console.log();
              this.parentElement.parentElement.parentElement.parentElement.parentElement.removeChild(
                this.parentElement.parentElement.parentElement.parentElement
              );
            } else {
              tooltip.classList.add("tooltip-error");
            }
            tooltip.innerHTML = result.message;
            setTimeout(() => {
              console.log("удаляем классы у tooltip");
              tooltip.classList.remove("tooltip-good");
              tooltip.classList.remove("tooltip-error");
            }, 6000);
          }
        );
        //   async function () {
        //     // event.stopPropagation();
        //     console.log(id);
        //     console.log("привет ты подтвердил удаление объявления");
        //     let response = await fetch(`/admin/delnews/${id}`, {
        //       method: "DELETE",
        //     });
        //     let result = await response.json();
        //     console.log(result);
        //     if (result.del == "Ok") {
        //       elem.parentElement.parentElement.style.display = "none";
        //    }
      });
    });

    let selectedDate;
    let formatedDate;
    let inp = rabCalendar.querySelector(".choiceDate");

    let minDate = new Date();
    // maxDate = new Date();
    // // увеличиваем текущую дату на 1 месяц
    // maxDate.setMonth(minDate.getMonth() + 1);
    const choiceDate = datepicker(inp, {
      startDay: 1,
      customDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      customMonths: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июнь",
        "Июль",
        "Авг",
        "Сен",
        "Окт ",
        "Ноя",
        "Дек",
      ],
      minDate: minDate,

      onSelect: async (instance, data) => {
        console.log(data);
        formatedDate = DateTime.fromJSDate(data)
          .setLocale("ru")
          .toFormat("cccc, dd LLL yyyy");
        // const formatedDate = new Intl.DateTimeFormat("ru", {
        //   dateStyle: "long",
        // }).format(data);
        let span = document.querySelector(".formateddate");
        span.innerHTML = formatedDate;
        //Присваиваем значение "глобальной :)" переменной selectedDate, объявленной выше
        selectedDate = data;
      },
    });
    let listCalendar = document.querySelector(".listCalendar");
    let idTypeDay = rabCalendar.querySelector(".formAddCalendarItem__type");
    let addDayBtn = rabCalendar.querySelector(".formAddCalendarItem__addbtn");
    addDayBtn.addEventListener("click", async () => {
      let response = await fetch("/admin/calendar", {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          idTypeDay: idTypeDay.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      // if (response.status == 200) {
      //   console.log("День добавлен");
      //   let result = await response.json();
      //   console.log(result);
      // }
      let result = await response.json();
      if (response.status == 200) {
        tooltip.classList.add("tooltip-good");
        let sec = document.createElement("section");
        sec.classList.add("listCalendar__item");
        sec.classList.add("grid");
        sec.innerHTML = `<section class='listCalendar__item-opisanie'>${formatedDate} </section><section></section>`;
        //console.log(section);
        console.log(this);
        listCalendar.prepend(sec);
      } else {
        tooltip.classList.add("tooltip-error");
      }
      tooltip.innerHTML = result.message;
      setTimeout(() => {
        console.log("удаляем классы у tooltip");
        tooltip.classList.remove("tooltip-good");
        tooltip.classList.remove("tooltip-error");
      }, 6000);
    });
  }

  ///////////////////////////////////////////////

  //устанавливаем режим работы пункта(в данном примере даем 30 минут на одно транспортное средство)
  // let grafInspection = [
  //   "9:00",
  //   "9:30",
  //   "10:00",
  //   "10:30",
  //   "11:00",
  //   "11:30",
  //   "13:00",
  //   "13:30",
  //   "14:00",
  //   "14:30",
  //   "15:00",
  //   "15:30",
  //   "16:00",
  //   "16:30",
  // ];

  ////////////////////////////////////////////////////////////////
  let listCategory = document.querySelector(".listCategory");
  //Если выбран пункт меню "возрастные категории"
  if (listCategory) {
    let inputNameCategory = document.querySelector(".name_category");
    let inputAgeCategory = document.querySelector(".age_category");
    let btnAddCategory = document.querySelector(".form__btn-addcategory");
    btnAddCategory.addEventListener("click", async () => {
      let response = await fetch("/admin/category", {
        method: "POST",
        body: JSON.stringify({
          nameCategory: inputNameCategory.value,
          ageCategory: inputAgeCategory.value,
        }),
        headers: { "Content-Type": "application/json" },
      });

      let result = await response.json();
      if (response.status == 200) {
        tooltip.classList.add("tooltip-good");
        //this.parentElement.parentElement.removeChild(this.parentElement);
      } else {
        tooltip.classList.add("tooltip-error");
      }
      tooltip.innerHTML = result.massege;
      setTimeout(() => {
        console.log("удаляем классы у tooltip");
        tooltip.classList.remove("tooltip-good");
        tooltip.classList.remove("tooltip-error");
      }, 6000);
    });
    //console.log(result);
    //Редактирование категории
    let editCategory = document.querySelectorAll(".edit-category");
    editCategory.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idCategory = this.querySelector(".idcategory").value;
        console.log(idCategory);
        let response = await fetch("/admin/getformeditcategory", {
          method: "POST",
          body: JSON.stringify({ idCategory: idCategory }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let result = await response.text();
        console.log(result);
        document.querySelector(".modal_content").innerHTML = result;
        wrapmodal.classList.add("visible");
        let formEditCategory = document.querySelector(
          "[data-formeditcategory]"
        );
        let formBtnEditCategory = formEditCategory.querySelector(
          ".form__btn-editcategory"
        );
        formBtnEditCategory.addEventListener("click", async () => {
          console.log("сохраняем изменения");
          let editIdCategory =
            formEditCategory.querySelector(".id_category").value;

          let editNameCategory =
            formEditCategory.querySelector(".name_category").value;

          let editAgeCategory =
            formEditCategory.querySelector(".age_category").value;

          let response = await fetch("/admin/category", {
            method: "PUT",
            body: JSON.stringify({
              idCategory: editIdCategory,
              nameCategory: editNameCategory,
              ageCategory: editAgeCategory,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          let result = await response.json();
          console.log(response);
          console.log(result);
          if (response.status == 200) {
            wrapmodal.classList.remove("visible");
            elem.parentElement.parentElement.children[1].innerHTML =
              editNameCategory;
            elem.parentElement.parentElement.children[2].innerHTML =
              editAgeCategory;
          }
        });
      });
    });
    //Удаление категорий
    let delCategory = document.querySelectorAll(".delcategory");
    delCategory.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idCategory = this.querySelector(".idcategory").value;
        let response = await fetch(`/admin/category/${idCategory}`, {
          method: "DELETE",
          // body: JSON.stringify({ idCategory: idCategory }),
          // headers: {
          //   "Content-Type": "application/json",
          // },
        });
      });
    });
    //////////////////////////
    //console.log("tttttttttttttttttt");
  }

  //форма добавления услуги
  let formAddService = document.querySelector(".formaddservice");

  if (formAddService) {
    //Выбираем возрастные категории
    let categoryService = document.querySelectorAll(".category_service");
    categoryService.forEach((elem) => {
      let toggle = false;
      elem.addEventListener("click", function () {
        this.setAttribute("checked", !toggle);
        toggle = !toggle;
      });
    });
    //Выбираем тарифы
    let listTariffService = document.querySelectorAll(".tariff_service");
    listTariffService.forEach((elem) => {
      let toggle = false;
      elem.addEventListener("click", function () {
        this.setAttribute("checked", !toggle);
        toggle = !toggle;
      });
    });
    /////////////////////////////////////////////////////////////////////////////////////
    let btnAddService = document.querySelector(".form__btn-addservice");
    let inputNameService = document.querySelector(".name_service");
    let inputPosterService = document.querySelector(".afisha_service");
    let typeService = formAddService.querySelector(".type-service");

    // let myContent = tinymce.get("textareaaboutservice").getContent();

    let inputColorService = document.querySelector(".color_service");
    btnAddService.addEventListener("click", async () => {
      console.log("Добавляем услугу");
      let selCategoryService = await selected(categoryService);
      console.log(
        `выбранные категории:${selCategoryService} 'это массив? ${Array.isArray(
          selCategoryService
        )}`
      );
      let selTariffService = await selected(listTariffService);
      console.log(inputColorService.value);
      console.log(tinymce.get("textareaaboutservice").getContent());
      //     ////////////////////////////////////////
      let formData = new FormData();
      formData.set("typeService", typeService.value);
      formData.set("nameService", inputNameService.value);
      formData.set(
        "aboutService",
        tinymce.get("textareaaboutservice").getContent()
      );
      //Передаем через formdata массив выбранных возрастных категорий
      for (let x = 0; x < selCategoryService.length; x++) {
        formData.append("categoryService", selCategoryService[x]);
      }
      //Передаем через formdata массив выбранных тарифов
      for (let x = 0; x < selTariffService.length; x++) {
        formData.append("tariffesService", selTariffService[x]);
      }
      // window.location.href;

      //formData.set("categoryService", selCategoryService);
      formData.set("colorService", inputColorService.value);
      for (var i = 0; i < inputPosterService.files.length; i++) {
        formData.append("posterService", inputPosterService.files[i]);
      }
      let response = await fetch("/admin/addservice", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      let result = await response.json();
      console.log(result);
      if (result.code == 1) {
        console.log("Сервис Успешно добавлен");
        tooltip.classList.add("tooltip-good");
        window.location.href = "/admin/addservice";
        // //Сбрасываем значения в полях формы на исходные
        // tinymce.activeEditor.setContent("");
        // inputPosterService.value = null;
        // inputNameService.value = null;
        // categoryService.forEach((elem) => {
        //   elem.checked = false;
        // });
      } else {
        tooltip.classList.add("tooltip-error");
      }
      tooltip.innerHTML = result.message;
      setTimeout(() => {
        console.log("удаляем классы у tooltip");
        tooltip.classList.remove("tooltip-good");
        tooltip.classList.remove("tooltip-error");
      }, 3000);
      // });
      //     /////////////////////////////////////////
    });
    selectTariffesByTypeService(typeService.value);
  }
  //}
  ///////////////////////////////////////////////////////////////
  let razdelRegRab = document.querySelector(".razdelRegRab");
  //Если выбран пункт меню Режимы работы
  if (razdelRegRab) {
    /////////////////////////////////////////////
    //Для редактирования и удаления режимов

    //для формы добавления типа режима работы
    const btnAddRegRab = document.querySelector(".addRegRab");
    const inputNameType = document.querySelector(".nametype");
    const inputRegType = document.querySelector(".regtype");

    btnAddRegRab.addEventListener("click", async () => {
      let response = await fetch("/admin/regrab", {
        method: "POST",
        body: JSON.stringify({
          nameType: inputNameType.value,
          regType: inputRegType.value,
        }),
        headers: { "Content-Type": "application/json" },
      });
    });
  }
  ////////////////////////////////////////////

  //Список услуг(редактирование, удаление)
  //инициализируем функцию возвращающую промис
  ////////////////////////////////////////////////////////////////////////////
  function tinymceinit(idService) {
    return new Promise(function (resolve) {
      //TinyMCE редактирование услуги

      tinymce.init({
        selector: `#textareaaboutserviceedit${idService}`,
        language: "ru",
        menubar: false,
        plugins: ["lists", "code", "link", "image"],
        toolbar1:
          "undo redo | forecolor backcolor| fontsize bold italic underline hr|  |copy cut paste pastetext| ",
        toolbar2:
          "numlist bullist | aligncenter alignjustify alignleft alignnone alignright |  link code ",
      });
      //////////////////////////////////////////////////////////////////////////////////////

      resolve();
    });
  }
  ////////////////////////////////
  let listServices = document.querySelector("[data-listservices]");
  if (listServices) {
    console.log("Список услуг");
    //////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////
    let galleryService = listServices.querySelectorAll(".gallery-service");
    galleryService.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idService = this.querySelector(".idservice").value;
        console.log(`id_service(gallery):${idService}`);
        let response = await fetch(`/admin/galleryservice/${idService}`, {
          method: "GET",
        });
        if (response.status == 200) {
          let result = await response.text();
          console.log(result);
          document.querySelector(".modal_content").innerHTML = result;
          wrapmodal.classList.add("visible");
          //форма добавления фото в галерею услуги
          let formAddInGalleryService = document.querySelector(
            "[data-galleryservice]"
          );

          if (formAddInGalleryService) {
            console.log(
              `Форма загрузки фото в галерею ${formAddInGalleryService}`
            );
            let idService =
              formAddInGalleryService.querySelector(".id-service");
            let listAddInGalleryService = formAddInGalleryService.querySelector(
              ".add-in-gallery-service"
            );
            //Удаление элемента из галереи
            let delGalleryItem =
              formAddInGalleryService.querySelectorAll(".del__gallerryitem"); //красная точка над galleryitem
            delGalleryItem.forEach((elem) => {
              elem.addEventListener("click", async function () {
                let pathDelItem =
                  this.previousElementSibling.getAttribute("src");
                console.log(`Удаляем из галереи:${pathDelItem}`);
                let response = await fetch("/admin/galleryservice", {
                  method: "DELETE",
                  body: JSON.stringify({ pathDelItem: pathDelItem }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                let result = await response.json();
                console.log(`Удалили?: ${result.status}`);
                if (result.status == "ok") {
                  elem.parentElement.style.display = "none";
                }
              });
            });
            ////////////////////////////////////////////////////////////////////////////////////
            let listItems = formAddInGalleryService.querySelector(
              ".galleryservice__listitems"
            );
            let btnAddInGalleryService = formAddInGalleryService.querySelector(
              ".form__btn-addingallery"
            );
            let formData = new FormData();
            formData.set("idService", idService.value);
            btnAddInGalleryService.addEventListener("click", async () => {
              if (listAddInGalleryService.files.length > 0) {
                console.log("есть файлы!!");
                for (var i = 0; i < listAddInGalleryService.files.length; i++) {
                  formData.append(
                    "fotoGallery",
                    listAddInGalleryService.files[i]
                  );
                }
                let response = await fetch("/admin/addingalleryservice", {
                  method: "POST",
                  body: formData,
                });
                let result = await response.json();
                // console.log(listAddInGalleryService.files);
                //поскольку элемент FIlelist не array работает только след цикл (можно посмотреть в сторону Array.from для превращения его в полноценный array)
                for (var i = 0; i < listAddInGalleryService.files.length; i++) {
                  let newItemGallery = document.createElement("div");
                  newItemGallery.classList.add("galleryservice__wrapitem");
                  newItemGallery.innerHTML = `<img src="/uploads/img/services/gallery/${idService.value}/${listAddInGalleryService.files[i].name}" width="100px" height="auto" ></div>`;
                  setTimeout(() => {
                    listItems.appendChild(newItemGallery);
                  }, 1000 * i);
                }
                listAddInGalleryService.value = "";
                // listAddInGalleryService.files.forEach((elem) => {
                //   let newItemGallery = document.createElement("div");
                //   newItemGallery.classList.add("galleryservice__wrapitem");
                //   newItemGallery.innerHTML = `<img src="/uploads/img/services/gallery/${idService.value}/${elem.originalname}" width="100px" height="auto" ><div class="del__gallerryitem"></div>`;
                // });
              }
            });
          }

          /////////////////////////////////////////////////////
        }
      });
    });
    //////////////////////////////////////////
    let editService = listServices.querySelectorAll(".edit-service");
    editService.forEach((elem, i) => {
      elem.addEventListener("click", async function () {
        tinymce.remove(); //удаляем все tinymce.init  !!!!! если не сделать то визуальный редактор не будет работать
        let idService = this.querySelector(".idservice").value;
        console.log(`jjjj:${idService}`);
        let response = await fetch("/admin/getformeditservice", {
          method: "POST",
          body: JSON.stringify({ idService: idService }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200) {
          let result = await response.text();
          document.querySelector(".modal_content").innerHTML = result;

          await tinymceinit(idService);

          //Добавляем в tinyMCE текст
          setTimeout(() => {
            tinymce.activeEditor.setContent(
              elem.parentElement.parentElement.children[2].value
            );
          }, 1000);
          wrapmodal.classList.add("visible");
          //Форма редактирования сервиса/////////////////////////////////////////////
          let formEditService = document.querySelector(
            "[data-formeditservice]"
          );
          if (formEditService) {
            //setTimeout(() => {
            let listTariffes =
              formEditService.querySelectorAll(".tariff_service"); //массив тарифов полный список
            let selectedTariffes =
              formEditService.querySelector(".selectedTariff").value; // строка тарифов выбранного сервиса
            let cs = formEditService.querySelectorAll(".category_service"); //массив id возрастных категорий полный список
            let sc = formEditService.querySelector(".selectedCategory").value; // строка  категорий сервиса
            let arraySc = sc.split(","); //разбиваем строку возрастных категорий выбранного сервиса на елементы массива
            cs.forEach((elm) => {
              if (arraySc.includes(elm.value)) {
                elm.setAttribute("checked", true);
              }
              elm.addEventListener("click", function () {
                if (this.hasAttribute("checked")) {
                  this.removeAttribute("checked");
                } else {
                  this.setAttribute("checked", true);
                }
              });
            });
            /////////////////////////////////////////////////
            let arraySelectedTariffes = selectedTariffes.split(","); //разбиваем строку на елементы массива
            listTariffes.forEach((elm) => {
              if (arraySelectedTariffes.includes(elm.value)) {
                elm.setAttribute("checked", true);
              }
              elm.addEventListener("click", function () {
                if (this.hasAttribute("checked")) {
                  this.removeAttribute("checked");
                } else {
                  this.setAttribute("checked", true);
                }
              });
            });

            let posterService = formEditService.querySelector(
              "[data-poster-service]"
            );

            let btnSaveService = formEditService.querySelector(
              "[data-btn-save-service]"
            );
            btnSaveService.addEventListener("click", async () => {
              let idTypeService =
                formEditService.querySelector(".edit-type-service").value;
              let idService =
                formEditService.querySelector("[data-idservice]").value;
              //console.log(posterService.files[0]);
              let aboutService = tinymce.activeEditor.getContent(
                `#textareaaboutserviceedit${idService}`
              );
              let nameService = formEditService.querySelector(
                "[data-name-service]"
              ).value;
              let colorService = formEditService.querySelector(
                "[data-color-service]"
              ).value;
              let arrCategoryService = await selected(cs); //эта функция возвращает промис (прописана в начале кода)
              let arrTariffesService = await selected(listTariffes); //эта возвращает промис (прописана в начале кода)
              console.log(arrCategoryService);
              console.log(arrTariffesService);
              let formData = new FormData();
              for (let i = 0; i < posterService.files.length; i++) {
                formData.append("posterService", posterService.files[i]);
              }
              for (let i = 0; i < arrCategoryService.length; i++) {
                formData.append("categoryService", arrCategoryService[i]);
              }
              for (let i = 0; i < arrTariffesService.length; i++) {
                formData.append("tariffesService", arrTariffesService[i]);
              }
              formData.set("idTypeService", idTypeService);
              formData.set("aboutService", aboutService);
              formData.set("nameService", nameService);
              formData.set("colorService", colorService);
              formData.set("idService", idService);

              let response = await fetch("/admin/savechangesservice", {
                method: "PUT",
                body: formData,
              });
              let result = await response.json();
              console.log(result);
              if (result.status == "ok") {
                document.location.replace("/admin/service");
              }
            });
            ////////////////////////////////////
            // }, 1000);
          }
        }
        // console.log(result);
      });
    });
    ///////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////




    //Добавление ссылки на видео с youtube
    let listBtnsVideoService = listServices.querySelectorAll(".video-service");
    console.log(listBtnsVideoService);

    listBtnsVideoService.forEach((btn) => {
      btn.addEventListener("click", async function () {
        let idService = this.querySelector(".idservice").value;
        console.log(`ID услуги:${idService}`);
        let response = await fetch(`/admin/videoservice/${idService}`);

        if (response.status == 200) {
          let result = await response.text();
          // console.log(result);
          document.querySelector(".modal_content").innerHTML = result;
          wrapmodal.classList.add("visible");
          // if (result.itog == 1) {
          //   let cloneListVideoServiceItem = document.querySelector('.list-video-service__item').cloneNode(true);
          //   document.querySelector('.video-service__listitems').appendChild(cloneListVideoServiceItem);
          // }
        }

        //форма добавления ссылки на видео с YOUTUBE к услуге
        let formAddInVideoService = document.querySelector(".form-add-in-video-service");

        if (formAddInVideoService) {
          console.log(`Форма добавления ссылки на видео к услуге`);
          let idService = formAddInVideoService.querySelector(".id-service").value;
          console.log(idService);
          let videoServiceUrl = formAddInVideoService.querySelector('.form-add-in-video-service__url');
          let videoServiceName = formAddInVideoService.querySelector('.form-add-in-video-service__name');

          let btnAddInVideoService = formAddInVideoService.querySelector(".form-add-in-vide-service__btn");
          videoServiceUrl.addEventListener("input", function () {
            console.log(this);
            isEmpty(this);
          });
          videoServiceName.addEventListener("input", function () {
            console.log(this);
            isEmpty(this);
          })



          btnAddInVideoService.addEventListener("click", async () => {
            if (videoServiceUrl.value.trim().length == 0) {
              videoServiceUrl.classList.add('form__input_error');
              videoServiceUrl.focus();
              return;

            } else if (!/^https:\/\/youtu/.test(videoServiceUrl.value.trim())) {
              videoServiceUrl.classList.add('form__input_error');
              videoServiceUrl.focus();
              return;

            } else if (videoServiceName.value.trim().length == 0) {
              videoServiceName.classList.add('form__input_error');
              videoServiceName.focus();
              return;
            } else {

              let response = await fetch("/admin/videoservice", {
                method: "POST",
                body: JSON.stringify({
                  idServiceVideo: idService,
                  videoUrl: videoServiceUrl.value,
                  videoName: videoServiceName.value,
                }),
                headers: { "Content-Type": "application/json" },
              });
              if (response.status == 200) {

                let result = await response.json();
                console.log(result);
                if (result.itog == 1) {

                  let cloneListVideoServiceItem = document.querySelector('.list-video-service__item').cloneNode(true);
                  cloneListVideoServiceItem.classList.remove('hidden');
                  cloneListVideoServiceItem.querySelector('a').href = videoServiceUrl.value;
                  cloneListVideoServiceItem.querySelector('.list-video-service__item-link').src = result.urlCover;
                  cloneListVideoServiceItem.querySelector('.list-video-service__item-name').innerHTML = videoServiceName.value;
                  cloneListVideoServiceItem.querySelector('.id-service').value = result._id;
                  cloneListVideoServiceItem.querySelector('.btn-del-video-service').addEventListener("click", async function () {
                    let response = await fetch(`/admin/videoservice/${result._id}`, {
                      method: "DELETE",
                    });
                    let result1 = await response.json();
                    if (result1.del === 1) {
                      this.parentElement.remove();//удаляем элемент из списка видео у сервиса
                    }

                  })
                  document.querySelector('.video-service__listitems').appendChild(cloneListVideoServiceItem);
                  videoServiceUrl.value = '';
                  videoServiceName.value = '';
                }
                // document.querySelector(".modal_content").innerHTML = result;
                // wrapmodal.classList.add("visible");


              }


            };
          });
        }
        //Список видео сервиса

        let listVideoService = document.querySelector('.video-service__listitems');
        console.log('Список видео');
        console.log(listVideoService);
        // Удаление ссылки на видео с youtube
        let listBtnsDelVideoService = listVideoService.querySelectorAll(".btn-del-video-service");
        listBtnsDelVideoService.forEach((elem) => {
          elem.addEventListener('click', async function () {
            let idService = this.querySelector('.id-service').value;
            let response = await fetch(`/admin/videoservice/${idService}`, {
              method: "DELETE",
            });
            let result = await response.json();
            if (result.del === 1) {
              this.parentElement.remove();//удаляем элемент из списка видео у сервиса
            }

          })
        });


      });



    })


    ///////////////////////////////////////////
    //Удаление услуги
    let btnDelService = listServices.querySelectorAll("[data-delservice]");
    btnDelService.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idService = this.querySelector(".idservice").value;
        let response = await fetch(`/admin/service/${idService}`, {
          method: "DELETE",
        });
        let result = await response.json();
        if (result.status == "ok") {
          elem.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
            "none";
        }
      });
    });
  }

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
  let modalcloseeditnews = document.querySelector("#closeeditnews");
  modalcloseeditnews.addEventListener("click", () => {
    wrapmodal.classList.remove("visible");
  });
  // страница админки со списком объявлений
  //клик по иконке редактировать новость
  let lblsedit = document.querySelectorAll(".edit-news");
  lblsedit.forEach((elem, i) => {
    elem.addEventListener("click", function () {
      console.log(`кликнули по карандашу${i}`);
      wrapmodal.classList.add("visible");
      console.log(this.parentElement.nextElementSibling.innerHTML);
      tinymce.activeEditor.setContent(
        this.parentElement.nextElementSibling.innerHTML
      );
      let idnews = this.querySelector(".idnews");
      let btnsavenews = modal.querySelector(".form__btn-savenews");
      let rrr = this;
      btnsavenews.addEventListener("click", async function () {
        //console.log(rrr);
        let changedTextNew = tinymce.activeEditor.getContent("#mytextarea");
        console.log(changedTextNew);
        let response = await fetch("/admin/savechangesnews", {
          method: "PUT",
          body: JSON.stringify({
            idNews: idnews.value,
            textNews: changedTextNew,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let result = await response.json();
        console.log(result);
        if (result.itog == "Ok") {
          tinymce.activeEditor.setContent("");
          console.log(rrr.parentElement);
          rrr.parentElement.nextElementSibling.innerHTML = changedTextNew;

          wrapmodal.classList.remove("visible");
        }
      });
    });
  });
  let lblsdel = document.querySelectorAll(".del");
  console.log(lblsdel);
  lblsdel.forEach((elem) => {
    elem.addEventListener("click", function () {
      console.log("кликнули по корзине");
      let id = this.lastElementChild.value;
      console.log(this.firstElementChild);
      console.log(this.lastElementChild);
      this.firstElementChild.classList.toggle("del__confirm-visible");

      //Удаляем новость (если есть элемент...)
      if (this.querySelector(".delnews")) {
        this.querySelector(".delnews").addEventListener(
          "click",
          async function () {
            // event.stopPropagation();
            console.log(id);
            console.log("привет ты подтвердил удаление объявления");
            let response = await fetch(`/admin/delnews/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            console.log(result);
            if (result.del == "Ok") {
              elem.parentElement.parentElement.style.display = "none";
            }
          }
        );
      }
      /////////////////////////////////////////////////////////////////
      //Удаляем предварительную запись (если есть элемент...)
      if (this.querySelector(".delregistration")) {
        this.querySelector(".delregistration").addEventListener(
          "click",
          async function () {
            // event.stopPropagation();
            console.log(id);
            console.log("привет ты подтвердил удаление предворительной записи");
            let response = await fetch(`/admin/delregistration/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            console.log(result);
            if (result.del == "Ok") {
              elem.parentElement.style.display = "none";
            }
          }
        );
      }
    });
  });

  //////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  let formAddNews = document.querySelector(".formaddnews");
  if (formAddNews) {
    console.log("Добавление объявления");

    //let tooltip = document.querySelector(".tooltip");
    let btnAddNews = document.querySelector(".form__btn-addnew");
    btnAddNews.addEventListener("click", async () => {
      let textNews = tinymce.activeEditor.getContent("mytextarea");
      let posterNews = document.querySelector(".posternews");
      let my = tinymce.get("mytextarea");
      console.log(my);
      let formData = new FormData();
      formData.set("textnews", textNews);

      for (var i = 0; i < posterNews.files.length; i++) {
        formData.append("posternews", posterNews.files[i]);
      }
      let res = await fetch("/admin/addnews", {
        method: "POST",
        body: formData,
      });
      let result = await res.json();
      console.log(result);
      if (res.status == 200) {
        tooltip.classList.add("tooltip-good");
        tinymce.activeEditor.setContent("");
        posterNews.value = null;
      } else {
        tooltip.classList.add("tooltip-error");
      }
      tooltip.innerHTML = result.message;
      setTimeout(() => {
        console.log("удаляем классы у tooltip");
        tooltip.classList.remove("tooltip-good");
        tooltip.classList.remove("tooltip-error");
      }, 6000);
    });
  }
  ////////////////////////////////////////////////////////////
  let listTariffes = document.querySelector("[data-listtariffesadmin]");
  if (listTariffes) {
    console.log("Список тарифов");
    let btnAddtariff = listTariffes.querySelector(".form__btn-addtariff");
    btnAddtariff.addEventListener("click", async () => {
      let typeServiceTariff = listTariffes.querySelector(
        ".form__input_type-service"
      );
      console.log(`Id типа услуги: ${typeServiceTariff.value}`);
      let addTariffName = listTariffes.querySelector(".add-tariff-name");
      let tariffName;
      let addTariffPrice = listTariffes.querySelector(".add-tariff-price");
      let tariffPrice;
      let addTariffLessons = listTariffes.querySelector(".add-tariff-lessons");
      let tariffLessons;
      let regexpNumber = /^\d+$/; //Проверяем что введены только цыфры
      if (addTariffName.value == "") {
        addTariffName.classList.add("form__input_error");
      } else {
        console.log(addTariffName.value);
        tariffName = addTariffName.value;
      }
      if (addTariffPrice.value == "") {
        addTariffPrice.classList.add("form__input_error");
      } else if (regexpNumber.test(addTariffPrice.value)) {
        tariffPrice = addTariffPrice.value;
      } else {
        addTariffPrice.classList.add("form__input_error");
      }

      if (addTariffLessons.value == "") {
        tariffLessons = "1";
      } else if (regexpNumber.test(addTariffLessons.value)) {
        tariffLessons = addTariffLessons.value;
      } else {
        addTariffLessons.classList.add("form__input_error");
      }
      let listInputError = listTariffes.querySelectorAll(".form__input_error");

      if (listInputError.length == 0) {
        let response = await fetch("/admin/addtariff", {
          method: "POST",
          body: JSON.stringify({
            typeServiceTariff: typeServiceTariff.value,
            nameTariff: tariffName,
            priceTariff: tariffPrice,
            lessonsTariff: tariffLessons,
          }),
          headers: { "Content-Type": "application/json" },
        });
        //console.log(response);
        let result = await response.json();
        if (result.itog == "1") {
          window.location.href = "/admin/listtariffes";
          // let newTariff = document.createElement("section");
          // newTariff.classList.add("list__item");
          // newTariff.classList.add("grid");
          // newTariff.innerHTML = ` <div class="list__item-about grid">
          // <div class="list__item-about-text">${addTariffName.value}</div>
          // <div class="list__item-about-text">${typeServiceTariff.value}</div>
          // <div class="list__item-text">${addTariffPrice.value}</div>
          //   <div class="list__item-text">${addTariffLessons.value}</div>
          //    </div>`;
          // let parent = listTariffes.querySelector(".new-tariff");
          // parent.appendChild(newTariff);
          // addTariffName.value = "";
          // addTariffPrice.value = "";
          // addTariffLessons.value = "";
        }
      } else {
        listInputError[0].focus();
        listInputError.forEach((elem) => {
          elem.addEventListener("input", function () {
            this.classList.remove("form__input_error");
          });
        });
      }
    });
    //Удаление категорий
    let delTariff = document.querySelectorAll(".deltariff");
    delTariff.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idTariff = this.querySelector(".idtariff").value;
        let response = await fetch(`/admin/deltariff/${idTariff}`, {
          method: "DELETE",
        });
      });
    });
    //////////////////////////
    //вывод модального окна редактирования тарифа
    let listLblEditTariff = listTariffes.querySelectorAll(".edit-tariff");
    listLblEditTariff.forEach((elem) => {
      elem.addEventListener("click", async function () {
        let idtariff = this.querySelector(".idtariff").value;
        let response = await fetch(`/admin/edittariff/${idtariff}`, {
          method: "GET",
        });
        let result = await response.text();
        console.log(result);
        document.querySelector(".modal_content").innerHTML = result;
        wrapmodal.classList.add("visible");
        ///////////////////////////////////////////////
        let formEditTariff = document.querySelector("[data-formedittariff]");
        let formBtnEditTariff = formEditTariff.querySelector(
          ".form__btn-edittariff"
        );
        formBtnEditTariff.addEventListener("click", async () => {
          console.log("сохраняем изменения");
          let editIdTariff = formEditTariff.querySelector(".id_tariff").value;
          let editTypeServiceTariff =
            formEditTariff.querySelector(".edit-type-service").value;
          let editNameTariff =
            formEditTariff.querySelector(".edit-tariff-name").value;

          let editPriceTariff =
            formEditTariff.querySelector(".edit-tariff-price").value;

          let editLessonsTariff = formEditTariff.querySelector(
            ".edit-tariff-lessons"
          ).value;

          let response = await fetch("/admin/edittariff", {
            method: "PUT",
            body: JSON.stringify({
              editIdTariff: editIdTariff,
              editTypeServiceTariff: editTypeServiceTariff,
              editNameTariff: editNameTariff,
              editPriceTariff: editPriceTariff,
              editLessonsTariff: editLessonsTariff,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          let result = await response.json();
          console.log(response);
          console.log(result);
          if (result.code == 1) {
            wrapmodal.classList.remove("visible");
            window.location.href = "/admin/listtariffes";
          }
        });

        ////////////////////////////////////////////
      });
    });
  }
  /////////////////////////////////////////////////////////
  let listTypes = document.querySelector("[data-listtype]");
  if (listTypes) {
    let nameType = listTypes.querySelector(".form__input_addtype-name");
    nameType.addEventListener("input", function () {
      this.classList.remove("form__input_error");
    });
    let btnAddType = listTypes.querySelector(".form__btn-addtype");
    btnAddType.addEventListener("click", async () => {
      if (nameType.value != "") {
        let response = await fetch("/admin/addtypeservice", {
          method: "POST",
          body: JSON.stringify({ nameType: nameType.value }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let result = await response.json();
        if (result.code == 1) {
          window.location.href = "/admin/listtype";
        } else {
          tooltip.classList.add("tooltip-error");
          tooltip.innerHTML = result.massege;
        }
      } else {
        nameType.classList.add("form__input_error");
      }
    });
  }
  //Удаление типа услуги
  let delType = document.querySelectorAll(".deltype");
  delType.forEach((elem) => {
    elem.addEventListener("click", async function () {
      let idType = this.querySelector(".idtype").value;
      let response = await fetch(`/admin/deltypeservice/${idType}`, {
        method: "DELETE",
      });
      let result = await response.json();
      if (result.code == 1) {
        window.location.href = "/admin/listtype";
      } else {
        tooltip.classList.add("tooltip-error");
        tooltip.innerHTML = result.massege;
      }
    });
  });
  //Изменение вида услуг
  let editType = listTypes.querySelectorAll(".edittype");
  editType.forEach((elem) => {
    elem.addEventListener("click", async function () {
      let idType = this.querySelector(".idtype").value;

      let response = await fetch(`/admin/edittypeservice/${idType}`, {
        method: "get",
      });
      let result = await response.text();
      document.querySelector(".modal_content").innerHTML = result;
      wrapmodal.classList.add("visible");
      //Форма редактирования вида услуг
      let formEditType = document.querySelector("[data-formedittype]");
      if (formEditType) {
        let btnEditType = formEditType.querySelector(".form__btn-edit-type");
        btnEditType.addEventListener("click", async () => {
          let idType = formEditType.querySelector(".id").value;
          let newNameType = formEditType.querySelector(".type-name");
          newNameType.value = newNameType.value.trim(); //Удаляем пробелы в начале и в конце в поле type-name
          if (newNameType.value == "") {
            newNameType.classList.add("form__input_error");
            newNameType.focus();
          } else {
            let response = await fetch(`/admin/edittypeservice/${idType}`, {
              method: "PUT",
              body: JSON.stringify({ nameType: newNameType.value }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            let result = await response.json();
            if (result.code == 1) {
              wrapmodal.classList.remove("visible");
              window.location.href = "/admin/listtype";
            }
          }
        });
      }
      // if (result.code == 1) {
      //   window.location.href = "/admin/listtype";
      // } else {
      //   tooltip.classList.add("tooltip-error");
      //   tooltip.innerHTML = result.massege;
      // }
    });
  });
};
/////////////////////////////////////////////////
//Функция выборки тарифов услуги определенного типа: idType и вывода в DOM элемент:  toDomElem
async function selectTariffesByTypeService(idType, toDomElem) {
  console.log("делаем фэтч запрос тарифов");
  let response = await fetch(`/admin/selecttariffesbytype/${idType}`, {
    method: "GET",
  });
};
//Функция проверки на пустую строку
function isEmpty(elem) {
  if (elem.value.trim().length == 0) {
    elem.classList.add("form__input_error");
  } else {
    elem.classList.remove("form__input_error");
  }
};

//////////////////////////////////////////////////
//Запускаем функцию start только после того как браузер полностью построен DOM HTML страницы .
document.addEventListener("DOMContentLoaded", start);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
