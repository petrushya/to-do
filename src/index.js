import '../assets/style.css';
import brand from '../assets/brand.svg';
import { articlesData } from '../data/writearticle.js';
import { printContent } from '../data/printcontent.js';

localStorage.clear();
new articlesData('',[`${new Date().valueOf() - 30*60*1000}`,'','','daily job']).addArticleData;
new articlesData('my lessons',[new Date().valueOf() + 24*60*60*1000,'normal','learn something from "javascrit"']).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf() - 60*60*1000}`,'','','some one', 'lorem ipsum carent dolor:\n 1. something else']).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf() - 90*60*1000}`,'','','new some one', 'lorem ipsum carent dolor:\n 1. something else\n2. else something else']).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf() + 60*60*1000}`,'','high','else else some one']).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf()}`,'','low','else some one']).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf() + 16*60*60*1000}`,'','high','ooo some one']).addArticleData;
new articlesData('my lessons',[new Date().valueOf() - 24*60*60*1000,'','low','ooo else some one']).addArticleData;

const headerNode = document.querySelector('header');
const logo = new Image();
logo.src = brand;
logo.alt = '';
logo.width = '50';
logo.height = '50';
headerNode.appendChild(logo);
new printContent('today').pageContent;

const todayBtn = document.querySelector('#todaylink');
todayBtn.onclick = () => {
  todayBtn.blur();
  new printContent('today').pageContent;
}


