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
    if(Items != null && Items.length != 0){printAllItems();}else{setEmptyElement(true);}
    
}

// Initiating variables
var emptyIsSet = false;
var Items = []; // item list
let listItemEmptyElement; // empty indicator
let listItemPlaceholder; // item instace
var listParent; // parent of list
var showState = 1;

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

// updates items left value
function updateCheckdAmount(){
    if(Items == null){return;}
    document.getElementsByClassName("listInfoChild")[0].textContent = Items.filter(x => x.check == false).length + " items left"
}

// change item checked state
function checkChange(sender){
    // check if list is added. Just for error handling
    if(Items == null){console.log("List is null"); return;}

    // get sender element id
    let id = getElementIdByName(sender.parentNode.querySelector('.itemTextField').textContent);

    // check if item is checked and add or remove css element to indicate this state
    if(Items[id].check){
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.remove("itemTextFieldChk");
    }else{
        sender.parentNode.getElementsByClassName('itemTextField')[0].classList.add("itemTextFieldChk");
    }

    // update object list value for js
    Items[id].check = !Items[id].check;

    // updates items left value
    updateCheckdAmount();

    // save changes
    saveSession();
}

// returns element id by name.
function getElementIdByName(name){
    if(Items == null){return -1;}
    for (let i = 0; i < Items.length; i++) {
        if(Items[i].name == name){return i;}
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
    if(Items==null){return -1;}
    for (let i = 0; i < Items.length; i++) {
        if(Items[i].name == name)return i;
    }
    return -1;
}

// returns true if item exits and false if not
function itemExits(itemName){
    if(Items == null){return false;}
    for (let i = 0; i < Items.length; i++) {
        if(Items[i].name == itemName){return true;}
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
        if(Items == null){Items = [{name:itemName, check:chk}]}
        else{Items.push({name:itemName, check:chk});}
        saveSession();
    }

    updateCheckdAmount();

    // if theres no items yet, deletes no items indicator
    if(Items != null && emptyIsSet){
        setEmptyElement(false);
    }
}

// removes item, by sender (unknown element)
function removeItemDelegate(sender){
    removeItem(getItemNameByElementChild(sender));
    updateCheckdAmount();
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
    Items.splice(getItemIdByName(itemName), 1);

    // saves changes
    saveSession();

    // checks if theres no items left, add indicator
    if(Items == null || Items.length == 0 && !emptyIsSet){
        setEmptyElement(true);
    }
}

// reset session storage
function resetSessionStorage(){
    sessionStorage.clear();
}

// saves session
function saveSession(){
    if(Items != null){
        sessionStorage.setItem("items", JSON.stringify(Items));
    }else{console.log("Save failed. List is null");}
}

// load session to list
function loadSession(){
    Items = JSON.parse(sessionStorage.getItem("items"));
    console.log("session loaded");
}

// prints all list items
function printAllItems(){
    for (let i = 0; i < Items.length; i++) {
        const element = Items[i];
        addItem(element.name, false, element.check);
    }
}

function validateInput(input){
    if(input.length < 2){return false;}

    return true;
}

// for input enter event
function enter(sender){
    if(event.key === 'Enter'){
        if(validateInput(sender.value)){
            document.getElementsByClassName("textInput")[0].classList.remove("inputNotValid");
            addItem(sender.value);
            sender.value = "";
        }
        else{
            document.getElementsByClassName("textInput")[0].classList.add("inputNotValid");
        }
    }
}

// updates item visibility to match current state pointed by variable showState 
function updateShowState(){
    if(Items == null){return}
    // get item id by name
    elems = listParent.getElementsByClassName("listItem");
    for(let i = 0; i < elems.length; i++){
        curEl = elems[i].getElementsByClassName("itemTextField")[0];
        item = Items[getItemIdByName(curEl.textContent)];
        curEl.parentNode.classList.remove("itemHide");
        switch(showState){
            case 2:
                if(item.check){
                    curEl.parentNode.classList.add("itemHide");
                }
                break;
            case 3:
                if(!item.check){
                    curEl.parentNode.classList.add("itemHide");
                }
                break;
        }
    }
}

// Changes what is shown
function show(group){
    // 1=All, 2=Active, 3=Completed
    if(showState == group){return;}
    showState = group;
    updateShowState();
}

// clears all completed items
function clearCompleted(){
    if(Items == null){return;}

    // create list which I can store items I want to delete. Items cannot be removed here because it will change the list in for loop
    var toDelete = [];
    for(let i = 0; i < Items.length; i++){
        if(Items[i].check){
            toDelete.push(Items[i].name);
        }
    }

    // check if theres items to remove
    if(toDelete == null){return;}

    // removes marked items
    for(let i = 0; i < toDelete.length; i++){
        removeItem(toDelete[i]);
    }
}