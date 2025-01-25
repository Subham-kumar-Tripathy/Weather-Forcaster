const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const weatherresultdisplay=document.querySelector(".weatherresultdisplay");
const permisioncontainer=document.querySelector(".permisiondisplay");
const formcontainer=document.querySelector("[datasearchform]");
const loadingcontainer=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".userinfocontainer");
let currentTab=usertab;
const API_key = "3a01e64dd66bbc2b2c0c3a2ad0258ba0";
currentTab.classList.add("currentTab");
getfromsessionstorage();


function switchtab(clickedtab){
    if(clickedtab != currentTab){
        currentTab.classList.remove("currentTab");
        currentTab=clickedtab;
        currentTab.classList.add("currentTab");
    }
    if(!formcontainer.classList.contains("active")){
        userinfocontainer.classList.remove("active");
        permisioncontainer.classList.remove("active");
        formcontainer.classList.add("active");
    }
    else{
        formcontainer.classList.remove("active");
        userinfocontainer.classList.remove("active");
        getfromsessionstorage();
    }
}
usertab.addEventListener("click",()=>{
    switchtab(usertab);
});
searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
});


function getfromsessionstorage(){
    const localcodinates=sessionStorage.getItem("user-cordinates");
    if(!localcodinates){
        permisioncontainer.classList.add("active");
    }
    else{
        const cordinates=JSON.parse(localcodinates);
        fetchuserweatherinfo(cordinates);
    }
}
async function fetchuserweatherinfo(cordinates){
    const {lat ,lon }=cordinates;
    permisioncontainer.classList.remove("active");
    loadingcontainer.classList.add("active");
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await res.json();
        loadingcontainer.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingcontainer.classList.remove("active");
    }
}
function renderweatherinfo(weatherInfo){
    const cityName = document.querySelector("[datacityname]");
    const countryflag = document.querySelector("[countryflag]");
    const decss = document.querySelector("[dataweatherdecs]");
    const weathericon = document.querySelector("[dataweather-icon]");
    const tempdisplay = document.querySelector("[tempraturedisplay]");
    const windspeed = document.querySelector("[datawindspeed]");
    const humidity = document.querySelector("[datahumidity]");
    const cloudness = document.querySelector("[dataClouds]");

    if (weatherInfo) {
        cityName.innerText = weatherInfo?.name || 'City not available';
        countryflag.src = weatherInfo?.sys?.country
            ? `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
            : '';
        decss.innerText = weatherInfo?.weather?.[0]?.description || 'No description available';
        weathericon.src = weatherInfo?.weather?.[0]?.icon 
            ? `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` 
            : '' ;
        tempdisplay.innerText = `${weatherInfo?.main?.temp}°C` || 'N/A';
        windspeed.innerText = `${weatherInfo?.wind?.speed}m/s` || 'N/A';
        humidity.innerText = `${weatherInfo?.main?.humidity}%` || 'N/A';
        cloudness.innerText = `${weatherInfo?.clouds?.all}%` || 'N/A';
    }
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //ask for yes no location
    }
}
function showPosition(Position){
    const usercordinates={
        lat:Position.coords.latitude,
        lon:Position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinates",JSON.stringify(usercordinates));
    fetchuserweatherinfo(usercordinates);
}
const grantAcess=document.querySelector("[grant-acess]");
grantAcess.addEventListener('click',getlocation);

const searchinput=document.querySelector("[data-searchinput]");
formcontainer.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;
    if(cityname==="")
        return;
    else
    fetchsearchweatherinfo(cityname);
})
async function fetchsearchweatherinfo(cityname){
    loadingcontainer.classList.add("active");
    userinfocontainer.classList.remove("active");
    permisioncontainer.classList.remove("active");
    try{
        const respon=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`);
        const data = await respon.json();
        loadingcontainer.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        alert("enter valid location");
    }
}