import { reviseDate } from './revisedate.js';

export class createDialog{
  constructor(btnId, array){
    this.btnId = btnId ? btnId : false;
    this.array = array ? array : false;
  }

  get showDialog(){
    if(document.querySelector('#addnote')) document.querySelector('#addnote').remove();
    this.#createDialogForm();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
  }

  #createDialogForm(){
    const mainElem = document.querySelector('main');
    const divElem = document.createElement('div');
    const dialogNode = document.createElement('dialog');
    const noteForm = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const legendForm = document.createElement('legend');
    const startTime = document.createElement('input');
    const summaryNote = document.createElement('input');
    const detailNote = document.createElement('textarea');
    const priority = document.createElement('select');
    const normalOption = document.createElement('option');
    const highOption = document.createElement('option');
    const lowOption = document.createElement('option');
    const nameProject = document.createElement('input');
    const startTimeLabel = document.createElement('label');
    const summaryNoteLabel = document.createElement('label');
    const detailNoteLabel = document.createElement('label');
    const priorityLabel = document.createElement('label');
    const nameProjectLabel = document.createElement('label');
    const canselButton = document.createElement('button');
    const confirmButton = document.createElement('button');
    const btnPara = document.createElement('p');

    divElem.id = 'addnote';
    noteForm.className = 'noteform';
    startTime.id = 'startTime';
    summaryNote.id = 'summaryNote';
    detailNote.id = 'detailNote';
    priority.id = 'priority';
    nameProject.id = 'nameProject';
    confirmButton.id = 'confirmbtn';
    canselButton.className = 'dialogclose';
    btnPara.className = 'btnwrap';

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
    nameProject.setAttribute('maxlength', '35');
    if(this.btnId === 'createproject' || this.btnId !== 'dialogBtn') nameProject.required = 'required';
    if(this.array){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        if(JSON.parse(localStorage.getItem('todoList'))[key].includes(this.array.join('",,,"')))
        nameProject.value = key;
      });
    };
    canselButton.type = 'button';
    canselButton.name = 'close dialog';
    canselButton.value = 'cancel';
    canselButton.textContent = 'cancel';
    confirmButton.name ='confirm entry';
    confirmButton.value = 'confirm';
    confirmButton.textContent = 'confirm';
    legendForm.textContent = 'new entry';
    startTimeLabel.setAttribute('for', 'startTime');
    startTimeLabel.textContent = 'Start Time: ';
    summaryNoteLabel.setAttribute('for', 'summaryNote');
    summaryNoteLabel.textContent = this.btnId === 'createproject' ? 'Common Task: ' : 'Common Task (required): ';
    detailNoteLabel.setAttribute('for', 'detailNote');
    detailNoteLabel.textContent = 'Task Details: ';
    priorityLabel.setAttribute('for', 'priority');
    priorityLabel.textContent = 'Task Priority: ';
    nameProjectLabel.setAttribute('for', 'nameProject');
    if(this.btnId === 'createproject' || this.btnId !== 'dialogBtn'){
      nameProjectLabel.textContent = 'Project Name (required): ';
    }else if(this.btnId === 'dialogBtn'){
      nameProjectLabel.textContent = 'Project Name (default "routine"): ';
    };

    mainElem.appendChild(divElem);
    divElem.appendChild(dialogNode);
    dialogNode.appendChild(noteForm);
    noteForm.appendChild(fieldset);
    fieldset.appendChild(legendForm);
    fieldset.appendChild(startTimeLabel);
    fieldset.appendChild(startTime);
    fieldset.appendChild(summaryNoteLabel);
    fieldset.appendChild(summaryNote);
    fieldset.appendChild(detailNoteLabel);
    fieldset.appendChild(detailNote);
    fieldset.appendChild(priorityLabel);
    priorityLabel.appendChild(priority);
    priority.appendChild(normalOption);
    priority.appendChild(highOption);
    priority.appendChild(lowOption);
    fieldset.appendChild(nameProjectLabel);
    fieldset.appendChild(nameProject);
    dialogNode.appendChild(btnPara);
    btnPara.appendChild(confirmButton);
    btnPara.appendChild(canselButton);
  }
}