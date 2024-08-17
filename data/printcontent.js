import { controlArticles } from './controlarticles.js';
import { reviseDate } from './revisedate.js';
import { createDialog } from './dialogwindow.js';

export class printContent {
  constructor(pageLink, projectName){
    this.projectName = projectName;
    this.pageLink = pageLink;
  }

  get pageContent(){
    this.#expandMenu();
    const mainTitle = document.querySelector('main h1');
    if(document.querySelector('#dialogBtn')) document.querySelector('#dialogBtn').remove();
    const section = document.querySelector('section');
    section.textContent = '';
    if(Object.keys(JSON.parse(localStorage.getItem('todoList'))).length <= 0){
      mainTitle.textContent = 'no to-do lists';
    }else if(this.pageLink === 'today'){
      document.querySelector('.pagehead').appendChild(this.#noteBtn());
      mainTitle.textContent = 'today\'s to do list';
      let count = 0;
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        if(JSON.parse(localStorage.getItem('todoList'))[key].length > 0){
          const part = document.createElement('div');
          const titlePart = document.createElement('h2');
          titlePart.textContent = key;
          part.appendChild(titlePart);
          section.appendChild(part);
          JSON.parse(localStorage.getItem('todoList'))[key].forEach(item => {
            if(new reviseDate(+item.split('",,,"')[0]).equalDate){
              section.appendChild(new controlArticles(item, key, this.pageLink).extractArticle);
              count++;
            };
          });
        };
      });
      if(count === 0){
        mainTitle.textContent = 'today\'s list is empty';
        section.textContent = '';
      };
    }else if(!Object.keys(JSON.parse(localStorage.getItem('todoList'))).includes(this.projectName)){
      mainTitle.textContent = `${this.projectName} deleted`;
    }else if(JSON.parse(localStorage.getItem('todoList'))[this.projectName]){
      if(JSON.parse(localStorage.getItem('todoList'))[this.projectName].length === 0){
        mainTitle.textContent = `${this.projectName} list is empty`;
      }else{
        const dataProject = JSON.parse(localStorage.getItem('todoList'))[this.projectName];
        mainTitle.textContent = this.projectName;
      const projBtnBlock = document.createElement('div');
      const projectTitle = document.createElement('h2');
      projectTitle.textContent = 'to do list';
      projBtnBlock.classList = 'projblock';
      projBtnBlock.appendChild(this.#noteBtn());
      projBtnBlock.appendChild(projectTitle);
      projBtnBlock.appendChild(this.#delProject());
      section.prepend(projBtnBlock);
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
      };
    };
    const deletarticle = document.querySelectorAll('.deletarticle');
    deletarticle.forEach(item => {
      item.addEventListener('click', () => {
        this.pageContent;
      });
    });
    const status = document.querySelectorAll('.status');
    status.forEach(item => {
      item.addEventListener('click', () => {
        this.pageContent;
      });
    });
  }

  #expandMenu(){
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
          menuElement.blur();
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
    btnElement.onclick = () => {
      btnElement.blur();
      new createDialog(btnElement.id).showDialog;
    };
  }

  #noteBtn(){
    const createNote = document.createElement('button');
    createNote.id ='dialogBtn';
    createNote.type = 'button';
    createNote.name = 'dialogButton';
    createNote.textContent = 'create note';
    if(this.projectName) createNote.dataset.project = this.projectName;
    createNote.onclick = () => {
      createNote.blur();
      new createDialog(createNote.id).showDialog;
      this.pageContent;
    };
    return createNote;
  }

  #delProject(){
    const deleteProject = document.createElement('button');
    deleteProject.id = 'delProject';
    deleteProject.type = 'button';
    deleteProject.name = 'delete project';
    deleteProject.textContent = 'delete project';
    deleteProject.onclick = () => {
      const obj = JSON.parse(localStorage.getItem('todoList'));
      delete obj[this.projectName];
      localStorage.setItem('todoList', JSON.stringify(obj));
      this.pageContent;
    };
    return deleteProject;
  }
}