 //variables
 const btnWorld = document.querySelector(".btnWorld");
 const btnAsia = document.querySelector(".btnAsia");
 const btnAfrica = document.querySelector(".btnAfrica");
 const btnAmerica = document.querySelector(".btnAmerica");
 const btnEurope = document.querySelector(".btnEurope");
 const ctx = document.getElementById("myChart");
 const countryPick = document.querySelector("#country");
 const continentListBtn = document.querySelectorAll(".btn-continent button");
 
 //default mode-before entering information of continent
 const continent = {
   world: {deaths: 0,confirmed: 0, recovered: 0,critical: 0},
   africa: {deaths: 0,confirmed: 0,recovered: 0,critical: 0},
   americas: {deaths: 0,confirmed: 0,recovered: 0,critical: 0 },  
   europe: {deaths: 0,confirmed: 0,recovered: 0,critical: 0},  
   asia: {deaths: 0,confirmed: 0,recovered: 0,critical: 0},  
     }; 
//chart

 let myChart = "";
 
 const infoChart = (element, type) => {
   const data = [
   element.deaths,
   element.confirmed,
   element.recovered,
   element.critical,
   ];
   if (myChart !== "") myChart.destroy(); 
   myChart = new Chart(ctx, {
     type: type,
     data: {
       labels: ["Deaths", "Confirmed", "Recovered", "Critical"],
       datasets: [
         {
           label: "number of Cases",
           data: data,
           backgroundColor: ["#e4ef67", "#e88986", "#bd9dea", "#4cc460"],
           borderColor: "#2f2",
           borderWidth: 1,
           hoverBorderWidth: 3,
           hoverBorderColor:'#fff'
         },
       ],
     },
     options: {
        // legend:
        //   position='right',
      //     labels:{
      //         fontColor: 'grey'
      //     }
         
       scales: {
         y: {
           beginAtZero: true,
         },
       },
       maintainAspectRatio: false,
       
     },
   });
     myChart.update();
 };


 const replaceInfoOfCountry = async function(){
   const covidURL = "https://corona-api.com/countries/";   
   const countryData = await axios.get(covidURL + countryPick.value);
  //  console.log(countryData)
    infoChart(countryData.data.data.latest_data,
    myChart.config._config.type);
    continentListBtn.forEach((btn) => {
     btn.id = "";
   });
 };
 
 const countryOption = async () => {
   const covidURL = "https://corona-api.com/countries";
const countries = await axios.get(covidURL);
   countries.data.data.forEach((country) => {
      countryPick.innerHTML += `<option value="${country.code}">${country.name}</option>`;
   });
 };
 const getRegionData = async (data, region) => {
   const covidURL = "https://corona-api.com/countries";
   if (region !== "world") {
     data.data.forEach((country) => {
       axios.get(`${covidURL}/${country.cca2}`).then((response) => {
          continent[region].deaths += response.data.data.latest_data.deaths;
          continent[region].confirmed += response.data.data.latest_data.confirmed;
          continent[region].recovered += response.data.data.latest_data.recovered;
          continent[region].critical += response.data.data.latest_data.critical;
       });
     });
  
   } else {
     countries = await axios.get(covidURL, [
       {
         headers: "application/json",
       },
     ]);
     countries.data.data.forEach((country) => {
       continent.world.deaths += country.latest_data.deaths;
       continent.world.confirmed += country.latest_data.confirmed;
       continent.world.recovered += country.latest_data.recovered;
       continent.world.critical += country.latest_data.critical;
     });
     infoChart(continent.world, "bar");
   }
 };
 const listOfCountries = async (region) => {
   let countries;
   const covidURL =
     "https://intense-mesa-62220.herokuapp.com/restcountries.herokuapp.com/api/v1/region/";
   if (region !== "world") {
     countries = await axios.get(covidURL + region);
     getRegionData(countries, region);
   } else {
     getRegionData([], region);
   }
 };
 //add event listeners

 //each click change the chart, mark selected and delete the option country selected

 continentListBtn.forEach((button) => {
   button.addEventListener("click", () => {
    infoChart(
      continent[button.getAttribute("continent-data")],
       myChart.config._config.type
     );
     continentListBtn.forEach((btn) => {
       btn.id = "";
     });
     button.id = "selected";
     countryPick.value = "none";
   });
 });
 window.addEventListener("load", () => {
  listOfCountries("world").catch((err) => {
     console.log(err);
   });
   listOfCountries("asia").catch((err) => {
     console.log(err);
   });
   listOfCountries("africa").catch((err) => {
     console.log(err);
   });
   listOfCountries("europe").catch((err) => {
     console.log(err);
   });
   listOfCountries("americas").catch((err) => {
     console.log(err);
   });
 });
 countryOption();
 countryPick.addEventListener("change", replaceInfoOfCountry);
 