const params = new URLSearchParams(window.location.search);
let countryname = params.get("country");

async function getCountryDetails() {
  let url = `https://restcountries.com/v3.1/name/${countryname}?fullText=true`;
try {
  const response = await fetch(url);
  countryObject = await response.json();
  if (response.status === 200) {
    showCountryDetails(countryObject);
  } else {
    throw "somthing went wrong";
  }
} catch (error) {
 alert(error)
}
}
function showCountryDetails(countryObject) {
  const countrywrapper = document.querySelector(".wrapper");
  removeSpinner();
  countryObject.forEach((country) => {
    const countryDetailesContainer = document.createElement("div");
    countryDetailesContainer.classList.add("row");
    let currencies = country.currencies;
    let languages = country.languages;
    let borders = country.borders;
    let currenciesString = "";
    let languageString = "";
    let languageObjects = Object.values(languages);
    let currenciesObjects = Object.values(currencies);
    currenciesObjects.forEach((currency) => {
      currenciesString += currency.name + ", ";
    });
    languageObjects.forEach((language) => {
      languageString += language + ", ";
    });
    currenciesString = currenciesString.substring(0,currenciesString.length - 2);
    languageString = languageString.substring(0, languageString.length - 2);
    document.title = country.name.common;
    changetabIcon(country.flags.svg)
    countryDetailesContainer.innerHTML = `
  <div class="preview-img col-12 col-md-12 col-lg-6">
                <img src="${country.flags.svg}" alt="" />
              </div>
              <div class="preview-details col-12 col-md-12 col-lg-6">
                <div class="row">
                  <div class="country-name">
                    <h1>${country.name.common}</h1>
                  </div>
                </div>
                <div class="row">
                  <div class="country-details flex-wrap">
                    <div class="row">
                      <div class="col-12 col-md-6 col-lg-6 left">
                        <div class="item-info">
                          <span><strong>Native Name:</strong> ${
                            country.name.official
                          }</span>
                        </div>
                        <div class="item-info">
                          <span><strong>Population:</strong> ${country.population.toLocaleString(
                            "en-US"
                          )}</span>
                        </div>
                        <div class="item-info">
                          <span><strong>Region:</strong> ${
                            country.region
                          }</span>
                        </div>
                        <div class="item-info">
                          <span
                            ><strong>Sub Region:</strong> ${
                              country.subregion
                            }</span
                          >
                        </div>
                        <div class="item-info">
                          <span><strong>Capital:</strong> ${
                            country.capital
                          }</span>
                        </div>
                      </div>
                      <div class="col-12 col-md-6 col-lg-6 right">
                        <div class="item-info">
                          <span><strong>Top Level Domain:</strong> ${
                            country.tld
                          }</span>
                        </div>
                        <div class="item-info">
                          <span><strong>Currencies: </strong> ${currenciesString}</span>
                        </div>
                        <div class="item-info">
                          <span
                            ><strong>Languages:</strong> ${languageString}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="country-borders">
                    <span>Border Countries:</span>
                    <div class="borders" id="borders">
                    </div>
                  </div>
                </div> 
              </div>
  `;
    countrywrapper.appendChild(countryDetailesContainer);
    let borderscontainers = document.getElementById("borders");
    borderscontainers.innerHTML = "";
    if (borders) {
      borders.forEach(async (border) => {
        let country = await getBorderName(border);
        let a = document.createElement("a");
        a.href = `details.html?country=${country}`;
        a.appendChild(document.createTextNode(`${country}`));
        borderscontainers.appendChild(a);
      });
    } else {
      borderscontainers.innerHTML = ` ${countryname} has no bodrers`;
    }
  });
}
async function getBorderName(border) {
try {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${border}`
  );
  if (response.status === 200) {
    const borderCountry = await response.json();
    return borderCountry[0].name.common;
  }
} catch (error) {
  
}
}

getCountryDetails();
