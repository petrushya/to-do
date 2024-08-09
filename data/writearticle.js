export class articlesData {
  constructor(projectName, dataArticle, newDataArticle){
    this.projectName = projectName.trim() ? projectName.trim() : 'routine';
    this.dataArticle = dataArticle;
    this.newDataArticle = newDataArticle ? newDataArticle : false;
  }

#articleArray(){
  const dataArray = this.dataArticle.split('",,,"');
  let articleArray = [];
  if(dataArray[3].trim()){
    const appArray = [
      dataArray[0] ? dataArray[0] : new Date().valueOf().toString(),
      dataArray[1] === 'checked' ? dataArray[1] : 'nonchecked',
      dataArray[2] === 'low' || dataArray[2] === 'high' ? dataArray[2] : 'normal',
      dataArray[3].trim(),
      dataArray[4] ? dataArray[4] : ''
    ];
    articleArray = appArray.filter(item => item.length > 0);
  };
  return articleArray;
}

  get addArticleData(){
    const storageObject = !localStorage.getItem('todoList') ? Object() : JSON.parse(localStorage.getItem('todoList'));
    if(!storageObject[this.projectName]) storageObject[this.projectName] = [];
    if(this.#articleArray().length > 0){
      storageObject[this.projectName].push(this.#articleArray().join('",,,"'));
      storageObject[this.projectName].sort();
    };
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }

  get changeArticleData(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    const stringData = storageObject[this.projectName];
    stringData[stringData.indexOf(this.dataArticle)] = this.newDataArticle;
    if(+stringData[0].split('",,,"')[0] !== +this.newDataArticle.split('",,,"')[0]) stringData.sort();
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }

  get deletArticle(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    storageObject[this.projectName].splice(storageObject[this.projectName].indexOf(this.dataArticle), 1);
    if(storageObject[this.projectName].length === 0) delete storageObject[this.projectName];
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }
}