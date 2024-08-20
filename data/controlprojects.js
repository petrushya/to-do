import { reviseDate } from './revisedate.js';

export class controlprojects{
  constructor(storageKey){
    this.storageKey = storageKey;
  }
  get extractDiv(){
    const arrayData = JSON.parse(localStorage.getItem('projList'))[this.storageKey].toString().split('",,,"');
    const projectDiv = document.createElement('div');
    const projectCap = document.createElement('div');
    const projectDateCap = document.createElement('p');
    const projectDate = document.createElement('time');
    const projectPas = document.createElement('span');
    const projectInfo = document.createElement('div');
    const projectNote = document.createElement('p');

    projectDiv.className = 'projectart';
    projectCap.className = 'projectcap';
    projectDateCap.className = 'projdatecap';
    projectPas.className = 'projectpas';
    projectInfo.className = 'projectinfo';

    projectDateCap.textContent = 'end time: ';
    projectDate.textContent = arrayData[0] !== 'Indefinite' ? new reviseDate(+arrayData[0]).fullDate : arrayData[0];
    if(arrayData[2] === 'high'){
      projectPas.innerHTML = '&#x272d;&#x272d;&#x272d;';
      projectPas.classList = 'high';
    }else{
      projectPas.innerHTML = '&#x272d;&#x272d;';
    };
    projectNote.innerText = `information:\n${arrayData[3]}`;

    projectDiv.append(projectCap);
    projectDiv.append(projectInfo);
    projectCap.append(projectDateCap);
    projectDateCap.append(projectDate);
    projectCap.append(projectPas);
    projectInfo.append(projectNote);

    return projectDiv;
  }
}