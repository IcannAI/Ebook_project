// =============================
// 後台全域登入管理（Local + Session）
// =============================

// 取得目前登入管理員資料
function getCurrentAdmin() {
    const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken");
    const name  = sessionStorage.getItem("adminName")  || localStorage.getItem("adminName");
    const role  = sessionStorage.getItem("adminRole")  || localStorage.getItem("adminRole");

    if (token && name && role) {
        return { token, name, role };
    }
    return null;
}

// 同時寫入 sessionStorage 與 localStorage
function setCurrentAdmin(admin) {
    if (!admin) return;

    // localStorage
    localStorage.setItem("adminToken", admin.token);
    localStorage.setItem("adminName", admin.name || "管理員");
    localStorage.setItem("adminRole", admin.role || "STAFF");

    // sessionStorage
    sessionStorage.setItem("adminToken", admin.token);
    sessionStorage.setItem("adminName", admin.name || "管理員");
    sessionStorage.setItem("adminRole", admin.role || "STAFF");
}

// 清除管理員資料
function clearCurrentAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminName");
    sessionStorage.removeItem("adminRole");
}

// 檢查登入
function checkAdminLogin() {
    const admin = getCurrentAdmin();
    if (!admin) {
        alert("請先登入後台");
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

// 判斷是否為最高管理員
function isAdmin() {
    const admin = getCurrentAdmin();
    return admin?.role === "ADMIN";
}
