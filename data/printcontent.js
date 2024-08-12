import { controlArticles } from './controlarticles.js';
import { reviseDate } from './revisedate.js';

export class printContent {
  constructor(pageLink, projectName){
    this.projectName = projectName;
    this.pageLink = pageLink;
  }

  get pageContent(){
    new controlArticles().expandMenu;
    const contentBtn = document.querySelectorAll('.contentbtn');
    contentBtn.forEach(btn => {
      btn.onclick = () => {
        btn.blur();
        new printContent('', btn.dataset.link).pageContent;
      };
    })
    const mainTitle = document.querySelector('main h1');
    const section = document.querySelector('section');
    section.textContent = '';
    if(Object.keys(JSON.parse(localStorage.getItem('todoList'))).length === 0){
      mainTitle.textContent = 'to-do list is empty';
    }else if(this.pageLink === 'today'){
      mainTitle.textContent = 'today\'s list';
      const arr = [];
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        const part = document.createElement('div');
        const titlePart = document.createElement('h2');
        part.appendChild(titlePart);
        section.appendChild(part);
        JSON.parse(localStorage.getItem('todoList'))[key].forEach(item => {
          if(new reviseDate(+item.split('",,,"')[0]).equalDate){
            titlePart.textContent = key;
            arr.push(item);
            section.appendChild(new controlArticles(item, key, this.pageLink).extractArticle);
          };
        });
        if(arr.length === 0){
          mainTitle.textContent = 'today\'s list is empty';
          section.textContent = '';
        };
      });
      const deletarticle = document.querySelectorAll('.deletarticle');
      deletarticle.forEach(item => {
        item.addEventListener('click', () => {
          this.pageContent;
        });
      });
    }else if(JSON.parse(localStorage.getItem('todoList'))[this.projectName]){
      const dataProject = JSON.parse(localStorage.getItem('todoList'))[this.projectName];
      mainTitle.textContent = this.projectName;
      dataProject.forEach((item, index) => {
        const itemArr = item.split('",,,"');
        if(!dataProject[index - 1] || !new reviseDate(+dataProject[index - 1].split('",,,"')[0],+itemArr[0]).equalDate){
          const datePart = document.createElement('div');
          const dateTime = document.createElement('time');
          datePart.appendChild(dateTime);
          dateTime.textContent = new reviseDate(+itemArr[0]).equalDate ? 'Today' : new reviseDate(+itemArr[0]).intlFullDate;
          section.appendChild(datePart);
          section.appendChild(new controlArticles(item, this.projectName, this.pageLink).extractArticle);
        }else if(new reviseDate(+dataProject[index - 1].split('",,,"')[0],+itemArr[0]).equalDate){
          section.appendChild(new controlArticles(item, this.projectName, this.pageLink).extractArticle);
        };
      });
      const deletarticle = document.querySelectorAll('.deletarticle');
      deletarticle.forEach(item => {
        item.addEventListener('click', () => {
          this.pageContent;
        });
      });
    }else if(!JSON.parse(localStorage.getItem('todoList'))[this.projectName]){
      mainTitle.textContent = `No ${this.projectName}`;
    };
    const status = document.querySelectorAll('.status');
    status.forEach(item => {
      item.addEventListener('click', () => {
        this.pageContent;
      });
    });
  }
}