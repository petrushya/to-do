import DataCheck from "./storageCheck.js";
import DisplayTodo from "./displayTodo.js";

class ProjectsHandl extends DataCheck {
  entry;
  date = "";
  pas = "";
  info = "";
  task = "";
  constructor(entry, date, pas, info, task) {
    super();
    this.entry = entry;
    this.date = date;
    this.pas = pas;
    this.info = info;
    this.task = task;
  }

  taskDelete() {
    const contentArr = this.storageContent();
    const idTask = this.entry.slice(3);
    const indexTask = this.idToIndexTaskObj()[idTask];
    let indexChangeTopic;
    contentArr[0].topicIds.forEach((mark) => {
      if (contentArr[mark].taskIds.includes(indexTask)) {
        indexChangeTopic = mark;
        contentArr[mark].taskIds.pop();
        contentArr.splice(indexTask, 1);
        return;
      }
    });
    contentArr[0].topicIds.forEach((item) => {
      if (item > indexChangeTopic) {
        let taskIdsArr = contentArr[item].taskIds.map((mark) => mark - 1);
        contentArr[item].taskIds = taskIdsArr;
      }
    });

    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo(contentArr[indexChangeTopic].id).tasksProject();
  }

  taskRevise() {
    const contentArr = this.storageContent();
    const idTask = `${Date.parse(this.date)}`;
    const indexTask = this.idToIndexTaskObj()[idTask];

    contentArr.splice(indexTask, 1, this.#taskObj());

    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo(this.entry).tasksProject();
  }

  taskCreate() {
    const contentArr = this.storageContent();
    let indexChangeTopic = this.idToIndexTopicObj()[this.entry];
    let nextIndexTask = false;

    if (!contentArr[0].topicIds.length) {
      nextIndexTask = 2;
    } else if (contentArr[indexChangeTopic].taskIds.length) {
      nextIndexTask = contentArr[indexChangeTopic].taskIds.at(-1) + 1;
    } else {
      contentArr[0].topicIds.forEach((mark) => {
        if (mark < indexChangeTopic) {
          if (contentArr[mark].taskIds.length) {
            nextIndexTask = contentArr[mark].taskIds.at(-1) + 1;
          }
        } else if (!nextIndexTask) {
          nextIndexTask = contentArr[0].topicIds.length + 1;
          return;
        }
      });
    }
    if (contentArr[0].topicIds.length) {
      contentArr[0].topicIds.forEach((item) => {
        if (item > indexChangeTopic) {
          let taskIdsArr = contentArr[item].taskIds.map((mark) => mark + 1);
          contentArr[item].taskIds = taskIdsArr;
        }
      });
    }
    contentArr[indexChangeTopic].taskIds.push(nextIndexTask);
    contentArr.splice(nextIndexTask, 0, this.#taskObj());

    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo(this.entry).tasksProject();
  }

  topicDelete() {
    const contentArr = this.storageContent();
    const indexTopic = this.idToIndexTopicObj()[this.entry];
    let indexFirstTaskTopic = contentArr[indexTopic].taskIds[0] || false;
    let lengthTasks = contentArr[indexTopic].taskIds.length;

    contentArr[0].topicIds.forEach((item) => {
      let taskIdsArr = [];
      if (item < indexTopic && contentArr[item].taskIds.length) {
        taskIdsArr = contentArr[item].taskIds.map((mark) => mark - 1);
        contentArr[item].taskIds = taskIdsArr;
      }
      if (item > indexTopic && contentArr[item].taskIds.length) {
        taskIdsArr = contentArr[item].taskIds.map((mark) => {
          return mark - (lengthTasks + 1);
        });
        contentArr[item].taskIds = taskIdsArr;
      }
    });
    if (indexFirstTaskTopic)
      contentArr.splice(indexFirstTaskTopic, lengthTasks);
    contentArr[0].topicIds.pop();
    contentArr.splice(indexTopic, 1);

    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo().topicsTodo();
  }

  topicCreate() {
    const contentArr = this.storageContent();
    let indexTopic;

    if (contentArr[0].topicIds.length) {
      indexTopic = contentArr[0].topicIds.length + 1;
      contentArr[0].topicIds.forEach((item) => {
        if (contentArr[item].taskIds.length) {
          let taskIdsArr = contentArr[item].taskIds.map((mark) => mark + 1);
          contentArr[item].taskIds = taskIdsArr;
        }
      });
    } else {
      indexTopic = 1;
    }

    contentArr[0].topicIds.push(indexTopic);
    contentArr.splice(indexTopic, 0, this.#topicObj());

    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo().topicsTodo();
  }

  topicRevise() {
    const contentArr = this.storageContent();
    const indexTopic = this.idToIndexTopicObj()[this.entry];
    const contentTopic = contentArr[indexTopic];
    contentTopic.date = this.date;
    contentTopic.pas = this.pas;
    contentTopic.info = this.info;
    localStorage.setItem("dataTodo", JSON.stringify(contentArr));
    new DisplayTodo().topicsTodo();
  }

  #taskObj() {
    const obj = {};
    obj.id = `${Date.parse(this.date)}`;
    obj.startTime = this.date;
    obj.task = this.task;
    obj.pas = this.pas;
    obj.info = this.info;
    obj.completed = false;
    return obj;
  }

  #topicObj() {
    const obj = {};
    obj.id = this.entry.includes(" ")
      ? this.entry.trim().replace(" ", "-")
      : this.entry.trim();
    obj.name = this.entry;
    obj.date = this.date;
    obj.pas = this.pas;
    obj.info = this.info;
    obj.taskIds = [];
    return obj;
  }
}

export default ProjectsHandl;
