const spinner = document.querySelector(".spinner-container");
function loadSpinner(){
    spinner.classList.add("display");
    changeTabIcon("flag/Globe-Icon.png");
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
function changeTabIcon (icon) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = `${icon}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  async function getCountryDetails(countryname) {
    let url = `https://restcountries.com/v3.1/alpha?codes=${countryname}`;
    try { 
    countryObject = await fetchAPI(url);
    if (countryObject) {
      return countryObject;
    } else {
      throw "somthing went wrong";
    }
  } catch (error) {
   alert(error)
  }
  }
async function fetchAPI(url){
  const response=await fetch(url);
  if(response.status === 200){
    const result = await response.json();
    return result
  }
}
