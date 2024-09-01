import { controlArticles } from './controlarticles.js';
import { reviseDate } from './revisedate.js';
import { createDialog } from './dialogwindow.js';
import { controlprojects } from './controlprojects.js';

export class printContent {
  constructor(pageLink){
    this.pageLink = pageLink;
  }

  get pageContent(){
    const mainTitle = document.querySelector('main h1');
    mainTitle.textContent = 'daily to-do list';
    const navExpand = document.querySelector('#navexpand');
    navExpand.textContent = '';
    if(Object.keys(JSON.parse(localStorage.getItem('projList'))).length > 0) this.#expandMenu();
    if(document.querySelector('#dialogBtn')) document.querySelector('#dialogBtn').remove();
    const section = document.querySelector('section');
    section.textContent = '';
    if(Object.keys(JSON.parse(localStorage.getItem('projList'))).length === 0){
      const infoDiv = document.createElement('div');
      const infoText = document.createElement('h3');
      const btnElement = document.createElement('button');
      infoDiv.className = 'projblock';
      mainTitle.textContent = 'no topics on to-do list';
      infoText.textContent = 'It\'s time to create a to-do list project';
      btnElement.textContent = 'new project';
      btnElement.id = 'createproject';
      btnElement.setAttribute('type','button');
      btnElement.onclick = () => {
        btnElement.blur();
        new createDialog(btnElement.id).showDialog;
      };
      section.appendChild(infoDiv);
      infoDiv.appendChild(infoText);
      infoDiv.appendChild(btnElement);
    }else if(!isNaN(this.pageLink)){
      if(new createDialog().timeArticles.length === 0){
        const infoDiv = document.createElement('div');
        const infoText = document.createElement('h3');
        const btnElement = document.createElement('button');
        infoDiv.className = 'projblock';
        mainTitle.textContent = 'no to-do lists';
        infoText.textContent = 'create a task for the project';
        section.appendChild(infoDiv);
        infoDiv.appendChild(infoText);
        infoDiv.appendChild(this.#noteBtn());
      }else{
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
        leftarrow.innerHTML = '&#x25c1;';
        leftarrow.type = 'button';
        leftarrow.name = 'previously';
        rightarrow.id = 'rightarrow';
        rightarrow.innerHTML = '&#x25b7;';
        rightarrow.type = 'button';
        rightarrow.name = 'next day';
        section.appendChild(sectionCap);
        sectionCap.appendChild(capTitleDiv);
        capTitleDiv.appendChild(leftarrow);
        capTitleDiv.appendChild(capTitle);
        capTitleDiv.appendChild(capTime);
        capTitleDiv.appendChild(rightarrow);
        this.#projectNotify();
        this.#daysMap();
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
        headpart.appendChild(createNote);
        headpart.appendChild(title);
        const eye = document.createElement('button');
        eye.innerHTML = '&#x1f441;';
        eye.className = 'research';
        eye.onclick = () => {
          new printContent(key).pageContent;
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
    }else if(!Object.keys(JSON.parse(localStorage.getItem('todoList'))).includes(this.pageLink)){
      mainTitle.textContent = `${this.pageLink} deleted`;
    }else if(JSON.parse(localStorage.getItem('todoList'))[this.pageLink]){
      const projBtnBlock = document.createElement('div');
      const projectTitle = document.createElement('h2');
      projectTitle.textContent = 'to do list';
      projBtnBlock.classList = 'projblock';
      projBtnBlock.appendChild(this.#noteBtn());
      projBtnBlock.appendChild(new controlprojects(this.pageLink).extractDiv);
      section.prepend(projBtnBlock);
      if(JSON.parse(localStorage.getItem('todoList'))[this.pageLink].length === 0){
        mainTitle.textContent = `${this.pageLink} list is empty`;
      }else{
        const dataProject = JSON.parse(localStorage.getItem('todoList'))[this.pageLink];
        mainTitle.textContent = this.pageLink;
        dataProject.forEach((item, index) => {
          const itemArr = item;
          if(!dataProject[index - 1] || !new reviseDate(+dataProject[index - 1][0],+itemArr[0]).equalDate){
            const datePart = document.createElement('div');
            const dateTime = document.createElement('time');
            datePart.appendChild(dateTime);
            dateTime.textContent = new reviseDate(+itemArr[0]).equalDate ? `Today, ${new reviseDate(+itemArr[0]).intlFullDate}` : new reviseDate(+itemArr[0]).intlFullDate;
            section.appendChild(datePart);
            section.appendChild(new controlArticles(item, this.pageLink).extractArticle);
          }else if(new reviseDate(+dataProject[index - 1][0],+itemArr[0]).equalDate){
            section.appendChild(new controlArticles(item, this.pageLink).extractArticle);
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

  #daysMap(){
    const digitDaysDate = [];
    const capTime = document.querySelector('#sectioncap time');
    const leftarrow = document.querySelector('#leftarrow');
    const rightarrow = document.querySelector('#rightarrow');
    const timeArtcls = new createDialog().timeArticles;
    let actualDate = new Date(new reviseDate(this.pageLink).fullDate).getTime();
    timeArtcls.forEach((time,index) => {
      if(time && !timeArtcls[index - 1]){
        digitDaysDate.push(new Date(new reviseDate(+time).fullDate).getTime());
      }else if(time && timeArtcls[index - 1] && !new reviseDate(+time, +timeArtcls[index - 1]).equalDate){
        digitDaysDate.push(new Date(new reviseDate(+time).fullDate).getTime());
      };
    });
    if(!digitDaysDate.includes(new Date(new reviseDate(Date()).fullDate).getTime())){
      digitDaysDate.push(new Date(new reviseDate(Date()).fullDate).getTime());
      digitDaysDate.sort();
    };
    rightarrow.addEventListener('click', () => {
      if(digitDaysDate[digitDaysDate.indexOf(actualDate) + 1]){
        actualDate = (new Date(digitDaysDate[digitDaysDate.indexOf(actualDate) + 1])).getTime();
        new printContent(actualDate).pageContent;
      };
    });
    leftarrow.addEventListener('click', () => {
      if(digitDaysDate[digitDaysDate.indexOf(actualDate) - 1]){
        actualDate = (new Date(digitDaysDate[digitDaysDate.indexOf(actualDate) - 1])).getTime();
        new printContent(actualDate).pageContent;
      };
    });
    digitDaysDate.forEach((time,index) => {
      if(new reviseDate(time, actualDate).equalDate){
        capTime.textContent = new reviseDate(new Date(actualDate).getTime()).intlFullDate;
        capTime.dataset.actltime = actualDate;
        rightarrow.style.visibility = !digitDaysDate[index + 1] ? 'hidden' : 'visible';
        leftarrow.style.visibility = !digitDaysDate[index - 1] ? 'hidden' : 'visible';
        this.#getarticle();
      }else if(!digitDaysDate.includes(new Date(new reviseDate(actualDate).fullDate).getTime())){
        const juryArt = digitDaysDate;
        juryArt.push(new Date(new reviseDate(actualDate).fullDate).getTime());
        juryArt.sort();
        capTime.textContent = new reviseDate(new Date(actualDate).getTime()).intlFullDate;
        capTime.dataset.actltime = actualDate;
        rightarrow.style.visibility = !juryArt[juryArt.indexOf(actualDate) + 1] ? 'hidden' : 'visible';
        leftarrow.style.visibility = !juryArt[juryArt.indexOf(actualDate) - 1] ? 'hidden' : 'visible';
        this.#getarticle();
      };
    });
  }

  #getarticle(){
    if(document.querySelectorAll('.articlename')){
      document.querySelectorAll('.articlename').forEach(item => {
       item.remove();
      });
    };
    if(document.querySelectorAll('section article')){
      document.querySelectorAll('section article').forEach(item => {
       item.remove();
      });
    };
    const section = document.querySelector('section');
    const capTime = document.querySelector('#sectioncap time');
    const actualDate = capTime.dataset.actltime;
    const capTitle = document.querySelector('#sectioncap h2');
    if(new reviseDate(+actualDate).equalDate){
      capTitle.textContent = 'do today';
    }else if(new reviseDate(+actualDate, new Date().getTime() + 24*60*60*1000).equalDate){
      capTitle.textContent = 'do tomorrow';
    }else if(new reviseDate(+actualDate, new Date().getTime() - 24*60*60*1000).equalDate){
      capTitle.textContent = 'yesterday\'s list';
    }else{
      capTitle.textContent = 'do for the day';
    };
    let count = 0;
    Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
      let countitem = 0;
      const part = document.createElement('div');
      part.className = 'articlename';
      const titlePart = document.createElement('h3');
      titlePart.textContent = key;
      part.appendChild(titlePart);
      section.appendChild(part);
      JSON.parse(localStorage.getItem('todoList'))[key].forEach(item => {
        if(new reviseDate(+item[0],+actualDate).equalDate){
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
  }

  #expandMenu(){
    const navExpand = document.querySelector('#navexpand');
    navExpand.textContent = '';
    const olList = document.createElement('ol');
    const btnLi = document.createElement('li');
    const btnElement = document.createElement('button');
    btnElement.textContent = '+ new project';
    btnElement.id = 'createproject';
    btnElement.setAttribute('type','button');
    navExpand.appendChild(olList);
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
    if(localStorage.getItem('projList')){
      Object.keys(JSON.parse(localStorage.getItem('projList'))).forEach(item => {
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
          new printContent(menuElement.dataset.link).pageContent;
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
      if(!isNaN(this.pageLink)){
        new createDialog(createNote.id).showDialog;
      }else{
        new createDialog(createNote.id,'',this.pageLink).showDialog;
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
          document.querySelector('.alert').remove();
        });
      });
    };
  }

}