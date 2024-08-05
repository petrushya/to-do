import '../assets/style.css';
import brand from '../assets/brand.svg';
import { createMenu } from '../data/createmenu.js';

const headerNode = document.querySelector('header');
const logo = new Image();
logo.src = brand;
logo.alt = '';
logo.width = '50';
logo.height = '50';
headerNode.appendChild(logo);
const mainTitle = document.querySelector('main h1');
const todaylink = document.querySelector('#linktoday');
const basicElemNode = document.querySelector('section');
mainTitle.textContent = 'today\'s list';
basicElemNode.id = 'today';
new createMenu(localStorage.getItem('jsonArticlesData')).menuProject;
