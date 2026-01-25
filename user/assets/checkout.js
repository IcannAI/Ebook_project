// 檢查登入（共用登入檢查）
checkLogin();

// 強制登出
function forceLogout() {
    if (confirm("確定要登出嗎？")) {
        if (typeof logout === 'function') logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// 載入訂單總金額
getWithAuth("http://localhost:8080/api/members/cart").done(data => {
    $("#total").text((data.totalAmount || 0).toLocaleString());
});

// 載入宅配地址
getWithAuth("http://localhost:8080/api/members/shipping").done(list => {
    if (list && list.length > 0) {
        const addr = list.find(a => a.method_name?.includes("住家")) || list[0];
        $("#homeAddress").val(`${addr.method_name || '住家'}：${addr.address}`);
    } else {
        $("#homeAddress").val("尚未設定宅配地址，請至「地址管理」新增");
    }
});

// 載入付款方式
getWithAuth("http://localhost:8080/api/payment-methods").done(function(methods) {
    const select = $('#payment');
    select.empty();
    methods.forEach(method => {
        select.append(`<option value="${method.name}">${method.name}</option>`);
    });
});

// 配送方式切換
$("#shippingOptions").on("click", ".shipping-option", function() {
    $("#shippingOptions .shipping-option").removeClass("selected");
    $(this).addClass("selected");
    const type = $(this).data("type");
    $("#shippingType").val(type);
    $("#homeAddress").toggle(type === "home");
});

// 預設選第一個（宅配到府）
$("#shippingOptions .shipping-option").first().trigger("click");

// 結帳
function checkout() {
    const shippingType = $("#shippingType").val();
    const payment = $("#payment").val();

    if (!shippingType) {
        alert("請選擇配送方式！");
        return;
    }

    if (shippingType === "home") {
        getWithAuth("http://localhost:8080/api/members/shipping").done(list => {
            if (!list || list.length === 0) {
                alert("尚未設定宅配地址！");
                setTimeout(() => location.href = "shipping-address.html", 1000);
                return;
            }
            const addr = list.find(a => a.method_name?.includes("住家")) || list[0];
            submitOrder(addr.id, payment);
        });
    } else {
        submitOrder(null, payment, shippingType);
    }
}

//結帳
function submitOrder(shippingInfoId, paymentMethod, storeType = null) {
    const data = {
        shippingInfoId,
        paymentMethod,
        storeType
    };

    postWithAuth("http://localhost:8080/api/members/orders/checkout", data)
        .done(res => {
            alert(`訂單成立成功！\n訂單編號：${res.id}`);
            setTimeout(() => location.href = "order-list.html", 1500);
        })
        .fail(xhr => {
            alert("結帳失敗：" + (xhr.responseJSON?.message || "系統錯誤"));
        });
}
