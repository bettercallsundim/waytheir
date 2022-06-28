const links={
   wUrl:"https://api.openweathermap.org/data/2.5/weather?q=",
   wKey:'58955c5330f29951705b6b85e94652bc',
   cUrl:'https://api.countrystatecity.in/v1/countries',
   cKey:'bzZXZlhnRXJ2c1Zrc3VaNU1jMUlXQThzbzdJeVVjQ3Q4NWFoNnZRYg==',
}

const selectCountry = document.querySelector('.selectCountry');

const selectCity=document.querySelector(".selectCity");
const selectState=document.querySelector(".selectState");
const wgrid=document.querySelector(".wgrid");
const fare=document.querySelector(".fare");
const celc=document.querySelector(".celc");
const buttons=document.querySelector(".buttons");

async function getCCS(mode,...args){

let apiFinalLink;

switch(mode){
   case 'country':
      apiFinalLink=`https://api.countrystatecity.in/v1/countries`;
      break;

   case 'state':
      apiFinalLink=`https://api.countrystatecity.in/v1/countries/${args[0]}/states`;
      break;

   case 'city':
      apiFinalLink=`https://api.countrystatecity.in/v1/countries/${args[0]}/states/${args[1]}/cities`;
      break;
}

let res= await fetch(apiFinalLink,{
   headers:{'X-CSCAPI-KEY':links.cKey}
});
let data= await res.json();
return data;
}

async function fetchWeather(city,stateISO,countryISO,units){
   let finalWUrl= `${links.wUrl}${city},${stateISO},${countryISO}&appid=${links.wKey}&units=${units}`;
   let resp= await fetch(finalWUrl);
   let data= await resp.json();
   return data;
}


function weatherHTMLGenerator(fetchedData,selectedCountryName){
   let template=`
   <div class="gridChild">
               <p class="mb-2">${fetchedData.name}, ${selectedCountryName}</p>
               <p>21 Feb, 2021</p>
            </div>
            <div class="gridChild">
               <p class="mb-2">${fetchedData.main.temp} C</p>
               <p>Feels Like : ${fetchedData.main.feels_like} C</p>
            </div>
            <div class="gridChild">
               <p class="mb-2">${fetchedData.weather[0].main} <img src="https://openweathermap.org/img/w/${fetchedData.weather[0].icon}.png" alt=""> </p>
               <p>${fetchedData.weather[0].description}</p>
            </div>
            <div class="gridChild">
               <p class="mb-2">Temp Min : ${fetchedData.main.temp_min} C</p>
               <p>Temp Max : ${fetchedData.main.temp_max} C</p>
            </div>
   `
   wgrid.innerHTML=template;
}


document.addEventListener('DOMContentLoaded',firstLoad);

//////// main function

async function firstLoad(){
   let countries=await getCCS('country');
   countrySelectOptionGenerator(countries);

   ////country input change event
   selectCountry.onchange=async function (){
      let selectedCountryISO=this.value;
      let selectedCountryName=this.options[this.selectedIndex].innerText;
      let states=await getCCS('state',selectedCountryISO);
      if(states.length==0){
         alert(404)
       }

      stateSelectOptionGenerator(states);


       ////state input change event
   selectState.onchange=async function (){
      let selectedStateISO=this.value;
      let cities=await getCCS('city',selectedCountryISO,selectedStateISO);
      if(cities.length==0){
        alert(404)
      }
      citySelectOptionGenerator(cities);
      selectCity.onchange=async function(){
         let selectedCity=this.value;
         let units=`metric`;
         let fetchedData= await fetchWeather(selectedCity,selectedStateISO,selectedCountryISO,units);
         if(fetchedData.length==0){
            alert(404)
          }
         buttons.style.display='block';
         weatherHTMLGenerator(fetchedData,selectedCountryName);

         fare.onclick=async function(){
            let units=`imperial`;
         let fetchedData= await fetchWeather(selectedCity,selectedStateISO,selectedCountryISO,units);
         if(fetchedData.length==0){
            alert(404)
          }
            weatherHTMLGenerator(fetchedData,selectedCountryName);
         }
         celc.onclick=async function(){
            let units=`metric`;
         let fetchedData= await fetchWeather(selectedCity,selectedStateISO,selectedCountryISO,units);
         if(fetchedData.length==0){
            alert(404)
          }
            weatherHTMLGenerator(fetchedData,selectedCountryName);
         }
      }
   }

   }
}

///// countrySelectOptionGenerator

 function countrySelectOptionGenerator(countries){
   selectCountry.innerHTML='<option  value="">Select Country</option>';
 countries.forEach(country => {
      selectCountry.innerHTML +=`<option  value="${country.iso2}">${country.name}</option>`
   });
}
///// stateSelectOptionGenerator

 function stateSelectOptionGenerator(states){
   selectState.innerHTML='<option  value="">Select State</option>';
   selectState.disabled=false;
   states.forEach(state => {
      selectState.innerHTML +=`<option  value="${state.iso2}">${state.name}</option>`
   });
}


///// citySelectOptionGenerator

 function citySelectOptionGenerator(cities){
   selectCity.innerHTML='<option  value="">Select City</option>';
   selectCity.disabled=false;
   cities.forEach(city => {
      selectCity.innerHTML +=`<option>${city.name}</option>`
   });



}
