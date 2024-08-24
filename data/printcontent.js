import { controlArticles } from './controlarticles.js';
import { reviseDate } from './revisedate.js';
import { createDialog } from './dialogwindow.js';
import { controlprojects } from './controlprojects.js';

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
        let countitem = 0;
          const part = document.createElement('div');
          const titlePart = document.createElement('h2');
          titlePart.textContent = key;
          part.appendChild(titlePart);
          section.appendChild(part);
          JSON.parse(localStorage.getItem('todoList'))[key].forEach((item, index) => {
            if(new reviseDate(+item.split('",,,"')[0]).equalDate){
              section.appendChild(new controlArticles(item, key, this.pageLink).extractArticle);
              count++;
              countitem++;
            };
          });
        if(countitem === 0){
          const info = document.createElement('h4');
          info.style = 'text-align: center';
          info.textContent = 'Nothing to do';
          part.appendChild(info);
        };
      });
      if(count === 0){
        const info = document.createElement('h3');
        info.style = 'text-align: center';
        info.textContent = 'today\'s list is empty';
        section.textContent = '';
        section.appendChild(info);
      };
    }else if(this.pageLink === 'allprojects'){
      mainTitle.textContent = 'projects list';
      Object.keys(JSON.parse(localStorage.getItem('projList'))).forEach(key => {
        const part = document.createElement('div');
        const headpart = document.createElement('div');
        headpart.className = 'headpart';
        const title = document.createElement('h2');
        title.textContent = key;
        const createNote = document.createElement('button');
        createNote.className ='dialogBtn';
        createNote.dataset.projlink = key;
        createNote.type = 'button';
        createNote.name = 'dialogButton';
        createNote.textContent = 'add note';
        createNote.onclick = () => {
          new createDialog(createNote.className,'',createNote.dataset.projlink).showDialog;
        }
        headpart.append(createNote);
        headpart.append(title);
        const eye = document.createElement('button');
        eye.innerHTML = '&#x1f441;';
        eye.className = 'research';
        eye.onclick = () => {
          new printContent('',key).pageContent;
        };
        eye.setAttribute('tabindex', 0);
        headpart.append(eye);
        const reviseBtn = new controlprojects(key, 'allprojects').reviseButton;
        headpart.append(reviseBtn);
        reviseBtn.addEventListener('click', () => {
          this.pageContent;
        });
        const deleteProject = new controlprojects(key, 'allprojects').deletButton;
        headpart.appendChild(deleteProject);
        deleteProject.addEventListener('click', () => {
          this.pageContent;
        });
        part.appendChild(headpart);
        section.appendChild(part);
        if(JSON.parse(localStorage.getItem('projList'))[key].length > 0){
          part.appendChild(new controlprojects(key, 'allprojects').extractDiv);
        }else{
          const para = document.createElement('p');
          para.textContent = `${key} list is empty`;
        };
      });
    }else if(!Object.keys(JSON.parse(localStorage.getItem('todoList'))).includes(this.projectName)){
      mainTitle.textContent = `${this.projectName} deleted`;
    }else if(JSON.parse(localStorage.getItem('todoList'))[this.projectName]){
      const projBtnBlock = document.createElement('div');
      const projectTitle = document.createElement('h2');
      projectTitle.textContent = 'to do list';
      projBtnBlock.classList = 'projblock';
      projBtnBlock.appendChild(this.#noteBtn());
      projBtnBlock.appendChild(new controlprojects(this.projectName).extractDiv);
      section.prepend(projBtnBlock);
      if(JSON.parse(localStorage.getItem('todoList'))[this.projectName].length === 0){
        mainTitle.textContent = `${this.projectName} list is empty`;
      }else{
        const dataProject = JSON.parse(localStorage.getItem('todoList'))[this.projectName];
        mainTitle.textContent = this.projectName;
        dataProject.forEach((item, index) => {
          const itemArr = item.split('",,,"');
          if(!dataProject[index - 1] || !new reviseDate(+dataProject[index - 1].split('",,,"')[0],+itemArr[0]).equalDate){
            const datePart = document.createElement('div');
            const dateTime = document.createElement('time');
            datePart.appendChild(dateTime);
            dateTime.textContent = new reviseDate(+itemArr[0]).equalDate ? `Today, ${new reviseDate(+itemArr[0]).intlFullDate}` : new reviseDate(+itemArr[0]).intlFullDate;
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
    const btnLi = document.createElement('li');
    const btnElement = document.createElement('button');
    btnElement.textContent = '+ new project';
    btnElement.id = 'createproject';
    btnElement.setAttribute('type','button');
    olList.appendChild(btnLi);
    btnLi.appendChild(btnElement);
    btnElement.onclick = () => {
      btnElement.blur();
      new createDialog(btnElement.id).showDialog;
    };
    const btnProjLi = document.createElement('li');
    const btnProjElement = document.createElement('button');
    btnProjElement.textContent = 'Projects List';
    btnProjElement.id = 'allprojects';
    btnProjElement.setAttribute('type','button');
    olList.appendChild(btnProjLi);
    btnProjLi.appendChild(btnProjElement);
    btnProjElement.onclick = () => {
      btnProjElement.blur();
      new printContent(btnProjElement.id, '').pageContent;
    };
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
  }

  #noteBtn(){
    const createNote = document.createElement('button');
    createNote.id ='dialogBtn';
    createNote.type = 'button';
    createNote.name = 'dialogButton';
    createNote.textContent = 'add note';
    createNote.onclick = () => {
      if(this.pageLink === 'today'){
        new createDialog(createNote.id).showDialog;
      }else{
        new createDialog(createNote.id,'',this.projectName).showDialog;
      };
    };
    return createNote;
  }

}