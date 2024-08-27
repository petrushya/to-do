import { reviseDate } from './revisedate.js';
import { createDialog } from './dialogwindow.js';
import { articlesData } from './writearticle.js';

export class controlprojects{
  constructor(storageKey, pageLink){
    this.storageKey = storageKey;
    this.pageLink = pageLink;
  }
  get extractDiv(){
    const projData = JSON.parse(localStorage.getItem('projList'))[this.storageKey];
    const projectDiv = document.createElement('div');
    const projectCap = document.createElement('div');
    const projectStartCap = document.createElement('span');
    const projectDate = document.createElement('time');
    const wrapCap = document.createElement('div');
    const pasStart = document.createElement('span');
    const projectPas = document.createElement('p');
    const wrapPas = document.createElement('div');
    const projectInfo = document.createElement('span');
    const projectNote = document.createElement('p');
    const wrapInfo = document.createElement('div');

    projectDiv.className = 'projectart';
    projectCap.className = 'projectcap';
    wrapCap.className = wrapPas.className = wrapInfo.className = 'wrapping';

    projectStartCap.textContent = 'Deadline: ';
    projectDate.textContent = projData[0] !== '' ? new reviseDate(+projData[0]).intlFullDate : 'Indefinite';
    pasStart.textContent = 'Notify: ';
    if(projData[1] === 'low' || projData[0] === ''){
      projectPas.textContent = 'do not notify';
    }else if(projData[1] === 'normal'){
      projectPas.textContent = 'a day earlier';
    }else if(projData[1] === 'high'){
      projectPas.textContent = 'three days earlier';
    };
    projectInfo.textContent = 'Information:';

    projectDiv.append(projectCap);
    projectCap.append(wrapCap);
    wrapCap.append(projectStartCap);
    wrapCap.append(projectDate);
    projectCap.append(wrapPas);
    wrapPas.append(pasStart);
    wrapPas.append(projectPas);

    if(this.pageLink === 'allprojects'){
      projectDiv.append(wrapInfo);
      wrapInfo.append(projectInfo);
      projectNote.innerText = projData[2] !== '' ? projData[2] : 'Non Description!';
      wrapInfo.append(projectNote);
    };

    return projectDiv;
  }

  get reviseButton(){
    if(this.pageLink === 'allprojects'){
      const projData = JSON.parse(localStorage.getItem('projList'))[this.storageKey];
      const projectRevise = document.createElement('button');
      projectRevise.className = 'reviseproj';
      projectRevise.dataset.projlink = this.storageKey;
      projectRevise.setAttribute('type', 'button');
      projectRevise.innerHTML = '&#x1f4cb;';
      projectRevise.addEventListener('click', (e) => {
        new createDialog(projectRevise.className, projData, e.target.dataset.projlink).showDialog;
      });
    return projectRevise;
    };
  }

  get deletButton(){
    if(this.pageLink === 'allprojects'){
      const deleteProject = document.createElement('button');
      deleteProject.className = 'delproject';
      deleteProject.dataset.projlink = this.storageKey;
      deleteProject.type = 'button';
      deleteProject.name = 'delete project';
      deleteProject.innerHTML = '&#x1F5D1;';
      deleteProject.addEventListener('click', (e) => {
        const obj = JSON.parse(localStorage.getItem('todoList'));
        delete obj[e.target.dataset.projlink];
        localStorage.setItem('todoList', JSON.stringify(obj));
        const objProj = JSON.parse(localStorage.getItem('projList'));
        delete objProj[e.target.dataset.projlink];
        localStorage.setItem('projList', JSON.stringify(objProj));
      });
      return deleteProject;
    };
  }

}