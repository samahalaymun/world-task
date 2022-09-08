const country = document.querySelector(".country-info");
const filterDropDown = document.querySelector(".filter");
filterDropDown.addEventListener('click', function () {
    console.log(this)
    this.querySelector('.dropdown').classList.toggle('open');
})

country.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = "details.html";
    link.click();
})
