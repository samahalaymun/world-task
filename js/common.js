const spinner = document.querySelector(".spinner-container");
document.addEventListener("DOMContentLoaded", loadSpinner());
function loadSpinner(){
    spinner.classList.add("display");
    changetabIcon("flag/Globe-Icon.png");
}
function removeSpinner(){
    spinner.classList.remove("display");
}
function displayError(error){
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").innerText = error;
}
function removeError(){
    document.querySelector(".error").style.display = "none";
}
function changetabIcon (icon) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = `${icon}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }