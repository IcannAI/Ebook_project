/* ============================================================
   全域：讀取登入資訊
============================================================ */
let currentUser = null;

function loadUserFromStorage() {
    const u = localStorage.getItem("user");
    if (u) currentUser = JSON.parse(u);
}

loadUserFromStorage();

/* ============================================================
   書籍 API
============================================================ */

function loadHotBooks() {
    $.get("/api/books/hot", books => {
        renderBookList(books);
    });
}

function searchBooks() {
    let keyword = $("#keyword").val().trim();
    if (!keyword) return;

    $.get(`/api/books/search?keyword=${keyword}`, books => {
        renderBookList(books);
    });
}

function loadCategoryBooks(cid) {
    $.get(`/api/books/category/${cid}`, books => {
        renderBookList(books);
    });
}

/* ============================================================
   書籍列表渲染
============================================================ */
function renderBookList(list) {
    let html = "";
    list.forEach(b => {
        html += `
            <div class="book-card">
                <a href="book.html?id=${b.id}">
                    <img src="${b.cover_image}">
                    <div class="title">${b.title}</div>
                </a>
                <div>作者：${b.authors}</div>
                <div>價格：$${b.price}</div>
                ${
                    currentUser 
                    ? `<button onclick="addToCart(${b.id})">加入購物車</button>`
                    : `<small>登入後才能購買</small>`
                }
            </div>
        `;
    });
    $("#bookList").html(html);
}

/* ============================================================
   書籍詳細頁
============================================================ */
function loadBookDetail() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    $.get(`/api/books/${id}`, b => {
        $("#bookTitle").text(b.title);
        $("#bookImg").attr("src", b.cover_image);
        $("#bookAuthor").text(b.authors);
        $("#bookPrice").text("$" + b.price);
        $("#bookDesc").text(b.description);
    });
}

/* ============================================================
   購物車 API
============================================================ */
function addToCart(bookId) {
    if (!currentUser) {
        alert("請先登入！");
        location.href = "login.html";
        return;
    }

    $.post("/api/cart/add", { bookId }, () => {
        alert("已加入購物車！");
    });
}

function loadCart() {
    $.get("/api/cart", res => {
        let html = "";

        res.items.forEach(i => {
            html += `
                <div class="cart-row">
                    <b>${i.book.title}</b>
                    <br>數量：${i.quantity}
                    <br>小計：$${i.subtotal}
                    <br><button onclick="removeItem(${i.id})">移除</button>
                </div>
            `;
        });

        html += `<h2 style="text-align:center;">總額：$${res.total}</h2>
                 <div style="text-align:center;">
                    <button onclick="checkout()" style="padding:12px 20px;">前往結帳</button>
                 </div>`;

        $("#cartArea").html(html);
    });
}

function removeItem(id) {
    $.ajax({
        url: `/api/cart/item/${id}`,
        type: "DELETE",
        success: loadCart
    });
}

function checkout() {
    $.post("/api/orders/checkout", res => {
        alert("訂單已成立，編號：" + res.orderId);
        location.href = "user-center.html";
    });
}

/* ============================================================
   會員中心
============================================================ */
function loadUserCenter() {
    $.get("/api/users/me", u => {
        $("#userInfo").html(`
            <div class="user-info">
                <b>帳號：</b> ${u.username}<br>
                <b>Email：</b> ${u.email}<br>
                <b>電話：</b> ${u.phone}<br>
                <b>地址：</b> ${u.address}<br>
            </div>
        `);
    });

    $.get("/api/orders/my", orders => {
        let html = "";
        orders.forEach(o => {
            html += `
                <div class="order-item">
                    訂單編號：${o.id}<br>
                    金額：$${o.total}<br>
                    狀態：${o.status}<br>
                    時間：${o.created_at}
                </div>
            `;
        });
        $("#orderList").html(html);
    });
}

/* ============================================================
   使用者登入/註冊
============================================================ */
function login() {
    $.post("/api/login", {
        username: $("#username").val(),
        password: $("#password").val(),
    }, res => {
        localStorage.setItem("user", JSON.stringify(res));
        alert("登入成功！");
        location.href = "index.html";
    }).fail(() => alert("帳號或密碼錯誤"));
}

function register() {
    $.post("/api/register", {
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val()
    }, () => {
        alert("註冊成功！");
        location.href = "login.html";
    });
}


function loadBanners() {
    $.get("/api/banners", res => {
        let html = "";

        res.forEach(b => {
            html += `
                <div class="swiper-slide">
                    <a href="${b.link || '#'}">
                        <img src="${b.imageUrl}" class="banner-img">
                    </a>
                </div>`;
        });

        $("#bannerSwiper").html(html);

        new Swiper(".mySwiper", {
            loop: true,
            autoplay: { delay: 3000 },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            effect: "slide"
        });
    });
}

$(function(){
    loadBanners();
});
