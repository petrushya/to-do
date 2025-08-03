import DataCheck from "./storageCheck.js";
import ProjectsHandl from "./projectsHandl.js";

class DialogForm extends DataCheck {
  type;
  idTopic;
  idTask;
  constructor(type, idTopic, idTask) {
    super();
    this.type = type;
    this.idTopic = idTopic || false;
    this.idTask = idTask || false;
  }

  dialogForm() {
    if (document.querySelector("dialog")) {
      document.querySelector("dialog").remove();
    }
    this.#dialogPattern();
    const dialog = document.querySelector("dialog");
    dialog.showModal();

    const name = document.querySelector("#formFieldName");
    const date = document.querySelector("#formFieldDate");
    const pas = document.querySelector("#formFieldPas");
    const task = document.querySelector("#formFieldTask")
      ? document.querySelector("#formFieldTask")
      : false;
    const info = document.querySelector("#formFieldInfo");
    const btnConfirm = document.querySelector("#formBtnConfirm");
    const btnReset = document.querySelector("#formBtnReset");
    const btnCancel = document.querySelector("#formBtnCancel");
    const storage = this.storageContent();

    const topicsIndexes = storage[0].topicIds;
    let checkValueTopic = false;
    let checkValueTask = false;

    if (this.type === "topicMake") {
      const topicsIdExist = [];
      if (topicsIndexes.length) {
        topicsIndexes.forEach((value) => {
          topicsIdExist.push(storage[value].id);
        });
      }

      pas.setAttribute("disabled", "");
      date.addEventListener("change", () => {
        if (date) pas.removeAttribute("disabled");
      });

      name.addEventListener("input", (e) => {
        name.setCustomValidity("");
        let checkValue = e.target.value.trim().includes(" ")
          ? e.target.value.trim().replace(" ", "-")
          : e.target.value.trim();
        checkValueTopic = topicsIdExist.includes(checkValue);
        name.style.backgroundColor = checkValueTopic ? "mark" : "";
        if (name.classList.contains("error")) name.classList.remove("error");
      });

      name.addEventListener("blur", () => {
        name.setCustomValidity("");
        if (name.classList.contains("error")) name.classList.remove("error");
      });
    }

    if (this.type === "topicRevise") date.focus();

    if (this.type.startsWith("task")) {
      const taskDateExist = [];
      this.type !== "taskMake" ? date.focus() : name.focus();
      const dateDefault = date.defaultValue ? Date.parse(date.defaultValue) : 0;
      if (topicsIndexes.length)
        topicsIndexes.forEach((topic) => {
          storage[topic].taskIds.forEach((task) => {
            if (+storage[task].id !== dateDefault)
              taskDateExist.push(+storage[task].id);
          });
        });

      date.addEventListener("input", () => {
        date.setCustomValidity("");
        checkValueTask = taskDateExist.includes(Date.parse(date.value));
        date.style.backgroundColor = checkValueTask ? "mark" : "";
        if (date.classList.contains("error")) date.classList.remove("error");
      });
      date.addEventListener("blur", () => {
        date.setCustomValidity("");
        if (date.classList.contains("error")) date.classList.remove("error");
      });

      task.addEventListener("input", () => {
        task.setCustomValidity("");
        if (task.classList.contains("error")) task.classList.remove("error");
      });
      task.addEventListener("blur", () => {
        task.setCustomValidity("");
        if (task.classList.contains("error")) task.classList.remove("error");
      });
    }

    btnConfirm.addEventListener("click", (e) => {
      if (checkValueTopic || !name.validity.valid) {
        name.classList.add("error");
        name.focus();
        !name.validity.valid
          ? name.setCustomValidity("Topic name required!")
          : name.setCustomValidity("Name has already been used!");
      } else if (checkValueTask || !date.validity.valid) {
        date.classList.add("error");
        date.focus();
        checkValueTask
          ? date.setCustomValidity("The mark is already reserved!")
          : date.setCustomValidity("The field must be filled in completely!");
      } else if (task && !task.validity.valid) {
        task.classList.add("error");
        task.focus();
        task.setCustomValidity("This field is required!");
      } else {
        e.preventDefault();

        if (this.type.startsWith("topic")) {
          let argName = this.type === "topicMake" ? name.value : name.name;
          let argDate = date.value ? date.value : "Not specified";
          const projectData = [argName, argDate, pas.value, info.value];
          this.type === "topicMake"
            ? new ProjectsHandl(...projectData).topicCreate()
            : new ProjectsHandl(...projectData).topicRevise();
        } else {
          let argName = this.type === "taskMake" ? name.value : name.name;
          const taskData = [
            argName,
            date.value,
            pas.value,
            info.value,
            task.value,
          ];
          this.type === "taskRevise"
            ? new ProjectsHandl(...taskData).taskRevise()
            : new ProjectsHandl(...taskData).taskCreate();
        }
        dialog.close();
        dialog.remove();
      }
      btnConfirm.blur();
    });

    btnReset.onclick = () => {
      if (this.type === "topicMake") {
        document.querySelector("form").reset();
        name.focus();
        btnReset.blur();
      } else {
        date.value = "";
        info.value = "";
        if (task) task.value = "";
        date.focus();
        btnReset.blur();
      }
    };

    btnCancel.onclick = () => {
      dialog.close();
      dialog.remove();
    };
  }

  #dialogPattern() {
    const storage = this.storageContent();
    const section = document.querySelector("section");
    const dialog = document.createElement("dialog");
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const form = document.createElement("form");

