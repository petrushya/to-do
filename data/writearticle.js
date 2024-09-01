export class articlesData {
  constructor(projectName, dataArticle, newDataArticle){
    this.projectName = projectName.trim();
    this.dataArticle = dataArticle;
    this.newDataArticle = newDataArticle;
  }

#articleArray(){
  const dataArray = this.dataArticle;
  let articleArray = [];
  if(this.dataArticle.length > 3){
    const appArray = [
      dataArray[0] ? dataArray[0].toString().trim() : new Date().valueOf().toString(),
      dataArray[1] === 'checked' ? dataArray[1] : 'nonchecked',
      dataArray[2] === 'low' || dataArray[2] === 'high' ? dataArray[2] : 'normal',
      dataArray[3].trim(),
      dataArray[4] ? dataArray[4].trim() : ''
    ];
    articleArray = appArray.filter(item => item.length > 0);
  }else{
    articleArray = [
      dataArray[0].toString().trim() !== '' ? dataArray[0].toString() : '',
      dataArray[1] === 'high' || dataArray[1] === 'normal' ? dataArray[1] : 'low',
      dataArray[2] ? dataArray[2].trim() : ''
    ];
  };
  return articleArray;
}

  get addArticleData(){
    const storageObject = !localStorage.getItem('todoList') ? Object() : JSON.parse(localStorage.getItem('todoList'));
    const storProjObject = !localStorage.getItem('projList') ? Object() : JSON.parse(localStorage.getItem('projList'));
    if(!storProjObject[this.projectName]){
      storageObject[this.projectName] = [];
      // to record examples
      storProjObject[this.projectName] = this.dataArticle.length > 3 ? ['','low',''] : this.#articleArray();
      const sortkey = [];
      const sortObj = Object();
      Object.keys(storProjObject).forEach(key => {
        if(!sortkey.includes(key)) sortkey.push(key);
      });
      sortkey.sort().forEach(item => {
        sortObj[item] = storProjObject[item];
      });
      localStorage.setItem('projList', JSON.stringify(sortObj));
    };
    if(this.dataArticle.length > 3){
      storageObject[this.projectName].push(this.#articleArray());
      const sortArticle = storageObject[this.projectName].map(part => part.join('``",,,"``'));
      sortArticle.sort();
      storageObject[this.projectName] = sortArticle.map(part => part.split('``",,,"``'));
    };
    const sortObjArt = Object();
    Object.keys(JSON.parse(localStorage.getItem('projList'))).forEach(key => {
      sortObjArt[key] = storageObject[key];
    });
    localStorage.setItem('todoList', JSON.stringify(sortObjArt));
  }

  get changeArticleData(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    const newData = this.newDataArticle.filter(item => item.length > 0);
    storageObject[this.projectName].forEach((item, index) => {
      if(this.dataArticle[0] === item[0]){
        storageObject[this.projectName].splice(index, 1, newData);
        if(newData !== item[0]){
          const stringData = storageObject[this.projectName].map(part => part.join('``",,,"``'));
          stringData.sort();
          storageObject[this.projectName] = stringData.map(part => part.split('``",,,"``'));
        };
      };
    });
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }

  get changeProjData(){
    const storProjObject = JSON.parse(localStorage.getItem('projList'));
    storProjObject[this.projectName] = this.dataArticle;
    localStorage.setItem('projList', JSON.stringify(storProjObject));
  }

  get deletArticle(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    const stringData = storageObject[this.projectName].map(part => part.join('``",,,"``'));
    stringData.splice(stringData.indexOf(this.dataArticle.join('``",,,"``')), 1);
    storageObject[this.projectName] = stringData.map(part => part.split('``",,,"``'));
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }
}