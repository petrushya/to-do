import DataCheck from './storageCheck.js';
import DateFormat from './dateFormat.js';
import DialogForm from './dialogForm.js';
import ProjectsHandl from './projectsHandl.js';

class DisplayTodo extends DataCheck{
  id = '';
  dayTime;
  constructor(id, dayTime) {
    super();
    this.id = id;
    this.dayTime = dayTime || false;
  }

  projectsDaily() {
    const title = document.querySelector('h1');
    const btnLeft = document.querySelector('#btnLeftChList');
    const btnRight = document.querySelector('#btnRightChList');

    const todayDay = new DateFormat(Date.now()).dayString();
    const datesExist = Object.keys(this.taskByDaily()).sort();
// header
    this.#pageHeader();

// Title
    title.textContent = 'DAILY TO-DO';

// change of day
    let indexDayExist = datesExist.indexOf(todayDay);
    btnRight.classList.toggle('invisible', !(datesExist[indexDayExist + 1]));
    btnLeft.classList.toggle('invisible', !(datesExist[indexDayExist - 1]));
    printPage(datesExist[indexDayExist]);

    btnRight.onclick = () => {
      ++indexDayExist;
      btnLeft.classList.toggle('invisible', indexDayExist === 0);
      btnRight.classList.
        toggle('invisible', indexDayExist === datesExist.length -1);
      printPage(datesExist[indexDayExist]);
      btnRight.blur();
    };

    btnLeft.onclick = () => {
      --indexDayExist;
      btnLeft.classList.toggle('invisible', indexDayExist === 0);
      btnRight.classList.
        toggle('invisible', indexDayExist === datesExist.length -1);
      printPage(datesExist[indexDayExist]);
      btnLeft.blur();
    };

    function printPage(day) {
      const section = document.querySelector('section');
      const timeDay = document.querySelector('#timeChList');
      const tasksDaily = new DataCheck().taskByDaily();
      Object.keys(tasksDaily).forEach(key => {
        if(day === key) {
          timeDay.textContent = day === todayDay ? 'Today' :
          new Date(day).getDate() - new Date().getDate() === 1 ? 'Tomorrow' :
          new Date(day).getDate() - new Date().getDate() === -1 ? 'Yesterday' :
          new DateFormat(day).calendarDate();
          section.textContent = '';
//  notice
          new DataCheck().storageContent()[0].topicIds.forEach(mark => {
            const content = new DataCheck().storageContent();
            let endDate = content[mark].date;
            let pas = content[mark].pas;
            if(typeof(pas) === 'number' &&
            new Date(endDate).getDate() - new Date().getDate() < pas + 1) {
              const divWarn = document.createElement('div');
              const note = document.createElement('p');
              const button = document.createElement('button');

              divWarn.className = 'rowDiv head warn';
              button.id = 'confirmWarn';
              button.type = 'button';
              button.textContent = 'ACCEPT';
              note.innerHTML = pas === 3 ?
               'End of <b>' + content[mark].name.toUpperCase() + '</b> on ' +
               new DateFormat(endDate).calendarDate() + '!' :
               content[mark].name.toUpperCase() + ' ends tomorrow!';
              button.onclick = () => {
                content[mark].pas = pas === 3 ? 1 : 'Never';
                localStorage.setItem('dataTodo', JSON.stringify(content));
                divWarn.remove();
              };

              section.appendChild(divWarn);
              divWarn.appendChild(note);
              divWarn.appendChild(button);
            };
          });

//  no tasks in the project
          if(key === todayDay && !tasksDaily[todayDay].length) {
            const divEmptyTask = document.createElement('div');
            const message = document.createElement('h2');

            divEmptyTask.className = 'startProject';
            message.innerText = 'There are no planned tasks for today,\n'
            + new DateFormat(todayDay).calendarDate() + '.';
            divEmptyTask.appendChild(message);
            section.appendChild(divEmptyTask);
            return;
          };

//  day tasks
          tasksDaily[day].forEach(item => {
            section.appendChild(new DisplayTodo('', 'show').#taskBlock(item));
          });
        };
      });
    };
  }

  tasksProject() {
    const content = this.storageContent();
    const mainTitle = document.querySelector('h1');
    const section = document.querySelector('section');
    const indexTopic = this.idToIndexTopicObj()[this.id];

// header
    this.#pageHeader();
// Title
    mainTitle.textContent = content[indexTopic].name.toUpperCase();

// section
    section.textContent = '';
    if(content[indexTopic].taskIds.length == 0) {
      const divEmptyTopic = document.createElement('div');
      const message = document.createElement('h2');
      const btnTaskAdd = document.createElement('button');

      divEmptyTopic.className = 'startProject';
      btnTaskAdd.id = 'createFirstTask';
      message.innerText = 'There are no tasks for your project yet.' +
        '\nWant to create the first one?';
      btnTaskAdd.textContent = 'ADD TASK';
      btnTaskAdd.onclick = () => {
        new DialogForm('taskAdd', content[indexTopic].id).dialogForm();
      };
      divEmptyTopic.appendChild(message);
      divEmptyTopic.appendChild(btnTaskAdd);
      section.appendChild(divEmptyTopic);
      return;
    };
    const sortArr = [];
    content[indexTopic].taskIds.forEach(mark => sortArr.push(content[mark].id));
    sortArr.sort();
    let indexArr = sortArr.map(item => this.idToIndexTaskObj()[item]);
    let dayArg = false;
    indexArr.forEach(mark => {
      const dayDiv = document.createElement('article');
      section.appendChild(dayDiv);
      if(dayArg !== new DateFormat(content[mark].startTime).calendarDate()) {
        let ifToday = new DateFormat(content[mark].startTime).dayString() ===
          new DateFormat(new Date()).dayString();
        dayArg = new DateFormat(content[mark].startTime).calendarDate();
        const dayHead = document.createElement('h3');
        dayHead.className = 'dayHead';
        dayHead.textContent = ifToday ? 'Today, ' + dayArg : dayArg;
        dayDiv.appendChild(dayHead);
      };
      dayDiv.appendChild(this.#taskBlock(mark));
    });
  }

  topicsTodo(){
    const content = this.storageContent();
    const mainTitle = document.querySelector('h1');
    const section = document.querySelector('section');
// header
    this.#pageHeader();
// Title
    mainTitle.textContent = 'PROJECTS LIST';

// section
    section.textContent = '';
    if(content[0].topicIds.length === 0) {
      this.startPage();
      return;
    };
    const sortNameProject = [];
    content[0].topicIds.forEach(mark => sortNameProject.push(content[mark].id));
    sortNameProject.sort();
    sortNameProject.forEach(mark => {
      let indexTopic = this.idToIndexTopicObj()[mark];
      const divArt = document.createElement('article');
      const divHead = document.createElement('div');
      const divInfo = document.createElement('div');
      const nameTopic = document.createElement('h3');
      const endDateTopic = document.createElement('time');
      const pasTopic = document.createElement('p');
      const infoTopic = document.createElement('p');
      const spanDate = document.createElement('span');
      const spanPas = document.createElement('span');
      const spanInfo = document.createElement('span');
      const btnDeleteTopic = document.createElement('button');
      const btnLookTasks = document.createElement('button');
      const btnVaryTopic = document.createElement('button');

      divHead.className = 'rowDiv head';
      divInfo.className = 'rowDiv bodyLine';
      spanDate.className = 'spanBold';
      spanPas.className = 'spanBold';
      spanInfo.className = 'spanBold';

      btnDeleteTopic.textContent = 'DELETE';
      btnLookTasks.textContent = 'TO-DO LIST';
      btnVaryTopic.textContent = 'REVISE';
      btnDeleteTopic.type = 'button';
      btnLookTasks.type = 'button';
      btnVaryTopic.type = 'button';
      btnDeleteTopic.id = 'remove' + mark;
      btnLookTasks.id = 'lookTask' + mark;
      btnVaryTopic.id = 'vary' + mark;
      nameTopic.textContent = content[indexTopic].name.toUpperCase();
      endDateTopic.textContent = content[indexTopic].date;
      pasTopic.textContent = content[indexTopic].pas === 3 ? '3 days ahead' :
      content[indexTopic].pas === 1 ? 'a day ahead' : 'Never';
      infoTopic.textContent = (content[indexTopic].info !== '' ?
      content[indexTopic].info : 'Non');
      spanDate.textContent = 'DEADLINE: ';
      spanPas.textContent = 'NOTIFY: ';
      spanInfo.textContent = 'INFO: ';

      section.appendChild(divArt);
      divArt.appendChild(divHead);
      divArt.appendChild(divInfo);
      divHead.appendChild(btnLookTasks);
      divHead.appendChild(nameTopic);
      divHead.appendChild(btnVaryTopic);
      divHead.appendChild(btnDeleteTopic);
      divInfo.appendChild(endDateTopic);
      endDateTopic.prepend(spanDate);
      divInfo.appendChild(pasTopic);
      pasTopic.prepend(spanPas);
      divInfo.appendChild(infoTopic);
      infoTopic.prepend(spanInfo);

      btnLookTasks.onclick = () => {
        new DisplayTodo(content[indexTopic].id).tasksProject();
      };
      btnVaryTopic.onclick = () => {
        btnVaryTopic.blur();
        new DialogForm('topicRevise', content[indexTopic].id).dialogForm();
      };
      btnDeleteTopic.onclick = () => {
        new ProjectsHandl(content[indexTopic].id).topicDelete();
      };
    });
  }

  startPage(){
    const startDiv = document.createElement('div');
    const message = document.createElement('h2');
    const btnCreate = document.createElement('button');

// header
    this.#pageHeader();

// section
    const section = document.querySelector('section');
    startDiv.className = 'startTitle';
    message.innerText = 'There are no projects for your to-do list yet.' +
      '\nWant to create one?';
    btnCreate.id = 'createFirstProject';
    btnCreate.textContent = 'NEW PROJECT';
    btnCreate.onclick = () => new DialogForm('topicMake').dialogForm();
    section.textContent = '';
    startDiv.appendChild(message);
    startDiv.appendChild(btnCreate);
    section.appendChild(startDiv);
  }

  #taskBlock(index) {
    const content = this.storageContent();
    const div = !this.dayTime ? document.createElement('div') : false;
    const divHead = document.createElement('div');
    const checkTask = document.createElement('input');
    const pTask = document.createElement('p');
    const goalTask = document.createElement('span');
    const startTask = document.createElement('time');
    const pasTask = document.createElement('p');
    const btnReviseTask = !this.dayTime ?
      document.createElement('button') : false;
    const btnDeleteTask = !this.dayTime ?
      document.createElement('button') : false;
    const btnProjList = this.dayTime ?
      document.createElement('button') : false;
    const divInfo = !this.dayTime ? document.createElement('div') : false;
    const infoTask = !this.dayTime ? document.createElement('p') : false;
    if(infoTask) infoTask.className = 'inform';
    const spanInfo = content[index].info && !this.dayTime ?
      document.createElement('span') : false;

    divHead.className = 'rowDiv head';
    if(!this.dayTime) {
      div.id = 'tp-' + content[index].id;
      divInfo.className = 'rowDiv bodyLine';
    }
    checkTask.type = 'checkBox';
    checkTask.id = 'ch-' + content[index].id;
    if(content[index].completed)
      checkTask.setAttribute('checked', '');
    pTask.className = 'rowDiv decoration';
    pTask.classList.toggle('checkable', content[index].completed);
    goalTask.textContent = content[index].task;
    startTask.className = content[index].completed === false ?
    checkClass(index) : '';
    startTask.setAttribute('datetime',
    new DateFormat(content[index].startTime).dateString());
    startTask.textContent =
      new DateFormat(content[index].startTime).timesOfDay();
    pasTask.innerHTML = content[index].pas === 'Low' ?
      '&#x272d;' : content[index].pas === 'High' ?
      '&#x272d;&#x272d;&#x272d;' : '&#x272d;&#x272d;';
    if(this.dayTime) {
      btnProjList.id = 'showProjList' + content[index].id;
      btnProjList.type = 'button';
      btnProjList.className = 'btnProjList';
      content[0].topicIds.forEach(mark => {
        if(content[mark].taskIds.includes(index)) {
          btnProjList.innerText = content[mark].name + '\nlist';
          btnProjList.onclick = () => {
            new DisplayTodo(content[mark].id).tasksProject();
          };
        };
      });
    }
    if(!this.dayTime) {
      btnReviseTask.textContent = 'REVISE';
      btnReviseTask.name = 'revise';
      btnReviseTask.id = 'tasksProjRev' + content[index].id;
      btnReviseTask.type = 'button';
      btnDeleteTask.textContent = 'DELETE';
      btnDeleteTask.name = 'delete';
      btnDeleteTask.id = 'tasksProjDel' + content[index].id;
      btnDeleteTask.type = 'button';
    };
    checkTask.onchange = () => {
      if(checkTask.hasAttribute('checked')) {
        pTask.classList.remove('checkable');
        checkTask.removeAttribute('checked');
        content[index].completed = false;
        localStorage.setItem('dataTodo', JSON.stringify(content));
        startTask.className = checkClass(index);
      } else {
        pTask.classList.add('checkable');
        checkTask.setAttribute('checked', '');
        content[index].completed = true;
        localStorage.setItem('dataTodo', JSON.stringify(content));
        startTask.className = '';
      };
    };

    pTask.appendChild(goalTask);
    pTask.appendChild(startTask);
    divHead.appendChild(checkTask);
    divHead.appendChild(pTask);
    divHead.appendChild(pasTask);
    if(this.dayTime) divHead.appendChild(btnProjList);
    if(!this.dayTime) {
      btnReviseTask.onclick = () => {
        btnReviseTask.blur();
        new DialogForm('taskRevise', this.id, content[index].id).dialogForm();
      };
      btnDeleteTask.onclick = () => {
        new ProjectsHandl(div.id).taskDelete();
      };
      divHead.appendChild(btnReviseTask);
      divHead.appendChild(btnDeleteTask);
      div.appendChild(divHead);
    };
    if(spanInfo && !this.dayTime) {
      infoTask.innerText = content[index].info;
      spanInfo.className = 'spanBold';
      spanInfo.textContent = 'DETAILS: ';
      infoTask.prepend(spanInfo);
    };
    if(!this.dayTime) {
      divInfo.appendChild(infoTask);
      div.appendChild(divInfo);
      return div;
    } else {
      return divHead;
    };

    function checkClass(index) {
      let nameClass = '';
      let checkTaskArr = new DataCheck().idTasksInWork();
      if(new DateFormat(+content[index].id).dayString() <
        new DateFormat(Date.now()).dayString()) {
          nameClass = 'forgot';
      };
      if(checkTaskArr.length > 0) {
        if(checkTaskArr.includes(content[index].id) &&
        (content[index].id !== checkTaskArr.at(-1))) {
          nameClass = 'during';
        } else if(content[index].id === checkTaskArr.at(-1)) {
          nameClass = 'startWork';
        };
      };
      return nameClass;
    };
  }

  #pageHeader() {
    const btnProjects = document.querySelector('#btnProjects');
    const btnMakeProject = document.querySelector('#btnHeaderMakeProject');
    const btnMakeTask = document.querySelector('#btnHeaderMakeTask');
    const btnDaily = document.querySelector('#btnDaily');
    const mainTitle = document.querySelector('h1');
    const dayBlock = document.querySelector('#changeDateList');

    let hasDisplay = this.storageContent()[0].topicIds.length;

    dayBlock.classList.toggle('displayed', !this.dayTime);
    btnProjects.style.display = hasDisplay ? '' : 'none';
    mainTitle.style.display = hasDisplay ? '' : 'none';
    btnMakeTask.style.display = hasDisplay ? '' : 'none';
    btnDaily.style.display = hasDisplay && Object.keys(new DataCheck().
      idToIndexTaskObj()).length > 0 ? '' : 'none';
    btnProjects.onclick = () => {
      new DisplayTodo().topicsTodo();
      btnProjects.blur();
    };
    btnMakeProject.onclick = () => {
      btnMakeProject.blur();
      new DialogForm('topicMake').dialogForm();
    };
    btnMakeTask.onclick = () => {
      btnMakeTask.blur();
      new DialogForm('taskMake').dialogForm();
    };
    btnDaily.onclick = () => {
      new DisplayTodo('', 'show').projectsDaily();
      btnDaily.blur();
    };
  }
}

export default DisplayTodo;