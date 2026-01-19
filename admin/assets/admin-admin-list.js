$(document).ready(function () {
    checkAdminLogin(); // 檢查登入狀態

    let currentAdmin = null;
    let isEditMode = false; // 新增或編輯模式
    let editingBookId = null;

    // 取得登入者資訊
    $.get("/api/admin/profile") // 假設後端有 /api/admin/profile 回傳當前 admin
        .done(res => {
            currentAdmin = res;
        })
        .fail(() => {
            alert("請重新登入");
            forceAdminLogout();
        });

    // 強制登出
    function forceAdminLogout() {
        if (confirm("確定要登出後台？")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "admin-login.html";
        }
    }

    // 載入出版社下拉選單
    function loadPublishers() {
        $.get("/api/publishers", publishers => {
            const select = $("#publisherId");
            select.empty();
            select.append('<option value="">請選擇出版社</option>');
            publishers.forEach(p => {
                select.append(`<option value="${p.id}">${p.name}</option>`);
            });
        });
    }

    // 載入子分類下拉選單（可依需求從 /api/categories 巢狀載入）
    function loadSubCategories() {
        $.get("/api/categories", categories => {
            const select = $("#subCategoryId");
            select.empty();
            select.append('<option value="">請選擇子分類</option>');
            categories.forEach(cat => {
                cat.subCategories.forEach(sub => {
                    select.append(`<option value="${sub.id}">${cat.name} - ${sub.name}</option>`);
                });
            });
        });
    }

    // 預覽圖片
    $("#coverImage").on("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                $("#previewImage").attr("src", ev.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    });

    // 載入現有書籍資料（編輯模式）
    function loadBookData(bookId) {
        $.get(`/api/admin/books/${bookId}`, book => {
            isEditMode = true;
            editingBookId = bookId;

            $("#bookId").val(book.id);
            $("#title").val(book.title);
            $("#isbn").val(book.isbn);
            $("#publisherId").val(book.publisherId);
            $("#subCategoryId").val(book.subCategoryId);
            $("#publishDate").val(book.publishDate ? book.publishDate.split('T')[0] : ''); // 處理 LocalDate
            $("#price").val(book.price);
            $("#stock").val(book.stock);
            $("#discount").val(book.discount || 1.0);
            $("#description").val(book.description);
            $("#status").val(book.status);

            // 如果有圖片，顯示預覽
            if (book.coverImage) {
                $("#previewImage").attr("src", book.coverImage).show();
            }
        }).fail(() => alert("載入書籍資料失敗"));
    }

    // 檢查 URL 是否有 ?id=xxx（編輯模式）
    const urlParams = new URLSearchParams(window.location.search);
    const bookIdFromUrl = urlParams.get("id");
    if (bookIdFromUrl) {
        loadBookData(bookIdFromUrl);
    }

    // 儲存書籍（新增或編輯）
    $("#saveBtn").on("click", function () {
        const formData = new FormData();

        // 收集文字欄位
        formData.append("title", $("#title").val());
        formData.append("isbn", $("#isbn").val());
        formData.append("publisherId", $("#publisherId").val());
        formData.append("subCategoryId", $("#subCategoryId").val());
        formData.append("publishDate", $("#publishDate").val());
        formData.append("price", $("#price").val());
        formData.append("stock", $("#stock").val());
        formData.append("discount", $("#discount").val());
        formData.append("description", $("#description").val());
        formData.append("status", $("#status").val());

        // 圖片檔案
        const coverFile = $("#coverImage")[0].files[0];
        if (coverFile) {
            formData.append("cover", coverFile);
        }

        // 送出請求
        const url = isEditMode ? `/api/admin/books/${editingBookId}` : "/api/admin/books";
        const method = isEditMode ? "PUT" : "POST";

        $.ajax({
            url: url,
            type: method,
            data: formData,
            processData: false, // 重要：讓 jQuery 不處理 FormData
            contentType: false, // 重要：讓瀏覽器自動設定 multipart/form-data
            success: function () {
                alert(isEditMode ? "書籍更新成功" : "書籍新增成功");
                window.location.href = "admin-book-list.html"; // 跳回列表
            },
            error: function (xhr) {
                alert("儲存失敗：" + (xhr.responseJSON?.message || "請檢查輸入資料"));
            }
        });
    });


    // 頁面載入時初始化
    loadPublishers();
    loadSubCategories();
});