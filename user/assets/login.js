// ========== 工具函數 ==========

function handleApiError(xhr, defaultMsg = "操作失敗，請稍後再試") {
    let errorMsg = defaultMsg;

    if (xhr.status === 401) {
        errorMsg = "帳號或密碼錯誤！請重新輸入";
    } else if (xhr.status === 404) {
        errorMsg = "帳號不存在！請確認帳號是否正確";
    } else if (xhr.status === 400) {
        errorMsg = xhr.responseJSON?.message || "請求參數錯誤，請檢查輸入資料";
    } else if (xhr.status === 403) {
        errorMsg = "帳號已被停用，請聯絡管理員";
    } else if (xhr.status === 500) {
        errorMsg = "伺服器錯誤，請稍後再試";
    } else if (xhr.responseJSON?.message) {
        errorMsg = xhr.responseJSON.message;
    }

    return errorMsg;
}

function logout() {
    $.post("/api/members/logout").always(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
    });
}

function fetchWithAuth(url, options = {}) {
    return $.ajax({
        url: url,
        type: options.method || "GET",
        contentType: options.contentType || "application/json",
        data: options.body || null,
        xhrFields: {
            withCredentials: true
        }
    });
}

function showAlert(message, type = "error") {
    const alertBox = $("#alertBox");
    alertBox.removeClass("alert-success alert-error");
    alertBox.addClass("alert-" + type);
    alertBox.text(message);
    alertBox.fadeIn();

    setTimeout(() => alertBox.fadeOut(), 5000);
}

// ========== 登入功能 ==========

function loginUser() {
    const account = $("#account").val().trim();
    const password = $("#password").val();
    const loginBtn = $("#loginBtn");

    if (!account || !password) {
        showAlert("請輸入帳號和密碼！", "error");
        return;
    }

    loginBtn.prop("disabled", true).text("登入中...");

    const loginData = {
        account: account,
        password: password
    };

    $.ajax({
        url: "/api/members/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(loginData),
        xhrFields: { withCredentials: true }
    })
        .done(function (response) {
            showAlert("登入成功！歡迎回來 " + response.name, "success");

            sessionStorage.setItem("memberName", response.name);
            sessionStorage.setItem("memberId", response.id);
            sessionStorage.setItem("memberAccount", response.account);

            setTimeout(() => {
                const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
                sessionStorage.removeItem("redirectAfterLogin");

                window.location.href = redirectUrl && redirectUrl !== "/login.html"
                    ? redirectUrl
                    : "index.html";
            }, 1000);
        })
        .fail(function (xhr) {
            const errorMsg = handleApiError(xhr, "登入失敗，請稍後再試");
            showAlert(errorMsg, "error");
            $("#password").val("").focus();
        })
        .always(function () {
            loginBtn.prop("disabled", false).text("立即登入");
        });
}

// ========== 事件監聽 ==========

// 按 Enter 鍵登入
$(document).on("keypress", function (e) {
    if (e.which === 13) {
        loginUser();
    }
});

// ========== 初始化 ==========

$(document).ready(function () {
    $.get("/api/members/who")
        .done(function () {
            showAlert("已經登入了！即將跳轉...", "success");
            setTimeout(() => (window.location.href = "index.html"), 1000);
        })
        .fail(function () {
            // 讓 HTML 自己處理 autofocus
        });
});

// 綁定按鈕事件
$(document).on("click", "#loginBtn", loginUser);
