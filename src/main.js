window.onload = function(){
    listItemPlaceholder = document.getElementsByClassName("listItem")[0];
    listItemPlaceholder.remove();
    listParent = document.getElementsByClassName("wrapper")[0];

    // addItem("test");
    // addItem("test2");
    // addItem("test3");

    loadSession();
    printAllItems();
    console.log(list);
}

var list = [];
let listItemPlaceholder;
var listParent;

function checkChange(sender){
    let id = getElementByName(sender.parentNode.querySelector('.itemTextField').textContent);

    console.log(list[id].check);
    if(list[id].check){
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.remove("itemTextFieldChk");
    }else{
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
    }
    list[id].check = !list[id].check;
    saveSession();
}

function getElementByName(name){
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == name){return i;}
    }
}

function addSamples(){

}

function addItem(itemName, save=true, chk=false){
    let newItem = listItemPlaceholder;
    newItem.querySelector('.itemTextField').textContent = itemName;
    listParent.insertAdjacentHTML('beforeend', newItem.outerHTML)
    
    if(chk){
        listParent.lastChild.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
        listParent.lastChild.getElementsByClassName('itemButton')[0].checked =true;
    }

    if(save){list.push({name:itemName, check:false});saveSession();}
}

function saveSession(){
    sessionStorage.setItem("items", JSON.stringify(list));
    console.log("session saved");
}

function loadSession(){
    list = JSON.parse(sessionStorage.getItem("items"));
    console.log("session loaded");
}

function printAllItems(){
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        addItem(element.name, false, element.check);
    }
}