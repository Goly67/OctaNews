document.addEventListener('DOMContentLoaded', () => {
    // Initialize current date and breaking news
    DomUtils.updateCurrentDate();
    DomUtils.updateBreakingNews(newsData.featured.title);

    // Initial render
    ArticleRenderer.renderFeaturedArticle(newsData.featured);
    ArticleRenderer.renderArticles(newsData.articles);
});

window.onload = function() {
    // Wait a little bit before scrolling to the top to ensure page is fully loaded
    setTimeout(function() {
        window.scrollTo(0, 0); // Scroll to the top
    }, 50); // Small delay before scrolling to the top

    // Disable scrolling initially
    document.documentElement.style.overflow = 'hidden'; // Apply to html
    document.body.style.overflow = 'hidden'; // Apply to body
    
    // Show loading screen for 10 seconds
    setTimeout(function() {
        // Hide the loading screen after 10 seconds
        document.getElementById('loading-screen').classList.add('hidden');
        
        // Additional delay before enabling scrolling (e.g., 2 more seconds)
        setTimeout(function() {
            // Allow scrolling after additional delay
            document.documentElement.style.overflow = 'auto'; // Allow scrolling on html
        }, 1000); // Delay before allowing scrolling (2 seconds)
    }, 1000); // 10 seconds delay for the loading screen
};