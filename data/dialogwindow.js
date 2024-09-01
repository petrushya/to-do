import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { printContent } from './printcontent.js';

export class createDialog{
  constructor(btnId, array, nameProj){
    this.btnId = btnId ? btnId : '';
    this.array = array ? array : '';
    this.nameProj = nameProj ? nameProj : '';
  }

  get showDialog(){
    this.#createDialogForm();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const canselBtn = document.querySelector('.dialogclose');
    const confirmBtn = document.querySelector('#confirmbtn');
    if(this.btnId.includes('proj')){
      if(this.btnId === 'createproject'){
        const nameProject = document.querySelector('#nameProject');
        const spanName = document.querySelector('#spanName');

        nameProject.addEventListener('input', () => {
          if(nameProject.classList.contains('error')) nameProject.classList.remove('error');
          if(spanName.classList.contains('error')) spanName.classList.remove('error');
          spanName.textContent = '';
        });
      };

      confirmBtn.addEventListener('click', (e) => {
        if(!nameProject.validity.valid && this.btnId === 'createproject'){
          nameProject.className = 'error';
          spanName.className = 'error';
          spanName.textContent = 'Project name required!';
          nameProject.focus();
        }else{
          e.preventDefault();
          const startProjTime = new Date(document.querySelector('#startTime').value).valid ? new Date(document.querySelector('#startTime').value).valueOf().toString() : '';
          const priority = document.querySelector('#priority').value;
          const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
          if(this.btnId === 'reviseproj'){
            const inputString = [startProjTime, priority, detailNote];
            new articlesData(nameProject.value, inputString).changeProjData;
            new printContent('allprojects').pageContent;
          }else if(this.btnId === 'createproject'){
            const inputString = [startProjTime, priority, detailNote];
            new articlesData(nameProject.value, inputString).addArticleData;
            new printContent(nameProject.value).pageContent;
          };
          dialog.close();
        };
      });
    }else{
      const summaryNote = document.querySelector('#summaryNote');
      const spanNote = document.querySelector('#spanNote');
      const startTime = document.querySelector('#startTime');
      let spanTime;
      let reviseTime;
      if(this.btnId === 'dialogBtn' || this.btnId === 'revise') spanTime = document.querySelector('#startTime + span');
      if(this.btnId === 'revise'){
        reviseTime = this.timeArticles.splice(this.timeArticles.indexOf(new Date(startTime.value).valueOf().toString()), 1)[0];
      };

      summaryNote.addEventListener('input', () => {
        if(summaryNote.classList.contains('error')) summaryNote.classList.remove('error');
        if(spanNote.classList.contains('error')) spanNote.classList.remove('error');
        spanNote.textContent = '';
      });

      if(this.btnId === 'dialogBtn') startTime.addEventListener('input', () => {
        if(this.timeArticles.includes(new Date(startTime.value).valueOf().toString())){
          spanTime.className = 'error';
          startTime.className = 'error';
          spanTime.textContent = 'This time is reserved!';
        }else{
          startTime.classList.remove('error');
          spanTime.classList.remove('error');
          spanTime.textContent = '';
        };
      });

      if(this.btnId === 'revise') startTime.addEventListener('input', () => {
        console.log(reviseTime, new Date(startTime.value).valueOf().toString());
        if(reviseTime !== new Date(startTime.value).valueOf().toString() && this.timeArticles.includes(new Date(startTime.value).valueOf().toString())){
          spanTime.className = 'error';
          startTime.className = 'error';
          spanTime.textContent = 'This time is reserved!';
        }else{
          startTime.classList.remove('error');
          spanTime.classList.remove('error');
          spanTime.textContent = '';
        };
      });

      confirmBtn.addEventListener('click', (e) => {
        if((this.btnId === 'dialogBtn' && this.timeArticles.includes(new Date(startTime.value).valueOf().toString())) || (this.btnId === 'revise' && reviseTime !== new Date(startTime.value).valueOf().toString() && this.timeArticles.includes(new Date(startTime.value).valueOf().toString()))){
          startTime.className = 'error';
          spanTime.className = 'error';
          spanTime.textContent = 'This time is reserved!';
          startTime.focus();
        }else if(!summaryNote.validity.valid){
          summaryNote.className = 'error';
          spanNote.className = 'error';
          spanNote.textContent = 'Basic description required!';
          summaryNote.focus();
        }else{
          e.preventDefault();
          const startAddTime = new Date(startTime.value).valueOf().toString();
          const status = '';
          const priority = document.querySelector('#priority').value;
          const nameProject = document.querySelector('#nameProject').value;
          const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
          if(this.btnId === 'revise'){
            const inputString = [startAddTime, this.array[1], priority, summaryNote.value, detailNote];
            new articlesData(nameProject, this.array, inputString).changeArticleData;
          }else if(this.btnId === 'dialogBtn'){
            const inputString = [startAddTime, status, priority, summaryNote.value, detailNote];
            new articlesData(nameProject, inputString).addArticleData;
          };
          new printContent(nameProject).pageContent;
          dialog.close();
        };
      });
    };
    canselBtn.onclick = () => dialog.close();
  }

