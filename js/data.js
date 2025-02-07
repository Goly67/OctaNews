// Ensure `newsData` is globally accessible or imported correctly
const featuredNews = {
    title: "PNP SURIGAO INVESTIGATION",
    content: "PNP Surigao <Strong>Investigating</Strong> the \"Kidnapping Incident\", they stated that there was <Strong>no tricycle seen at the CCTV</Strong>, they also stated that they can capture faces and detect even when wearing any obstructions on the face. Now people are wondering if the girl only made a story about it for \"Clout\". They are still investigating the current situation and we have to wait for more information.<br><br><br><Strong>RPN DXKS SURIGAO</Strong>",
    video: "https://www.facebook.com/RPNSurigao1080/videos/1180814840311370", //https://src.meteopilipinas.gov.ph/repo/himawari/24hour/irsml/1irsml.gif
    category: "Local surigaonon news",
    timestamp: new Date().toLocaleDateString() // This will only display the date
};

// Country code to full name mapping
const countryNameMap = {
    "PH": "Philippines",
    "US": "United States",
    "GB": "United Kingdom",
    "CA": "Canada",
    "AU": "Australia",
    "IN": "India",
    "FR": "France",
    "DE": "Germany",
    // Add more country codes as needed
};

// Function to fetch news
async function fetchNews(url) {
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
    const response = await fetch(proxyUrl + encodeURIComponent(url));
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    return Array.from(items).map(item => ({
        title: item.querySelector('title')?.textContent || 'No title',
        content: item.querySelector('description')?.textContent || 'No description',
        image: item.querySelector('media\\:thumbnail')?.getAttribute('url') || '',
        link: item.querySelector('link')?.textContent || '#',
        category: 'National News'
    }));
}

// Updated JavaScript to handle World News
async function updateNews() {
    try {
        const nationalNewsUrl = 'https://data.gmanetwork.com/gno/rss/news/feed.xml';
        const showbizNewsUrl = 'https://data.gmanetwork.com/gno/rss/showbiz/feed.xml';
        const worldNewsUrl = 'https://data.gmanetwork.com/gno/rss/news/world/feed.xml';

        const [nationalNews, showbizNews, worldNews] = await Promise.all([
            fetchNews(nationalNewsUrl),
            fetchNews(showbizNewsUrl),
            fetchNews(worldNewsUrl)
        ]);

        console.log("Fetched National News:", nationalNews);
        console.log("Fetched World News:", worldNews);
        console.log("Fetched World News:", showbizNews);

        // ** Ensure national news only contains national articles **
        const filteredNationalNews = nationalNews.filter(item => !item.link.includes('/world/'));

        console.log("Filtered National News:", filteredNationalNews);

        const articlesGrid = document.getElementById('articles');
        articlesGrid.innerHTML = filteredNationalNews.slice(0, 6).map(item => `
            <div class="article-card">
                <div class="content">
                    <span class="category">National News</span>
                    <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="contents">${item.content}</p>
                </div>
            </div>
        `).join('');

        const worldNewsGrid = document.getElementById('world-news');
        worldNewsGrid.innerHTML = worldNews.slice(0, 6).map(item => `
            <div class="article-card">
                <div class="content">
                    <span class="category">World News</span>
                    <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="contents">${item.content}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Add featured article section
function renderFeaturedNews() {
    const featuredContainer = document.getElementById('featured');
    const featuredArticleHTML = `
        <div class="featured-article-card">
                <iframe class="video-container" src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(featuredNews.video)}"
                            width="500" height="700" style="border-radius:20px;border:none;overflow:hidden"
                            scrolling="no" frameborder="0" allowfullscreen="true">
                </iframe>
            <div class="content">
                <span class="category">${featuredNews.category}</span>
                <h2>${featuredNews.title}</h2>
                <p>${featuredNews.content}</p>
                <span class="timestamp">${featuredNews.timestamp}</span>
            </div>
        </div>
    `;
    featuredContainer.innerHTML = featuredArticleHTML;
}

// Set country and region info
function renderCountryAndRegion() {
    const countryCode = "PH"; // You can change this dynamically if needed
    const countryName = countryNameMap[countryCode] || "Unknown";
    const countryRegionContainer = document.getElementById('country-region');
    countryRegionContainer.textContent = countryName;
}

// Update the news section when the page loads
window.addEventListener('DOMContentLoaded', () => {
    updateNews();
    displayFeaturedNews();
});

setInterval(updateNews, 300000);

// Initialize everything
function init() {
    renderFeaturedNews();
    renderCountryAndRegion();
    updateNews();
    setInterval(updateNews, 3600000); // Update news every hour
}

init();
