// 檢查登入（使用帶認證的 API 工具）
function checkRealLogin() {
    getWithAuth("http://localhost:8080/api/auth/who")
        .done(() => loadCart())
        .fail(() => {
            alert("請先登入會員");
            location.href = "login.html";
        });
}

// 強制登出
function forceLogout() {
    if (!confirm("確定要登出嗎？")) return;
    postWithAuth("http://localhost:8080/api/members/logout", {}).always(() => {
        localStorage.clear();
        sessionStorage.clear();
        location.href = "login.html";
    });
}

// 載入購物車
function loadCart() {
    getWithAuth("http://localhost:8080/api/members/cart")
        .done(data => {
            const items = data.items || [];
            const total = data.totalAmount || 0;

            if (!items.length) {
                $("#cartBody").html('<tr><td colspan="6" class="no-data">您的購物車目前是空的</td></tr>');
                $("#totalAmount").text("0");
                return;
            }

            const rows = items.map(item => {
                const bookId = item.bookId;
                const title = item.bookName || ("書籍ID " + bookId);
                const cover = item.coverImage ? `images/books/${item.coverImage}` : `images/books/default.jpg`;

                return `
                <tr>

                    <!-- 書籍（可點擊封面 + 書名） -->
                    <td style="cursor:pointer;">
                        <div onclick="location.href='productpage.html?id=${bookId}'" style="display:flex; align-items:center; gap:12px;">

                            <!-- 封面 -->
                            <img src="${cover}"
                                 alt="${title}"
                                 style="width:50px; height:70px; object-fit:cover; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">

                            <!-- 書名（可點） -->
                            <span style="color:#008c5f; font-weight:bold; text-decoration:underline;">
                                ${title}
                            </span>

                        </div>
                    </td>

                    <td>${item.price.toLocaleString()} 元</td>

                    <td>
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">－</button>
                        <span class="qty-text" id="qty-${item.id}">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">＋</button>
                    </td>

                    <td>
                        <span id="sub-${item.id}" data-price="${item.price}">
                            ${(item.price * item.quantity).toLocaleString()}
                        </span> 元
                    </td>

                    <td>${formatDateTime(item.createdAt)}</td>

                    <td>
                        <button class="btn-small btn-remove" onclick="removeItem(${item.id})">刪除</button>
                    </td>
                </tr>
                `;
            }).join('');

            $("#cartBody").html(rows);
            $("#totalAmount").text(Number(total).toLocaleString());
        })
        .fail(() => {
            $("#cartBody").html('<tr><td colspan="6" class="no-data">載入失敗，請重新登入</td></tr>');
            setTimeout(forceLogout, 2000);
        });
}

// === 即時加減數量 ===
function changeQty(itemId, diff) {
    const span = $(`#qty-${itemId}`);
    let qty = parseInt(span.text());

    qty += diff;
    if (qty < 1) return;

    span.text(qty);

    const price = parseInt($(`#sub-${itemId}`).data("price"));
    $(`#sub-${itemId}`).text((price * qty).toLocaleString());

    recalcTotal();

    putWithAuth(`http://localhost:8080/api/members/cart/${itemId}`, { quantity: qty });
}

// === 重新計算總金額 ===
function recalcTotal() {
    let total = 0;

    $("span[id^='sub-']").each(function () {
        total += parseInt($(this).text().replace(/,/g, ""));
    });

    $("#totalAmount").text(total.toLocaleString());
}

// 刪除商品
function removeItem(itemId) {
    if (!confirm("確定要從購物車移除此商品嗎？")) return;

    deleteWithAuth(`http://localhost:8080/api/members/cart/${itemId}`)
        .done(() => loadCart())
        .fail(() => alert("移除失敗"));
}

// 格式化時間
function formatDateTime(dateStr) {
    const dt = new Date(dateStr);
    return dt.toLocaleString();
}

// 頁面載入
$(function () { checkRealLogin(); });
