// ========== 全域變數 ==========
let allBooks = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let currentFilter = null; // { type: 'all' | 'subcategory', id: null | subcategoryId }

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
    initializeHeader();
    initializeBanner();
    await loadInitialData();
    updateCartBadge();
});

// ========== Header 導覽功能 ==========
function initializeHeader() {
    // 個人資料
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            if (isUserLoggedIn()) {
                window.location.href = 'profile.html';
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
                window.location.href = 'address.html';
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
                window.location.href = 'orders.html';
            } else {
                showToast('請先登入');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        });
    }
    
    // 登入按鈕
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        if (isUserLoggedIn()) {
            loginBtn.textContent = '登出';
            loginBtn.addEventListener('click', handleLogout);
        } else {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }

    
    //核心登入頁

function loginUser() {
    const account = $("#account").val().trim();
    const password = $("#password").val();
    if (!account || !password) {
        showAlert("請輸入帳號和密碼！", "error");
        return;
    }

    $.ajax({
        url: "/api/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ account, password })
    })
    .done(response => {
        showAlert("登入成功！", "success");
        localStorage.setItem("authToken", response.token);
        sessionStorage

    // 前端 fetch 範例
    fetch('http://localhost:8080/api/auth/login', { // 必須完整路徑
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account: 'your_acc', password: 'your_password' })
    })

    //補足 isUserLoggedIn 邏輯
    function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
    }

    //對齊 /who 介面呼叫
    async function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:8080/api/auth/who', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
            handleLogout(); // Token 過期
        }
        const userData = await response.json();
        console.log("當前使用者:", userData);
    } catch (error) {
        console.error("驗證失敗", error);
    }
}
}

/**
 * 處理登出
 */
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        showToast('已登出');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// ========== Swiper 輪播初始化 ==========
function initializeBanner() {
    const swiper = new Swiper('.bannerSwiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800
    });
}

// ========== 載入初始資料 ==========
async function loadInitialData() {
    showLoading(true);
    
    try {
        // 並行載入所有資料
        const [categoryTree, books, recommendedBooks] = await Promise.all([
            fetchCategoryTree(),
            fetchAllBooks(),
            fetchRecommendedBooks()
        ]);
        
        allBooks = books;
        
        // 渲染分類樹
        renderCategoryTree(categoryTree);
        
        // 渲染推薦書籍
        renderRecommendedBooks(recommendedBooks);
        
        // 渲染全部書籍（第一頁）
        currentFilter = { type: 'all', id: null };
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
    const categoryTreeContainer = document.getElementById('categoryTree');
    if (!categoryTreeContainer) return;
    
    categoryTreeContainer.innerHTML = '';
    
    categoryTree.forEach((category, index) => {
        const categoryItem = createCategoryItem(category, index);
        categoryTreeContainer.appendChild(categoryItem);
    });
}

/**
 * 建立分類項目
 */
function createCategoryItem(category, index) {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.style.animationDelay = `${index * 0.05}s`;
    
    // 主分類
    const categoryMain = document.createElement('div');
    categoryMain.className = 'category-main';
    categoryMain.innerHTML = `
        <span class="category-name">${category.name}</span>
        <span class="category-toggle">▸</span>
    `;
    
    // 子分類列表
    const subcategoryList = document.createElement('div');
    subcategoryList.className = 'subcategory-list';
    
    if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach((subcategory) => {
            const subcategoryItem = document.createElement('div');
            subcategoryItem.className = 'subcategory-item';
            subcategoryItem.textContent = subcategory.name;
            subcategoryItem.dataset.subcategoryId = subcategory.id;
            
            // 點擊子分類顯示該分類的書籍
            subcategoryItem.addEventListener('click', (e) => {
                e.stopPropagation();
                handleSubcategoryClick(subcategory.id, subcategory.name);
            });
            
            subcategoryList.appendChild(subcategoryItem);
        });
    }
    
    // 主分類點擊展開/收合
    categoryMain.addEventListener('click', () => {
        const isExpanded = categoryMain.classList.contains('active');
        
        // 關閉所有其他分類
        document.querySelectorAll('.category-main').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.subcategory-list').forEach(list => {
            list.classList.remove('expanded');
        });
        
        if (!isExpanded) {
            categoryMain.classList.add('active');
            subcategoryList.classList.add('expanded');
        }
    });
    
    categoryItem.appendChild(categoryMain);
    categoryItem.appendChild(subcategoryList);
    
    return categoryItem;
}

/**
 * 處理子分類點擊
 */
async function handleSubcategoryClick(subcategoryId, subcategoryName) {
    showLoading(true);
    
    try {
        // 更新子分類選中狀態
        document.querySelectorAll('.subcategory-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-subcategory-id="${subcategoryId}"]`)?.classList.add('active');
        
        // 獲取該子分類的書籍
        const books = await fetchBooksBySubcategory(subcategoryId);
        
        // 更新標題
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) {
            sectionTitle.textContent = `${subcategoryName}`;
        }
        
        // 更新當前過濾器
        currentFilter = { type: 'subcategory', id: subcategoryId, books: books };
        currentPage = 1;
        
        // 渲染書籍
        renderFilteredBooks(books, 1);
        
        // 平滑滾動到書籍區
        document.querySelector('.all-books-section')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
    } catch (error) {
        console.error('Error fetching subcategory books:', error);
        showToast('載入分類書籍失敗');
    } finally {
        showLoading(false);
    }
}

// ========== 推薦書籍渲染 ==========
function renderRecommendedBooks(books) {
    const recommendedContainer = document.getElementById('recommendedBooks');
    if (!recommendedContainer) return;
    
    recommendedContainer.innerHTML = '';
    
    // 最多顯示 3 本
    const displayBooks = books.slice(0, 3);
    
    displayBooks.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        recommendedContainer.appendChild(bookCard);
    });
}

// ========== 全部書籍渲染 ==========
function renderAllBooks(page) {
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) {
        sectionTitle.textContent = '全部書籍';
    }
    
    // 清除子分類選中狀態
    document.querySelectorAll('.subcategory-item').forEach(item => {
        item.classList.remove('active');
    });
    
    currentFilter = { type: 'all', id: null };
    currentPage = page;
    
    renderFilteredBooks(allBooks, page);
}

/**
 * 渲染過濾後的書籍
 */
function renderFilteredBooks(books, page) {
    const allBooksContainer = document.getElementById('allBooks');
    if (!allBooksContainer) return;
    
    allBooksContainer.innerHTML = '';
    
    // 分頁處理
    const paginatedBooks = paginateData(books, page, ITEMS_PER_PAGE);
    
    if (paginatedBooks.length === 0) {
        allBooksContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem;">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <p style="font-size: 1.2rem;">此分類暫無書籍</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    paginatedBooks.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        allBooksContainer.appendChild(bookCard);
    });
    
    // 渲染分頁按鈕
    const totalPages = getTotalPages(books.length, ITEMS_PER_PAGE);
    createPaginationButtons(page, totalPages, (newPage) => {
        if (currentFilter.type === 'all') {
            renderAllBooks(newPage);
        } else {
            currentPage = newPage;
            renderFilteredBooks(currentFilter.books, newPage);
        }
        
        // 滾動到頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== 平滑滾動到頁面頂部（供分頁使用）==========
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
