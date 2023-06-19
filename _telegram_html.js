import { JSDOM } from "jsdom";
export default (strHTML) => {
  let output = "";
  let massege = new JSDOM(strHTML);
  let nonDeleatableTags = [
    "b",
    "i",
    "strong",
    "em",
    "u",
    "ins",
    "s",
    "strike",
    "del",
    "span",
  ];
  let span = Array.from(massege.window.document.querySelectorAll("span"));
  console.log(Array.isArray(span));
  for (let elem of span) {
    elem.classList.add("tg-spoiler");
  }
  //   let allTagElements = Array.from(
  //     massege.window.document.getElementsByTagName("*")
  //   ).filter(
  //     (element) =>
  //       element.tagName != "HTML" &&
  //       element.tagName != "HEAD" &&
  //       element.tagName != "BODY"
  //   );

  /////////////////
  //   for (const element of allTagElements) {
  /* We want to avoid printing the same element twice if its a childNode */
  // let alreadyInspected = false;
  // for (const inspectedElement of allTagElements) {
  //   if (
  //     element != inspectedElement
  //     // && inspectedElement.contains(element)
  //   ) {
  //     alreadyInspected = true;
  //   }
  //   if (!alreadyInspected) {
  // output += nonDeleatableTags.includes(element.tagName.toLowerCase())
  //   ? element.outerHTML
  //   : element.innerHTML; //The .toLowerCase can be omitted if you write the nonDeleatableTags elements with the upperCase
  //   }
  // }
  //   }
  console.log(strHTML);
  //   return output;
};
