let apiKey = "f408b458699300138b2f973b8c6a1c4a";

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
let dateElement = document.querySelector("#current-day");
let currentTime = new Date();
dateElement.innerHTML = getCurrentDay(currentTime);

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

  function showCelsius(event) {
    event.preventDefault();
    let celsius = document.querySelector("#current-city-temp");
    celsius.innerHTML = currentTemperature;
  }
  let celsiusTemp = document.querySelector("#celsius-link");
  celsiusTemp.addEventListener("click", showCelsius);

  function showFahrenheit(event) {
    event.preventDefault();
    let temperature = document.querySelector("#current-city-temp");
    temperature.innerHTML = Math.round((currentTemperature * 9) / 5 + 32);

    let forecastMax = document.querySelector(".max-temperature");
    forecastMax.innerHTML = `${Math.round((maxTemperature * 9) / 5 + 32)}º`;

    let forecastMin = document.querySelector(".min-temperature");
    forecastMin.innerHTML = `${Math.round((minTemperature * 9) / 5 + 32)}º`;
  }

  let fahrenheitTemp = document.querySelector("#fahrenheit-link");
  fahrenheitTemp.addEventListener("click", showFahrenheit);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search-city-form");
searchForm.addEventListener("submit", handleSubmit);

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
let currentLocation = document.querySelector("#current-button");
currentLocation.addEventListener("click", showLocation);

searchCity("Berlin");
