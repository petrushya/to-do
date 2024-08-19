export class articlesData {
  constructor(projectName, dataArticle, newDataArticle){
    this.projectName = projectName ? projectName.trim() : 'routine';
    this.dataArticle = dataArticle.trim();
    this.newDataArticle = newDataArticle ? newDataArticle.trim() : '';
  }

#articleArray(){
  const dataArray = this.dataArticle.split('",,,"');
  let articleArray = [];
  if(dataArray[3].trim() !== ''){
    const appArray = [
      dataArray[0] ? dataArray[0].trim() : new Date().valueOf().toString(),
      dataArray[1] === 'checked' ? dataArray[1] : 'nonchecked',
      dataArray[2] === 'low' || dataArray[2] === 'high' ? dataArray[2] : 'normal',
      dataArray[3].trim(),
      dataArray[4] ? dataArray[4].trim() : ''
    ];
    articleArray = appArray.filter(item => item.length > 0);
  }else{
    articleArray = [
      dataArray[0] ? dataArray[0].trim() : 'Indefinite',
      dataArray[1] === 'checked' ? dataArray[1] : 'nonchecked',
      dataArray[2] === 'high' ? dataArray[2] : 'normal',
      dataArray[4] ? dataArray[4].trim() : 'No Description'
    ];
  };
  return articleArray;
}
  get addArticleData(){
    const storageObject = !localStorage.getItem('todoList') ? Object() : JSON.parse(localStorage.getItem('todoList'));
    const storProjObject = !localStorage.getItem('projList') ? Object() : JSON.parse(localStorage.getItem('projList'));
    if(!storageObject[this.projectName]) storageObject[this.projectName] = [];
    if(!storProjObject[this.projectName] || !storageObject[this.projectName]){
      storProjObject[this.projectName] = [];
      if(this.dataArticle.split('",,,"')[3].trim() === '') storProjObject[this.projectName].push(this.#articleArray().join('",,,"'));
      if(this.dataArticle.split('",,,"')[3].trim() !== '') storProjObject[this.projectName].push('Indefinite",,,"No Description');
      localStorage.setItem('projList', JSON.stringify(storProjObject));
    };
    if(this.dataArticle.split('",,,"')[3].trim() !== ''){
      storageObject[this.projectName].push(this.#articleArray().join('",,,"'));
      storageObject[this.projectName].sort();
    };
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }

  get changeArticleData(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    const stringData = storageObject[this.projectName];
    const sortDate = stringData;
    const newData = this.newDataArticle.split('",,,"').filter(item => item.length > 0).join('",,,"');
    sortDate[stringData.indexOf(this.dataArticle)] = newData;
    if(+stringData[0].split('",,,"')[0] !== +sortDate[0].split('",,,"')[0]) sortDate.sort();
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }

  get deletArticle(){
    const storageObject = JSON.parse(localStorage.getItem('todoList'));
    storageObject[this.projectName].splice(storageObject[this.projectName].indexOf(this.dataArticle), 1);
    localStorage.setItem('todoList', JSON.stringify(storageObject));
  }
}