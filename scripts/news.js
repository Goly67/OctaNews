window.onload = function() {
    window.location.href = "https://goly67.github.io/OctaNewsWeb/";
};

const newsGrid = document.getElementById('newsGrid');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

async function updateNews() {
    showLoading(true);
    hideError();
    const proxyUrl = 'https://octa-news-gma.glitch.me/proxy?url=';
    const targetUrl = 'https://data.gmanetwork.com/gno/rss/news/feed.xml';

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');

        const newsItems = Array.from(items)
            .map(item => ({
                title: item.querySelector('title')?.textContent || 'No title',
                content: item.querySelector('description')?.textContent || 'No description',
                image: item.querySelector('link[rel="image_src"]')?.getAttribute('href') || '/placeholder.svg?height=200&width=300',
                link: item.querySelector('link')?.textContent || '#',
                pubDate: item.querySelector('pubDate')?.textContent || '',
                category: item.querySelector('category')?.textContent || 'News'
            }))
            .slice(0, 6);

        renderNewsItems(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Failed to fetch news. Please try again later.');
    } finally {
        showLoading(false);
    }
}

function renderNewsItems(newsItems) {
    newsGrid.innerHTML = newsItems.map((item, index) => `
        <div class="news-item">
            <img src="${item.image}" alt="${item.title}" class="news-item-image">
            <div class="news-item-content">
                <h3>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-item-link">${item.title}</a>
                </h3>
                <p>${item.content}</p>
            </div>
            <div class="news-item-footer">
                <span>${item.category}</span>
                <span>${new Date(item.pubDate).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

function showLoading(isLoading) {
    loadingElement.style.display = isLoading ? 'flex' : 'none';
    newsGrid.style.display = isLoading ? 'none' : 'grid';
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    newsGrid.style.display = 'none';
}

function hideError() {
    errorElement.style.display = 'none';
}

// Initial update
updateNews();

// Auto-refresh every 5 minutes
setInterval(updateNews, 300000);
