function showPage(pageId) {
    // 1. Ẩn tất cả các trang
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. Hiện trang được chọn
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

// script.js - Global script to set favicon for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Inject favicon if not already present
    if (!document.querySelector('link[rel="icon"]')) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = '/avatar.png';  // Path from root
        link.type = 'image/png';
        document.head.appendChild(link);
    }

    // Optional: Add last updated script if not present
    if (!document.getElementById('last-updated-script')) {
        const script = document.createElement('script');
        script.id = 'last-updated-script';
        script.innerHTML = `
            const path = window.location.pathname.split('/').pop() || 'index.html';
            fetch('https://api.github.com/repos/ashirosleepy/ashiro/commits?path=' + path + '&per_page=1')
                .then(response => response.json())
                .then(data => {
                    const p = document.getElementById('last-updated');
                    if (p && data.length > 0) {
                        const date = new Date(data[0].commit.committer.date);
                        p.innerText = 'Chỉnh sửa lần cuối: ' + date.toLocaleString('vi-VN');
                    }
                })
                .catch(() => {
                    const p = document.getElementById('last-updated');
                    if (p) p.innerText = 'Lỗi khi tải thông tin chỉnh sửa.';
                });
        `;
        document.body.appendChild(script);
    }
});