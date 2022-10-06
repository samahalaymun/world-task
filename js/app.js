const countriesContainer = document.querySelector(".countries .row");
const filterDropDownButton = document.querySelector(".dropdown button");
const filterDropDownList = document.querySelectorAll(".dropdown ul li a");
const searchInput = document.querySelector(".form-control");
const favouritesContainer = document.querySelector(".favourites-list");
const dropedContainer = document.querySelector(".section-container");
let draggableCountry = null;
let draggableCountries = [];
let countries;
let favourites = getFavourites() || [];
let init = async () => {
  loadSpinner();
  countries = await getCountries();
  removeSpinner();
  let html = prepareHtmlView(countries);
  displayCountries(html,countriesContainer);
  assignDraggableCountries()
  onFilterClicked(filterDropDownList, (event) => {
    let filteredCountries;
    filteredCountries = applyRegionFilter(
      searchInput.value,
      event.target,
      countries
    );
    let filteredHtml = prepareHtmlView(filteredCountries);
    displayCountries(filteredHtml,countriesContainer);
    assignDraggableCountries()
  });

  onSearchInput(searchInput, async (event) => {
    let searchedCountries;
    searchedCountries = await searchCountries(event.target.value);
    handleFilterButtonText(searchedCountries);
    let searchedHtml = prepareHtmlView(searchedCountries);
    displayCountries(searchedHtml,countriesContainer);
    assignDraggableCountries()
  });

  
  let favouritesHtml=prepareFavouritesHtml(favourites);
  displayCountries(favouritesHtml,favouritesContainer);
  assignDeleteFavBtns(favouritesContainer,(e) => {
      if (e.target.nodeName == "BUTTON") {
        let btn = e.target;
        let id = btn.getAttribute("name");
        let deletedItem = document.getElementById(`${id}`);
        favouritesContainer.removeChild(deletedItem);
        indicateFavIconColor(id,true);
        removeFavouriteCountry(id);
      }
    
  });
  dropedContainerEvent();
};
init();
function dragStart() {
  draggableCountry = this;
  draggableCountry.style.opacity = 0.5;
}
function dragEnd() {
  draggableCountry.style.opacity = 1;
  draggableCountry = null;
}
function dragOver(e) {
  e.preventDefault();
  this.style.border = "1px solid #27ae60";
}
function dragEnter() {
  this.style.border = "1px solid #27ae60";
}
function dragLeave() {
  this.style.border = "none";
}
async function dragDrop() {
  let cca3 = draggableCountry.querySelector("button").getAttribute("icon-name");
  let favourite=isFavourite(cca3)
  let countryObject = {
    cca3: cca3,
    flag: draggableCountry.querySelector("img").src,
    name: draggableCountry.querySelector(".card-title").innerText,
  };
  if (!favourite) {
    let country=countries.find(item=>{
      return item.name.common === countryObject.name;
     })
    setFavouriteCountry(country);
    let favouritesHtml=prepareFavouritesHtml(favourites);
    displayCountries(favouritesHtml,favouritesContainer);
    indicateFavIconColor(cca3,favourite);
  }
  this.style.border = "none";
}

function onFilterClicked(filterDropDownList, callback) {
  filterDropDownList.forEach((list) => {
    list.addEventListener("click", (event) => {
      callback(event);
    });
  });
}
function onSearchInput(searchInput, callback) {
  searchInput.addEventListener(
    "keyup",
    deboune(async (e) => {
      callback(e);
    }, 500)
  );
}
function assignDeleteFavBtns(favouritesContainer,callback) {
  favouritesContainer.addEventListener("click",(event)=>{
    callback(event)
  })
}
async function getCountries() {
  const url = "https://restcountries.com/v3.1/all";
  try {
    const countries = await fetchAPI(url);
    if (countries) {
      return countries;
    } else {
      throw "somthing went wrong";
    }
  } catch (error) {
    displayError(error);
  }
}
function displayCountries(html,container) {
  container.innerHTML = html;
}
function assignDraggableCountries(){
   draggableCountries =countriesContainer.querySelectorAll(".country-container");
   addDragDropEvent(draggableCountries)
}

