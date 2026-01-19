// =============================
// 全域登入使用者管理（只用 sessionStorage）
// =============================

// 從 sessionStorage 讀取使用者資料
function getCurrentUser() {
    const id = sessionStorage.getItem("memberId");
    const name = sessionStorage.getItem("memberName");
    const account = sessionStorage.getItem("memberAccount");

    if (id && name && account) {
        return { id, name, account };
    }
    return null;
}

// 設定登入使用者資料到 sessionStorage
function setCurrentUser(user) {
    if (!user) return;
    sessionStorage.setItem("memberId", user.id);
    sessionStorage.setItem("memberName", user.name);
    sessionStorage.setItem("memberAccount", user.account);
}

// 清除使用者資料
function clearCurrentUser() {
    sessionStorage.removeItem("memberId");
    sessionStorage.removeItem("memberName");
    sessionStorage.removeItem("memberAccount");
}

// =============================
// 登入檢查
// =============================
function checkLogin() {
    const user = getCurrentUser();
    if (!user) {
        // 沒登入就導到 login.html
        location.href = "login.html";
        return false;
    }
    return true;
}

// =============================
// 登出
// =============================
function logoutUser() {
    $.post("/api/members/logout").always(() => {
        clearCurrentUser();
        location.href = "login.html";
    });
}

// =============================
// 顯示 navbar 使用者名稱
// =============================
function updateNavbarUser() {
    const user = getCurrentUser();
    if (user) {
        $("#navUser").text(`Hi, ${user.name}`);
    } else {
        $("#navUser").text("帳戶功能");
    }
}

// =============================
// AJAX 全域設定 (附帶 Cookie)
// =============================
$.ajaxSetup({
    xhrFields: { withCredentials: true }
});

// =============================
// 初始化 (頁面載入時)
$(function() {
    updateNavbarUser();
});
