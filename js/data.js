// Ensure `newsData` is globally accessible or imported correctly
const featuredNews = {
    title: "24-HOUR PUBLIC WEATHER FORECAST",
    content: "This section shows realtime weather provided by PAGASA! A trustable source from the Weather Cooperatives in the Philippines, We will be also planning to partner with Windy soon! So stay tuned for the update!",
    image: "https://www.pagasa.dost.gov.ph/themes/hiraia/assets/images/learning_tools/how_a_weather_forecast_is_made/Total%20Precipitation%2023-28%20DEC%202016.gif",
    category: "PAGASA WEATHER FORECAST",
    timestamp: new Date().toLocaleDateString() // This will only display the date
};

// Function to fetch and parse RSS feed
async function fetchNews(url) {
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';

    const response = await fetch(proxyUrl + encodeURIComponent(url));
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.text();

    // Parse the RSS feed data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');

    const items = xmlDoc.querySelectorAll('item');
    return Array.from(items).map(item => ({
        title: item.querySelector('title')?.textContent || 'No title',
        content: item.querySelector('description')?.textContent || 'No description',
        image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
        link: item.querySelector('link')?.textContent || '#', // Ensure this is a link to the article, not the feed
        category: 'National News' // Default category or can be changed based on source
    }));
}

// Updated JavaScript to handle World News
async function updateNews() {
    try {
        // Fetch National News, Showbiz News, and World News
        const nationalNewsUrl = 'https://data.gmanetwork.com/gno/rss/news/feed.xml';
        const showbizNewsUrl = 'https://data.gmanetwork.com/gno/rss/showbiz/feed.xml';
        const worldNewsUrl = 'https://data.gmanetwork.com/gno/rss/news/world/feed.xml'; // Example World News feed

        const [nationalNews, showbizNews, worldNews] = await Promise.all([
            fetchNews(nationalNewsUrl),
            fetchNews(showbizNewsUrl),
            fetchNews(worldNewsUrl)
        ]);

        // Generate HTML for the latest news (first 6 from both National and Showbiz)
        const articlesGrid = document.getElementById('articles');
        articlesGrid.innerHTML = nationalNews.slice(0, 6).map(item => `
            <div class="article-card">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ''} <!-- Image -->
                <div class="content">
                    <span class="category">${item.category}</span> <!-- Category below the image -->
                    <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3> <!-- Title -->
                    <p class="contents">${item.content}</p>
                </div>
            </div>
        `).join('');

        // Generate HTML for the old news section (next 9 articles)
        const oldNewsGrid = document.getElementById('old-news');
        oldNewsGrid.innerHTML = nationalNews.slice(6, 12).map(item => `
            <div class="article-card">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ''} <!-- Image -->
                <div class="content">
                    <span class="category">${item.category}</span> <!-- Category below the image -->
                    <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3> <!-- Title -->
                    <p class="contents">${item.content}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching news:', error);
        const articlesGrid = document.getElementById('articles');
        articlesGrid.innerHTML = `<p>Error fetching news: ${error.message}</p>`;
    }
}

// Function to display featured news
function displayFeaturedNews() {
    const featuredSection = document.getElementById('featured');
    featuredSection.innerHTML = `
        <div class="featured-article-card">
            ${featuredNews.image ? `<img src="${featuredNews.image}" alt="${featuredNews.title}" />` : ''} <!-- Image -->
            <div class="content">
                <span class="category">${featuredNews.category}</span> <!-- Category below the image -->
                <h3 class="featured-title">${featuredNews.title}</h3> <!-- Title -->
                <p class="contents">${featuredNews.content}</p>
                <span class="timestamp">${featuredNews.timestamp}</span> <!-- Timestamp -->
            </div>
        </div>
    `;
}

function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let period = "AM";
    
    // Convert to 12-hour format with AM/PM
    if (hours >= 12) {
        period = "PM";
        if (hours > 12) {
            hours -= 12; // Convert to 12-hour format
        }
    } else if (hours === 0) {
        hours = 12; // Handle midnight case (00:00 becomes 12:00 AM)
    }
    
    // Ensure two digits for minutes and seconds
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    // Set the clock text
    clockElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
}

const countryRegionElement = document.getElementById('country-region');

// Check if geolocation is available
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Get the user's latitude and longitude
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Use IP-API to get country and region based on coordinates
            fetch(`https://ip-api.com/xml/?lat=${latitude}&lon=${longitude}&fields=country,regionName`)  // Changed to https
    .then(response => response.text())  // Use .text() to handle XML response
    .then(data => {
        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        const country = xmlDoc.getElementsByTagName("country")[0].textContent;
        const region = xmlDoc.getElementsByTagName("regionName")[0].textContent;

        // Display the country and region
        if (country && region) {
            countryRegionElement.textContent = `${country}, ${region}`;
        } else {
            countryRegionElement.textContent = 'Unknown Location';
        }
    })
    .catch(error => {
        console.error('Error fetching country and region data:', error);
        countryRegionElement.textContent = 'Error retrieving location';
    });

        },
        function(error) {
            // Handle location access denied or error
            if (error.code === error.PERMISSION_DENIED) {
                countryRegionElement.textContent = 'Location blocked'; // Show "Location blocked" if permission is denied
            } else {
                countryRegionElement.textContent = 'Error retrieving location'; // Handle other errors
            }
        }
    );
} else {
    // Fallback if geolocation is not available
    countryRegionElement.textContent = 'Geolocation not available';
}

// Update the news section when the page loads
window.addEventListener('DOMContentLoaded', () => {
    updateNews();
    displayFeaturedNews();
    updateClock();
});

setInterval(updateClock, 1000);
setInterval(updateNews, 300000);