function prepareHtmlView(countries) {
  let html = "";
  if (countries) {
    countriesContainer.innerHTML = "";
    removeError();
    countries.forEach((country) => {
      let favourite = isFavourite(country.cca3);
      html += `
      <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 ">
      <div class="country-container">
      <a href="details.html?country=${country.cca3}"draggable ="true">
      <div class="country" >
        <div class="card">
          <div class="img">
            <img src="${country.flags.svg}" alt="${
        country.name.common
      }" class="card-img-top" />
          </div>
          <div class="card-body">
            <h2 class="card-title">${country.name.common}</h2>
            <p class="card-text">
              <span>Population:</span> ${country.population.toLocaleString(
                "en-US"
              )}
            </p>
            <p class="card-text"><span>Region:</span> ${country.region}</p>
            <p class="card-text"><span>Capital:</span> ${country?.capital}</p>
          </div>
          <button class="btn icon ${
            favourite === true ? "fav" : " "
          }" onclick=" handleFavouriteCountryEvent('${
        country.cca3
      }',event) "icon-name="${
        country.cca3
      }"><i class="fa-solid fa-star"></i></button>
        </div>
      </div>
    </a> 
      
      </div>
      </div>
      `;
    });
  } else {
    html = `there are no countries to display`;
  }
  return html;
}
function applyRegionFilter(searchWord, list, countries) {
  let filteredCountires = [];
  const continent = list.innerText.toLowerCase();
  changeFilterButtonText(list.innerText);
  if (!searchWord) {
    countries.forEach((country) => {
      if (continent === "all") filteredCountires = countries;
      else if (country.region.toLowerCase() === continent) {
        filteredCountires.push(country);
      } else if (continent === "favourites") {
        filteredCountires = favourites;
      }
    });
  } else {
    filteredCountires = handleFilterAndsearchEvents(
      searchWord,
      continent,
      countries
    );
  }
  return filteredCountires;
}
function changeFilterButtonText(text) {
  filterDropDownButton.innerHTML = `${text}<i class="fa fa-chevron-down"></i>`;
}
function handleFilterButtonText(searchedCountries) {
  if (searchedCountries.length === 1) {
    changeFilterButtonText(searchedCountries[0].region);
  } else {
    changeFilterButtonText("all");
  }
}
function handleFilterAndsearchEvents(searchWord, continent, countries) {
  let filteredCountires = [];
  countries.forEach((country) => {
    if (
      country.name.official.toLowerCase().indexOf(searchWord) !== -1 &&
      continent !== "all" &&
      country.region.toLowerCase() === continent
    ) {
      filteredCountires.push(country);
    }else if(country.name.official.toLowerCase().indexOf(searchWord) !== -1 &&
      continent === "all"){
        filteredCountires.push(country);
    }else if( continent === "favourites"){
     filteredCountires=favourites.filter(item=>{
      return item.name.official.toLowerCase().indexOf(searchWord) !== -1;
     })
       
    }
  });
 return filteredCountires;
  
}
const deboune = (fun, delay) => {
  let timeoutid;
  return function (...args) {
    clearTimeout(timeoutid);
    timeoutid = setTimeout(() => {
      fun(...args);
    }, delay);
  };
};
async function searchCountries(value) {
  let result = [];
  if (value.trim()) {
    const url = `https://restcountries.com/v3.1/name/${value.toLowerCase()}`;
    result = await searchResult(url);
  } else {
    result = getCountries();
  }
  return result;
}

async function searchResult(url) {
  try {
    const fetchController = new AbortController();
    let timeout = setTimeout(() => {
      fetchController.abort();
    }, 2000);
    const response = await fetch(url, { signal: fetchController.signal });
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else if (response.status === 404) {
      throw "something went error";
    }
  } catch (error) {
    console.log(TypeError(error));
    if (error.name === "AbortError") return;
    countriesContainer.innerHTML = "";
    displayError(error);
  }
}
function setFavouriteCountry(country) {
  favourites.push(country);
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

function getFavourites() {
  let favourites = localStorage.getItem("favourites");
  return JSON.parse(favourites);
}
async function handleFavouriteCountryEvent(name, e) {
  e.preventDefault();
  let country=countries.find(item=>item.cca3===name)
  let favourite=isFavourite(name)
  if (favourite) {
    removeFavouriteCountry(name);
  } else {
    setFavouriteCountry(country);
  }
    indicateFavIconColor(name,favourite)
    let favouritesHtml=prepareFavouritesHtml(favourites);
    displayCountries(favouritesHtml,favouritesContainer);
 
}
function isFavourite(country) {
  let fav = false;
  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i].cca3 === country) {
      fav = true;
      break;
    }
  }
  return fav;
}
function removeFavouriteCountry(country) {
  favourites = favourites.filter((element) => {
    return element.cca3 !== country;
  });
  localStorage.setItem("favourites", JSON.stringify(favourites));
}
function prepareFavouritesHtml(favourites){
  let html="";
  if(favourites){
    favourites.forEach((favourite)=>{
      html+=`
      <div class="favourite-country mb-3" id="${favourite.cca3}">
      <div class="country-info">
      <div class="img">
        <img src="${favourite.flags.svg}" alt="" >
      </div>
       <p>${favourite.name.common}</p>
   </div>
    <button name="${favourite.cca3}">&#x2716;</button>
      </div>
      
      `
    })
    return html
  }
}
function addDragDropEvent(countries) {
  countries.forEach((country) => {
    country.addEventListener("dragstart", dragStart);
    country.addEventListener("dragend", dragEnd);
  });
}
function dropedContainerEvent() {
  dropedContainer.addEventListener("dragover", dragOver);
  dropedContainer.addEventListener("dragenter", dragEnter);
  dropedContainer.addEventListener("dragleave", dragLeave);
  dropedContainer.addEventListener("drop", dragDrop);
}
function indicateFavIconColor(id,favourite){
  if(favourite){
    document.querySelector(`[icon-name=${id}]`).classList.remove("fav");
  }else{
    document.querySelector(`[icon-name=${id}]`).classList.add("fav");
  }
}


