import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { printContent } from './printcontent.js';

export class createDialog{
  constructor(btnId, array){
    this.btnId = btnId ? btnId : '';
    this.array = array ? array : '';
  }

  get showDialog(){
    this.#createDialogForm();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const canselBtn = document.querySelector('.dialogclose');
    const confirmBtn = document.querySelector('#confirmbtn');
    if(this.btnId === 'createproject'){
      const nameProject = document.querySelector('#nameProject');
      const spanName = document.querySelector('#spanName');

      nameProject.addEventListener('input', () => {
        if(nameProject.classList.contains('error')) nameProject.classList.remove('error');
        if(spanName.classList.contains('error')) spanName.classList.remove('error');
        spanName.textContent = '';
      });

      confirmBtn.addEventListener('click', (e) => {
        if(!nameProject.validity.valid){
          nameProject.className = 'error';
          spanName.className = 'error';
          spanName.textContent = 'Project name required!';
          nameProject.focus();
        }else{
          e.preventDefault();
          const startTime = new Date(document.querySelector('#startTime').value).valueOf() ? new Date(document.querySelector('#startTime').value).valueOf() : '';
          const priority = document.querySelector('#priority').value;
          const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
          const inputString = [startTime, 'nonchecked', priority, '', detailNote].join('",,,"');
          new articlesData(nameProject.value, inputString).addArticleData;
          new printContent('', nameProject.value).pageContent;
          dialog.close();
        };
      });
    }else{
      const summaryNote = document.querySelector('#summaryNote');
      const spanNote = document.querySelector('#spanNote');

      summaryNote.addEventListener('input', () => {
        if(summaryNote.classList.contains('error')) summaryNote.classList.remove('error');
        if(spanNote.classList.contains('error')) spanNote.classList.remove('error');
        spanNote.textContent = '';
      });

      confirmBtn.addEventListener('click', (e) => {
        if(!summaryNote.validity.valid){
          summaryNote.className = 'error';
          spanNote.className = 'error';
          spanNote.textContent = 'Basic description required!';
          summaryNote.focus();
        }else{
          e.preventDefault();
          const startTime = document.querySelector('#startTime').value ? 
new Date(document.querySelector('#startTime').value).valueOf() : '';
          const status = '';
          const priority = document.querySelector('#priority').value;
          const nameProject = document.querySelector('#nameProject').value;
          const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
          if(this.btnId === 'revise'){
            const inputString = [startTime, this.array[1], priority, summaryNote.value, detailNote].join('",,,"');
            new articlesData(nameProject, this.array.join('",,,"'), inputString).changeArticleData;
          }else if(this.btnId === 'dialogBtn'){
            const inputString = [startTime, status, priority, summaryNote.value, detailNote].join('",,,"');
            new articlesData(nameProject, inputString).addArticleData;
          };
          new printContent('', nameProject).pageContent;
          dialog.close();
        };
      });
    };
    canselBtn.onclick = () => dialog.close();
  }

  #createDialogForm(){
    if(document.querySelector('#addnote')) document.querySelector('#addnote').remove();
    const mainElem = document.querySelector('main');
    const divElem = document.createElement('div');
    const dialog = document.createElement('dialog');
    const noteForm = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const legendForm = document.createElement('legend');
    const nameProjectLabel = document.createElement('label');
    const nameProject = document.querySelector('#dialogBtn').dataset.project || this.btnId === 'createproject' ? document.createElement('input') : document.createElement('select');
    const startTimeLabel = document.createElement('label');
    const startTime = document.createElement('input');
    const priorityLabel = document.createElement('label');
    const priority = document.createElement('select');

    divElem.id = 'addnote';
    noteForm.className = 'noteform';
    legendForm.textContent = 'new entry';
    nameProject.id = 'nameProject';
    nameProject.name = 'project name';
    nameProjectLabel.setAttribute('for', 'nameProject');
    nameProjectLabel.textContent = 'Project Name: ';
    startTime.id = 'startTime';
    startTime.type = this.btnId === 'createproject' ? 'date' : 'datetime-local';
    startTime.name = 'startTime';
    startTime.value = this.array ? startTime.value = new reviseDate(+this.array[0]).sortFullDate : new reviseDate(new Date()).sortFullDate;
    startTimeLabel.setAttribute('for', 'startTime');
    startTimeLabel.textContent = this.btnId === 'createproject' ? 'Deadline: ' : 'Start Time: ';
    priority.name = 'priority';
    priority.id = 'priority';
    priorityLabel.setAttribute('for', 'priority');

