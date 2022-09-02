window.onload = function(){

}

function checkChange(sender){
    console.log(sender.parentNode);
    sender.parentNode.childNodes[1].classList.add("itemTextFieldChk");
}