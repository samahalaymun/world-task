const spinner = document.querySelector(".spinner-container");
document.addEventListener("DOMContentLoaded", loadSpinner());
function loadSpinner(){
    spinner.classList.add("display");
}
function displayError(error){
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").innerText = error;
}
function removeError(){
    document.querySelector(".error").style.display = "none";
}