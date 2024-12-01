class DomUtils {
    static updateBreakingNews(text) {
        const breakingNewsElement = document.getElementById('breaking-news-text');
        breakingNewsElement.textContent = text;
    }

    static updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        dateElement.textContent = DateFormatter.getCurrentDate();
    }

    static setActiveNavLink(element) {
        document.querySelectorAll('.nav a').forEach(link => {
            link.classList.remove('active');
        });
        element.classList.add('active');
    }
}