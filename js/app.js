const countriesContainer = document.querySelector(".countries .row");
const filterDropDownButton = document.querySelector(".dropdown button");
const filterDropDownList = document.querySelectorAll(".dropdown ul li a");
const searchInput = document.querySelector(".form-control");
const favouritesContainer = document.querySelector(".favourites-list");
const dropedContainer = document.querySelector(".section-container");
let draggableCountry = null;
let draggableCountries=[];
let favourites = getFavourites() ? getFavourites() : [];
let init = async () => {
  let countries;
  loadSpinner();
  countries = await getCountries();
  removeSpinner();
  displayCountries(countries);
  assignOnFilter(() => {
    filterDropDownList.forEach((list) => {
      let filteredCountries;
      list.addEventListener("click", () => {
        filteredCountries = applyRegionFilter(list, countries);
        displayCountries(filteredCountries);
      });
    });
  });

  onSearchInput(() => {
    let searchedCountries;
    searchInput.addEventListener(
      "keyup",
      deboune(async (e) => {
        searchedCountries = await searchCountries(e.target.value);
        handleFilterButtonText(searchedCountries);
        displayCountries(searchedCountries);
      }, 500)
    );
  });

  displayFavouriteCountries(favourites);
  assignDeleteFavBtns(() => {
    favouritesContainer.addEventListener("click",function(e){
       if(e.target.nodeName =="BUTTON"){
        let btn=e.target;
        let id=btn.getAttribute("name");
        let deletedItem = document.getElementById(`${id}`);
        favouritesContainer.removeChild(deletedItem);
        removeFavouriteCountry(id);
       }
    })
  });
  dropedContainerEvent();
};
init();
function dragStart() {
  draggableCountry = this;
  draggableCountry.style.opacity=0.5
}
function dragEnd() {
  draggableCountry.style.opacity=1
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
  let countryObject = {
    cca3: cca3,
    flag: draggableCountry.querySelector("img").src,
    name: draggableCountry.querySelector(".card-title").innerText,
  };
  if (!isFavourite(cca3)) {
    let country =await getCountryDetails(cca3);
    showFavouriteCountry(countryObject);
    setFavouriteCountry(country[0]);
  }
  this.style.border = "none";
}

function assignOnFilter(callback) {
  callback();
}
function onSearchInput(callback) {
  callback();
}
function assignDeleteFavBtns(callback) {
  callback();
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
function displayCountries(countries) {
  if (countries) {
    countriesContainer.innerHTML = "";
    removeError();
  }
  countries.forEach((country) => {
    let favourite = isFavourite(country.cca3);
    let countryObject = {
      capital: country?.capital,
      cca3: country.cca3,
      flag: country.flags.svg,
      name: country.name.common,
      population: country.population,
      region: country.region,
      favourite: favourite,
    };
    showCountry(countryObject);
  });
  draggableCountries =countriesContainer.querySelectorAll(".country-container");
  addDragDropEvent(draggableCountries)
}

function showCountry(countryObject) {
  const { capital, cca3, flag, name, population, region, favourite } =
    countryObject;
  const countryContainer = document.createElement("div");
  countryContainer.classList.add(
    "col-12",
    "col-sm-6",
    "col-md-6",
    "col-lg-6",
    "col-xl-4",
    "country-container"
  );
  countryContainer.innerHTML = `
 <a href="details.html?country=${cca3}"draggable ="true">
   <div class="country" >
     <div class="card">
       <div class="img">
         <img src="${flag}" alt="${name}" class="card-img-top" />
       </div>
       <div class="card-body">
         <h2 class="card-title">${name}</h2>
         <p class="card-text">
           <span>Population:</span> ${population.toLocaleString("en-US")}
         </p>
         <p class="card-text"><span>Region:</span> ${region}</p>
         <p class="card-text"><span>Capital:</span> ${capital}</p>
       </div>
       <button class="btn icon ${favourite===true ?'fav':' '}" onclick=" handleFavouriteCountryEvent('${cca3}',event) "icon-name="${cca3}"><i class="fa-solid fa-star"></i></button>
     </div>
   </div>
 </a>
 `;
  countriesContainer.appendChild(countryContainer);
}
function applyRegionFilter(list, countries) {
  let filteredCountires = [];
  const continent = list.innerText.toLowerCase();
  changeFilterButtonText(list.innerText);
  countries.forEach((country) => {
    if (continent === "all") filteredCountires = countries;
    else if (country.region.toLowerCase() === continent) {
      filteredCountires.push(country);
    } else if (continent === "favourites") {
      filteredCountires = favourites;
    }
  });
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
    const response = await fetch(url,{signal: fetchController.signal});
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else if (response.status === 404) {
      throw "something went error";
    }
  } catch (error) {
    console.log(TypeError(error))
    if(error.name === "AbortError" )return
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
  const country = await fetchAPI(
    `https://restcountries.com/v3.1/alpha?codes=${name}`
  );
  if (isFavourite(name)) {
    removeFavouriteCountry(name);
    document.querySelector(`[icon-name=${name}]`).classList.remove("fav");
  } else {
    document.querySelector(`[icon-name=${name}]`).classList.add("fav");
    setFavouriteCountry(country[0]);
  }
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
function displayFavouriteCountries(favourites) {
  if (favourites) {
    favourites.forEach((favourite) => {
      let favouriteObject = {
        cca3: favourite.cca3,
        flag: favourite.flags.svg,
        name: favourite.name.common,
      };
      showFavouriteCountry(favouriteObject);
    });
    
  }
}
function showFavouriteCountry(favouriteCountry) {
  const { cca3, flag, name } = favouriteCountry;
  const favouriteCountryDiv = document.createElement("div");
  favouriteCountryDiv.setAttribute("id", `${cca3}`);
  favouriteCountryDiv.classList.add("favourite-country", "mb-3");
  favouriteCountryDiv.innerHTML = `
  <div class="country-info">
     <div class="img">
       <img src="${flag}" alt="" >
     </div>
      <p>${name}</p>
  </div>
   <button name="${cca3}">&#x2716;</button>
  `;
  favouritesContainer.appendChild(favouriteCountryDiv);
}
function addDragDropEvent(countries){
  countries.forEach((country) => {
    country.addEventListener("dragstart", dragStart);
    country.addEventListener("dragend", dragEnd);
  });
}
function dropedContainerEvent(){
  dropedContainer.addEventListener("dragover", dragOver);
  dropedContainer.addEventListener("dragenter", dragEnter);
  dropedContainer.addEventListener("dragleave", dragLeave);
  dropedContainer.addEventListener("drop", dragDrop);
}


