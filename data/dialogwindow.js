import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { printContent } from './printcontent.js';

export class createDialog{
  constructor(btnId, array){
    btnId ? this.btnId = btnId : this.btnId = false;
    array ? this.array = array : this.array = false;
  }

  get showDialog(){
    this.#createDialogForm();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const summaryNote = document.querySelector('#summaryNote');
    const spanNote = document.querySelector('.spanNote');
    const nameProject = document.querySelector('#nameProject');
    const spanProject = document.querySelector('.spanProject');
    const confirmBtn = document.querySelector('#confirmbtn');
    const canselBtn = document.querySelector('.dialogclose');
    if(summaryNote.required){
      summaryNote.addEventListener('input', () => {
        if(summaryNote.classList.contains('error')) summaryNote.classList.remove('error');
        if(spanNote.classList.contains('error')) spanNote.classList.remove('error');
        spanNote.textContent = '';
      });
    };
    if(nameProject.required){
      nameProject.addEventListener('input', () => {
        if(nameProject.classList.contains('error')) nameProject.classList.remove('error');
        if(spanProject.classList.contains('error')) spanProject.classList.remove('error');
        spanProject.textContent = '';
      });
    };

    confirmBtn.addEventListener('click', (e) => {
      if(summaryNote.required && !summaryNote.validity.valid){
          summaryNote.classList.add('error');
          spanNote.classList.add('error');
          spanNote.textContent = 'Write something';
          summaryNote.focus();
      }else if(nameProject.required && !nameProject.validity.valid){
          nameProject.classList.add('error');
          spanProject.classList.add('error');
          spanProject.textContent = 'Write something';
          nameProject.focus();
      }else{
        e.preventDefault();
        const startTime = document.querySelector('#startTime').value ?
      new Date(document.querySelector('#startTime').value).valueOf() : '';
        const status = '?';
        const priority = document.querySelector('#priority').value;
        const inpSumNote = summaryNote.value ? summaryNote.value : '';
        const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
        const inpNameProject = nameProject.value ? nameProject.value : '';
        const inputString = [startTime, status, priority, inpSumNote, detailNote].join('",,,"');
        if(this.btnId === 'revise'){
          new articlesData(inpNameProject, this.array.join('",,,"'), inputString).changeArticleData;
        }else if(this.btnId === 'dialogBtn' || this.btnId === 'createproject'){
          new articlesData(inpNameProject, inputString).addArticleData;
        };
        new printContent(this.btnId, inpNameProject).pageContent;
        dialog.close();
      };
    });
    canselBtn.onclick = () => dialog.close();
  }

  #createDialogForm(){
    if(document.querySelector('#addnote')) document.querySelector('#addnote').remove();
    const mainElem = document.querySelector('main');
    const divElem = document.createElement('div');
    const dialogNode = document.createElement('dialog');
    const noteForm = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const legendForm = document.createElement('legend');
    const startTime = document.createElement('input');
    const summaryNote = document.createElement('input');
    const spanNote = document.createElement('span');
    const detailNote = document.createElement('textarea');
    const priority = document.createElement('select');
    const normalOption = document.createElement('option');
    const highOption = document.createElement('option');
    const lowOption = document.createElement('option');
    const nameProject = document.createElement('input');
    const spanProject = document.createElement('span');
    const startTimeLabel = document.createElement('label');
    const summaryNoteLabel = document.createElement('label');
    const detailNoteLabel = document.createElement('label');
    const priorityLabel = document.createElement('label');
    const nameProjectLabel = document.createElement('label');
    const canselBtn = document.createElement('button');
    const confirmBtn = document.createElement('button');
    const btnPara = document.createElement('p');

    divElem.id = 'addnote';
    noteForm.className = 'noteform';
    startTime.id = 'startTime';
    summaryNote.id = 'summaryNote';
    detailNote.id = 'detailNote';
    priority.id = 'priority';
    nameProject.id = 'nameProject';
    confirmBtn.id = 'confirmbtn';
    canselBtn.className = 'dialogclose';
    btnPara.className = 'btnwrap';
    spanNote.className = 'spanNote';
    spanProject.className = 'spanProject';

