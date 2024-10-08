import { reviseDate } from './revisedate.js';
import { articlesData } from './writearticle.js';
import { printContent } from './printcontent.js';

export class createDialog{
  constructor(btnname, array, nameProj){
    this.btnname = btnname ? btnname : '';
    this.array = array ? array : '';
    this.nameProj = nameProj ? nameProj : '';
  }

  get showDialog(){
    this.#createDialogForm();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const canselBtn = document.querySelector('.dialogclose');
    const confirmBtn = document.querySelector('#confirmbtn');
    if(this.btnname.includes('proj')){
      if(this.btnname === 'createproject'){
        const nameProject = document.querySelector('#nameProject');
        const spanName = document.querySelector('#spanName');

        nameProject.addEventListener('input', () => {
          if(spanName.classList.contains('error')) spanName.classList.remove('error');
          spanName.textContent = '';
        });
        nameProject.addEventListener('blur', () => {
          if(spanName.classList.contains('error')) spanName.classList.remove('error');
          spanName.textContent = '';
        });
      };

      confirmBtn.addEventListener('click', (e) => {
        if(!nameProject.validity.valid && this.btnname === 'createproject'){
          spanName.className = 'error';
          spanName.textContent = 'Topic name required!';
          nameProject.focus();
        }else{
          e.preventDefault();
          const startProjTime = new Date(document.querySelector('#startTime').value).valid ? new Date(document.querySelector('#startTime').value).valueOf().toString() : '';
          const priority = document.querySelector('#priority').value;
          const detailNote = document.querySelector('#detailNote').value ? document.querySelector('#detailNote').value : '';
          if(this.btnname === 'reviseproj'){
            const inputString = [startProjTime, priority, detailNote];
            new articlesData(nameProject.value, inputString).changeProjData;
            new printContent('allprojects').pageContent;
          }else if(this.btnname === 'createproject'){
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
      if(this.btnname === 'dialogBtn' || this.btnname === 'revise') spanTime = document.querySelector('#startTime + span');
      if(this.btnname === 'revise'){
        reviseTime = this.timeArticles.splice(this.timeArticles.indexOf(new Date(startTime.value).valueOf().toString()), 1)[0];
      };

      summaryNote.addEventListener('input', () => {
        if(spanNote.classList.contains('error')) spanNote.classList.remove('error');
        spanNote.textContent = '';
      });
      summaryNote.addEventListener('blur', () => {
        if(spanNote.classList.contains('error')) spanNote.classList.remove('error');
        spanNote.textContent = '';
      });

      if(this.btnname === 'dialogBtn') startTime.addEventListener('input', () => {
        if(this.timeArticles.includes(new Date(startTime.value).valueOf().toString())){
          spanTime.className = 'error';
          spanTime.textContent = 'This time is reserved!';
        }else{
          spanTime.classList.remove('error');
          spanTime.textContent = '';
        };
        startTime.addEventListener('blur', () => {
          if(spanTime.classList.contains('error')) spanTime.classList.remove('error');
          spanTime.textContent = '';
        });
      });

      if(this.btnname === 'revise') startTime.addEventListener('input', () => {
        if(reviseTime !== new Date(startTime.value).valueOf().toString() && this.timeArticles.includes(new Date(startTime.value).valueOf().toString())){
          spanTime.className = 'error';
          spanTime.textContent = 'This time is reserved!';
        }else{
          spanTime.classList.remove('error');
          spanTime.textContent = '';
        };
        startTime.addEventListener('blur', () => {
          if(spanTime.classList.contains('error')) spanTime.classList.remove('error');
          spanTime.textContent = '';
        });
      });

      confirmBtn.addEventListener('click', (e) => {
        if((this.btnname === 'dialogBtn' && this.timeArticles.includes(new Date(startTime.value).valueOf().toString())) || (this.btnname === 'revise' && reviseTime !== new Date(startTime.value).valueOf().toString() && this.timeArticles.includes(new Date(startTime.value).valueOf().toString()))){
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
          if(this.btnname === 'revise'){
            const inputString = [startAddTime, this.array[1], priority, summaryNote.value, detailNote];
            new articlesData(nameProject, this.array, inputString).changeArticleData;
          }else if(this.btnname === 'dialogBtn'){
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
    const nameProject = this.btnname === 'dialogBtn' && this.nameProj === '' ? document.createElement('select') : document.createElement('input');
    const startTimeLabel = document.createElement('label');
    const startTime = document.createElement('input');
    const priorityLabel = document.createElement('label');
    const priority = document.createElement('select');

    divElem.id = 'addnote';
    noteForm.className = 'noteform';
    legendForm.textContent = this.btnname.includes('proj') ? 'create a topic' : 'create an entry';
    nameProject.id = 'nameProject';
    nameProject.name = 'topic name';
    nameProjectLabel.setAttribute('for', 'nameProject');
    nameProjectLabel.textContent = 'Topic Name: ';
    startTime.id = 'startTime';
    startTime.type = this.btnname.includes('proj') ? 'date' : 'datetime-local';
    startTime.name = 'startTime';
    if(this.btnname === 'reviseproj' && new reviseDate(+this.array[0]).fullDate !== new reviseDate(0).fullDate){
      startTime.value = new reviseDate(+this.array[0]).fullDate;
      legendForm.textContent = 'adjust the topic';
    }else if(this.btnname === 'revise'){
      startTime.value = this.array[0] !== 'indefinit' ? new reviseDate(+this.array[0]).sortFullDate : '';
      legendForm.textContent = 'correct the entry';
    }else if(this.btnname === 'createproject'){
      startTime.value = '';
      legendForm.textContent = 'create a topic';
    }else if(this.btnname === 'dialogBtn'){
      startTime.value = new reviseDate(new Date()).sortFullDate;
      legendForm.textContent = 'create an entry';
    };
    startTimeLabel.setAttribute('for', 'startTime');
    startTimeLabel.textContent = this.btnname.includes('proj') ? 'Deadline (skip the field if not): ' : 'Start Time: ';
    priority.name = 'priority';
    priority.id = 'priority';
    priorityLabel.setAttribute('for', 'priority');

    mainElem.appendChild(divElem);
    divElem.appendChild(dialog);
    dialog.appendChild(noteForm);
    noteForm.appendChild(fieldset);
    fieldset.appendChild(legendForm);
    fieldset.appendChild(nameProjectLabel);
    if(this.btnname === 'reviseproj'){
      nameProject.setAttribute('disabled', '');
      nameProject.value = this.nameProj;
      nameProjectLabel.appendChild(nameProject);
    }else if(this.btnname === 'createproject'){
      nameProject.setAttribute('maxlength', '15');
      nameProject.required = 'required';
      nameProjectLabel.textContent = 'Topic Name (required): ';
      const spanName = document.createElement('span');
      spanName.id = 'spanName';
      spanName.textContent = '';
      fieldset.appendChild(nameProject)
      fieldset.appendChild(spanName);
    }else if(this.btnname === 'dialogBtn' && this.nameProj === ''){
      Object.keys(JSON.parse(localStorage.getItem('todoList'))).forEach(key => {
        const nameProjectOption = document.createElement('option');
        nameProjectOption.value = key;
        nameProjectOption.textContent = key;
        nameProjectLabel.appendChild(nameProject);
        nameProject.appendChild(nameProjectOption);
      });
    }else if(this.btnname === 'revise' || (this.btnname === 'dialogBtn' && this.nameProj)){
      nameProject.value = this.nameProj;
      nameProject.setAttribute('disabled', '');
      nameProjectLabel.appendChild(nameProject);
    };

    fieldset.appendChild(startTimeLabel);
    fieldset.appendChild(startTime);
    if(!this.btnname.includes('proj')){
      const spanTime = document.createElement('span');
      spanTime.textContent = '';
      fieldset.appendChild(spanTime);

      const summaryNoteLabel = document.createElement('label');
      const summaryNote = document.createElement('input');
      const spanNote = document.createElement('span');
      const normalOption = document.createElement('option');
      const highOption = document.createElement('option');
      const lowOption = document.createElement('option');

      priorityLabel.textContent = 'Job priority: ';
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
      summaryNoteLabel.textContent = 'General work description (required): ';
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

    if(this.btnname.includes('proj')){
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
    detailNote.rows = this.btnname.includes('proj') ? '3' : '5';
    detailNote.cols = '30';
    if(this.array && this.array[4] && !this.btnname.includes('proj')) detailNote.value = this.array[4];
    if(this.array && this.array[2] && this.btnname.includes('proj')) detailNote.value = this.array[2];
    detailNoteLabel.setAttribute('for', 'detailNote');
    detailNoteLabel.textContent = this.btnname.includes('proj') ? 'Topic description: ' : 'Details: ';
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