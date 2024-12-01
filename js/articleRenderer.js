class ArticleRenderer {
    static renderFeaturedArticle(article) {
        const featured = document.getElementById('featured');
        featured.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div class="content">
                <span class="category">${article.category}</span>
                <h2>${article.title}</h2>
                <p>${article.content}</p>
                <div class="timestamp">${DateFormatter.formatArticleDate(article.timestamp)}</div>
            </div>
        `;
    }

    static renderArticle(article) {
        return `
            <article class="article-card">
                <img src="${article.image}" alt="${article.title}">
                <div class="content">
                    <span class="category">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <div class="timestamp">${DateFormatter.formatArticleDate(article.timestamp)}</div>
                </div>
            </article>
        `;
    }

    static renderTrendingArticle(article, index) {
        return `
            <div class="trending-item">
                <img src="${article.image}" alt="${article.title}">
                <div class="content">
                    <h4>${article.title}</h4>
                    <div class="meta">
                        <span>${article.category}</span>
                        <span>${DateFormatter.formatArticleDate(article.timestamp)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    static renderArticles(articles) {
        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = articles
            .map(article => this.renderArticle(article))
            .join('');

        const trendingContainer = document.getElementById('trending');
        trendingContainer.innerHTML = articles
            .slice(0, 3)
            .map((article, index) => this.renderTrendingArticle(article, index))
            .join('');
    }
}