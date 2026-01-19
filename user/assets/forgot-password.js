// 頁面載入完成
$(document).ready(function() {
    // 自動聚焦 Email
    $("#email").focus();

    // 綁定按鈕事件
    $("#resetBtn").on("click", resetPassword);

    // Enter 鍵送出
    $(document).on("keypress", function(e) {
        if (e.which === 13) {
            resetPassword();
        }
    });
});

// ======= 工具函數 =======

// 顯示訊息
function showAlert(message, type = 'info') {
    const alertBox = $('#alertBox');
    alertBox.removeClass('alert-success alert-error alert-info');
    alertBox.addClass('alert-' + type);
    alertBox.text(message);
    alertBox.fadeIn();

    setTimeout(() => alertBox.fadeOut(), 3000);
}

// 處理 API 錯誤
function handleApiError(xhr, defaultMsg = "操作失敗，請稍後再試") {
    let errorMsg = defaultMsg;

    if (xhr.status === 401) {
        errorMsg = "未登入或登入已過期，請重新登入";
        setTimeout(() => logout(), 2000);
    } else if (xhr.status === 404) {
        errorMsg = "找不到該 Email，請確認是否正確";
    } else if (xhr.status === 400) {
        errorMsg = xhr.responseJSON?.message || "請求參數錯誤";
    } else if (xhr.status === 500) {
        errorMsg = "伺服器錯誤，請稍後再試";
    } else if (xhr.responseJSON?.message) {
        errorMsg = xhr.responseJSON.message;
    }

    return errorMsg;
}

// 登出功能
function logout() {
    $.post("/api/members/logout")
        .always(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "login.html";
        });
}

// ======= 功能 =======

// 重設密碼
function resetPassword() {
    const email = $("#email").val().trim();
    const resetBtn = $("#resetBtn");

    if (!email) {
        showAlert("請輸入您的 Email", "error");
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showAlert("請輸入正確的 Email 格式", "error");
        return;
    }

    // 禁用按鈕
    resetBtn.prop('disabled', true).text('處理中...');

    // 模擬 API 呼叫
    $.ajax({
        url: "/api/members/forgot-password",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email }),
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        showAlert("密碼重設成功！新密碼已發送至您的信箱", "success");

        // 清空輸入框
        $("#email").val('');

        // 在 client 端設定 loginMemberId
        if (response && response.memberId) {
            localStorage.setItem('loginMemberId', response.memberId);
            sessionStorage.setItem('loginMemberId', response.memberId);
        }

        // 3秒後跳轉登入頁
        setTimeout(() => location.href = "login.html", 3000);
    })
    .fail(function(xhr) {
        const errorMsg = handleApiError(xhr, "密碼重設失敗");
        showAlert(errorMsg, "error");
    })
    .always(function() {
        resetBtn.prop('disabled', false).text('送出重設密碼請求');
    });
}
