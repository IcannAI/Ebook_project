checkAdminLogin();

const urlParams = new URLSearchParams(location.search);
const orderId = urlParams.get('id');
let editingDetailId = null;

$(document).ready(function() {
    if (!orderId) {
        alert("無訂單編號");
        location.href = "admin-order-list.html";
    } else {
        $("#orderIdDisplay").text(orderId);
        loadDetails();
    }

    $("#quantity, #priceAtMoment").on("input", updateSubtotal);

    // 點擊外部關閉 modal
    $(window).on("click", function(e) {
        if (e.target.id === "detailModal") closeModal();
    });
});

function loadDetails() {
    $.get(`/api/v1/admin/orders/${orderId}/details`, details => {
        $("#detailBody").html(details.map(d => `
            <tr>
                <td>${d.id}</td>
                <td>${d.book_id}</td>
                <td>${d.quantity}</td>
                <td>$${parseFloat(d.price_at_moment).toFixed(2)}</td>
                <td class="subtotal">$${parseFloat(d.subtotal).toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editDetail(${d.id}, ${d.book_id}, ${d.quantity}, ${d.price_at_moment})">修改</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDetail(${d.id})">刪除</button>
                </td>
            </tr>
        `).join(''));

        const total = details.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);
        $("#totalAmount").text(total.toFixed(2));
    });
}

function openAddDetailModal() {
    editingDetailId = null;
    $("#modalTitle").text("新增訂單明細");
    $("#detailForm")[0].reset();
    $("#detailId").val("");
    updateSubtotal();
    $("#detailModal").show();
}

function editDetail(id, bookId, qty, price) {
    editingDetailId = id;
    $("#modalTitle").text("修改訂單明細");
    $("#detailId").val(id);
    $("#bookId").val(bookId);
    $("#quantity").val(qty);
    $("#priceAtMoment").val(price);
    updateSubtotal();
    $("#detailModal").show();
}

function closeModal() {
    $("#detailModal").hide();
}

function updateSubtotal() {
    const qty = parseFloat($("#quantity").val()) || 0;
    const price = parseFloat($("#priceAtMoment").val()) || 0;
    $("#subtotal").val((qty * price).toFixed(2));
}

function saveDetail() {
    const data = {
        book_id: parseInt($("#bookId").val()),
        quantity: parseInt($("#quantity").val()),
        price_at_moment: parseFloat($("#priceAtMoment").val())
    };

    if (!data.book_id || !data.quantity || !data.price_at_moment) {
        alert("請填寫完整資料");
        return;
    }

    const method = editingDetailId ? "PUT" : "POST";
    const url = editingDetailId 
        ? `/api/v1/admin/orders/${orderId}/details/${editingDetailId}`
        : `/api/v1/admin/orders/${orderId}/details`;

    $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function() {
            alert(editingDetailId ? "修改成功" : "新增成功");
            closeModal();
            loadDetails();
        },
        error: function(xhr) {
            alert("操作失敗：" + (xhr.responseText || "請檢查資料"));
        }
    });
}

function deleteDetail(id) {
    if (confirm("確定刪除此明細？")) {
        $.ajax({
            url: `/api/v1/admin/orders/${orderId}/details/${id}`,
            type: "DELETE",
            success: function() {
                alert("刪除成功");
                loadDetails();
            }
        });
    }
}

function exportDetailCSV() {
    $.get(`/api/v1/admin/orders/${orderId}/details`, details => {
        let csv = "\uFEFFID,訂單編號,書籍ID,數量,單價,小計\n";
        details.forEach(d => {
            csv += `${d.id},${orderId},${d.book_id},${d.quantity},${d.price_at_moment},${d.subtotal}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `訂單明細_${orderId}_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
    });
}
