import "./data/style.css";
import Ikon from "./brand.svg";
import DisplayTodo from "./data/displayTodo.js";
import contentArr from "./data/projList.js";
import DataCheck from "./data/storageCheck.js";

const link = document.querySelector('link[rel="icon"]');
link.href = Ikon;

localStorage.clear();
localStorage.setItem("dataTodo", JSON.stringify(contentArr));
// btn color shceme
const htmlTag = document.querySelector("html");
const btnColorScheme = document.querySelector("#colorScheme");
btnColorScheme.onclick = () => {
  if (htmlTag.style.colorScheme === "light" || !htmlTag.style.colorScheme) {
    htmlTag.style.colorScheme = "dark";
    btnColorScheme.textContent = "LIGHT";
    btnColorScheme.blur();
  } else {
    htmlTag.style.colorScheme = "light";
    btnColorScheme.textContent = "DARK";
    btnColorScheme.blur();
  }
};

Object.keys(new DataCheck().idToIndexTaskObj()).length
  ? new DisplayTodo("", "show").projectsDaily()
  : new DataCheck().storageContent()[0].topicIds.length
    ? new DisplayTodo().topicsTodo()
    : new DisplayTodo().startPage();
