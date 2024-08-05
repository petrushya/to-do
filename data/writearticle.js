export class articlesData {
  constructor(projectName, dateTime, priority, contentArticle, noteArticle){
    this.projectName = projectName ? projectName : "routine";
    this.dateTime = dateTime ? new Date(dateTime).valueOf() : new Date().valueOf();
    this.priority = priority ? priority : 'normal';
    this.contentArticle = contentArticle ? contentArticle : 'empty';
    this.noteArticle = noteArticle ? noteArticle : '';
  }
  get addArticleData(){
    const checkValue = 'nonchecked';
    const totalObject = !localStorage.getItem('jsonArticlesData') ? Object() : JSON.parse(localStorage.getItem('jsonArticlesData'));
    let articleArray = [this.dateTime.toString(),checkValue,this.priority,this.contentArticle,this.noteArticle].filter(item => item.length > 0);
    if(!totalObject[this.projectName]){
      totalObject[this.projectName] = [];
    }else if(articleArray[3] === 'empty' && Object.keys(totalObject).includes(this.projectName)){
      return;
    };
    if(articleArray[3] !== 'empty'){
      totalObject[this.projectName].push(articleArray.join('%%%'));
      totalObject[this.projectName].sort();
    };
    localStorage.setItem('jsonArticlesData', JSON.stringify(totalObject));
  }
}