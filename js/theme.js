const modeBtn=document.querySelector(".mode button");
let mode=localStorage.getItem("mode");
modeBtn.addEventListener("click",()=>{
    if(mode === "dark"){
        localStorage.setItem("mode","light")
        modeBtn.innerHTML=`<i class="fa-regular fa-moon"></i>Dark Mode`;
    }else {
        localStorage.setItem("mode","dark")
        modeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>Dark Mode`;
    }
    mode=localStorage.getItem("mode");
    changeTheme()
});
function changeTheme(){
    if(mode === "dark"){
        document.body.classList.add("dark");
    }else{
        document.body.classList.remove("dark");
    }
}
changeTheme()