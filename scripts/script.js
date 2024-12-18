window.onload = function() {
    window.location.href = "https://goly67.github.io/OctaNewsWeb/";
};

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

burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
});

async function fetchWeatherData(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}

async function fetchForecastData(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '☀️', // Changed '01n' to show sun emoji
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

async function updateWeather() {
    const location = locationSelect.value;
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

    if (location === '#') {
        stormAlert.innerHTML = '<span>⚠️ </span> <em><strong><span style="color: red;"> SIGNAL NO. 2</span></strong></em>';
        stormAlert.style.display = 'flex';
    } else {
        stormAlert.style.display = 'none';
    }

    const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 4);
    forecastGrid.innerHTML = dailyForecasts.map(day => `
        <div class="forecast-card">
            <div class="font-medium">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="text-xl">${getWeatherIcon(day.weather[0].icon)}</div>
            <div class="text-xl font-bold">${Math.round(day.main.temp)}°C</div>
            <div class="text-sm">${capitalizeFirstLetter(day.weather[0].description)}</div>
        </div>
    `).join('');

    lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
}
        async function updateNews() {
            const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
            const targetUrl = 'https://data.gmanetwork.com/gno/rss/news/feed.xml'; // https://www.inquirer.net/rss

            try {
                const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.text();

                // Parse the RSS feed data
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'text/xml');

        const items = xmlDoc.querySelectorAll('item');

        const newsItems = Array.from(items).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            content: item.querySelector('description')?.textContent || 'No description',
            image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
            link: item.querySelector('link')?.textContent || '#'
        }));

        // Limit to the first 6 news items
        const limitedNewsItems = newsItems.slice(0, 9);

    // Generate HTML for the news items
    newsGrid.innerHTML = limitedNewsItems.map((item, index) => `
  <div class="news-item">
    ${item.image ? `<div class="news-item-image-container"><img src="${item.image}" alt="${item.title}" class="news-item-image"></div>` : ''}
    <div class="news-item-content">
      <h3>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-item-link">${item.title}</a>
      </h3>
      <p>${item.content}</p>
    </div>
  </div>
`).join('');

    } catch (error) {
        console.error('Error fetching news:', error);
        newsGrid.innerHTML = `<p>Error fetching news: ${error.message}</p>`;
    }

    // Hide the loading animation after the news items are loaded
    const loadingAnimation = document.querySelector('.loading-animation');
    loadingAnimation.style.display = 'none';
}


locationSelect.addEventListener('change', updateWeather);

// Initial update
updateWeather();
updateNews();

// Auto-refresh every 5 minutes
setInterval(updateWeather, 300000);
setInterval(updateNews, 300000);
    
document.addEventListener('DOMContentLoaded', function () {
    const notification = document.getElementById('app-notification');
    const dismissButton = document.getElementById('dismiss-notification');

    // Show the notification after 1 second
    setTimeout(function () {
        notification.classList.remove('hidden');
    }, 1000);

    // Set timeout to automatically hide the notification after 5 minutes
    const autoDismiss = setTimeout(function () {
        notification.classList.add('hidden');
        // Remove from the DOM after hiding it
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 300000); // 5 minutes (300,000 milliseconds)

    // Dismiss notification on button click
    dismissButton.addEventListener('click', function () {
        notification.classList.add('hidden');
        // Cancel the auto-dismiss timeout
        clearTimeout(autoDismiss);
        // Remove the notification from the DOM after hiding it
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const localNewsItem = document.getElementById('localNewsItem');

    // Define your single news item here
    const newsItem = {
        title: "Windy weather map available",
        content: "You can now see the map via Windy! a trusted source of mine that tracked the typhoon Odette back in 2021.",
        iframeSrc: "https://www.windy.com/?9.243,125.969,6,m:dVsajzk", // Replace with the actual iframe source you need
        date: "2024-10-26"
    };

    function createNewsItem(item) {
        localNewsItem.innerHTML = `
            <div class="local-news-item-content">
                <h3>${item.title}</h3>
                <iframe 
                    class="windy-iframe" 
                    width="100%" 
                    height="450" 
                    src="https://embed.windy.com/embed2.html?lat=9.243&lon=125.969&zoom=6&level=surface&overlay=rain&menu=&message=true&marker=&calendar=&pressure=true&type=map&location=coordinates&detail=&detailLat=9.243&detailLon=125.969&metricWind=km/h&metricTemp=%C2%B0C&radarRange=-1"
                    frameborder="0">
                </iframe>
                <p>${item.content}</p>
                <p class="date">${item.date}</p>
            </div>
        `;
    }
    
    

    createNewsItem(newsItem);
});

const worldNewsGrid = document.getElementById('worldNewsGrid');

async function updateWorldNews() {
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
    const targetUrl = 'https://data.gmanetwork.com/gno/rss/news/world/feed.xml'; // World News RSS feed

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.text();

        // Parse the RSS feed data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');

        const items = xmlDoc.querySelectorAll('item');

        const newsItems = Array.from(items).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            content: item.querySelector('description')?.textContent || 'No description',
            image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
            link: item.querySelector('link')?.textContent || '#'
        }));

        // Limit to the first 6 news items
        const limitedNewsItems = newsItems.slice(0, 9);

        // Generate HTML for the world news items
        const worldNewsGrid = document.getElementById('worldNewsGrid'); // Make sure to add this ID in your HTML
        worldNewsGrid.innerHTML = limitedNewsItems.map(item => `
            <div class="news-item">
                ${item.image ? `<div class="news-item-image-container"><img src="${item.image}" alt="${item.title}" class="news-item-image"></div>` : ''}
                <div class="news-item-content">
                    <h3>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-item-link">${item.title}</a>
                    </h3>
                    <p>${item.content}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching world news:', error);
        worldNewsGrid.innerHTML = `<p>Error fetching world news: ${error.message}</p>`;
    }
}

window.addEventListener('resize', () => {
    const iframe = document.querySelector('.windy-iframe iframe');
    if (window.innerWidth < 768) {
        iframe.style.height = '300px';  // Adjust height for mobile
    } else {
        iframe.style.height = '400px';  // Desktop fallback
    }
});

function reloadIframe() {
    const iframe = document.querySelector('.windy-iframe-container iframe');
    iframe.src = iframe.src; // Reload the iframe
}

const iframe = document.querySelector('.windy-iframe');
iframe.onerror = function() {
    console.error('Error loading Windy iframe');
    // Optionally, you can provide a fallback or retry logic here
};



// Call the updateWorldNews function alongside the existing updateNews function
updateNews();
updateWorldNews();

// Auto-refresh world news every 5 minutes
setInterval(updateWorldNews, 300000);
