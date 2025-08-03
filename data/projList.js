import DateFormat from "./dateFormat.js";

const contentArr = [
  {
    id: "topicList",
    topicIds: [1, 2],
  },
  {
    id: "routine",
    name: "routine",
    date: "Not specified",
    pas: "Never",
    info: "daily affairs",
    taskIds: [3, 4, 5, 6],
  },
  {
    id: "my-lesson",
    name: "my lesson",
    date: new DateFormat(Date.now() + 3 * 24 * 60 * 60 * 1000).dayString(),
    pas: 3,
    info: "",
    taskIds: [7, 8],
  },
  {
    id: `${Date.parse(new DateFormat(Date.now() - 23 * 60 * 60 * 1000).dateString())}`,
    startTime: new DateFormat(Date.now() - 23 * 60 * 60 * 1000).dateString(),
    task: "hard job",
    pas: "Low",
    info: "unknoun job",
    completed: false,
  },
  {
    id: `${Date.parse(new DateFormat(Date.now() + 60 * 60 * 1000).dateString())}`,
    startTime: new DateFormat(Date.now() + 60 * 60 * 1000).dateString(),
    task: "daily job",
    pas: "Normal",
    info: "",
    completed: false,
  },
  {
    id: `${Date.parse(new DateFormat(Date.now() + 48 * 60 * 60 * 1000).dateString())}`,
    startTime: new DateFormat(Date.now() + 48 * 60 * 60 * 1000).dateString(),
    task: "future job",
    pas: "Normal",
    info: "beutiful surprise",
    completed: false,
  },
  {
    id: `${Date.parse(new DateFormat(Date.now()).dateString())}`,
    startTime: new DateFormat(Date.now()).dateString(),
    task: "surprise for someone",
    pas: "High",
    info: "happy day for one puplec",
    completed: false,
  },
  {
    id: `${Date.parse(new DateFormat(Date.now() + 24 * 60 * 60 * 1000).dateString())}`,
    startTime: new DateFormat(Date.now() + 24 * 60 * 60 * 1000).dateString(),
    task: "learn finish",
    pas: "Normal",
    info: "be happy",
    completed: false,
  },
  {
    id: `${Date.parse(new DateFormat(Date.now() - 30 * 60 * 1000).dateString())}`,
    startTime: new DateFormat(Date.now() - 30 * 60 * 1000).dateString(),
    task: "learn start",
    pas: "Low",
    info: "create a general concept",
    completed: false,
  },
];

export default contentArr;
