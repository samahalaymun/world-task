const countriesContainer = document.querySelector(".countries .row");
let countries = [];
let countriesDisplayed;
async function getCountries() {
  const url = "https://restcountries.com/v3.1/all";
  const response = await fetch(url);
  if (response.status === 200) {
    countries = await response.json();
    countriesContainer.innerHTML = "";
    countries.forEach((country) => {
      showCountry(country);
    });
    countriesDisplayed =countriesContainer.querySelectorAll(".country-container");
  }else{
    alert("somthing went wrong");
  }

}

function showCountry(country) {
  spinner.classList.remove("display");
  const countryFalg = country.flags.svg;
  const countryName = country.name.common;
  const countryPopulation = country.population.toLocaleString("en-US");
  const countryregion = country.region;
  const countryCapital = country.capital;
  const countryContainer = document.createElement("div");
  countryContainer.classList.add(
    "col-12",
    "col-sm-6",
    "col-md-6",
    "col-lg-4",
    "col-xl-3",
    "country-container"
  );
  countryContainer.innerHTML = `
 <a href="details.html?country=${country.name.common}">
   <div class="country">
     <div class="card">
       <div class="img">
         <img src="${countryFalg}" alt="" class="card-img-top" />
       </div>
       <div class="card-body">
         <h2 class="card-title">${countryName}</h2>
         <p class="card-text">
           <span>Population:</span> ${countryPopulation}
         </p>
         <p class="card-text"><span>Region:</span> ${countryregion}</p>
         <p class="card-text"><span>Capital:</span> ${countryCapital}</p>
       </div>
     </div>
   </div>
 </a>
 `;
  countriesContainer.appendChild(countryContainer);
}
getCountries();

const filterDropDownButton = document.querySelector(".dropdown button");
const filterDropDownList = document.querySelectorAll(".dropdown ul li a");
filterDropDownList.forEach((list) => {
  list.addEventListener("click", () => {
    const continent = list.innerText.toLowerCase();
    filterDropDownButton.innerHTML = `${list.innerText}<i class="fa fa-chevron-down"></i>`;
    countries.forEach((country, i) => {
      if (continent === "all") {
        countriesDisplayed[i].style.display = "unset";
      } else if (country.region.toLowerCase() !== continent) {
        countriesDisplayed[i].style.display = "none";
      } else {
        countriesDisplayed[i].style.display = "unset";
      }
    });
  });
});
const deboune=(fun,delay)=>{
  let timeoutid;
  return function(...args){
    if(timeoutid){
        clearTimeout(timeoutid)
    }
   timeoutid= setTimeout(()=>{
      fun(...args);
    },delay)
  }
}
const searchInput = document.querySelector(".form-control");
const fetchController=new AbortController();

searchInput.addEventListener("keyup",deboune(
  e => {
    if (e.target.value) {
      console.log(e.target.value)
      const url = `https://restcountries.com/v3.1/name/${e.target.value.toLowerCase()}`;
      searchResult(url);
    } else {
      console.log("input empty")
      removeError();
      getCountries();
    }
  },1000));
let count=0;
async function searchResult(url) {
  count++;
  console.log(count)
  let timeout=setTimeout(()=>{
     fetchController.abort()
     console.log("abort")
  },1000)
  try {
    const response = await fetch(url,fetchController.abort());
    if (response.status === 200) {
      const result = await response.json();
      clearTimeout(timeout)
      console.log(result)
      countriesContainer.innerHTML = "";
      removeError();
      result.forEach((country) => {
        showCountry(country);
      });
    } else if(response.status === 404) {
      countriesContainer.innerHTML = "";
      throw "Country not fount";
    }
  } catch (error) {
    if (error.name === "AbortError") {
      removeError();
      return;
    }else{
      console.log(error)
      displayError(error)
    }

  }
}


