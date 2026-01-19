/**
 * auth.js - 會員認證工具函數
 * 提供登入驗證、登出、API 錯誤處理等共用功能
 */

// ========== 認證檢查 ==========

/**
 * 檢查登入狀態
 * 若未登入則自動導向登入頁
 * @param {boolean} redirectIfNotLogin - 是否在未登入時自動跳轉 (預設: true)
 * @returns {Promise<Object|null>} 登入的會員資料，若未登入則返回 null
 */
function checkLoginStatus(redirectIfNotLogin = true) {
    return $.get("/api/members/who")
        .then(function(member) {
            // 登入成功，返回會員資料
            return member;
        })
        .fail(function(xhr) {
            if (xhr.status === 401 && redirectIfNotLogin) {
                // 未登入，導向登入頁
                alert("請先登入");
                redirectToLogin();
            }
            return null;
        });
}

/**
 * 導向登入頁
 * 會記住當前頁面，登入後可返回
 */
function redirectToLogin() {
    const currentPage = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPage);
    window.location.href = "login.html";
}

/**
 * 登入後返回原頁面
 * 在 login.html 登入成功後呼叫
 */
function redirectAfterLogin() {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    
    if (redirectUrl && redirectUrl !== '/login.html') {
        window.location.href = redirectUrl;
    } else {
        window.location.href = "index.html";
    }
}

// ========== 登出功能 ==========

/**
 * 登出功能
 * 清除 Session 和本地儲存，並跳轉到登入頁
 * @param {boolean} showConfirm - 是否顯示確認對話框 (預設: false)
 */
function logout(showConfirm = false) {
    if (showConfirm && !confirm("確定要登出嗎？")) {
        return;
    }

    $.post("/api/members/logout")
        .always(function() {
            // 清除所有本地儲存
            localStorage.clear();
            sessionStorage.clear();
            
            // 跳轉到登入頁
            window.location.href = "login.html";
        });
}

/**
 * 強制登出 (不需確認)
 * 用於 Session 過期或需要立即登出的情況
 */
function forceLogout() {
    logout(false);
}

// ========== API 錯誤處理 ==========

/**
 * 統一 API 錯誤處理
 * @param {Object} xhr - jQuery AJAX 錯誤物件
 * @param {string} defaultMsg - 預設錯誤訊息
 * @param {boolean} autoLogoutOn401 - 401 錯誤時是否自動登出 (預設: true)
 * @returns {string} 錯誤訊息
 */
function handleApiError(xhr, defaultMsg = "操作失敗，請稍後再試", autoLogoutOn401 = true) {
    let errorMsg = defaultMsg;
    
    switch(xhr.status) {
        case 400:
            errorMsg = xhr.responseJSON?.message || "請求參數錯誤，請檢查輸入資料";
            break;
            
        case 401:
            errorMsg = "未登入或登入已過期，請重新登入";
            if (autoLogoutOn401) {
                setTimeout(() => {
                    forceLogout();
                }, 1500);
            }
            break;
            
        case 403:
            errorMsg = "沒有權限執行此操作";
            break;
            
        case 404:
            errorMsg = xhr.responseJSON?.message || "找不到該資源";
            break;
            
        case 409:
            errorMsg = xhr.responseJSON?.message || "資料衝突，該資料可能已存在";
            break;
            
        case 422:
            errorMsg = xhr.responseJSON?.message || "資料驗證失敗";
            break;
            
        case 500:
            errorMsg = "伺服器錯誤，請稍後再試";
            break;
            
        case 503:
            errorMsg = "服務暫時無法使用，請稍後再試";
            break;
            
        default:
            if (xhr.responseJSON?.message) {
                errorMsg = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMsg = response.message || defaultMsg;
                } catch (e) {
                    errorMsg = defaultMsg;
                }
            }
    }
    
    return errorMsg;
}

/**
 * 顯示 API 錯誤訊息 (使用 alert)
 * @param {Object} xhr - jQuery AJAX 錯誤物件
 * @param {string} defaultMsg - 預設錯誤訊息
 */
function showApiError(xhr, defaultMsg = "操作失敗") {
    const errorMsg = handleApiError(xhr, defaultMsg);
    alert(errorMsg);
}

// ========== 帶認證的 Fetch ==========

/**
 * 帶認證的 Fetch (使用 jQuery AJAX 實現)
 * 自動攜帶 Session Cookie，並處理常見錯誤
 * @param {string} url - API 路徑
 * @param {Object} options - 請求選項
 * @returns {Promise} jQuery Promise 物件
 */
