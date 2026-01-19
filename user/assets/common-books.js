// ========== 共用配置 ==========
const API_BASE_URL = 'http://localhost:8080/api';

// ========== 工具函數 ==========
/**
 * 顯示 Toast 通知
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

/**
 * 顯示/隱藏載入指示器
 */
function showLoading(show = true) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }
}

/**
 * 檢查使用者是否已登入
 */
function isUserLoggedIn() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
}

/**
 * 格式化價格
 */
function formatPrice(price) {
    return `NT$ ${price.toLocaleString()}`;
}

/**
 * 生成書籍圖片路徑
 */
function getBookImagePath(bookId) {
    return `images/books/${bookId}.png`;
}

/**
 * 處理圖片載入錯誤
 */
function handleImageError(img) {
    img.src = 'images/books/default.png'; // 預設圖片
    img.onerror = null; // 防止無限循環
}

// ========== API 呼叫函數 ==========

/**
 * 獲取完整分類樹（包含主分類、子分類和書籍）
 */
async function fetchCategoryTree() {
    try {
        const response = await fetch(`${API_BASE_URL}/tree`);
        if (!response.ok) {
            throw new Error('Failed to fetch category tree');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching category tree:', error);
        showToast('載入分類失敗');
        return [];
    }
}

/**
 * 獲取所有書籍
 */
async function fetchAllBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching books:', error);
        showToast('載入書籍失敗');
        return [];
    }
}

/**
 * 獲取推薦書籍
 */
async function fetchRecommendedBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books/recommended`);
        if (!response.ok) {
            throw new Error('Failed to fetch recommended books');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommended books:', error);
        showToast('載入推薦書籍失敗');
        return [];
    }
}

/**
 * 根據子分類 ID 獲取書籍
 */
async function fetchBooksBySubcategory(subcategoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/subcategory/${subcategoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch books by subcategory');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching books by subcategory:', error);
        showToast('載入分類書籍失敗');
        return [];
    }
}

/**
 * 獲取單一書籍詳情
 */
async function fetchBookById(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch book');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book:', error);
        showToast('載入書籍詳情失敗');
        return null;
    }
}

// ========== 購物車相關函數 ==========

/**
 * 加入購物車
 */
async function addToCart(bookId, quantity = 1) {
    // 檢查是否登入
    if (!isUserLoggedIn()) {
        showToast('請先登入才能加入購物車');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                bookId: bookId,
                quantity: quantity
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add to cart');
        }
        
        const result = await response.json();
        showToast('已加入購物車');
        updateCartBadge();
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('加入購物車失敗');
        return false;
    }
}

/**
 * 獲取購物車商品數量
 */
async function getCartCount() {
    if (!isUserLoggedIn()) {
        return 0;
    }
    
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cartItems = await response.json();
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
        console.error('Error fetching cart count:', error);
        return 0;
    }
}

/**
 * 更新購物車數量顯示
 */
async function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const count = await getCartCount();
        cartBadge.textContent = count;
        
        // 動畫效果
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 300);
    }
}

// ========== 書籍卡片渲染函數 ==========

/**
 * 建立書籍卡片 HTML
 */
function createBookCard(book, index = 0) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const imagePath = getBookImagePath(book.id);
    
    card.innerHTML = `
        <div class="book-image">
            <img src="${imagePath}" 
                 alt="${book.title}" 
                 onerror="handleImageError(this)">
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author || '未知作者'}</p>
            <div class="book-footer">
                <span class="book-price">${formatPrice(book.price || 0)}</span>
                <button class="add-cart-btn" onclick="handleAddToCart(${book.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    加入
                </button>
            </div>
        </div>
    `;
    
    // 點擊卡片跳轉到商品頁（排除按鈕）
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.add-cart-btn')) {
            window.location.href = `productpage.html?id=${book.id}`;
        }
    });
    
    return card;
}

/**
 * 處理加入購物車按鈕點擊
 */
async function handleAddToCart(bookId) {
    await addToCart(bookId, 1);
}

// ========== 分頁函數 ==========

/**
 * 分頁資料
 */
function paginateData(data, page, itemsPerPage = 9) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
}

/**
 * 計算總頁數
 */
function getTotalPages(totalItems, itemsPerPage = 9) {
    return Math.ceil(totalItems / itemsPerPage);
}

/**
 * 建立分頁按鈕
 */
function createPaginationButtons(currentPage, totalPages, onPageChange) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    // 上一頁按鈕
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => onPageChange(currentPage - 1);
    pagination.appendChild(prevBtn);
    
    // 頁碼按鈕
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => onPageChange(1);
        pagination.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pagination.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.onclick = () => onPageChange(i);
        pagination.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pagination.appendChild(dots);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => onPageChange(totalPages);
        pagination.appendChild(lastBtn);
    }
    
    // 下一頁按鈕
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => onPageChange(currentPage + 1);
    pagination.appendChild(nextBtn);
}

// ========== 導出函數供全域使用 ==========
window.showToast = showToast;
window.showLoading = showLoading;
window.isUserLoggedIn = isUserLoggedIn;
window.formatPrice = formatPrice;
window.getBookImagePath = getBookImagePath;
window.handleImageError = handleImageError;
window.fetchCategoryTree = fetchCategoryTree;
window.fetchAllBooks = fetchAllBooks;
window.fetchRecommendedBooks = fetchRecommendedBooks;
window.fetchBooksBySubcategory = fetchBooksBySubcategory;
window.fetchBookById = fetchBookById;
window.addToCart = addToCart;
window.getCartCount = getCartCount;
window.updateCartBadge = updateCartBadge;
window.createBookCard = createBookCard;
window.handleAddToCart = handleAddToCart;
window.paginateData = paginateData;
window.getTotalPages = getTotalPages;
window.createPaginationButtons = createPaginationButtons;
