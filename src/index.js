import '../assets/style.css';
import brand from '../assets/brand.svg';
import { createMenu } from '../data/createmenu.js';
import { articlesData } from '../data/writearticle.js';
import { printContent } from '../data/printcontent.js';

localStorage.clear();
new articlesData(' ',['','','','daily job'].join('",,,"')).addArticleData;
new articlesData('mydaily',['','','','some one'].join('",,,"')).addArticleData;
new articlesData('mydaily',['','','','else some one'].join('",,,"')).addArticleData;

const headerNode = document.querySelector('header');
const logo = new Image();
logo.src = brand;
logo.alt = '';
logo.width = '50';
logo.height = '50';
headerNode.appendChild(logo);
const mainTitle = document.querySelector('main h1');
const todayBtn = document.querySelector('[data-link="today"]');
mainTitle.textContent = 'today\'s list';
new createMenu(localStorage.getItem('todoList')).menuProject;
new printContent('today').sectionContent;

todayBtn.onclick = () => {
  const pageLink = todayBtn.dataset.link;
  new printContent(pageLink).sectionContent;
}