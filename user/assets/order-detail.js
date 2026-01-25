// jQuery 所有 AJAX 都夾帶 Session Cookie
$.ajaxSetup({
    xhrFields: { withCredentials: true }
});

// 讀取登入者
function loadUser() {
    $.get("/api/auth/who")
        .done(res => {
            $("#navUser").text(`Hi, ${res.name}`);
        })
        .fail(() => {
            location.href = "login.html";
        });
}
loadUser();

// 登出
function logoutUser() {
    $.post("/api/members/logout")
        .always(() => {
            sessionStorage.clear();
            localStorage.clear();
            location.href = "login.html";
        });
}

// 訂單狀態
const statusMap = {
    0: { text: "待付款", class: "status-0" },
    1: { text: "已付款", class: "status-1" },
    2: { text: "出貨中", class: "status-2" },
    3: { text: "已完成", class: "status-3" },
    4: { text: "已取消", class: "status-4" }
};

// 點擊商品列跳轉商品頁
$(document).on("click", ".clickable-row", function() {
    const bookId = $(this).data("id");
    if (bookId) window.location.href = `productpage.html?id=${bookId}`;
});

// 取得 URL 訂單 ID
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

if (!orderId || isNaN(orderId)) {
    $("#orderContent").html('<div class="no-data">錯誤：無效的訂單編號</div>');
} else {
    $.get(`/api/members/orders/${orderId}`)
        .done(function(order) {
            const items = order.items || [];
            const statusInfo = statusMap[order.status] || { text: "未知", class: "" };
            const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleString('zh-TW') : '未知時間';

            const shipping = order.shippingInfo || {};
            const shippingHtml = `
                收件人：${shipping.receiver ?? ''} <br>
                電話：${shipping.phone ?? ''} <br>
                地址：${shipping.fullAddress ?? ''}
            `;

            // 產生商品明細
            let itemsHtml = "";
            if (items.length === 0) {
                itemsHtml = `<tr><td colspan="5" style="text-align:center;color:#888;">沒有商品資料</td></tr>`;
            } else {
                itemsHtml = items.map(i => `
                    <tr class="clickable-row" data-id="${i.bookId}">
                        <td>${i.bookId}</td>
                        <td>${i.bookTitle ?? '未知書名'}</td>
                        <td>${i.quantity}</td>
                        <td>$${Number(i.unitPrice).toFixed(2)}</td>
                        <td>$${Number(i.subtotal).toFixed(2)}</td>
                    </tr>
                `).join('');
            }

            const html = `
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">訂單編號</span>
                        #${order.orderId}
                    </div>
                    <div class="info-item">
                        <span class="info-label">訂單狀態</span>
                        <span class="status-tag ${statusInfo.class}">${statusInfo.text}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">訂購時間</span>
                        ${dateStr}
                    </div>
                    <div class="info-item">
                        <span class="info-label">付款方式</span>
                        ${order.paymentMethodName ?? "未選擇"}
                    </div>
                    <div class="info-item" style="grid-column: span 2;">
                        <span class="info-label">配送資訊</span>
                        ${shippingHtml}
                    </div>
                </div>

                <h3 style="color:#008c5f;border-bottom:2px solid #008c5f;padding-bottom:8px;margin:30px 0 15px;">
                    商品明細
                </h3>

                <table class="table">
                    <thead>
                        <tr>
                            <th>書籍ID</th>
                            <th>書名</th>
                            <th>數量</th>
                            <th>單價</th>
                            <th>小計</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>

                <div class="total-row">
                    訂單總金額：$${Number(order.totalAmount).toFixed(2)}
                </div>

                <div class="btn-group">
                    <button class="btn btn-primary" onclick="location.href='order-list.html'">返回訂單列表</button>
                    <button class="btn btn-secondary" onclick="location.href='index.html'">繼續購物</button>
                </div>
            `;

            $("#orderContent").html(html);
        })
        .fail(xhr => {
            if (xhr.status === 401) {
                alert("登入逾時，請重新登入");
                location.href = "login.html";
                return;
            }
            $("#orderContent").html(`<div class="no-data">載入失敗：${xhr.responseJSON?.message ?? "請確認訂單是否存在"}</div>`);
        });
}
