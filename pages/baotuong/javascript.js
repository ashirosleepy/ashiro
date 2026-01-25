document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Cập nhật favicon và thông tin chỉnh sửa lần cuối
    if (!document.getElementById('currentDate')) {
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

    // 2. Xử lý Form bình luận
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');

    if(commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;

            if (name && message) {
                const newComment = document.createElement('div');
                newComment.classList.add('comment-item');
                // Thêm hiệu ứng slide-in cho bình luận mới
                newComment.style.animation = "slideDown 0.5s ease"; 
                
                const time = new Date().toLocaleTimeString('vi-VN');
                newComment.innerHTML = `<strong>${name}</strong> <small>(${time})</small><br><span>${message}</span>`;
                
                commentList.prepend(newComment);
                commentForm.reset();
            }
        });
    }

    // --- PHẦN MỚI: HIỆU ỨNG CUỘN TRANG (SCROLL REVEAL) ---
    
    // Bước 1: Chọn tất cả các phần tử muốn tạo hiệu ứng
    // Ở đây ta chọn các khối section-box và các thẻ card bài viết
    const reveals = document.querySelectorAll('.section-box, .card, .gallery-grid img');

    // Bước 2: Thêm class 'reveal' vào các phần tử này ngay khi tải trang
    reveals.forEach(element => {
        element.classList.add('reveal');
    });

    // Bước 3: Tạo "Người quan sát"
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Nếu phần tử xuất hiện trong màn hình
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Thêm class kích hoạt animation
                observer.unobserve(entry.target); // Chỉ chạy 1 lần rồi thôi (đỡ lag)
            }
        });
    }, {
        threshold: 0.1 // Chỉ cần hiện 10% là bắt đầu chạy hiệu ứng
    });

    // Bước 4: Bắt đầu quan sát
    reveals.forEach(element => {
        observer.observe(element);
    });
});