checkAdminLogin();

let editingOrderId = null;

/* -------------------------
   讀取訂單（含查詢功能）
------------------------- */
function loadOrders() {
    const params = [];

    const s = $("#startDate").val();
    const e = $("#endDate").val();
    const st = $("#searchStatus").val();
    const oid = $("#searchOrderId").val();

    if (s) params.push(`startDate=${s}`);
    if (e) params.push(`endDate=${e}`);
    if (st !== "") params.push(`status=${st}`);
    if (oid) params.push(`orderId=${oid}`);

    const query = params.length ? "?" + params.join("&") : "";

    $.ajax({
        url: "/api/admin/orders" + query,
        method: "GET",
        xhrFields: { withCredentials: true },
        success: function(orders) {

            const statusText = ['待付款', '已付款', '出貨中', '已完成'];

            $("#orderBody").html(orders.map(o => `
                <tr>
                    <td><strong>${o.orderId}</strong></td>
                    <td>${o.memberId}</td>
                    <td>${o.shippingInfoId}</td>
                    <td>$${o.totalAmount.toFixed(2)}</td>
                    <td class="status-${o.status}"><strong>${statusText[o.status]}</strong></td>
                    <td>${o.createdAt}</td>
                    <td>${o.updatedAt}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="goDetail(${o.orderId})">查看詳情</button>
                        <button class="btn btn-primary btn-sm" onclick="editOrder(${o.orderId}, ${o.memberId}, ${o.shippingInfoId}, ${o.totalAmount}, ${o.status})">修改</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOrder(${o.orderId})">刪除</button>
                    </td>
                </tr>
            `).join(''));
        }
    });
}

/* 查看詳情 */
function goDetail(orderId) {
    window.location.href = `admin-order-detail.html?orderId=${orderId}`;
}

/* ----------------------
   新增/修改 Modal
---------------------- */
function openAddModal() {
    editingOrderId = null;
    $("#modalTitle").text("新增訂單");
    $("#orderForm")[0].reset();
    $("#orderModal").show();
}

function editOrder(orderId, memberId, shippingInfoId, totalAmount, status) {
    editingOrderId = orderId;
    $("#modalTitle").text("修改訂單");
    $("#memberId").val(memberId);
    $("#shippingInfoId").val(shippingInfoId);
    $("#totalAmount").val(totalAmount);
    $("#status").val(status);
    $("#orderModal").show();
}

function closeModal() {
    $("#orderModal").hide();
}

/* ----------------------
    儲存（新增/修改）
---------------------- */
function saveOrder() {
    const data = {
        memberId: parseInt($("#memberId").val()),
        shippingInfoId: parseInt($("#shippingInfoId").val()),
        totalAmount: parseFloat($("#totalAmount").val()),
        status: parseInt($("#status").val())
    };

    const method = editingOrderId ? "PUT" : "POST";
    const url = editingOrderId
        ? `/api/admin/orders/${editingOrderId}`
        : "/api/admin/orders";

    $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },
        success: function() {
            alert(editingOrderId ? "修改成功" : "新增成功");
            closeModal();
            loadOrders();
        }
    });
}

/* ----------------------
   刪除訂單
---------------------- */
function deleteOrder(id) {
    if (!confirm(`確定刪除訂單 ${id}？`)) return;

    $.ajax({
        url: `/api/admin/orders/${id}`,
        type: "DELETE",
        xhrFields: { withCredentials: true },
        success: function() {
            alert("刪除成功");
            loadOrders();
        }
    });
}

/* ----------------------
   匯出 CSV
---------------------- */
function exportCSV() {
    const params = [];

    const s = $("#startDate").val();
    const e = $("#endDate").val();
    const st = $("#searchStatus").val();
    const oid = $("#searchOrderId").val();

    if (s) params.push(`startDate=${s}`);
    if (e) params.push(`endDate=${e}`);
    if (st !== "") params.push(`status=${st}`);
    if (oid) params.push(`orderId=${oid}`);

    const query = params.length ? "?" + params.join("&") : "";

    window.location.href = `/api/admin/orders/export${query}`;
}

/* 點擊 modal 外關閉 */
$(window).click(function (e) {
    if (e.target.id === "orderModal") closeModal();
});
