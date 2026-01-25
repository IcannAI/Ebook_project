// common.js 裡的登入檢查
checkLogin();

// 手動登出
function forceLogout() {
    if (confirm("確定要登出嗎？")) {
        if (typeof logout === "function") logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// 狀態對應
const statusMap = {
    0: { text: "待付款", class: "status-0" },
    1: { text: "已付款", class: "status-1" },
    2: { text: "出貨中", class: "status-2" },
    3: { text: "已完成", class: "status-3" },
    4: { text: "已取消", class: "status-4" }
};

// 渲染訂單卡片
function renderOrders(orders) {
    if (orders.length === 0) {
        $("#orderList").html(`<div class="no-data">目前沒有符合條件的訂單</div>`);
        return;
    }

    const html = orders
        .map(order => {
            const s = statusMap[order.status] || { text: "未知", class: "" };
            const date = order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "未知時間";

            // 商品列表：每個書名加上超連結
            const itemsHtml = (order.items || [])
                .map(item => `
                    <div class="info-item">
                        <span>商品名稱：</span><br>
                        <strong class="book-link" onclick="location.href='productpage.html?id=${item.bookId}'">
                            ${item.title}
                        </strong>
                        <br>數量：${item.quantity} 本
                    </div>
                `).join("");

            return `
                <div class="order-card" onclick="location.href='order-detail.html?id=${order.id}'">
                    <div class="card-header">
                        <div class="order-id">訂單編號：${order.id}</div>
                        <div class="status ${s.class}">${s.text}</div>
                    </div>

                    <div class="card-body">
                        <div class="info-item">
                            <span>下單時間</span><br>
                            <strong>${date}</strong>
                        </div>
                        <div class="info-item">
                            <span>付款方式</span><br>
                            <strong>${order.paymentName || "未選擇"}</strong>
                        </div>
                        <div class="info-item">
                            <span>商品總計</span><br>
                            <strong>${order.totalAmount?.toFixed(2) || "0.00"} 元</strong>
                        </div>

                        ${itemsHtml}  <!-- 商品名稱超連結 -->
                    </div>

                    <div class="card-footer">
                        訂單總金額：$${order.totalAmount?.toFixed(2) || "0.00"}
                    </div>
                </div>
            `;
        })
        .join("");

    $("#orderList").html(html);
}


// 載入訂單列表
function loadOrders(status = -1) {
    let url = "http://localhost:8080/api/members/orders";
    if (status !== -1) url += `?status=${status}`;

    getWithAuth(url)
        .done(res => renderOrders(res))
        .fail(xhr => {
            const msg = xhr.responseJSON?.message || "載入訂單失敗";
            $("#orderList").html(`<div class="no-data">錯誤：${msg}</div>`);

            if (xhr.status === 401) {
                alert("登入逾時，請重新登入");
                location.href = "login.html";
            }
        });
}

// 篩選事件
$("#statusFilter").on("change", function () {
    loadOrders(parseInt($(this).val()));
});

// 頁面載入 → 取得全部訂單
$(function () {
    loadOrders();
});
