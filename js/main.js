document.addEventListener('DOMContentLoaded', () => {
    // Initialize current date and breaking news
    DomUtils.updateCurrentDate();
    DomUtils.updateBreakingNews(newsData.featured.title);

    // Initial render
    ArticleRenderer.renderFeaturedArticle(newsData.featured);
    ArticleRenderer.renderArticles(newsData.articles);
});