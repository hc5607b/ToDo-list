window.onload = function(){
    // load all needed elements to variables & removes placeholders instaces
    listItemEmptyElement = document.getElementsByClassName("itemEmpty")[0];
    listItemEmptyElement.remove();
    listItemPlaceholder = document.getElementsByClassName("listItem")[0];
    listItemPlaceholder.remove();
    listParent = document.getElementsByClassName("wrapper")[0];
 
    // check if session exits and load data to list
    loadSession();

    // if there was data in session, print all items
    if(list != null && list.length != 0){printAllItems();}else{setEmptyElement(true);}
    
}

// Initiating variables
var emptyIsSet = false;
var list = []; // item list
let listItemEmptyElement; // empty indicator
let listItemPlaceholder; // item instace
var listParent; // parent of list

// set or remove empty element. Shows if theres no data yet to user
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

// change item checked state
function checkChange(sender){
    // check if list is added. Just for error handling
    if(list == null){console.log("List is null"); return;}

    // get sender element id
    let id = getElementIdByName(sender.parentNode.querySelector('.itemTextField').textContent);

    // check if item is checked and add or remove css element to indicate this state
    if(list[id].check){
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.remove("itemTextFieldChk");
    }else{
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
    }

    // update object list value for js
    list[id].check = !list[id].check;

    // save changes
    saveSession();
}

// returns element id by name.
function getElementIdByName(name){
    if(list == null){return -1;}
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == name){return i;}
    }
    return -1;
}

// returns DOM element by name.
function getDOMElementByName(name){
    var elms = document.getElementsByClassName('itemTextField')
    if(elms == null){return null;}
    for (let i = 0; i < elms.length; i++) {
        if(elms[i].textContent == name){return elms[i];}
    }
    return null;
}

// returns elemts paren node
function getItemNameByElementChild(child){
    return child.parentNode.querySelector('.itemTextField').textContent;
}

// returns item id by item name
function getItemIdByName(name){
    if(list==null){return -1;}
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == name)return i;
    }
    return -1;
}

// returns true if item exits and false if not
function itemExits(itemName){
    if(list == null){return false;}
    for (let i = 0; i < list.length; i++) {
        if(list[i].name == itemName){return true;}
    }
    return false;
}

// adds given item and saves & checks it by arguments
function addItem(itemName, save=true, chk=false){
    // check if item alredy exits
    if(itemExits(itemName) && save){console.log("Dublicate, not added");return;}

    // creates instance of placeholder element
    let newItem = listItemPlaceholder;

    // set text content for item
    newItem.querySelector('.itemTextField').textContent = itemName;

    // add item to html
    listParent.insertAdjacentHTML('beforeend', newItem.outerHTML)

    // checks if item is cheked and checks it if it is
    if(chk){
        listParent.lastChild.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
        listParent.lastChild.getElementsByClassName('itemButton')[0].checked =true;
    }

    // saves item if save argument is true
    if(save){
        if(list == null){list = [{name:itemName, check:chk}]}
        else{list.push({name:itemName, check:chk});}
        saveSession();
    }

    // if theres no items yet, deletes no items indicator
    if(list != null && emptyIsSet){
        setEmptyElement(false);
    }
}

// removes item, by sender (unknown element)
function removeItemDelegate(sender){
    removeItem(getItemNameByElementChild(sender));
}

// removes given item
function removeItem(itemName){
    // get element to variable
    var item = getDOMElementByName(itemName).parentNode;

    // check if item extis
    if(item == null){console.log("No match for item name");return;}

    // remove item
    item.remove();

    // removes item for list
    list.splice(getItemIdByName(itemName), 1);

    // saves changes
    saveSession();

    // checks if theres no items left, add indicator
    if(list == null || list.length == 0 && !emptyIsSet){
        setEmptyElement(true);
    }
}

// reset session storage
function resetSessionStorage(){
    sessionStorage.clear();
}

// saves session
function saveSession(){
    if(list != null){
        sessionStorage.setItem("items", JSON.stringify(list));
    }else{console.log("Save failed. List is null");}
}

// load session to list
function loadSession(){
    list = JSON.parse(sessionStorage.getItem("items"));
    console.log("session loaded");
}

// prints all list items
function printAllItems(){
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        addItem(element.name, false, element.check);
    }
}

// for input enter event
function enter(sender){
    if(event.key === 'Enter'){
        addItem(sender.value);
        sender.value = "";
        // sender.blur();
    }
}