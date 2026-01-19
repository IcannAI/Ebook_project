// 登入檢查
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

// 取得網址 orderId
const params = new URLSearchParams(location.search);
const orderId = params.get("orderId");

if (!orderId || isNaN(orderId)) {
    $("#successBody").html(`
        <div class="order-info">
            <p style="color:#e74c3c;">無法取得訂單編號</p>
            <p>請至「我的訂單」查看最新訂單</p>
        </div>
        <div class="btn-group">
            <button class="btn-success btn-primary" onclick="location.href='order-list.html'">
                前往我的訂單
            </button>
        </div>
    `);
} else {
    $.get(`/api/members/orders/${orderId}`)
        .done(order => {
            const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleString("zh-TW") : "未知時間";
            const statusText = ["待付款","已付款","出貨中","已完成","已取消"][order.status] || "處理中";

            // 商品表格
            let itemsHtml = "";
            const items = order.items || [];
            if(items.length===0){
                itemsHtml = `<tr><td colspan="5" style="color:#888;">沒有商品資料</td></tr>`;
            } else {
                itemsHtml = items.map(i => `
                    <tr class="order-item clickable-row" data-id="${i.bookId}">
                        <td>${i.bookId}</td>
                        <td>${i.bookTitle ?? '未知書名'}</td>
                        <td>${i.quantity}</td>
                        <td>$${Number(i.unitPrice).toFixed(2)}</td>
                        <td>$${Number(i.subtotal).toFixed(2)}</td>
                    </tr>
                `).join('');
            }

            const html = `
                <div class="order-info">
                    <p>您的訂單編號</p>
                    <div class="order-id">#${order.orderId}</div>

                    <div class="info-row"><span class="info-label">訂購時間：</span>${dateStr}</div>
                    <div class="info-row"><span class="info-label">訂單狀態：</span><strong style="color:#27ae60;">${statusText}</strong></div>
                    <div class="info-row"><span class="info-label">付款方式：</span>${order.paymentMethodName || "未選擇"}</div>
                    <div class="info-row"><span class="info-label">訂單總額：</span><strong style="color:#d03;font-size:22px;">$${Number(order.totalAmount).toFixed(2)}</strong></div>

                    <h3 style="color:#008c5f;border-bottom:2px solid #008c5f;padding-bottom:8px;margin:20px 0 10px;">商品明細</h3>
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
                        <tbody class="order-items">${itemsHtml}</tbody>
                    </table>
                </div>

                <div class="btn-group">
                    <button class="btn-success btn-primary" onclick="location.href='order-list.html'">返回我的訂單</button>
                    <button class="btn-success btn-secondary" onclick="location.href='index.html'">繼續逛逛書城</button>
                </div>
            `;

            $("#successBody").html(html);

            // 點擊商品跳轉商品頁
            $(document).on("click", ".order-item", function() {
                const bookId = $(this).data("id");
                if(bookId) window.location.href = `productpage.html?id=${bookId}`;
            });
        })
        .fail(xhr=>{
            let msg="無法載入訂單資訊";
            if(xhr.status===404) msg="訂單不存在";
            if(xhr.status===401){ alert("登入逾時，請重新登入"); location.href="login.html"; return; }

            $("#successBody").html(`
                <div class="order-info" style="color:#e74c3c;">
                    <p>${msg}</p>
                    <p>訂單編號：${orderId}</p>
                </div>
                <div class="btn-group">
                    <button class="btn-success btn-primary" onclick="location.href='order-list.html'">前往我的訂單</button>
                </div>
            `);
        });
}
