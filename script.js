const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');

// Fetch and display weather data
 async function checkWeather(city) {
    const apiKey = "08ce0f8da445b4e094b41c23f6ca3875";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const weatherData = await response.json();

        if (weatherData.cod === '404') {
            locationNotFound.style.display = "flex";
            weatherBody.style.display = "none";
            console.error("City not found");
            return;
        }

        // Display weather data
        locationNotFound.style.display = "none";
        weatherBody.style.display = "flex";
        temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}°C`;
        description.innerHTML = weatherData.weather[0].description;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        windSpeed.innerHTML = `${weatherData.wind.speed} Km/H`;

        // Update weather image
        updateWeatherImage(weatherData.weather[0].main);

        console.log(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to retrieve weather data. Please try again later.");
    }
}

// Update weather image based on condition
function updateWeatherImage(condition) {
    const imageMap = {
        'Clouds': 'assets/cloud.png',
        'Clear': 'assets/clear.png',
        'Rain': 'assets/rain.png',
        'Mist': 'assets/mist.png',
        'Snow': 'assets/snow.png'
    };
    weatherImg.src = imageMap[condition] || 'assets/default.png';
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Fetch AQI based on user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchAQI, handleError);
} else {
    alert("Geolocation is not supported by this browser.");
}

async function fetchAQI(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '08ce0f8da445b4e094b41c23f6ca3875';
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const locationElement = document.getElementById('location');
    const aqiStatusElement = document.getElementById('aqi-status');

    if (locationElement) {
        locationElement.innerText = `Location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const aqi = data.list[0].main.aqi;
        displayAQI(aqi);
    } catch (error) {
        console.error('Error fetching AQI:', error);
        if (aqiStatusElement) {
            aqiStatusElement.innerText = "Failed to retrieve AQI data.";
        }
    }
}

// Display AQI with color coding
function displayAQI(aqi) {
    const aqiValue = document.getElementById('aqi-value');
    const aqiStatus = document.getElementById('aqi-status');
    const aqiBox = document.getElementById('aqi-box');

    if (aqiValue && aqiStatus && aqiBox) {
        aqiValue.innerText = aqi;
        const statusMap = ["Good", "Fair", "Moderate", "Poor", "Hazardous"];
        const classMap = ["good", "moderate", "unhealthy", "very-unhealthy", "hazardous"];

        aqiStatus.innerText = statusMap[aqi - 1] || "Unknown";
        aqiBox.className = `aqi-box ${classMap[aqi - 1] || 'unknown'}`;
    }
}

// Handle geolocation errors
function handleError(error) {
    const locationElement = document.getElementById('location');
    if (locationElement) {
        locationElement.innerText = "Unable to retrieve location.";
    }
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        default:
            alert("An unknown error occurred.");
    }
}