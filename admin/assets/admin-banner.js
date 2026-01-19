// ---- 權限檢查 ----
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

// ---- 登出 ----
function forceAdminLogout() {
    if (confirm("確定要登出後台？")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "admin-login.html";
    }
}

// ---- 載入頁面 ----
$(function () {
    if (!checkAdminLogin()) return;
    loadBanners();
});

// ---- 取得推播列表 ----
function loadBanners() {
    const token = localStorage.getItem("adminToken");

    $.ajax({
        url: "/api/v1/home/banners",
        type: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: res => {
            let html = "";
            res.forEach(b => {
                html += `
                    <div class="cart-row">
                        <div style="display:flex;align-items:center;">
                            <img src="${b.imageUrl}" style="width:120px;height:70px;border-radius:4px;margin-right:20px;">
                            <div>
                                <b>${b.title}</b><br>
                                連結：${b.link || "無"}<br>
                                排序：${b.sortOrder || 0}
                                <span style="color:${b.active ? '#008c5f' : '#dc3545'};font-weight:bold;">
                                    ${b.active ? "啟用中" : "已停用"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <button onclick="toggleBanner(${b.id}, ${b.active})">
                                ${b.active ? "停用" : "啟用"}
                            </button>
                            <button onclick="editBanner(${b.id})">編輯</button>
                            <button class="button-danger" onclick="deleteBanner(${b.id})">刪除</button>
                        </div>
                    </div>
                `;
            });

            $("#bannerList").html(html || "<p style='text-align:center;color:#888;'>目前無推播</p>");
        },
        error: () => alert("讀取輪播列表失敗")
    });
}

// ---- 新增推播 ----
function uploadBanner() {
    const token = localStorage.getItem("adminToken");
    let fd = new FormData();

    fd.append("title", $("#bannerTitle").val());
    fd.append("link", $("#bannerLink").val());
    const file = $("#bannerImage")[0].files[0];
    if (file) fd.append("imageFile", file);

    $.ajax({
        url: "/api/v1/home/banners",
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        data: fd,
        contentType: false,
        processData: false,
        success: () => {
            alert("推播新增成功！");
            loadBanners();
            $("#bannerTitle").val("");
            $("#bannerLink").val("");
            $("#bannerImage").val("");
        },
        error: () => alert("新增失敗，請檢查檔案")
    });
}

// ---- 啟用/停用 ----
function toggleBanner(id, active) {
    const token = localStorage.getItem("adminToken");

    $.ajax({
        url: `/api/v1/home/banners/${id}/toggle`,
        type: "POST",
        headers: { "Authorization": "Bearer " + token },
        success: () => {
            alert("狀態已更新");
            loadBanners();
        },
        error: () => alert("更新狀態失敗")
    });
}

// ---- 刪除 ----
function deleteBanner(id) {
    if (!confirm("確定刪除此推播？")) return;

    const token = localStorage.getItem("adminToken");

    $.ajax({
        url: `/api/v1/home/banners/${id}`,
        type: "DELETE",
        headers: { "Authorization": "Bearer " + token },
        success: () => {
            alert("已刪除");
            loadBanners();
        },
        error: () => alert("刪除失敗")
    });
}

// ---- 編輯 ----
function editBanner(id) {
    const title = prompt("新標題", "");
    const link = prompt("新連結", "");

    if (!title && !link) return;

    const token = localStorage.getItem("adminToken");

    $.ajax({
        url: `/api/v1/home/banners/${id}`,
        type: "PUT",
        headers: { "Authorization": "Bearer " + token },
        data: { title, link },
        success: () => {
            alert("編輯成功");
            loadBanners();
        },
        error: () => alert("編輯失敗")
    });
}
