const API_KEY = '045ac4f01f984ff68820a4943e6592bd';
const locationSelect = document.getElementById('locationSelect');
const selectedLocation = document.getElementById('selectedLocation');
const stormAlert = document.getElementById('stormAlert');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feelsLike');
const precipitation = document.getElementById('precipitation');
const forecastGrid = document.getElementById('forecastGrid');
const lastUpdated = document.getElementById('lastUpdated');
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');
const closeMenu = document.querySelector('.close-menu');
const newsGrid = document.getElementById('newsGrid');
const worldNewsGrid = document.getElementById('worldNewsGrid');
const localNewsItem = document.getElementById('localNewsItem');

// Burger menu handlers
burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
});
closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
});

// Utility Functions
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌕',
        '02d': '⛅', '02n': '⛅',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌧️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '❓';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Weather Update Function
async function updateWeather() {
    const location = locationSelect.value;
    if (!location) return;

    try {
        const weatherData = await fetchWeatherData(location);
        const forecastData = await fetchForecastData(location);

        selectedLocation.textContent = location;
        weatherIcon.textContent = getWeatherIcon(weatherData.weather[0].icon);
        temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;
        condition.textContent = capitalizeFirstLetter(weatherData.weather[0].description);
        humidity.textContent = `${weatherData.main.humidity}%`;
        wind.textContent = `${Math.round(weatherData.wind.speed * 3.6)} km/h`;
        feelsLike.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        precipitation.textContent = weatherData.rain ? `${weatherData.rain['1h']}mm` : '0mm';

        stormAlert.style.display = location === '#' ? 'flex' : 'none';

        const dailyForecasts = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 4);
        forecastGrid.innerHTML = dailyForecasts.map(day => `
            <div class="forecast-card">
                <div>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div>${getWeatherIcon(day.weather[0].icon)}</div>
                <div>${Math.round(day.main.temp)}°C</div>
                <div>${capitalizeFirstLetter(day.weather[0].description)}</div>
            </div>
        `).join('');
        
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    } catch (error) {
        console.error('Error updating weather:', error);
    }
}

// News Update Functions
async function updateNews() {
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
    const targetUrl = 'https://data.gmanetwork.com/gno/rss/news/feed.xml';

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.text();
        const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const newsItems = Array.from(items).slice(0, 9).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            content: item.querySelector('description')?.textContent || 'No description',
            image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
            link: item.querySelector('link')?.textContent || '#'
        }));
        newsGrid.innerHTML = newsItems.map(item => `
            <div class="news-item">
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating news:', error);
        newsGrid.innerHTML = `<p>Error loading news: ${error.message}</p>`;
    }
}

// World News Update
async function updateWorldNews() {
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
    const targetUrl = 'https://data.gmanetwork.com/gno/rss/news/world/feed.xml';

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.text();
        const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const newsItems = Array.from(items).slice(0, 9).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            content: item.querySelector('description')?.textContent || 'No description',
            image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
            link: item.querySelector('link')?.textContent || '#'
        }));
        worldNewsGrid.innerHTML = newsItems.map(item => `
            <div class="news-item">
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating world news:', error);
        worldNewsGrid.innerHTML = `<p>Error loading world news: ${error.message}</p>`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    locationSelect.addEventListener('change', updateWeather);
    updateWeather();
    updateNews();
    updateWorldNews();
    setInterval(updateWeather, 300000);
    setInterval(updateNews, 300000);
    setInterval(updateWorldNews, 300000);
});
