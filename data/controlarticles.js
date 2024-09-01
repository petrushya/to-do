import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { createDialog } from './dialogwindow.js';

export class controlArticles{
  constructor(stringData, storageKey, pageLink){
    stringData ? this.stringData = stringData : this.stringData = '';
    this.storageKey = storageKey.trim();
    pageLink ? this.pageLink = pageLink : this.pageLink = '';
  }

  get extractArticle(){
    const storageData = JSON.parse(localStorage.getItem('todoList'));
    const arrayData = [];
    this.stringData.forEach(item => arrayData.push(item));
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
      new articlesData(this.storageKey, this.stringData, arrayData).changeArticleData;
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
      const timeMatch = this.#nonCeckedArtcl();
      timeMatch.forEach((time, index) => {
        if(time === arrayData[0] && new reviseDate(+timeMatch[index+1]).overdueTime && new reviseDate(+timeMatch[index+1]).equalDate) timeHour.classList.add('expired');
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
    if(!this.pageLink){
      const reviseButton = document.createElement('button');
      reviseButton.className = 'revise'
      reviseButton.dataset.link = this.storageKey;
      reviseButton.setAttribute('type', 'button');
      reviseButton.innerHTML = '&#x1f4cb;';
      reviseButton.onclick = () => {
        reviseButton.blur();
        new createDialog(reviseButton.className, arrayData, reviseButton.dataset.link).showDialog;
      };
      mainPart.appendChild(reviseButton);
    };
    mainPart.appendChild(deletButton);

    if(!this.pageLink && arrayData.length > 4){
      const notePart = document.createElement('div');
      const notePara = document.createElement('p');
      notePart.className = 'addition';
      notePara.innerText = arrayData[4];
      notePart.appendChild(notePara)
      article.appendChild(notePart);
    };
    return article;
  }

  #nonCeckedArtcl(){
    const timeArr = [];
    Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(proj => {
      JSON.parse(localStorage.getItem('todoList'))[proj].forEach(item => {
        if(item[1] === 'nonchecked'){
          timeArr.push(item[0]);
          timeArr.sort();
        };
      });
    });
    return timeArr;
  }
}
