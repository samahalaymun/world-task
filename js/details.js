const params = new URLSearchParams(window.location.search);
let countryname = params.get("country");
let init=async()=>{
  loadSpinner();
  let country=await getCountryDetails(countryname);
  removeSpinner();
  showCountryDetails(country)
}

function showCountryDetails(countryObject) {
  const countrywrapper = document.querySelector(".wrapper");
  countryObject.forEach((country) => {
    const {currencies,languages,borders,name}=country;
    const countryDetailesContainer = document.createElement("div");
    countryDetailesContainer.classList.add("row");
    let nativeName = Object.values(name.nativeName)[0].official;
    let currenciesString = (Object.values(currencies).map(item=>item.name)).toString();
    let languageString = (Object.values(languages)).toString();
    document.title = name.common;
    changeTabIcon(country.flags.svg)
    countryDetailesContainer.innerHTML = `
  <div class="preview-img col-12 col-md-12 col-lg-6">
                <img src="${country.flags.svg}" alt="" />
              </div>
              <div class="preview-details col-12 col-md-12 col-lg-6">
                <div class="row">
                  <div class="country-name">
                    <h1>${name.common}</h1>
                  </div>
                </div>
                <div class="row">
                  <div class="country-details flex-wrap">
                    <div class="row">
                      <div class="col-12 col-md-6 col-lg-6 left">
                        <div class="item-info">
                          <span><strong>Native Name:</strong> ${
                            nativeName
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
    displayBorders(borders);
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
function displayBorders(borders){
  let borderscontainers = document.getElementById("borders");
  borderscontainers.innerHTML = "";
  if (borders) {
    borders.forEach(async (border) => {
      let country = await getBorderName(border);
      let a = document.createElement("a");
      a.href = `details.html?country=${border}`;
      a.appendChild(document.createTextNode(`${country}`));
      borderscontainers.appendChild(a);
    });
  } else {
    borderscontainers.innerHTML = ` ${countryname} has no bodrers`;
  }
}
init();
