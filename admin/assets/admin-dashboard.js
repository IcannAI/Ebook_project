// ------------------ 權限檢查 ------------------
function checkAdminLogin() {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole"); 
    if (!token) {
        alert("請先登入！");
        window.location.href = "admin-login.html";
        return false;
    }
    if (role !== "ADMIN" && role !== "STAFF") {
        alert("權限不足！");
        localStorage.clear();
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

if (!checkAdminLogin()) return;

// ------------------ 登入者名稱 ------------------
$(function() {
    const name = localStorage.getItem("adminName") || "管理員";
    $("#adminName").text(name);
});

// ------------------ 登出 ------------------
function clearLocalStorageAndRedirect() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    sessionStorage.clear();
    location.href = "admin-login.html";
}

function adminLogout() {
    if (!confirm("確定要登出系統？")) return;

    $.post("/api/v1/auth/admin/logout", {}, function(){
        clearLocalStorageAndRedirect();
    }).fail(function(){
        clearLocalStorageAndRedirect();
    });
}

$(document).on("click", "#logoutBtn", adminLogout);

// ------------------ Banner 管理 ------------------
function getAuthHeader() {
    const token = localStorage.getItem("adminToken");
    return { "Authorization": "Bearer " + token };
}

// 載入現有推播
function loadBanners() {
    $.ajax({
        url: "/api/v1/home/banners",
        type: "GET",
        headers: getAuthHeader(),
        success: res => {
            if (!res || res.length === 0) {
                $("#bannerList").html("<p style='color:#999; text-align:center;'>尚未建立任何推播</p>");
                return;
            }

            let html = "";
            res.forEach(b => {
                html += `
                    <div class="cart-row">
                        <div style="display:flex; align-items:center;">
                            <img src="${b.imageUrl}" style="width:120px; height:70px; object-fit:cover; border-radius:8px; margin-right:20px;">
                            <div>
                                <strong style="font-size:18px;">${b.title}</strong><br>
                                連結：<a href="${b.link}" target="_blank" style="color:#008c5f;">${b.link || "無"}</a><br>
                                排序：${b.sortOrder || 0} | 
                                <span style="color:${b.active ? '#27ae60' : '#e74c3c'}; font-weight:bold;">
                                    ${b.active ? '啟用中' : '已停用'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <button class="btn ${b.active ? 'btn-warning' : 'btn-success'}" onclick="toggleBanner(${b.id})">
                                ${b.active ? '停用' : '啟用'}
                            </button>
                            <button class="btn btn-primary" onclick="editBanner(${b.id})">編輯</button>
                            <button class="button-danger btn" onclick="deleteBanner(${b.id})">刪除</button>
                        </div>
                    </div>
                `;
            });
            $("#bannerList").html(html);
        },
        error: () => {
            $("#bannerList").html("<p style='color:red;'>載入推播失敗，請檢查 API</p>");
        }
    });
}

// 新增推播
function uploadBanner() {
    const title = $("#bannerTitle").val().trim();
    const link = $("#bannerLink").val().trim();
    const file = $("#bannerImage")[0].files[0];

    if (!title || !file) {
        alert("請填寫標題並選擇圖片！");
        return;
    }

    let fd = new FormData();
    fd.append("title", title);
    fd.append("link", link);
    fd.append("imageFile", file);

    $.ajax({
        url: "/api/v1/home/banners",
        method: "POST",
        headers: getAuthHeader(),
        data: fd,
        contentType: false,
        processData: false,
        success: function(){
            alert("推播新增成功！");
            $("#bannerTitle").val("");
            $("#bannerLink").val("");
            $("#bannerImage").val("");
            loadBanners();
        },
        error: function() {
            alert("上傳失敗，請檢查檔案或伺服器");
        }
    });
}

$(document).on("click", "#uploadBannerBtn", uploadBanner);

// 啟用/停用
function toggleBanner(id){
    $.ajax({
        url: `/api/v1/home/banners/${id}/toggle`,
        type: "POST",
        headers: getAuthHeader(),
        success: loadBanners,
        error: () => alert("更新狀態失敗")
    });
}

// 刪除
function deleteBanner(id){
    if(confirm("確定要永久刪除此推播？")) {
        $.ajax({
            url: `/api/v1/home/banners/${id}`,
            type: "DELETE",
            headers: getAuthHeader(),
            success: loadBanners,
            error: () => alert("刪除失敗")
        });
    }
}

// 編輯
function editBanner(id){
    const title = prompt("請輸入新標題：");
    if (title === null) return;
    if (title.trim() === "") {
        alert("標題不能為空！");
        return;
    }

    $.ajax({
        url: `/api/v1/home/banners/${id}`,
        method: "PUT",
        headers: getAuthHeader(),
        data: { title: title },
        success: loadBanners,
        error: () => alert("編輯失敗")
    });
}

// 初始化
$(function(){
    loadBanners();

    // 加入推薦內容管理連結
    const recommendBtn = $('<a class="btn btn-success">推薦內容管理</a>');
    recommendBtn.attr("href", "admin-dashboard.html#recommend");
    $(".dashboard-nav").append(recommendBtn);
});
