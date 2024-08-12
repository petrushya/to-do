import '../assets/style.css';
import brand from '../assets/brand.svg';
import { articlesData } from '../data/writearticle.js';
import { printContent } from '../data/printcontent.js';
import { createDialog } from '../data/dialogwindow.js';

localStorage.clear();
new articlesData(' ',['','','','daily job'].join('",,,"')).addArticleData;
new articlesData('my lessons',['','','','some one', 'lorem ipsum carent dolor:\n 1. something else'].join('",,,"')).addArticleData;
new articlesData('my lessons',['','','low','else some one'].join('",,,"')).addArticleData;
new articlesData('my lessons',[`${new Date().valueOf() + 16*60*60*1000}`,'','high','ooo some one'].join('",,,"')).addArticleData;
new articlesData('my lessons',[new Date().valueOf() - 24*60*60*1000,'','low','ooo else some one'].join('",,,"')).addArticleData;

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

const dialogBtn = document.querySelector('#dialogBtn');
dialogBtn.onclick = () => {
  dialogBtn.blur();
  new createDialog(dialogBtn.id).showDialog;
};

