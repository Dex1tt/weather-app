const API_KEY = "d7b41d91ea1121857f8987ca4a7454b2"
let input = document.getElementById('city-input')
let btn = document.getElementById('search-btn')
let result = document.getElementById('result')
let error = document.getElementById('error')
let cityName = document.getElementById('city-name')
let description = document.getElementById('description')
let temperature = document.getElementById('temperature')
let weatherIcon = document.getElementById('weather-icon')
let humidity = document.getElementById('humidity')
let wind = document.getElementById('wind')
let feelsLike = document.getElementById('feels-like')

async function getWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
async function showWeather(data, city) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp) + '°C';
    description.textContent = data.weather[0].description;
    feelsLike.textContent = Math.round(data.main.feels_like) + '°C';
    humidity.textContent = data.main.humidity + '%';
    wind.textContent = Math.round(data.wind.speed) + ' м/с';
    result.classList.remove('hidden');
    error.classList.add('hidden');
    let type = data.weather[0].main;
    weatherIcon.textContent = getIcon(type);
    document.body.style.background = backgrounds(type);
}

function getIcon(type) {
    let icons = {
        Clear: '☀️',
        Clouds: '⛅',
        Rain: '🌧️',
        Snow: '❄️',
        Thunderstorm: '⛈️',
        Drizzle: '🌦️',
        Mist: '🌫️',
    }
    return icons[type] ?? '🌡️';
}
function backgrounds(type) {
    let colors = {
    Clear: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
    Clouds: 'linear-gradient(135deg, #BDC3C7, #8395A7)',
    Rain: 'linear-gradient(135deg, #4B6CB7, #182848)',
    Snow: 'linear-gradient(135deg, #E0EAFC, #CFDEF3)',
    Thunderstorm: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
    Drizzle: 'linear-gradient(135deg, #89F7FE, #66A6FF)',
    Mist: 'linear-gradient(135deg, #D7D2CC, #304352)',
    }
    return colors[type] ?? 'linear-gradient(135deg, #b8d4f0, #7fa8d4)'
}
async function handleSearch() {
    let city = input.value;
    let data = await getWeather(city);
    
    if (data.cod === '404') {
        error.classList.remove('hidden');
        result.classList.add('hidden');
    } else {
        showWeather(data, city);
        let forecastData = await getForecast(city);
        let daily = processForecast(forecastData);
        showForecast(daily);
    }
}
async function getForecast(city){
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
function processForecast(data){
    let daily = data.list.filter(function(item){
        return item.dt_txt.includes('12:00:00');
    })
    return daily;
}
function showForecast(daily) {
    let forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    daily.forEach(function(day) {
        let date = new Date(day.dt * 1000);
        let dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        let html = `<div class="forecast-day">
            <p>${dayName}</p>
            <p>${getIcon(day.weather[0].main)}</p>
            <p>${Math.round(day.main.temp)}°C</p>
        </div>`;
        forecastContainer.innerHTML += html;
    });
}
btn.addEventListener('click', handleSearch);

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
})
getForecast('Moscow').then(function(data) {
    let daily = processForecast(data);
    showForecast(daily);
});
