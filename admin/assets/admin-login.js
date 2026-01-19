$(document).ready(function() {
    // 登入按鈕事件
    $("#loginBtn").on("click", adminLogin);

    // 註冊連結事件
    $("#registerLink").on("click", function() {
        location.href = 'admin-register.html';
    });

    // Enter 鍵觸發登入
    $(document).on("keypress", function(e) {
        if (e.which === 13) {
            adminLogin();
        }
    });
});

function adminLogin() {
    const account = $("#account").val().trim();
    const password = $("#password").val();

    if (!account || !password) {
        alert("請輸入帳號與密碼！");
        return;
    }

    $.ajax({
        url: "/api/v1/auth/admin/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ account: account, password: password }),
        success: function(res) {
            localStorage.setItem("adminToken", res.token);
            localStorage.setItem("adminName", res.name || "管理員");
            localStorage.setItem("adminRole", res.role || "STAFF");

            alert("登入成功！歡迎回來，" + (res.name || "管理員"));

            location.href = "admin-dashboard.html";
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                alert("登入失敗：帳號或密碼錯誤！");
            } else if (xhr.status === 403) {
                alert("帳號已被停用，請聯繫超級管理員！");
            } else {
                alert("登入失敗，請稍後再試！");
            }
        }
    });
}

// 後台頁面檢查登入
function checkAdminLogin() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        alert("請先登入後台");
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

// 判斷角色
function isAdmin() {
    return localStorage.getItem("adminRole") === "ADMIN";
}
