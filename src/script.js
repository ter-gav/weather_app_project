function getCurrentDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[date.getDay()];
  let currentHour = date.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = date.getMinutes();

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  return `${currentDay} ${currentHour}:${currentMinutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
     <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
     <img src="http://openweathermap.org/img/wn/${
       forecastDay.weather[0].icon
     }@2x.png" alt="weather" />
     <div class="weather-forecast-temperatures">
       <span class="max-temperature">${Math.round(
         forecastDay.temp.max
       )}º </span>
       <span class="min-temperature">${Math.round(forecastDay.temp.min)}º</span>
     </div>
     </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  document.querySelector(".current-city h1").innerHTML = response.data.name;

  let currentTemperature = Math.round(response.data.main.temp);
  document.querySelector("#current-city-temp").innerHTML = currentTemperature;

  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#windspeed").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}km/h`;

  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;

  let maxTemperature = Math.round(response.data.main.temp_max);
  document.querySelector("#max-temp-today").innerHTML = `${maxTemperature}º`;

  let minTemperature = Math.round(response.data.main.temp_min);
  document.querySelector("#min-temp-today").innerHTML = `${minTemperature}º`;

  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);

  function formatSunrise(date) {
    let sunriseDate = new Date(date * 1000);
    let sunriseHours = sunriseDate.getHours();
    if (sunriseHours < 10) {
      sunriseHours = `0${sunriseHours}`;
    }
    let sunriseMinutes = sunriseDate.getMinutes();
    if (sunriseMinutes < 10) {
      sunriseMinutes = `0${sunriseMinutes}`;
    }
    let sunriseTime = document.querySelector("#sunrise");
    sunriseTime.innerHTML = `Sunrise: ${sunriseHours}:${sunriseMinutes}`;
  }

  let sunrise = response.data.sys.sunrise;
  formatSunrise(sunrise);

  function formatSunset(date) {
    let sunsetDate = new Date(date * 1000);
    let sunsetHours = sunsetDate.getHours();
    if (sunsetHours < 10) {
      sunsetHours = `0${sunsetHours}`;
    }
    let sunsetMinutes = sunsetDate.getMinutes();
    if (sunsetMinutes < 10) {
      sunsetMinutes = `0${sunsetMinutes}`;
    }
    let sunsetTime = document.querySelector("#sunset");
    sunsetTime.innerHTML = `Sunset: ${sunsetHours}:${sunsetMinutes}`;
  }
  let sunset = response.data.sys.sunset;
  formatSunset(sunset);

  getForecast(response.data.coord);
}

function searchCity(city) {
  if (city != "") {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl).then(showTemperature);
  } else {
    alert("Hi there! Enter a city please");
  }
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-input").value;
  searchCity(city);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function showLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let apiKey = "f408b458699300138b2f973b8c6a1c4a";

let dateElement = document.querySelector("#current-day");
let currentTime = new Date();
dateElement.innerHTML = getCurrentDay(currentTime);

let searchForm = document.querySelector("#search-city-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-button");
currentLocation.addEventListener("click", showLocation);

searchCity("Berlin");
