import '../assets/style.css';
import brand from '../assets/brand.svg';
import icon from '../assets/minima-social-icons.svg';
import { reviseDate } from '../data/revisedate.js';
import { articlesData } from '../data/writearticle.js';
import { printContent } from '../data/printcontent.js';

localStorage.clear();
new articlesData('routine',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() - 30*60*1000}`,'','','daily job']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() + 24*60*60*1000}`,'normal','learn something from "javascript"']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() - 60*60*1000}`,'','','some one', 'lorem ipsum carent dolor:\n 1. something else']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() - 90*60*1000}`,'','','new some one', 'lorem ipsum carent dolor:\n 1. something else\n2. else something else']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() + 60*60*1000}`,'','high','else else some one']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf()}`,'','low','else some one']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() + 16*60*60*1000}`,'','high','wow some one']).addArticleData;
new articlesData('my lessons',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() - 24*60*60*1000}`,'','low','wow else some one']).addArticleData;
new articlesData('routine',[`${new Date(new reviseDate(Date()).sortFullDate).valueOf() + 3*24*60*60*1000}`,'','','future daily job']).addArticleData;

const headerNode = document.querySelector('header');
const logo = new Image();
logo.src = brand;
logo.alt = '';
logo.width = '50';
logo.height = '50';
headerNode.appendChild(logo);
new printContent(new Date().getTime()).pageContent;

const footerNode = document.querySelector('#footerContent');
const p = document.createElement('p');
const link = document.createElement('a');
link.setAttribute('href', 'https://github.com/petrushya/to-do');
link.setAttribute('rel', 'noopener noreferrer');
const imgIcon = new Image;
imgIcon.src = icon;
imgIcon.width = '28';
imgIcon.height ='28';
p.appendChild(link);
link.appendChild(imgIcon);
footerNode.appendChild(p);


