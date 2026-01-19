// -------------------- 權限檢查 --------------------
checkAdminLogin();

// -------------------- 登出 --------------------
function forceAdminLogout() {
    if (confirm("確定要登出後台？")) {
        if (typeof logout === 'function') logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "admin-login.html";
    }
}

// -------------------- 讀取 URL 取得書籍 ID --------------------
const urlParams = new URLSearchParams(location.search);
const bookId = urlParams.get('id');

// -------------------- 載入書籍資料 --------------------
if (bookId) {
    $("#pageTitle").text("編輯書籍");

    $.get(`/api/v1/admin/books/${bookId}`, b => {
        $("#id").val(b.id);
        $("#isbn").val(b.isbn);
        $("#title").val(b.title);
        $("#publisher_id").val(b.publisher_id);
        $("#sub_category_id").val(b.sub_category_id);
        $("#publish_date").val(b.publish_date);
        $("#price").val(b.price);
        $("#stock").val(b.stock);
        $("#discount").val(b.discount);
        $("#description").val(b.description);
        $("#status").val(b.status);

        $("#created_at").val(new Date(b.created_at).toLocaleString());
        $("#updated_at").val(new Date(b.updated_at).toLocaleString());
        $("#updated_by_admin_id").val(b.updated_by_admin_id);
    }).fail(() => {
        alert("載入失敗");
    });
}

//--------------載入出版社下拉選單---------------------

$.get("/api/publishers", function(data) {
    const select = $("#publisherSelect");
    select.empty();
    data.forEach(p => {
        select.append(`<option value="${p.id}">${p.name}</option>`);
    });
});

// -------------------- 儲存書籍 --------------------
function saveBook() {
    let fd = new FormData();
    fd.append("isbn", $("#isbn").val());
    fd.append("title", $("#title").val());
    fd.append("publisher_id", $("#publisher_id").val());
    fd.append("sub_category_id", $("#sub_category_id").val());
    fd.append("publish_date", $("#publish_date").val());
    fd.append("price", $("#price").val());
    fd.append("stock", $("#stock").val());
    fd.append("discount", $("#discount").val());
    fd.append("description", $("#description").val());
    fd.append("status", $("#status").val());

    // 上傳封面
    const file = $("#cover_image")[0].files[0];
    if (file) fd.append("cover_image", file);

    const method = bookId ? "PUT" : "POST";
    const url = bookId ? `/api/v1/admin/books/${bookId}` : "/api/v1/admin/books";

    $.ajax({
        url: url,
        type: method,
        data: fd,
        contentType: false,
        processData: false,
        success: () => {
            alert("儲存成功");
            location.href = "admin-book-list.html";
        },
        error: () => {
            alert("儲存失敗，請檢查資料");
        }
    });

    //新增驗證
    if (!$("#title").val().trim()) return alert("書名必填");
    if (!$("#price").val() || $("#price").val() <= 0) return alert("價格必須大於 0");

    //出版日期預設(初始預設今天）
    if (!isEditMode) $("#publishDate").val(new Date().toISOString().split('T')[0]);
}