  get timeArticles(){
    const timeArr = [];
    Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(proj => {
      JSON.parse(localStorage.getItem('todoList'))[proj].forEach(item => {
        timeArr.push(item[0]);
        timeArr.sort();
      });
    });
    console.log(timeArr);
    return timeArr;
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
    const nameProject = this.btnId === 'dialogBtn' && this.nameProj === '' ? document.createElement('select') : document.createElement('input');
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
    startTime.type = this.btnId.includes('proj') ? 'date' : 'datetime-local';
    startTime.name = 'startTime';
    if(this.btnId === 'reviseproj' && new reviseDate(+this.array[0]).fullDate !== new reviseDate(0).fullDate){
      startTime.value = new reviseDate(+this.array[0]).fullDate;
    }else if(this.btnId === 'revise'){
      startTime.value = this.array[0] !== 'indefinit' ? new reviseDate(+this.array[0]).sortFullDate : '';
    }else if(this.btnId === 'createproject'){
      startTime.value = '';
    }else if(this.btnId === 'dialogBtn'){
      startTime.value = new reviseDate(new Date()).sortFullDate;
    };
    startTimeLabel.setAttribute('for', 'startTime');
    startTimeLabel.textContent = this.btnId.includes('proj') ? 'Deadline (skip the field if not): ' : 'Start Time: ';
    priority.name = 'priority';
    priority.id = 'priority';
    priorityLabel.setAttribute('for', 'priority');

    mainElem.appendChild(divElem);
    divElem.appendChild(dialog);
    dialog.appendChild(noteForm);
    noteForm.appendChild(fieldset);
    fieldset.appendChild(legendForm);
    fieldset.appendChild(nameProjectLabel);
    if(this.btnId === 'reviseproj'){
      nameProject.setAttribute('disabled', '');
      nameProject.value = this.nameProj;
      nameProjectLabel.appendChild(nameProject);
    }else if(this.btnId === 'createproject'){
      nameProject.setAttribute('maxlength', '15');
      nameProject.required = 'required';
      nameProjectLabel.textContent = 'Project Name (required): ';
      const spanName = document.createElement('span');
      spanName.id = 'spanName';
      spanName.textContent = '';
      fieldset.appendChild(nameProject)
      fieldset.appendChild(spanName);
    }else if(this.btnId === 'dialogBtn' && this.nameProj === ''){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        const nameProjectOption = document.createElement('option');
        nameProjectOption.value = key;
        nameProjectOption.textContent = key;
        nameProjectLabel.appendChild(nameProject);
        nameProject.appendChild(nameProjectOption);
      });
    }else if(this.btnId === 'revise' || (this.btnId === 'dialogBtn' && this.nameProj)){
      nameProject.value = this.nameProj;
      nameProject.setAttribute('disabled', '');
      nameProjectLabel.appendChild(nameProject);
    };

    fieldset.appendChild(startTimeLabel);
    fieldset.appendChild(startTime);
    if(!this.btnId.includes('proj')){
      const spanTime = document.createElement('span');
      spanTime.textContent = '';
      fieldset.appendChild(spanTime);

      const summaryNoteLabel = document.createElement('label');
      const summaryNote = document.createElement('input');
      const spanNote = document.createElement('span');
      const normalOption = document.createElement('option');
      const highOption = document.createElement('option');
      const lowOption = document.createElement('option');

      priorityLabel.textContent = 'Task Priority: ';
      normalOption.value = 'normal';
      normalOption.textContent = 'normal';
      if(this.array[2] === 'normal') normalOption.setAttribute('selected', '');
      highOption.value = 'high';
      highOption.textContent = 'high';
      if(this.array[2] === 'high') highOption.setAttribute('selected', '');
      lowOption.value = 'low';
      lowOption.textContent = 'low';
      if(this.array[2] === 'low') lowOption.setAttribute('selected', '');
      summaryNote.id = 'summaryNote';
      spanNote.id = 'spanNote';
      spanNote.textContent = '';
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

    if(this.btnId.includes('proj')){
      priorityLabel.textContent = 'Notice of expiration: ';
      const normalOption = document.createElement('option');
      const highOption = document.createElement('option');
      const lowOption = document.createElement('option');
      lowOption.value = 'low';
      lowOption.textContent = 'don\'t warn';
      if(this.array[1] === 'low') lowOption.setAttribute('selected', '');
      normalOption.value = 'normal';
      normalOption.textContent = 'one day\'s';
      if(this.array[1] === 'normal') normalOption.setAttribute('selected', '');
      highOption.value = 'high';
      highOption.textContent = 'three days';
      if(this.array[1] === 'high') highOption.setAttribute('selected', '');
      fieldset.appendChild(priorityLabel);
      priorityLabel.appendChild(priority);
      priority.appendChild(lowOption);
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
    detailNote.rows = this.btnId.includes('proj') ? '3' : '5';
    detailNote.cols = '30';
    if(this.array && this.array[4] && !this.btnId.includes('proj')) detailNote.value = this.array[4];
    if(this.array && this.array[2] && this.btnId.includes('proj')) detailNote.value = this.array[2];
    detailNoteLabel.setAttribute('for', 'detailNote');
    detailNoteLabel.textContent = this.btnId.includes('proj') ? 'Project description: ' : 'Task Details: ';
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