    const labelName = document.createElement("label");
    const fieldName =
      this.type === "taskMake"
        ? document.createElement("select")
        : document.createElement("input");
    const labelDate = document.createElement("label");
    const fieldDate = document.createElement("input");
    const labelPas = document.createElement("label");
    const fieldPas = document.createElement("select");
    const pasLowOption = document.createElement("option");
    const pasNormalOption = document.createElement("option");
    const pasHighOption = document.createElement("option");
    const labelInfo = document.createElement("label");
    const fieldInfo = document.createElement("textarea");
    const btnsDiv = document.createElement("div");
    const btnConfirm = document.createElement("button");
    const btnReset = document.createElement("button");
    const btnCancel = document.createElement("button");
    const labelTask = document.createElement("label");
    const fieldTask = document.createElement("input");

    fieldName.id = "formFieldName";
    fieldDate.id = "formFieldDate";
    fieldPas.id = "formFieldPas";
    fieldInfo.id = "formFieldInfo";
    fieldTask.id = "formFieldTask";
    btnConfirm.id = "formBtnConfirm";
    btnReset.id = "formBtnReset";
    btnCancel.id = "formBtnCancel";
    labelTask.textContent = "Task goal (required):";
    fieldTask.setAttribute("required", "");
    labelTask.appendChild(fieldTask);

    btnReset.type = "button";
    btnCancel.type = "button";
    if (!(this.type === "topicMake" || this.type === "taskMake")) {
      fieldName.setAttribute("disabled", "");
    }

    btnConfirm.textContent = "confirm";
    btnReset.textContent = "reset";
    btnCancel.textContent = "cancel";
    legend.textContent =
      this.type === "topicMake"
        ? "Create a Project"
        : this.type === "topicRevise"
          ? "Revise a Project"
          : this.type === "taskMake" || this.type === "taskAdd"
            ? "Create a Task"
            : "Revise a Task";
    labelName.textContent =
      this.type === "topicMake"
        ? "Name of the project (required):"
        : "Name of the project:";
    if (this.type === "topicMake") fieldName.setAttribute("required", "");
    if (this.type === "topicMake" || this.type === "topicRevise") {
      if (this.type === "topicRevise") {
        fieldName.textContent =
          storage[this.idToIndexTopicObj()[this.idTopic]].name;
        fieldName.name = this.idTopic;
      }
      labelDate.textContent = "Project completion date:";
      labelPas.textContent = "Completion notice:";
      pasLowOption.value = "Never";
      pasNormalOption.value = 1;
      pasHighOption.value = 3;
      pasLowOption.textContent = pasLowOption.value;
      pasNormalOption.textContent = "a days ahead";
      pasHighOption.textContent = "3 days ahead";
      pasLowOption.setAttribute("selected", "");
      labelInfo.textContent = "Project goal:";
      fieldDate.type = "date";
    } else {
      if (this.type === "taskRevise") {
        fieldName.textContent =
          storage[this.idToIndexTopicObj()[this.idTopic]].name;
        fieldName.name = this.idTopic;
      }
      if (this.type === "taskAdd") {
        fieldName.textContent =
          storage[this.idToIndexTopicObj()[this.idTopic]].name;
        fieldName.name = this.idTopic;
      }
      if (this.type === "taskMake") {
        labelName.style.flexDirection = "row";
        labelName.style.columnGap = "0.5ch";
        storage[0].topicIds.forEach((item, index) => {
          let option = document.createElement("option");
          if (index == 0) option.setAttribute("default", "");
          option.value = storage[item].id;
          option.textContent = storage[item].name;
          fieldName.appendChild(option);
        });
      }
      if (this.type.startsWith("task")) {
        labelDate.textContent = "Task start date (required):";
        fieldDate.setAttribute("required", "");
      }
      labelPas.textContent = "Task priority:";
      pasLowOption.value = "Low";
      pasNormalOption.value = "Normal";
      pasHighOption.value = "Heigh";
      pasLowOption.textContent = pasLowOption.value;
      pasNormalOption.textContent = pasNormalOption.value;
      pasHighOption.textContent = pasHighOption.value;
      pasNormalOption.setAttribute("selected", "");
      labelInfo.textContent = "Task description:";
      fieldDate.type = "datetime-local";
    }

    if (this.idTopic) {
      const indexTopic = this.idToIndexTopicObj()[this.idTopic];
      fieldName.value = storage[indexTopic].name;

      if (this.type === "topicRevise") {
        fieldDate.value = storage[indexTopic].date;
        fieldPas.value =
          storage[indexTopic].pas === 3
            ? "3 days ahead"
            : storage[indexTopic].pas === 1
              ? "a day ahead"
              : "Never";
        fieldInfo.value = storage[indexTopic].info;
      }

      if (this.type === "taskRevise") {
        const indexTask = this.idToIndexTaskObj()[this.idTask];
        fieldTask.value = storage[indexTask].task;
        fieldDate.setAttribute("value", storage[indexTask].startTime);
        fieldPas.value = storage[indexTask].pas;
        fieldInfo.value = storage[indexTask].info;
      }
    }

    section.appendChild(dialog);
    dialog.appendChild(fieldset);
    fieldset.appendChild(legend);
    fieldset.appendChild(form);
    fieldset.appendChild(btnCancel);
    form.appendChild(labelName);
    form.appendChild(labelDate);
    form.appendChild(labelPas);
    if (this.type.startsWith("task")) form.appendChild(labelTask);
    form.appendChild(labelInfo);
    form.appendChild(btnsDiv);
    labelName.appendChild(fieldName);
    labelDate.appendChild(fieldDate);
    labelPas.appendChild(fieldPas);
    labelInfo.appendChild(fieldInfo);
    fieldPas.appendChild(pasLowOption);
    fieldPas.appendChild(pasNormalOption);
    fieldPas.appendChild(pasHighOption);
    btnsDiv.appendChild(btnConfirm);
    btnsDiv.appendChild(btnReset);
  }
}

export default DialogForm;
