export class createMenu{
  constructor(objectStorage){
    this.objectStorage = objectStorage;
  }
  get menuProject(){
    const olList = document.querySelector('#navexpand ol');
    const namesMenuElement = Object.keys(JSON.parse(this.objectStorage));
    namesMenuElement.forEach(item => {
      const menuLi = document.createElement('li');
      const menuElement = document.createElement('button');
      menuElement.id = `link${item}`;
      menuElement.textContent = item;
      menuElement.setAttribute('type','button');
      olList.appendChild(menuLi);
      menuLi.appendChild(menuElement);
    });
    const menuLi = document.createElement('li');
    const menuElement = document.createElement('button');
    menuElement.innerHTML = '+ new project';
    menuElement.id = 'createproject';
    menuElement.setAttribute('type','button');
    olList.appendChild(menuLi);
    menuLi.appendChild(menuElement);
  }
}