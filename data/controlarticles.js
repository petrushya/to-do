import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { createDialog } from './dialogwindow.js';

export class controlArticles{
  constructor(stringData, storageKey, pageLink){
    this.stringData = stringData;
    this.storageKey = storageKey;
    this.pageLink = pageLink;
  }

  get extractArticle(){
    const arrayData = this.stringData.split('",,,"');
    const article = document.createElement('article');
    const mainPart = document.createElement('div');
    const notePart = document.createElement('div');
    const notePara = document.createElement('p');
    const reviseButton = document.createElement('button');
    const checkSpan = document.createElement('span');
    const contentPara = document.createElement('p');
    const timeSpan = document.createElement('time');
    const prioritySpan = document.createElement('span');
    const deletButton = document.createElement('button');

    article.className = 'card';
    mainPart.className = 'mainArticle';
    checkSpan.setAttribute('tabindex', 0);
    checkSpan.className = 'status';
    arrayData[1] === 'nonchecked' ? checkSpan.classList.add('nonchecked') : checkSpan.classList.add('checked');
    timeSpan.className = 'hourdate';
    timeSpan.setAttribute('datetime', new reviseDate(+arrayData[0]).sortFullDate);
    if(checkSpan.classList.contains('checked')){
      timeSpan.classList.add('isready');
      contentPara.className = 'paraready';
    }else if(new reviseDate(+arrayData[0]).overdueTime && !new reviseDate(+arrayData[0]).equalDate){
      timeSpan.classList.add('expired');
    }else if(new reviseDate(+arrayData[0]).overdueTime){
      timeSpan.classList.add('towork');
    };
    prioritySpan.className = 'priority';
    if(arrayData[2] === 'low'){
      prioritySpan.classList.add('low');
      prioritySpan.innerHTML = '&#x272d;';
    }else if(arrayData[2] === 'high'){
      prioritySpan.classList.add('high');
      prioritySpan.innerHTML = '&#x272d;&#x272d;&#x272d;';
    }else{
      prioritySpan.innerHTML = '&#x272d;&#x272d;';
    };
    if(this.pageLink !== 'today'){
      reviseButton.className = 'revise'
      reviseButton.setAttribute('type', 'button');
    };
    deletButton.className = 'deletarticle';
    deletButton.setAttribute('type', 'button');
    notePart.className = 'addition';

    article.appendChild(mainPart);
    if(this.pageLink !== 'today') article.appendChild(notePart);
    mainPart.appendChild(checkSpan);
    mainPart.appendChild(contentPara);
    mainPart.appendChild(timeSpan);
    mainPart.appendChild(prioritySpan);
    if(this.pageLink !== 'today') mainPart.appendChild(reviseButton);
    mainPart.appendChild(deletButton);
    arrayData[1] === 'checked' ? checkSpan.innerHTML = '&#x2611;' : checkSpan.innerHTML = '&#x2610;';
    reviseButton.innerHTML = '&#x1f4cb;';
    deletButton.innerHTML = '&#x1F5D1;';
    contentPara.textContent = arrayData[3];
    if(this.pageLink !== 'today' && arrayData.length > 4){
      notePara.innerText = arrayData[4];
      notePart.appendChild(notePara)
    };
    timeSpan.textContent = new reviseDate(+arrayData[0]).intlHour;

    reviseButton.onclick = () => {
      reviseButton.blur();
      new createDialog(reviseButton.className, arrayData).showDialog;
    };

    checkSpan.addEventListener('click', () => {
      arrayData[1] === 'nonchecked' ? arrayData[1] = 'checked' : arrayData[1] = 'nonchecked';
      new articlesData(this.storageKey, this.stringData, arrayData.join('",,,"')).changeArticleData;
    });

    deletButton.addEventListener('click', () => {
      new articlesData(this.storageKey, this.stringData).deletArticle;
    });
    return article;
  }

  get expandMenu(){
    const olList = document.querySelector('#navexpand ol');
    olList.textContent = '';
    if(localStorage.getItem('todoList')){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(item => {
        const menuLi = document.createElement('li');
        const menuElement = document.createElement('button');
        menuElement.className = 'contentbtn';
        menuElement.dataset.link = item;
        menuElement.textContent = item;
        menuElement.setAttribute('type','button');
        olList.appendChild(menuLi);
        menuLi.appendChild(menuElement);
      });
    };
    const btnLi = document.createElement('li');
    const btnElement = document.createElement('button');
    btnElement.innerHTML = '+ new project';
    btnElement.id = 'createproject';
    btnElement.setAttribute('type','button');
    olList.appendChild(btnLi);
    btnLi.appendChild(btnElement);
    btnElement.onclick = () => {
      btnElement.blur();
      new createDialog(btnElement.id).showDialog;
    };
  }

}
