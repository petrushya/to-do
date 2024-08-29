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
    mainTitle.textContent = 'daily to-do list';
    if(document.querySelector('#dialogBtn')) document.querySelector('#dialogBtn').remove();
    const section = document.querySelector('section');
    section.textContent = '';
    if(Object.keys(JSON.parse(localStorage.getItem('todoList'))).length <= 0){
      mainTitle.textContent = 'no to-do lists';
      section.textContent = '';
    }else if(this.pageLink === 'today'){
      document.querySelector('.pagehead').appendChild(this.#noteBtn());
      const sectionCap = document.createElement('div');
      sectionCap.className = 'sticky';
      const capTitleDiv = document.createElement('div');
      capTitleDiv.id = 'sectioncap';
      const capTitle = document.createElement('h2');
      const capTime = document.createElement('time');
      const leftarrow = document.createElement('button');
      const rightarrow = document.createElement('button');
      leftarrow.id = 'leftarrow';
      rightarrow.id = 'rightarrow';
      capTitle.textContent = 'do today ';
      capTime.textContent = new reviseDate(new Date().valueOf()).intlFullDate;
      capTime.dataset.time = new Date().valueOf();
      section.appendChild(sectionCap);
      sectionCap.appendChild(capTitleDiv);
      capTitleDiv.appendChild(leftarrow);
      capTitleDiv.append(capTitle, capTime);
      capTitleDiv.appendChild(rightarrow);
      this.#projectNotify();
      this.daysMap;
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
        headpart.appendChild(createNote);
        headpart.appendChild(title);
        const eye = document.createElement('button');
        eye.innerHTML = '&#x1f441;';
        eye.className = 'research';
        eye.onclick = () => {
          new printContent('',key).pageContent;
        };
        eye.setAttribute('tabindex', 0);
        headpart.appendChild(eye);
        const reviseBtn = new controlprojects(key, 'allprojects').reviseButton;
        headpart.appendChild(reviseBtn);
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
          const itemArr = item;
          if(!dataProject[index - 1] || !new reviseDate(+dataProject[index - 1][0],+itemArr[0]).equalDate){
            const datePart = document.createElement('div');
            const dateTime = document.createElement('time');
            datePart.appendChild(dateTime);
            dateTime.textContent = new reviseDate(+itemArr[0]).equalDate ? `Today, ${new reviseDate(+itemArr[0]).intlFullDate}` : new reviseDate(+itemArr[0]).intlFullDate;
            section.appendChild(datePart);
            section.appendChild(new controlArticles(item, this.projectName, this.pageLink).extractArticle);
          }else if(new reviseDate(+dataProject[index - 1][0],+itemArr[0]).equalDate){
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

  get daysMap(){
    const daysDate = [];
    const leftarrow = document.querySelector('#leftarrow');
    const rightarrow = document.querySelector('#rightarrow');
    const timeArtcls = new createDialog().timeArticles;
    const capTime = document.querySelector('#sectioncap time');
    timeArtcls.forEach((time,index) => {
      if(time && !(index - 1)){
        daysDate.push(time);
      }else if(time && (index - 1) && !new reviseDate(+time, +timeArtcls[index - 1]).equalDate){
        daysDate.push(time);
      };
    });
    let arrindex;
    daysDate.forEach((time,index) => {
      if(new reviseDate(+time).equalDate){
        capTime.dataset.time = time;
        arrindex = index;
        this.#getarticle();
      };
    });
    rightarrow.addEventListener('click', () => {
      if(arrindex < daysDate.length - 1 ){
        capTime.dataset.time = daysDate[arrindex + 1];
        arrindex += 1;
        this.#getarticle();
      };
    });
    leftarrow.addEventListener('click', () => {
      if(arrindex-1 >= 0){
        capTime.dataset.time = daysDate[arrindex - 1];
        arrindex -= 1;
        this.#getarticle();
      };
    });
  }

  #getarticle(){
    const articleName = document.querySelector('.articlename');
    if(document.querySelectorAll('.articlename')){
      document.querySelectorAll('.articlename').forEach(item => {
       item.remove();
      });
    };
    const section = document.querySelector('section');
    if(document.querySelectorAll('section article')){
      document.querySelectorAll('section article').forEach(item => {
       item.remove();
      });
    };
    const capTime = document.querySelector('#sectioncap time');
    const actualDate = capTime.dataset.time;
    let count = 0;
    Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
      let countitem = 0;
        const part = document.createElement('div');
        part.className = 'articlename';
        const titlePart = document.createElement('h3');
        titlePart.textContent = key;
        part.appendChild(titlePart);
        section.appendChild(part);
        JSON.parse(localStorage.getItem('todoList'))[key].forEach((item, index) => {
          if(new reviseDate(+item[0],+actualDate).equalDate){
            section.appendChild(new controlArticles(item, key, this.pageLink).extractArticle);
            count++;
            countitem++;
          };
        });
      if(countitem === 0 && count !== 0){
        const info = document.createElement('h4');
        info.style = 'text-align: center';
        info.textContent = 'Nothing to do';
        part.appendChild(info);
      };
    });
    if(count === 0){
      capTitle.textContent = 'today\'s list is empty';
      section.textContent = '';
      section.appendChild(sectionCap);
      sectionCap.appendChild(capTitleDiv);
      this.#projectNotify();
    };
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
      new printContent(btnProjElement.id).pageContent;
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

  #projectNotify(){
    const projObj = JSON.parse(localStorage.getItem('projList'));
    Object.keys(projObj).forEach(key => {
      if(projObj[key][1] === 'normal' || projObj[key][1] === 'high'){
        const timeEndProj = new Date(+projObj[key][0]).valueOf();
        const difference = timeEndProj - new Date().valueOf();
        const difCompare = projObj[key][1] === 'normal' ? 24*60*60*1000 : 3*24*60*60*1000;
        if(0 < difference <= difCompare){
          const section = document.querySelector('section');
          const notifyBlock = document.createElement('div');
          const notifySpan = document.createElement('span');
          const notifyNote = document.createElement('p');
          const notifyTime = document.createElement('time');
          const notifyBtn = document.createElement('button');
          notifyBlock.className = 'alert';
          notifySpan.textContent = key;
          notifyNote.textContent = ' time expires: ';
          notifyTime.textContent = new reviseDate(new Date(+projObj[key][0]).valueOf()).intlFullDate;
          notifyBtn.textContent = 'accept';
          notifyBtn.type = 'button';
          notifyBtn.dataset.projlink = key;
          section.appendChild(notifyBlock);
          notifyBlock.appendChild(notifyNote);
          notifyNote.prepend(notifySpan);
          notifyNote.appendChild(notifyTime);
          notifyBlock.appendChild(notifyBtn);
        };
      };
    });
    if(document.querySelector('.alert')){
      const acceptBtns = document.querySelectorAll('.alert button');
      acceptBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const projKey = e.target.dataset.projlink;
          projObj[projKey][1] = projObj[projKey][1] === 'high' ? 'normal' : 'low';
          localStorage.setItem('projList', JSON.stringify(projObj));
          this.pageContent;
        });
      });
    };
  }

}