// link to secret API key
var APIKey = "bd6d0eadd3a6c286cab6f0eba2baa4a4";
var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
var cityForm = document.querySelector("#city-form");
var cityList = document.querySelector("#city-list");
var today = moment();

// when the user submits a city it shows the current weather and five day forecast
// and also saves the city local storage
function saveCity(event) {
  event.preventDefault();
  
  const select = document.querySelector("#city-input")
  const cityInput = select.value.trim();
  storedCities.push(cityInput);
  localStorage.setItem("cities", JSON.stringify(storedCities));
  getWeather(cityInput);   
    // is not working!!
  select.value = "";
  renderCities();
  
    // document.location.reload()
}

document.querySelector("#city-button").addEventListener("click", saveCity);

// Renders local cities to the screen
const renderCities = () => {
  document.querySelector(".list-group").innerHTML = "";
    for (var i = 0; i < storedCities.length; i++) {
           
        const cityListItem = `<li class="list-group-item" id="${i}">
                ${storedCities[i]}
                <button type="button" class="btn btn-danger" data-removebutton="${i}">X</button>
            </li>`
        // console.log(storedCities)
        document.querySelector(".list-group").innerHTML += cityListItem;
    }
}

renderCities()

//  button to delete all cities
const clearCities = (event) => {
  event.preventDefault();
  localStorage.clear();
  storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  renderCities();
};
        
document.querySelector("#city-list-delete").addEventListener("click", clearCities)


const selectItem = (event) => {
  event.preventDefault();
  // individual city delete from list 
    if (event.target.matches(`[data-removebutton]`)) {
        const id = event.target.dataset.removebutton
        console.log(id)
        storedCities.splice(id, 1);
      localStorage.setItem("cities", JSON.stringify(storedCities));
      renderCities();
    } else {
    // individual city reGet weather
      const id = event.target.id
      const cityInput = storedCities[id]
      console.log(id)
      getWeather(cityInput); 
    }
  
}

document.querySelector(".list-group").addEventListener("click", selectItem)






const getWeather = async (cityName) => {
  const fiveDayRoute =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;
  
  const fiveDayData = await fetch(fiveDayRoute).then((res) => res.json());
  var midDayForecasts = fiveDayData.list.filter(function (inputs) {
    return inputs.dt_txt.includes("18:00:00");
  });
  console.log(midDayForecasts);

  const fiveDayField = document.querySelector("#five-day")
  
  fiveDayField.innerHTML = "";
  for (var i = 0; i < midDayForecasts.length; i++) {
    // STYLIZE DATE
    const selectedDate = midDayForecasts[i].dt_txt
    const weatherIcon = "https://openweathermap.org/img/wn/" + midDayForecasts[i].weather[0].icon + "@2x.png"
    const fiveDayCard = `<div class="card mx-2" style="width: 18%;">
      <div class="card-body">
        <h5 class="card-title">${selectedDate}</h5>
        <img src="${weatherIcon}" alt="${midDayForecasts[i].weather[0].description}"></img>
        <p class="card-text">Temperature: ${midDayForecasts[i].main.temp}°</p>
        <p class="card-text">Wind: ${midDayForecasts[i].wind.speed}mph</p>
        <p class="card-text">Humidity: ${midDayForecasts[i].main.humidity}%</p>
      </div>
    </div>
    `
    fiveDayField.innerHTML += fiveDayCard;
  }
  const latitude = fiveDayData.city.coord.lat
  const longitude = fiveDayData.city.coord.lon
  const todayRoute = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + APIKey;
  const todayData = await fetch(todayRoute).then((res) => res.json());
  console.log(todayData)
  const todayField = document.querySelector("#today-weather")
  const weatherIcon = "https://openweathermap.org/img/wn/" + todayData.current.weather[0].icon + "@2x.png"
  const todayDate = today.format("MMMM Do, YYYY")
  var uvColor = "";

  // selects color based on current UV index
  if (todayData.current.uvi < 3) {
        uvColor = "green";
      } else if (todayData.current.uvi < 6) {
        uvColor = "yellow";
      } else if (todayData.current.uvi < 8) {
        uvColor = "orange";
      } else if (todayData.current.uvi < 11) {
        uvColor = "red";
      } else {
        uvColor =  "purple";
  }
  
  const todayCard = `<div class="card">
    <div class="card-header fs-1">
      ${cityName}
      <img src="${weatherIcon}"></img>
      ${todayDate}
    </div>
    <div class="card-body">
      <h5 class="card-title">Temp: ${todayData.current.temp}°</h5>
      <h5 class="card-title">Wind: ${todayData.current.wind_speed}mph</h5>
      <h5 class="card-title">Humidity: ${todayData.current.humidity}%</h5>
      <h5 class="card-title">UV Index: <span class="rounded p-1" style="background-color: ${uvColor}"> ${todayData.current.uvi} </span> </h5>
     </div>
  </div>`;
  todayField.innerHTML = todayCard;

}  

