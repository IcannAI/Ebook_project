// ========== 全域變數 ==========
let allBooks = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let currentFilter = null; // { type: 'all' | 'subcategory', id: null | subcategoryId }

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
    initializeHeader();       // 導覽列按鈕 & 登入狀態
    initializeBanner();       // Swiper 輪播
    await loadInitialData();  // 載入分類與書籍
    updateCartBadge();        // 購物車數量
});

// ========== Header 導覽功能 ==========
function initializeHeader() {
    const memberAccount = localStorage.getItem('memberAccount');
    const loginBtn = document.getElementById('loginBtn');

    // 顯示登入使用者帳號（如果已登入）
    if (loginBtn && memberAccount) {
        loginBtn.textContent = `登出 (${memberAccount})`;
        loginBtn.addEventListener('click', handleLogout);
    } else if (loginBtn) {
        loginBtn.textContent = '登入';
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // 個人資料
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            if (isUserLoggedIn()) {
                window.location.href = 'user-profile.html';
            } else {
                showToast('請先登入');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        });
    }

    // 配送地址
    const addressBtn = document.getElementById('addressBtn');
    if (addressBtn) {
        addressBtn.addEventListener('click', () => {
            if (isUserLoggedIn()) {
                window.location.href = 'shipping-address.html';
            } else {
                showToast('請先登入');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        });
    }

    // 購物車
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (isUserLoggedIn()) {
                window.location.href = 'cart.html';
            } else {
                showToast('請先登入');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        });
    }

    // 我的訂單
    const ordersBtn = document.getElementById('ordersBtn');
    if (ordersBtn) {
        ordersBtn.addEventListener('click', () => {
            if (isUserLoggedIn()) {
                window.location.href = 'order-list.html';
            } else {
                showToast('請先登入');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        });
    }
}

// ========== 檢查登入狀態 ==========
function isUserLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// ========== 登入功能 ==========
async function loginUser() {
    const account = document.getElementById('account')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!account || !password) {
        showToast("請輸入帳號和密碼！");
        return;
    }

    try {
        // 登入 API
        const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account, password })
        });

        if (!loginRes.ok) throw new Error("登入失敗");

        const loginData = await loginRes.json();
        const token = loginData.token;

        // 存 token
        localStorage.setItem("authToken", token);

        // 立即呼叫 /api/auth/who 獲取使用者資訊
        const userRes = await fetch("/api/auth/who", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error("獲取使用者資訊失敗");

        const userData = await userRes.json();
        localStorage.setItem("memberAccount", userData.account);
        localStorage.setItem("memberName", userData.name);
        localStorage.setItem("memberId", userData.id);

        showToast("登入成功！");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error(error);
        showToast("登入失敗，請檢查帳號密碼");
    }
}

// ========== 登出 ==========
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('memberAccount');
        localStorage.removeItem('memberName');
        localStorage.removeItem('memberId');
        showToast('已登出');
        setTimeout(() => window.location.reload(), 1000);
    }
}

// ========== Swiper 輪播初始化 ==========
function initializeBanner() {
    const swiper = new Swiper('.bannerSwiper', {
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 800
    });
}

// ========== 載入初始資料 ==========
async function loadInitialData() {
    showLoading(true);
    try {
        const [categoryTree, books, recommendedBooks] = await Promise.all([
            fetchCategoryTree(),
            fetchAllBooks(),
            fetchRecommendedBooks()
        ]);

        allBooks = books;
        renderCategoryTree(categoryTree);
        renderRecommendedBooks(recommendedBooks);
        renderAllBooks(1);

    } catch (error) {
        console.error('Error loading initial data:', error);
        showToast('載入資料失敗');
    } finally {
        showLoading(false);
    }
}

// ========== 分類樹渲染 ==========
function renderCategoryTree(categoryTree) {
    const container = document.getElementById('categoryTree');
    if (!container) return;
    container.innerHTML = '';
    categoryTree.forEach((category, index) => {
        container.appendChild(createCategoryItem(category, index));
    });
}

