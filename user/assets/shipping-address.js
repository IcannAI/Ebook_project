checkLogin();

let editingId = null;

// 載入地址
function loadAddresses() {
    getWithAuth("http://localhost:8080/api/members/shipping").done(function(list) {
        if (!list || list.length === 0) {
            $("#addressList").html("<p style='color:#888;text-align:center;margin:30px 0;'>尚未新增任何地址</p>");
            return;
        }

        const html = list.map(item => `
            <div class="address-item">
                <strong>${item.method_name ? item.method_name : '未命名地址'}</strong>
                <div class="addr-text">${item.address}</div>
                <div class="address-actions">
                    <button class="edit-btn" onclick="startEdit(${item.id}, ${JSON.stringify(item.method_name || '')}, ${JSON.stringify(item.address)})">
                        編輯
                    </button>
                    <button class="delete-btn" onclick="deleteAddress(${item.id})">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');

        $("#addressList").html(html);
    }).fail(() => {
        alert("載入地址失敗，請重新登入");
        forceLogout();
    });
}

// 開始編輯
function startEdit(id, methodName, address) {
    editingId = id;
    $("#methodName").val(methodName);
    $("#address").val(address);
    $("#saveBtn").text("儲存修改");
    $("html, body").animate({ scrollTop: 0 }, 400);
}

// 儲存或新增
function saveAddress() {
    const methodName = $("#methodName").val().trim();
    const address = $("#address").val().trim();

    if (!address) {
        alert("請填寫完整地址！");
        return;
    }

    const data = {
        method_name: methodName || null,
        address: address
    };

    if (editingId) {
        putWithAuth(`http://localhost:8080/api/members/shipping/${editingId}`, data)
            .done(() => {
                alert("地址修改成功！");
                resetForm();
                loadAddresses();
            })
            .fail(() => alert("修改失敗，請稍後再試"));
    } else {
        postWithAuth("http://localhost:8080/api/members/shipping", data)
            .done(() => {
                alert("地址新增成功！");
                resetForm();
                loadAddresses();
            })
            .fail(() => alert("新增失敗，請檢查欄位"));
    }
}

// 刪除
function deleteAddress(id) {
    if (!confirm("確定要刪除這筆地址嗎？")) return;

    deleteWithAuth(`http://localhost:8080/api/members/shipping/${id}`)
        .done(() => {
            alert("地址已刪除");
            loadAddresses();
        })
        .fail(() => alert("刪除失敗"));
}

// 清除表單
function resetForm() {
    editingId = null;
    $("#methodName").val("");
    $("#address").val("");
    $("#saveBtn").text("新增地址");
}

// 強制登出（共用 common.js）
function forceLogout() {
    if (confirm("確定要登出嗎？")) {
        if (typeof logout === 'function') logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// 綁定按鈕
$("#saveBtn").on("click", saveAddress);

// 初始化
$(function() {
    loadAddresses();
});