    startTime.type = 'datetime-local';
    startTime.name = 'startTime';
    if(this.array) startTime.value = new reviseDate(+this.array[0]).sortFullDate;
    summaryNote.name = 'summary';
    summaryNote.setAttribute('maxlength', '80');
    if(this.btnId !== 'createproject') summaryNote.required = 'required';
    if(this.array) summaryNote.value = this.array[3];
    detailNote.name = 'detail';
    detailNote.rows = '5';
    detailNote.cols = '30';
    if(this.array && this.array[4]) detailNote.value = this.array[4];
    priority.name = 'priority';
    if(this.array) priority.value = this.array[2];
    normalOption.value = 'normal';
    normalOption.textContent = 'normal';
    highOption.value = 'high';
    highOption.textContent = 'high';
    lowOption.value = 'low';
    lowOption.textContent = 'low';

    nameProject.name = 'project name';
    nameProject.setAttribute('maxlength', '15');
    nameProjectLabel.setAttribute('for', 'nameProject');
    if(this.btnId === 'createproject' || (this.btnId === 'dialogBtn' && !document.querySelector('#dialogBtn').dataset.project)){
      nameProjectLabel.textContent = 'Project Name (required): ';
      nameProject.setAttribute('required', '');
    };
    if(this.btnId === 'dialogBtn' && document.querySelector('#dialogBtn').dataset.project){
      nameProject.value = document.querySelector('#dialogBtn').dataset.project;
      nameProjectLabel.textContent = 'Project Name: ';
      nameProject.setAttribute('disabled', '');
    };
    if(this.array){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        if(JSON.parse(localStorage.getItem('todoList'))[key].includes(this.array.join('",,,"')))
        nameProject.value = key;
        nameProject.setAttribute('disabled', '');
        nameProjectLabel.textContent = 'Project Name: ';
      });
    };

    canselBtn.type = 'button';
    canselBtn.name = 'close dialog';
    canselBtn.value = 'cancel';
    canselBtn.textContent = 'cancel';
    confirmBtn.name ='confirm entry';
    confirmBtn.value = 'confirm';
    confirmBtn.textContent = 'confirm';
    legendForm.textContent = 'new entry';
    startTimeLabel.setAttribute('for', 'startTime');
    startTimeLabel.textContent = 'Start Time: ';
    summaryNoteLabel.setAttribute('for', 'summaryNote');
    summaryNoteLabel.textContent = this.btnId === 'createproject' ? 'Common Task: ' : 'Common Task (required): ';
    detailNoteLabel.setAttribute('for', 'detailNote');
    detailNoteLabel.textContent = 'Task Details: ';
    priorityLabel.setAttribute('for', 'priority');
    priorityLabel.textContent = 'Task Priority: ';

    mainElem.appendChild(divElem);
    divElem.appendChild(dialogNode);
    dialogNode.appendChild(noteForm);
    noteForm.appendChild(fieldset);
    fieldset.appendChild(legendForm);
    fieldset.appendChild(startTimeLabel);
    fieldset.appendChild(startTime);
    fieldset.appendChild(summaryNoteLabel);
    fieldset.appendChild(summaryNote);
    fieldset.appendChild(spanNote);
    fieldset.appendChild(detailNoteLabel);
    fieldset.appendChild(detailNote);
    fieldset.appendChild(priorityLabel);
    priorityLabel.appendChild(priority);
    priority.appendChild(normalOption);
    priority.appendChild(highOption);
    priority.appendChild(lowOption);
    fieldset.appendChild(nameProjectLabel);
    fieldset.appendChild(nameProject);
    fieldset.appendChild(spanProject);
    dialogNode.appendChild(btnPara);
    btnPara.appendChild(confirmBtn);
    btnPara.appendChild(canselBtn);
  }
}