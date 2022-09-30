const modeBtn=document.querySelector(".mode button");
const regularMoon=`<i class="fa-regular fa-moon"></i>Dark Mode`;
const solidMoon=`<i class="fa-solid fa-moon"></i>Dark Mode`;
let mode=localStorage.getItem("mode");
modeBtn.addEventListener("click",()=>{
  mode=mode==="dark" ? "light":"dark";
  localStorage.setItem("mode",mode);
    changeTheme()
});
function changeTheme(){
    if(mode === "dark"){
        document.body.classList.add("dark");
        setModeIcon(solidMoon)
    }else{
        document.body.classList.remove("dark");
        setModeIcon(regularMoon)
    }
}
function setModeIcon(icon){
    modeBtn.innerHTML=icon;
}
changeTheme()