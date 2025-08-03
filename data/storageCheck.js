import DateFormat from "./dateFormat.js";

class DataCheck {
  constructor() {
    this.storageExist = localStorage.getItem("dataTodo") ? true : false;
  }

  storageContent() {
    const content = this.storageExist
      ? JSON.parse(localStorage.getItem("dataTodo"))
      : [
          {
            id: "topicList",
            topicIds: [],
          },
        ];
    return content;
  }

  idToIndexTopicObj() {
    let obj = {};
    if (this.storageContent()[0].topicIds.length) {
      this.storageContent()[0].topicIds.forEach((mark) => {
        obj[this.storageContent()[mark].id] = mark;
      });
    }
    return obj;
  }

  idToIndexTaskObj() {
    let obj = {};
    if (this.storageContent()[0].topicIds.length) {
      this.storageContent()[0].topicIds.forEach((item) => {
        this.storageContent()[item].taskIds.forEach((mark) => {
          obj[this.storageContent()[mark].id] = mark;
        });
      });
    }
    return obj;
  }

  idTasksInWork() {
    let arr = [];
    if (this.storageContent()[0].topicIds.length) {
      this.storageContent().forEach((item, index) => {
        if (index > this.storageContent()[0].topicIds.at(-1)) {
          if (
            +item.id <= Date.now() &&
            new DateFormat(+item.id).dayString() >
              new DateFormat(Date.now() - 24 * 60 * 60 * 1000).dayString()
          )
            arr.push(item.id);
        }
      });
    }
    return arr.sort();
  }

  taskByDaily() {
    const today = new DateFormat(Date.now()).dayString();
    const taskDaily = {};
    const obj = {};
    if (this.storageContent()[0].topicIds.length) {
      this.storageContent().forEach((item, index) => {
        if (index > this.storageContent()[0].topicIds.at(-1)) {
          let markDay = new DateFormat(new Date(+item.id)).dayString();
          if (!taskDaily[markDay]) {
            taskDaily[markDay] = [item.id];
          } else {
            taskDaily[markDay].push(item.id);
          }
        }
      });
    }
    if (!taskDaily[today]) taskDaily[today] = [];
    Object.keys(taskDaily).forEach((key) => {
      obj[key] = taskDaily[key].sort().map((id) => this.idToIndexTaskObj()[id]);
    });
    return obj;
  }
}

export default DataCheck;
