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
    const token = localStorage.getItem("authToken");
    const headers = options.headers || {};
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return $.ajax({
        url: url,
        type: options.method || 'GET',
        contentType: 'application/json',
        headers: headers,
        data: options.body || null,
        xhrFields: { withCredentials: false } // JWT 模式下通常不需攜帶 Cookie
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:61',message:'loginUser called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const account = $("#account").val().trim();
    const password = $("#password").val();
    const loginBtn = $("#loginBtn");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:68',message:'Input values',data:{hasAccount:!!account,hasPassword:!!password,accountLength:account.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (!account || !password) {
        showAlert("請輸入帳號和密碼！", "error");
        return;
    }

    loginBtn.prop("disabled", true).text("登入中...");

    const loginData = {
        account: account,
        password: password
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:82',message:'Before API call',data:{url:'/api/auth/login',hasData:!!loginData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    $.ajax({
        url: "http://localhost:8080/api/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(loginData),
        success: function (response) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:92',message:'Login success',data:{hasToken:!!response.token,hasMember:!!response.member},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            
            // 1. 儲存 JWT Token 到 localStorage 
            localStorage.setItem("authToken", response.token);
            
            // 2. 資料層級：從 response.member 中取得資料
            if (response.member) {
                sessionStorage.setItem("memberName", response.member.name);
                sessionStorage.setItem("memberAccount", response.member.account);
                sessionStorage.setItem("memberId", response.member.id);
            }

            showAlert("登入成功！歡迎回來 " + (response.member?.name || ""), "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        },
        error: function (xhr) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:107',message:'Login error',data:{status:xhr.status,statusText:xhr.statusText,hasResponse:!!xhr.responseJSON},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            
            loginBtn.prop("disabled", false).text("立即登入");
            showAlert("登入失敗：" + handleApiError(xhr), "error");
        }
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:118',message:'Document ready, checking auth',data:{hasToken:!!localStorage.getItem('authToken')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    // #region agent log
    try {
        fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:119',message:'jQuery withCredentials setting',data:{withCredentials:!!($.ajaxSettings && $.ajaxSettings.xhrFields && $.ajaxSettings.xhrFields.withCredentials)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'CORS'})}).catch(()=>{});
    } catch (_) {}
    // #endregion
    
    const token = localStorage.getItem('authToken');
    if (token) {
        $.ajax({
            url: "http://localhost:8080/api/auth/who",
            type: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .done(function () {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:125',message:'Already logged in',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            showAlert("已經登入了！即將跳轉...", "success");
            setTimeout(() => (window.location.href = "index.html"), 1000);
        })
        .fail(function (xhr) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:131',message:'Not logged in or auth failed',data:{status:xhr.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            // 讓 HTML 自己處理 autofocus
        });
    } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:136',message:'No token found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
    }
    
    // 綁定按鈕事件
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/24433843-7085-4448-81ca-a35b44f183c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.js:137',message:'Binding login button',data:{hasLoginBtn:!!$('#loginBtn').length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    $(document).on("click", "#loginBtn", loginUser);
});



