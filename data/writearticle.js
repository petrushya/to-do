export class articlesData {
  constructor(projectName, dataArticle, newDataArticle){
    this.projectName = projectName ? projectName.trim() : 'routine';
    this.dataArticle = dataArticle;
    this.newDataArticle = newDataArticle;
  }

#articleArray(){
  const dataArray = this.dataArticle;
  let articleArray = [];
  if(this.dataArticle.length > 3){
    const appArray = [
      dataArray[0].toString() ? dataArray[0].toString() : new Date().valueOf().toString(),
      dataArray[1] === 'checked' ? dataArray[1] : 'nonchecked',
      dataArray[2] === 'low' || dataArray[2] === 'high' ? dataArray[2] : 'normal',
      dataArray[3].trim(),
      dataArray[4] ? dataArray[4].trim() : ''
    ];
    articleArray = appArray.filter(item => item.length > 0);
  }else{
//    console.log(dataArray[0]);
    articleArray = [
      dataArray[0].toString() !== '' ? dataArray[0].toString() : '',
      (dataArray[1] === 'high' || dataArray[1] === 'normal') && dataArray[0].toString().trim() !== '' ? dataArray[1] : 'low',
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
      storageObject[this.projectName] = sortArticle.map(item => item.split('``",,,"``'));
    };
    const sortObjArt = Object();
    Object.keys(JSON.parse(localStorage.getItem('projList'))).forEach(key => {
      sortObjArt[key] = storageObject[key];
    });
    localStorage.setItem('todoList', JSON.stringify(sortObjArt));
  }

  get changeArticleData(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    const stringData = storageObject[this.projectName].map(part => part.join('``",,,"``'));
    const sortDate = stringData;
    const newData = this.newDataArticle.filter(item => item.length > 0).join('``",,,"``');
    if(stringData[0].split('``",,,"``')[0] === this.newDataArticle[0].toString().trim()){
      sortDate[stringData.indexOf(this.dataArticle.join('``",,,"``'))] = newData;
      storageObject[this.projectName] = sortDate.map(item => item.split('``",,,"``'));
      localStorage.setItem('todoList', JSON.stringify(storageObject));
    }else{
      stringData.splice(stringData.indexOf(this.dataArticle.join('``",,,"``')), 1);
      storageObject[this.projectName] = stringData.map(item => item.split('``",,,"``'));
      localStorage.setItem('todoList', JSON.stringify(storageObject));
      new articlesData(this.projectName, this.newDataArticle).addArticleData;
    };
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
    storageObject[this.projectName] = stringData.map(item => item.split('``",,,"``'));
    localStorage.setItem('todoList', JSON.stringify(storageObject));
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
}