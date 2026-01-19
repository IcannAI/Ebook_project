checkAdminLogin(); // 檢查登入狀態

let currentAdmin = null;

// 取得登入者資訊，檢查權限
$.get("/api/v1/admin/me")
    .done(res => { currentAdmin = res; })
    .fail(() => {
        alert("請重新登入");
        forceAdminLogout();
    });

function forceAdminLogout() {
    if (confirm("確定要登出後台？")) {
        if (typeof logout === 'function') logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "admin-login.html";
    }
}

// 送出註冊表單
function registerEmployee() {
    if (!currentAdmin || currentAdmin.role !== 'ADMIN') {
        return alert("無權限操作");
    }

    const password = $("#password").val();
    const confirmPassword = $("#confirm_password").val();
    if (password !== confirmPassword) {
        return alert("密碼與確認密碼不一致");
    }

    const data = {
        username: $("#username").val(),
        password: password,
        name: $("#name").val(),
        email: $("#email").val(),
        role: "STAFF", // 預設 STAFF
        status: true
    };

    $.ajax({
        url: "/api/v1/admin/employees",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: () => {
            alert("員工註冊成功");
            $("#username, #password, #confirm_password, #name, #email").val('');
        },
        error: (xhr) => alert("註冊失敗：" + xhr.responseText)
    });
}

// 綁定表單送出事件
$(function() {
    $("#registerForm").on("submit", function(e) {
        e.preventDefault(); // 防止表單預設提交
        registerEmployee();
    });
});