function createCategoryItem(category, index) {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.style.animationDelay = `${index * 0.05}s`;

    const categoryMain = document.createElement('div');
    categoryMain.className = 'category-main';
    categoryMain.innerHTML = `<span class="category-name">${category.name}</span><span class="category-toggle">▸</span>`;

    const subcategoryList = document.createElement('div');
    subcategoryList.className = 'subcategory-list';

    if (category.subCategories?.length) {
        category.subCategories.forEach(sub => {
            const item = document.createElement('div');
            item.className = 'subcategory-item';
            item.textContent = sub.name;
            item.dataset.subcategoryId = sub.id;
            item.addEventListener('click', e => {
                e.stopPropagation();
                handleSubcategoryClick(sub.id, sub.name);
            });
            subcategoryList.appendChild(item);
        });
    }

    categoryMain.addEventListener('click', () => {
        const expanded = categoryMain.classList.contains('active');
        document.querySelectorAll('.category-main').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.subcategory-list').forEach(x => x.classList.remove('expanded'));
        if (!expanded) {
            categoryMain.classList.add('active');
            subcategoryList.classList.add('expanded');
        }
    });

    categoryItem.appendChild(categoryMain);
    categoryItem.appendChild(subcategoryList);
    return categoryItem;
}

// ========== 子分類點擊 ==========
async function handleSubcategoryClick(subcategoryId, subcategoryName) {
    showLoading(true);
    try {
        document.querySelectorAll('.subcategory-item').forEach(x => x.classList.remove('active'));
        document.querySelector(`[data-subcategory-id="${subcategoryId}"]`)?.classList.add('active');

        const books = await fetchBooksBySubcategory(subcategoryId);
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) sectionTitle.textContent = subcategoryName;

        currentFilter = { type: 'subcategory', id: subcategoryId, books };
        currentPage = 1;
        renderFilteredBooks(books, 1);

        document.querySelector('.all-books-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error(error);
        showToast('載入分類書籍失敗');
    } finally {
        showLoading(false);
    }
}

// ========== 推薦書籍 ==========
function renderRecommendedBooks(books) {
    const container = document.getElementById('recommendedBooks');
    if (!container) return;
    container.innerHTML = '';
    books.slice(0, 3).forEach((book, index) => container.appendChild(createBookCard(book, index)));
}

// ========== 全部書籍 ==========
function renderAllBooks(page) {
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) sectionTitle.textContent = '全部書籍';

    document.querySelectorAll('.subcategory-item').forEach(x => x.classList.remove('active'));
    currentFilter = { type: 'all', id: null };
    currentPage = page;
    renderFilteredBooks(allBooks, page);
}

function renderFilteredBooks(books, page) {
    const container = document.getElementById('allBooks');
    if (!container) return;

    container.innerHTML = '';
    const paginatedBooks = paginateData(books, page, ITEMS_PER_PAGE);

    if (!paginatedBooks.length) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color: var(--text-muted);"><p>此分類暫無書籍</p></div>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    paginatedBooks.forEach((book, index) => container.appendChild(createBookCard(book, index)));

    const totalPages = getTotalPages(books.length, ITEMS_PER_PAGE);
    createPaginationButtons(page, totalPages, newPage => {
        if (currentFilter.type === 'all') renderAllBooks(newPage);
        else {
            currentPage = newPage;
            renderFilteredBooks(currentFilter.books, newPage);
        }
        scrollToTop();
    });
}

// ========== 分頁滾動 ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 登入頁面按鈕綁定 ==========
document.addEventListener('DOMContentLoaded', () => {
    const loginPageBtn = document.getElementById('loginPageBtn'); // login.html 的登入按鈕
    if (loginPageBtn) {
        loginPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginUser();
        });

        // 支援 Enter 鍵登入
        const accountInput = document.getElementById('account');
        const passwordInput = document.getElementById('password');
        if (accountInput && passwordInput) {
            [accountInput, passwordInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') loginUser();
                });
            });
        }
    }
});
