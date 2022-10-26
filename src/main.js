window.onload = function(){
    listItemEmptyElement = document.getElementsByClassName("itemEmpty")[0];
    listItemEmptyElement.remove();
    listItemPlaceholder = document.getElementsByClassName("listItem")[0];
    listItemPlaceholder.remove();
    listParent = document.getElementsByClassName("wrapper")[0];

    loadSession();
    if(list != null && list.length != 0){printAllItems();}else{setEmptyElement(true);}
    
}

var emptyIsSet = false;
var list = [];
let listItemEmptyElement;
let listItemPlaceholder;
var listParent;

function setEmptyElement(set){
    if(set){
        listParent.insertAdjacentHTML('beforeend', listItemEmptyElement.outerHTML);
        emptyIsSet = true;
    }
    else{
        document.getElementsByClassName("itemEmpty")[0].remove();
        emptyIsSet = false;
    }
}

function checkChange(sender){
    if(list == null){console.log("List is null"); return;}
    let id = getElementIdByName(sender.parentNode.querySelector('.itemTextField').textContent);

    if(list[id].check){
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.remove("itemTextFieldChk");
    }else{
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
    }
    list[id].check = !list[id].check;
    saveSession();
}

function getElementIdByName(name){
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == name){return i;}
    }
}

function getDOMElementByName(name){
    var elms = document.getElementsByClassName('itemTextField')
    for (let i = 0; i < elms.length; i++) {
        if(elms[i].textContent == name){return elms[i];}
    }
    return null;
}

function getItemNameByElementChild(child){
    return child.parentNode.querySelector('.itemTextField').textContent;
}

function getItemIdByName(name){
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == name)return i;
    }
    return -1;
}

function itemExits(itemName){
    if(list == null){return false;}
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == itemName){return true;}
    }
    return false;
}

function addItem(itemName, save=true, chk=false){
    if(itemExits(itemName) && save){console.log("Dublicate, not added");return;}
    let newItem = listItemPlaceholder;
    newItem.querySelector('.itemTextField').textContent = itemName;
    listParent.insertAdjacentHTML('beforeend', newItem.outerHTML)
    if(chk){
        listParent.lastChild.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
        listParent.lastChild.getElementsByClassName('itemButton')[0].checked =true;
    }

    if(save){
        if(list == null){list = [{name:itemName, check:chk}]}
        else{list.push({name:itemName, check:chk});}
        saveSession();
    }

    if(list != null && emptyIsSet){
        setEmptyElement(false);
    }
}

function removeItemDelegate(sender){
    removeItem(getItemNameByElementChild(sender));
}

function removeItem(itemName){
    var item = getDOMElementByName(itemName).parentNode;
    if(item == null){console.log("No match for item name");return;}
    item.remove();
    list.splice(getItemIdByName(itemName), 1);
    saveSession();
    if(list == null || list.length == 0 && !emptyIsSet){
        setEmptyElement(true);
    }
}

function resetSessionStorage(){
    sessionStorage.clear();
}

function saveSession(){
    if(list != null){
        sessionStorage.setItem("items", JSON.stringify(list));
    }else{console.log("Save failed. List is null");}
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

function enter(sender){
    if(event.key === 'Enter'){
        addItem(sender.value);
        sender.value = "";
        // sender.blur();
    }
}