function fetchWithAuth(url, options = {}) {
    const ajaxOptions = {
        url: url,
        type: options.method || 'GET',
        contentType: options.contentType || 'application/json',
        data: options.body || null,
        xhrFields: {
            withCredentials: true  // 攜帶 Cookie/Session
        }
    };
    
    // 如果有自訂 headers
    if (options.headers) {
        ajaxOptions.headers = options.headers;
    }
    
    return $.ajax(ajaxOptions);
}

/**
 * GET 請求 (帶認證)
 * @param {string} url - API 路徑
 * @returns {Promise}
 */
function getWithAuth(url) {
    return fetchWithAuth(url, { method: 'GET' });
}

/**
 * POST 請求 (帶認證)
 * @param {string} url - API 路徑
 * @param {Object} data - 要發送的資料
 * @returns {Promise}
 */
function postWithAuth(url, data) {
    return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT 請求 (帶認證)
 * @param {string} url - API 路徑
 * @param {Object} data - 要發送的資料
 * @returns {Promise}
 */
function putWithAuth(url, data) {
    return fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE 請求 (帶認證)
 * @param {string} url - API 路徑
 * @returns {Promise}
 */
function deleteWithAuth(url) {
    return fetchWithAuth(url, { method: 'DELETE' });
}

// ========== 工具函數 ==========

/**
 * 取得當前登入會員資料
 * @returns {Promise<Object|null>} 會員資料或 null
 */
function getCurrentMember() {
    return $.get("/api/members/who")
        .then(function(member) {
            return member;
        })
        .fail(function() {
            return null;
        });
}

/**
 * 格式化日期時間
 * @param {string} dateStr - ISO 日期字串
 * @returns {string} 格式化後的日期時間
 */
function formatDateTime(dateStr) {
    if (!dateStr) return "未知";
    return new Date(dateStr).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 格式化日期
 * @param {string} dateStr - ISO 日期字串
 * @returns {string} 格式化後的日期
 */
function formatDate(dateStr) {
    if (!dateStr) return "未知";
    return new Date(dateStr).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// ========== 表單驗證 ==========

/**
 * 驗證 Email 格式
 * @param {string} email - Email 字串
 * @returns {boolean} 是否為有效的 Email
 */
function validateEmail(email) {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
}

/**
 * 驗證帳號格式 (4-20 位英數字)
 * @param {string} account - 帳號字串
 * @returns {boolean} 是否為有效的帳號
 */
function validateAccount(account) {
    const re = /^[a-zA-Z0-9]{4,20}$/;
    return re.test(account);
}

/**
 * 驗證密碼強度 (至少 6 位)
 * @param {string} password - 密碼字串
 * @returns {boolean} 是否為有效的密碼
 */
function validatePassword(password) {
    return password && password.length >= 6;
}

/**
 * 驗證手機號碼 (09 開頭的 10 位數字)
 * @param {string} phone - 手機號碼
 * @returns {boolean} 是否為有效的手機號碼
 */
function validatePhone(phone) {
    if (!phone) return true; // 允許空值
    const re = /^09\d{8}$/;
    return re.test(phone);
}

// ========== 頁面載入完成後的初始化 ==========

/**
 * 檢查是否為需要登入的頁面
 * 若是則自動執行登入檢查
 */
$(document).ready(function() {
    const currentPage = window.location.pathname;
    
    // 需要登入才能訪問的頁面列表
    const protectedPages = [
        'user-profile.html',
        'order-list.html',
        'order-detail.html',
        'cart.html',
        'checkout.html',
        'shipping-address.html'
    ];
    
    // 檢查當前頁面是否需要登入
    const needsLogin = protectedPages.some(page => currentPage.includes(page));
    
    if (needsLogin) {
        checkLoginStatus(true);
    }
});

// ========== 導出函數 (供其他腳本使用) ==========
// 如果使用模組系統，可以使用以下方式導出

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkLoginStatus,
        redirectToLogin,
        redirectAfterLogin,
        logout,
        forceLogout,
        handleApiError,
        showApiError,
        fetchWithAuth,
        getWithAuth,
        postWithAuth,
        putWithAuth,
        deleteWithAuth,
        getCurrentMember,
        formatDateTime,
        formatDate,
        validateEmail,
        validateAccount,
        validatePassword,
        validatePhone
    };
}