    mainElem.appendChild(divElem);
    divElem.appendChild(dialog);
    dialog.appendChild(noteForm);
    noteForm.appendChild(fieldset);
    fieldset.appendChild(legendForm);
    fieldset.appendChild(nameProjectLabel);
    document.querySelector('#dialogBtn').dataset.project || this.btnId === 'createproject' ? fieldset.appendChild(nameProject) : nameProjectLabel.appendChild(nameProject);
    if(this.btnId === 'createproject'){
      nameProject.setAttribute('maxlength', '15');
      nameProject.required = 'required';
      nameProjectLabel.textContent = 'Project Name (required): ';
      const spanName = document.createElement('span');
      spanName.id = 'spanName';
      fieldset.appendChild(spanName);
    }else if(this.btnId === 'dialogBtn' && document.querySelector('#dialogBtn').dataset.project){
      nameProject.value = document.querySelector('#dialogBtn').dataset.project;
      nameProject.setAttribute('disabled', '');
    }else if(this.btnId === 'dialogBtn' && !document.querySelector('#dialogBtn').dataset.project){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        const nameProjectOption = document.createElement('option');
        nameProjectOption.value = key;
        nameProjectOption.textContent = key;
        nameProject.appendChild(nameProjectOption);
      });
    };
    if(this.array){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        if(JSON.parse(localStorage.getItem('todoList'))[key].includes(this.array.join('",,,"')))
        nameProject.value = key;
        nameProject.setAttribute('disabled', '');
      });
    };
    fieldset.appendChild(startTimeLabel);
    fieldset.appendChild(startTime);

    if(this.btnId !== 'createproject'){
      const summaryNoteLabel = document.createElement('label');
      const summaryNote = document.createElement('input');
      const spanNote = document.createElement('span');
      const normalOption = document.createElement('option');
      const highOption = document.createElement('option');
      const lowOption = document.createElement('option');

      priorityLabel.textContent = 'Task Priority: ';
      if(this.array) priority.value = this.array[2];
      normalOption.value = 'normal';
      normalOption.textContent = 'normal';
      highOption.value = 'high';
      highOption.textContent = 'high';
      lowOption.value = 'low';
      lowOption.textContent = 'low';
      summaryNote.id = 'summaryNote';
      spanNote.id = 'spanNote';
      summaryNote.name = 'summary';
      summaryNote.setAttribute('maxlength', '80');
      summaryNote.required = 'required';
      summaryNoteLabel.setAttribute('for', 'summaryNote');
      summaryNoteLabel.textContent = 'Common Task (required): ';
      if(this.array) summaryNote.value = this.array[3];

      fieldset.appendChild(priorityLabel);
      priorityLabel.appendChild(priority);
      priority.appendChild(normalOption);
      priority.appendChild(highOption);
      priority.appendChild(lowOption);
      fieldset.appendChild(summaryNoteLabel);
      fieldset.appendChild(summaryNote);
      fieldset.appendChild(spanNote);
    }

    if(this.btnId === 'createproject'){
      priorityLabel.textContent = 'Priority Project: ';
      const normalOption = document.createElement('option');
      const highOption = document.createElement('option');
      normalOption.value = 'normal';
      normalOption.textContent = 'normal';
      highOption.value = 'high';
      highOption.textContent = 'high';
      fieldset.appendChild(priorityLabel);
      priorityLabel.appendChild(priority);
      priority.appendChild(normalOption);
      priority.appendChild(highOption);
    }
    const detailNoteLabel = document.createElement('label');
    const detailNote = document.createElement('textarea');
    const canselBtn = document.createElement('button');
    const confirmBtn = document.createElement('button');
    const btnPara = document.createElement('p');

    detailNote.id = 'detailNote';
    confirmBtn.id = 'confirmbtn';
    canselBtn.className = 'dialogclose';
    btnPara.className = 'btnwrap';

    detailNote.name = 'detail';
    detailNote.rows = this.btnId === 'createproject' ? '3' : '5';
    detailNote.cols = '30';
    if(this.array && this.array[4]) detailNote.value = this.array[4];
    detailNoteLabel.setAttribute('for', 'detailNote');
    detailNoteLabel.textContent = this.btnId === 'createproject' ? 'Project description: ' : 'Task Details: ';
    confirmBtn.name ='confirm entry';
    confirmBtn.value = 'confirm';
    confirmBtn.textContent = 'confirm';
    canselBtn.type = 'button';
    canselBtn.name = 'close dialog';
    canselBtn.value = 'cancel';
    canselBtn.textContent = 'cancel';

    fieldset.appendChild(detailNoteLabel);
    fieldset.appendChild(detailNote);
    dialog.appendChild(btnPara);
    btnPara.appendChild(confirmBtn);
    btnPara.appendChild(canselBtn);
  }
}