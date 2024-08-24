import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { createDialog } from './dialogwindow.js';

export class controlArticles{
  constructor(stringData, storageKey, pageLink){
    stringData ? this.stringData = stringData : this.stringData = '';
    storageKey ? this.storageKey = storageKey : this.storageKey = 'routine';
    pageLink ? this.pageLink = pageLink : this.pageLink = '';
  }
  get extractArticle(){
    const storageData = JSON.parse(localStorage.getItem('todoList'));
    const arrayData = this.stringData.split('",,,"');
    const article = document.createElement('article');
    const mainPart = document.createElement('div');
    const checkSpan = document.createElement('span');
    const contentPara = document.createElement('p');
    const timeHour = document.createElement('time');
    const prioritySpan = document.createElement('span');
    const deletButton = document.createElement('button');

    article.className = 'card';
    mainPart.className = 'mainArticle';
    article.appendChild(mainPart);

    checkSpan.setAttribute('tabindex', 0);
    checkSpan.className = 'status';
    checkSpan.addEventListener('click', () => {
      arrayData[1] === 'nonchecked' ? arrayData[1] = 'checked' : arrayData[1] = 'nonchecked';
      new articlesData(this.storageKey, this.stringData, arrayData.join('",,,"')).changeArticleData;
    });
    checkSpan.classList.add(arrayData[1]);
    arrayData[1] === 'checked' ? checkSpan.innerHTML = '&#x2611;' : checkSpan.innerHTML = '&#x2610;';

    contentPara.textContent = arrayData[3];

    timeHour.className = 'hourdate';
    timeHour.textContent = new reviseDate(+arrayData[0]).intlHour;
    timeHour.setAttribute('datetime', new reviseDate(+arrayData[0]).sortFullDate);
    if(checkSpan.classList.contains('checked')){
      timeHour.classList.add('isready');
      contentPara.className = 'paraready';
    }else if(new reviseDate(+arrayData[0]).overdueTime && !new reviseDate(+arrayData[0]).equalDate){
      timeHour.classList.add('expired');
    }else if(new reviseDate(+arrayData[0]).overdueTime && new reviseDate(+arrayData[0]).equalDate){
      timeHour.classList.add('towork');
      Object.keys(storageData).forEach(item => {
        const index = storageData[item].indexOf(this.stringData);
        if(item === this.storageKey && storageData[item][index + 1] && new reviseDate(+storageData[item][index + 1].split('",,,"')[0]).equalDate && new reviseDate(+storageData[item][index + 1].split('",,,"')[0]).overdueTime){
        timeHour.classList.add('expired');
        };
      });
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

    deletButton.className = 'deletarticle';
    deletButton.setAttribute('type', 'button');
    deletButton.innerHTML = '&#x1F5D1;';
    deletButton.addEventListener('click', () => {
      new articlesData(this.storageKey, this.stringData).deletArticle;
    });

    mainPart.appendChild(checkSpan);
    mainPart.appendChild(contentPara);
    mainPart.appendChild(timeHour);
    mainPart.appendChild(prioritySpan);
    if(this.pageLink !== 'today'){
      const reviseButton = document.createElement('button');
      reviseButton.className = 'revise'
      reviseButton.dataset.link = this.storageKey;
      reviseButton.setAttribute('type', 'button');
      reviseButton.innerHTML = '&#x1f4cb;';
      reviseButton.onclick = () => {
        reviseButton.blur();
        new createDialog(reviseButton.className, arrayData).showDialog;
      };
      mainPart.appendChild(reviseButton);
    };
    mainPart.appendChild(deletButton);

    if(this.pageLink !== 'today' && arrayData.length > 4){
      const notePart = document.createElement('div');
      const notePara = document.createElement('p');
      notePart.className = 'addition';
      notePara.innerText = arrayData[4];
      notePart.appendChild(notePara)
      article.appendChild(notePart);
    };

    return article;
  }

}
