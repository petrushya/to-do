import { reviseDate } from './revisedate.js';
import { printContent } from './printcontent.js';
import { articlesData } from './writearticle.js';

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
    arrayData[1] === 'nonchecked' ? checkSpan.className = 'nonchecked' : checkSpan.className = 'checked';
    timeSpan.className = 'hourdate';
    timeSpan.setAttribute('datetime', new reviseDate(+arrayData[0]).sortFullDate);
    if(checkSpan.classList.contains('checked')){
      timeSpan.classList.add('isreade');
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
      reviseButton.id = 'revise'
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

    checkSpan.addEventListener('click', () => {
      if(checkSpan.classList.contains('nonchecked')){
        checkSpan.classList.remove('nonchecked');
        checkSpan.classList.add('checked');
        if(timeSpan.classList.contains('expired')){
          timeSpan.classList.remove('expired');
        }else if(timeSpan.classList.contains('towork')){
          timeSpan.classList.remove('towork');
        };
        timeSpan.classList.add('isreade');
        checkSpan.innerHTML = '&#x2611';
        arrayData[1] = 'checked';
      }else{
        checkSpan.classList.remove('checked');
        checkSpan.classList.add('nonchecked');
        checkSpan.innerHTML = '&#x2610;';
        arrayData[1] = 'nonchecked'
        timeSpan.classList.remove('isreade');
        if(new reviseDate(+arrayData[0]).overdueTime && !new reviseDate(+arrayData[0]).equalDate){
          timeSpan.classList.add('expired');
        }else if(new reviseDate(+arrayData[0]).overdueTime){
          timeSpan.classList.add('towork');
        };
      };
      new articlesData(this.storageKey, this.stringData, arrayData.join('",,,"')).changeArticleData;
      new printContent(this.pageLink, this.storageKey).pageContent;
    });

    deletButton.addEventListener('click', () => {
      new articlesData(this.storageKey, this.stringData).deletArticle;
      new printContent(this.pageLink, this.storageKey).pageContent;
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
        menuElement.onclick = () => {
          new printContent('', menuElement.dataset.link).pageContent;
        };
      });
    };
    const btnLi = document.createElement('li');
    const btnElement = document.createElement('button');
    btnElement.innerHTML = '+ new project';
    btnElement.id = 'createproject';
    btnElement.setAttribute('type','button');
    olList.appendChild(btnLi);
    btnLi.appendChild(btnElement);
  }


}
