const API_KEY = "d7b41d91ea1121857f8987ca4a7454b2"
const UNSPLASH_KEY = 'AkMYfz9ca4z5fC1maGZHuaVQMi7k7VrzPlQW1sVEgo0';
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

async function getCityPhoto(city) {
    let url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_KEY}`;
    let response = await fetch(url);
    let data = await response.json();
    return data.results[0].urls.regular;
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
    let photoUrl = await getCityPhoto(city);
    document.querySelector('body').style.backgroundImage = `url(${photoUrl})`;
    document.querySelector('body').style.backgroundSize = 'cover';
    document.querySelector('body').style.backgroundPosition = 'center';
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

btn.addEventListener('click', async function () {
    let city = input.value
    let data = await getWeather(city);
    if (data.cod === '404') {
        error.classList.remove('hidden');
        result.classList.add('hidden');
    } else {
        showWeather(data, city);
    }
})

input.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        let city = input.value
        let data = await getWeather(city);
        if (data.cod === '404') {
            error.classList.remove('hidden');
            result.classList.add('hidden');
        } else {
            showWeather(data, city);
        }
    }
})