const modeBtn=document.querySelector(".mode button");
const regularMoon=`<i class="fa-regular fa-moon"></i>Dark Mode`;
const solidMoon=`<i class="fa-solid fa-moon"></i>Dark Mode`;
let mode=localStorage.getItem("mode");
modeBtn.addEventListener("click",()=>{
    if(mode === "dark"){
        localStorage.setItem("mode","light")
        modeBtn.innerHTML=regularMoon;
    }else {
        localStorage.setItem("mode","dark")
        modeBtn.innerHTML = solidMoon;
    }
    mode=localStorage.getItem("mode");
    changeTheme()
});
function changeTheme(){
    if(mode === "dark"){
        document.body.classList.add("dark");
        modeBtn.innerHTML = solidMoon;
    }else{
        document.body.classList.remove("dark");
        modeBtn.innerHTML=regularMoon;
    }
}
changeTheme()