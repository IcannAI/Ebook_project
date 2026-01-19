// ------------------------ 權限檢查 ------------------------
checkAdminLogin();

// ------------------------ 登出 ------------------------
function forceAdminLogout() {
    if (confirm("確定要登出後台管理系統？")) {
        if (typeof logout === 'function') logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "admin-login.html";
    }
}

// ------------------------ 載入書籍列表 ------------------------
function loadBooks() {
    $.get("/api/v1/admin/books", books => {
        $("#bookBody").html(
            books.map(b => `
                <tr>
                    <td><strong>#${b.id}</strong></td>
                    <td>${b.title || '未命名'}</td>
                    <td>${Array.isArray(b.authors) ? b.authors.join(', ') : '未知'}</td>
                    <td>$${b.price || 0}</td>
                    <td>${b.stock || 0}</td>
                    <td>
                        <span class="${b.status ? 'status-on' : 'status-off'}">
                            ${b.status ? '上架中' : '已下架'}
                        </span>
                    </td>
                    <td>${new Date(b.created_at || Date.now()).toLocaleDateString('zh-TW')}</td>
                    <td>
                        <a href="admin-book-edit.html?id=${b.id}" class="btn-edit">修改</a>
                        <button class="btn-delete" onclick="deleteBook(${b.id})">刪除</button>
                        <button class="btn-edit" onclick="toggleStatus(${b.id}, ${b.status})">
                            ${b.status ? '下架' : '上架'}
                        </button>
                    </td>
                </tr>
            `).join('')
        );
    }).fail(() => {
        alert("載入失敗，請重新登入");
        forceAdminLogout();
    });
}

// ------------------------ 刪除書籍 ------------------------
function deleteBook(id) {
    if (!confirm("確定要永久刪除這本書籍？\n此動作無法復原！")) return;

    $.ajax({
        url: `/api/v1/admin/books/${id}`,
        type: "DELETE",
        success: () => {
            alert("書籍已刪除");
            loadBooks();
        },
        error: () => alert("刪除失敗")
    });
}

// ------------------------ 上下架切換 ------------------------
function toggleStatus(id, currentStatus) {
    $.ajax({
        url: `/api/v1/admin/books/${id}/status`,
        type: "PATCH",
        data: JSON.stringify({ status: currentStatus ? 0 : 1 }),
        contentType: "application/json",
        success: () => {
            alert("操作成功");
            loadBooks();
        },
        error: () => alert("操作失敗")
    });
}

// ------------------------ 初始化 ------------------------
$(function() {
    loadBooks();
});
