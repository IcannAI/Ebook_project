// ==========================
//   登出
// ==========================
function logoutAndRedirect() {
    if (!confirm('確定要登出嗎？')) return;
    postWithAuth("http://localhost:8080/api/members/logout", {})
        .always(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "login.html";
        });
}

// ==========================
//   訊息提示
// ==========================
function showAlert(msg, type = 'error') {
    const $box = $('#alertBox')
        .removeClass('alert-success alert-error alert-warning')
        .addClass('alert-' + type)
        .text(msg)
        .fadeIn();

    if (type !== 'success') setTimeout(() => $box.fadeOut(), 5000);
}

// ==========================
//   欄位錯誤
// ==========================
function showFieldError(id, msg) {
    const $input = $('#' + id);
    const $err = $('#' + id + 'Error');

    if (msg) {
        $input.addClass('error');
        $err.text(msg).fadeIn();
    } else {
        $input.removeClass('error');
        $err.fadeOut();
    }
}

function clearAllErrors() {
    $('.form-group input').removeClass('error');
    $('.error-message').fadeOut();
}

// ==========================
//   驗證
// ==========================
function validateName(v) { return v && v.trim().length >= 2; }
function validateEmail(v) { return v && /^\S+@\S+\.\S+$/.test(v); }
function validatePhone(v) { return !v || /^09\d{8}$/.test(v); }
function validatePassword(v) { return v && v.length >= 6; }

// ==========================
//   載入會員資料
// ==========================
function checkLoginAndLoadProfile() {
    $('#loadingIndicator').show();
    $('#profileForm').hide();

    getWithAuth("http://localhost:8080/api/auth/who")
        .done(m => {
            $('#id').val(m.id);
            $('#account').val(m.account);
            $('#name').val(m.name || '');
            $('#email').val(m.email || '');
            $('#phone').val(m.phone || '');

            sessionStorage.setItem("memberName", m.name);
            sessionStorage.setItem("memberId", m.id);

            $('#loadingIndicator').hide();
            $('#profileForm').fadeIn();
        })
        .fail(xhr => {
            if (xhr.status === 401) {
                showAlert('請先登入', 'warning');
                setTimeout(() => location.href = 'login.html', 1500);
            } else {
                showAlert('載入失敗', 'error');
            }
        });
}

// ==========================
//   儲存個人資料
// ==========================
function updateProfile() {
    clearAllErrors();

    const id = $('#id').val();
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const phone = $('#phone').val().trim();

    let ok = true;
    if (!validateName(name)) { showFieldError('name', '姓名至少2個字'); ok = false; }
    if (!validateEmail(email)) { showFieldError('email', 'Email格式錯誤'); ok = false; }
    if (!validatePhone(phone)) { showFieldError('phone', '手機格式錯誤'); ok = false; }
    if (!ok) return showAlert('請修正錯誤欄位');

    const data = {
        account: $('#account').val(),
        password: null,
        name,
        email,
        phone: phone || null
    };

    $('#saveBtn').prop('disabled', true).text('儲存中...');

    putWithAuth(`http://localhost:8080/api/members/${id}`, data)
    .done(() => {
        showAlert('個人資料已更新！', 'success');
        checkLoginAndLoadProfile();
    })
    .fail(() => showAlert('更新失敗', 'error'))
    .always(() => $('#saveBtn').prop('disabled', false).text('儲存修改'));
}

// ==========================
//   修改密碼
// ==========================
function changePassword() {
    clearAllErrors();

    const p1 = $('#newPassword').val();
    const p2 = $('#newPassword2').val();

    if (!p1 || !p2) return showAlert("請輸入新密碼兩次");
    if (!validatePassword(p1)) return showAlert("密碼至少 6 位數");
    if (p1 !== p2) return showAlert("兩次密碼不一致");

    if (!confirm("確定要修改密碼？修改後需重新登入")) return;

    const id = $('#id').val();
    const data = {
        account: $('#account').val(),
        password: p1,
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val() || null
    };

    $('#pwdBtn').prop('disabled', true).text('更新中...');

    putWithAuth(`http://localhost:8080/api/members/${id}`, data)
    .done(() => {
        showAlert("密碼已更新！即將登出重新登入", "success");
        setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            location.href = "login.html";
        }, 2000);
    })
    .fail(() => {
        showAlert("密碼更新失敗");
        $('#pwdBtn').prop('disabled', false).text('更改密碼');
    });
}

// ==========================
//   刪除帳號
// ==========================
function deleteAccount() {
    if (!confirm("確定要永久刪除帳號？此動作無法復原！")) return;

    const account = $('#account').val();
    const input = prompt("請再次輸入帳號以確認：");

    if (input !== account) {
        return showAlert('帳號確認錯誤，已取消', 'warning');
    }

    const id = $('#id').val();

    deleteWithAuth(`http://localhost:8080/api/members/${id}`)
    .done(() => {
        showAlert('帳號已刪除', 'success');
        setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            location.href = 'login.html';
        }, 1500);
    })
    .fail(xhr => {
        if (xhr.status === 403)
            showAlert('只能刪除自己的帳號', 'error');
        else
            showAlert('刪除失敗', 'error');
    });
}

// ==========================
//   初始化
// ==========================
$(function () {

    checkLoginAndLoadProfile();

    // 儲存按鈕
    $("#saveBtn").on("click", updateProfile);

    // 修改密碼
    $("#pwdBtn").on("click", changePassword);

    // 刪除帳號
    $("#deleteBtn").on("click", deleteAccount);

    // 即時驗證
    $('#name,#email,#phone,#newPassword,#newPassword2').on('blur', function () {
        const id = this.id;
        const v = $(this).val().trim();

        if (id === 'name' && !validateName(v)) showFieldError('name', '姓名至少2個字');
        if (id === 'email' && !validateEmail(v)) showFieldError('email', 'Email格式錯誤');
        if (id === 'phone' && !validatePhone(v)) showFieldError('phone', '手機格式錯誤');
        if (id === 'newPassword' && !validatePassword(v)) showFieldError('newPassword', '至少6位');
        if (id === 'newPassword2' && $('#newPassword').val() !== v) showFieldError('newPassword2', '兩次密碼不一致');
    });

});
