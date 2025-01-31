async function updateShowbizNews() {
    try {
        const showbizNewsUrl = 'https://data.gmanetwork.com/gno/rss/showbiz/feed.xml';
        const showbizNews = await fetchNews(showbizNewsUrl);

        console.log("Fetched Showbiz News:", showbizNews);

        const limitedShowbizNews = showbizNews.slice(0, 10);

        const newsItems = limitedShowbizNews.map(item => ({
            title: item.title,
            image: item.image || 'https://via.placeholder.com/300x200?text=No+Image',
            link: item.link
        }));

        let currentIndex = 0;
        const track = document.getElementById('track');
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');

        track.innerHTML = "";

        // Add CSS for mobile responsiveness with improved image sizing
        const style = document.createElement('style');
        style.textContent = `
            .carousel-item {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.news-card {
    width: 100%;
    max-height: 400px; /* Keep a max height to prevent content overflow */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.news-card img {
    width: 100%;
    height: auto; /* Key change: Set height to auto */
    object-fit: cover;
    max-height: 200px; /* Set a maximum height for mobile images */
}

.news-content {
    padding: 10px;
    flex-grow: 1;
}

.news-titles {
    font-size: 16px;
    line-height: 1.4;
    margin-top: 8px;
}

#track {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

@media (min-width: 769px) {
    .carousel-item {
        flex: 0 0 33.33%;
        max-width: 33.33%;
    }

    .news-card img {
        max-height: 190px; /* Adjust max height for larger screens */
    }
}
        `;
        document.head.appendChild(style);

        function createItems() {
            newsItems.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'carousel-item';
                div.dataset.index = index;

                div.innerHTML = `
                    <div class="news-card">
                        <img width="300" height="150" src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x150?text=No+Image'" />
                        <div class="news-content">
                            <h2 class="news-titles"><a href="${item.link}" target="_blank">${item.title}</a></h2>
                        </div>
                    </div>
                `;
                track.appendChild(div);
            });

            setTimeout(() => {
                document.querySelectorAll('.news-card').forEach(card => {
                    card.classList.add('styled');
                });
            }, 100);
        }

        function updateCarousel(transition = true) {
            if (transition) {
                track.style.transition = 'transform 0.3s ease-in-out';
            } else {
                track.style.transition = 'none';
            }

            const viewportWidth = window.innerWidth;
            let translateValue;

            if (viewportWidth <= 768) {
                // Mobile: Show exactly 1 card at a time
                translateValue = currentIndex * -100;
            } else if (viewportWidth <= 1042) {
                translateValue = currentIndex * -33.33; // Show 3 cards
            } else {
                translateValue = currentIndex * -39; // Show 4 cards
            }

            track.style.transform = `translateX(${translateValue}%)`;
        }

        function nextSlide() {
            const maxIndex = window.innerWidth <= 768 ? newsItems.length - 1 : newsItems.length - 4;
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel(true);
        }

        function prevSlide() {
            const maxIndex = window.innerWidth <= 768 ? newsItems.length - 1 : newsItems.length - 4;
            if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateCarousel(true);
        }

        createItems();

        // Event listeners for navigation
        prevButton.addEventListener('click', () => {
            clearInterval(autoAdvance);
            prevSlide();
        });

        nextButton.addEventListener('click', () => {
            clearInterval(autoAdvance);
            nextSlide();
        });

        // Auto-advance carousel every 5 seconds
        const autoAdvance = setInterval(nextSlide, 5000);

        // Handle window resize
        window.addEventListener('resize', () => {
            currentIndex = 0; // Reset position on resize
            updateCarousel(false);
        });

    } catch (error) {
        console.error('Error fetching showbiz news:', error);
    }
}

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
    
    return Array.from(items).map(item => {
        const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
        const mediaThumbnail = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        const enclosure = item.querySelector('enclosure');
        
        let image = '';
        if (mediaContent && mediaContent.getAttribute('url')) {
            image = mediaContent.getAttribute('url');
        } else if (mediaThumbnail && mediaThumbnail.getAttribute('url')) {
            image = mediaThumbnail.getAttribute('url');
        } else if (enclosure && enclosure.getAttribute('url')) {
            image = enclosure.getAttribute('url');
        }
        
        if (!image) {
            const description = item.querySelector('description')?.textContent || '';
            const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
                image = imgMatch[1];
            }
        }
        
        return {
            title: item.querySelector('title')?.textContent || 'No title',
            content: item.querySelector('description')?.textContent || 'No description',
            image: image,
            link: item.querySelector('link')?.textContent || '#',
            category: 'Showbiz News'
        };
    });
}

// Initialize everything
function init() {
    setInterval(updateShowbizNews, 1800000); 
}

document.addEventListener("DOMContentLoaded", updateShowbizNews);
