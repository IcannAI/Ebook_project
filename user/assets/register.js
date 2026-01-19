// ========== 工具函數 ==========

function handleApiError(xhr, defaultMsg = "操作失敗，請稍後再試") {
    let errorMsg = defaultMsg;

    if (xhr.status === 409) {
        errorMsg = "此帳號或 Email 已被註冊，請使用其他帳號";
    } else if (xhr.status === 400) {
        errorMsg = xhr.responseJSON?.message || "請求參數錯誤，請檢查輸入資料";
    } else if (xhr.status === 500) {
        errorMsg = "伺服器錯誤，請稍後再試";
    } else if (xhr.responseJSON?.message) {
        errorMsg = xhr.responseJSON.message;
    }

    return errorMsg;
}

function showAlert(message, type = 'error') {
    const alertBox = $('#alertBox');
    alertBox.removeClass('alert-success alert-error');
    alertBox.addClass('alert-' + type);
    alertBox.text(message).fadeIn();

    if (type !== 'success') {
        setTimeout(() => alertBox.fadeOut(), 5000);
    }
}

function showFieldError(fieldId, message) {
    const input = $('#' + fieldId);
    const errorDiv = $('#' + fieldId + 'Error');

    if (message) {
        input.addClass('error');
        errorDiv.text(message).fadeIn();
    } else {
        input.removeClass('error');
        errorDiv.fadeOut();
    }
}

function clearAllErrors() {
    $('.form-group input').removeClass('error');
    $('.error-message').fadeOut();
}

function validateAccount(account) {
    if (!account) return showFieldError('account', '帳號不能為空'), false;
    if (account.length < 4 || account.length > 20)
        return showFieldError('account', '帳號長度必須在 4-20 個字元之間'), false;
    if (!/^[a-zA-Z0-9]+$/.test(account))
        return showFieldError('account', '帳號只能包含英文字母和數字'), false;

    showFieldError('account', '');
    return true;
}

function validatePassword(password) {
    if (!password) {
        updatePasswordStrength(0);
        return showFieldError('password', '密碼不能為空'), false;
    }
    if (password.length < 8) {
        updatePasswordStrength(1);
        return showFieldError('password', '至少8碼，需包含大小寫英文與數字，且不可有特殊符號'), false;
    }

    // 強度計算
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    updatePasswordStrength(strength);
    showFieldError('password', '');
    return true;
}

function updatePasswordStrength(level) {
    const bar = $('#passwordStrengthBar');
    bar.removeClass('strength-weak strength-medium strength-strong');

    if (level === 1) bar.addClass('strength-weak');
    else if (level === 2 || level === 3) bar.addClass('strength-medium');
    else if (level >= 4) bar.addClass('strength-strong');
}

function validatePassword2(password, password2) {
    if (!password2)
        return showFieldError('password2', '請再次輸入密碼'), false;
    if (password !== password2)
        return showFieldError('password2', '兩次輸入的密碼不一致'), false;

    showFieldError('password2', '');
    return true;
}

function validateName(name) {
    if (!name.trim())
        return showFieldError('name', '姓名不能為空'), false;
    if (name.trim().length < 2)
        return showFieldError('name', '姓名至少需要 2 個字元'), false;

    showFieldError('name', '');
    return true;
}

function validateEmail(email) {
    if (!email)
        return showFieldError('email', 'Email 不能為空'), false;
    if (!/^\S+@\S+\.\S+$/.test(email))
        return showFieldError('email', '請輸入正確的 Email 格式'), false;

    showFieldError('email', '');
    return true;
}

function validatePhone(phone) {
    if (!phone) {
        showFieldError('phone', '');
        return true;
    }
    if (!/^09\d{8}$/.test(phone))
        return showFieldError('phone', '手機號碼格式不正確，請輸入09開頭的10位數字'), false;

    showFieldError('phone', '');
    return true;
}

// ========== 註冊功能 ==========

function registerUser() {
    clearAllErrors();
    $('#alertBox').fadeOut();

    const account = $("#account").val().trim();
    const password = $("#password").val();
    const password2 = $("#password2").val();
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();

    let isValid = true;
    if (!validateAccount(account)) isValid = false;
    if (!validatePassword(password)) isValid = false;
    if (!validatePassword2(password, password2)) isValid = false;
    if (!validateName(name)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePhone(phone)) isValid = false;

    if (!isValid) {
        showAlert("請修正表單中的錯誤", "error");
        return;
    }

    const registerBtn = $("#registerBtn");
    registerBtn.prop('disabled', true).text('註冊中...');

    $.ajax({
        url: "/api/members/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            account, password, name, email,
            phone: phone || null
        })
    })
    .done(() => {
        showAlert("註冊成功！即將跳轉到登入頁...", "success");
        $('input').val('');
        setTimeout(() => location.href = "login.html", 2000);
    })
    .fail(xhr => {
        const msg = handleApiError(xhr, "註冊失敗");
        showAlert(msg, "error");
        if (xhr.status === 409) {
            showFieldError('account', '此帳號已被使用');
        }
    })
    .always(() => {
        registerBtn.prop('disabled', false).text('立即註冊');
    });
}

// ========== 事件監聽 ==========

$('#account').on('blur', () => validateAccount($('#account').val().trim()));
$('#password').on('input', () => validatePassword($('#password').val()));
$('#password2').on('blur', () => validatePassword2($('#password').val(), $('#password2').val()));
$('#name').on('blur', () => validateName($('#name').val().trim()));
$('#email').on('blur', () => validateEmail($('#email').val().trim()));
$('#phone').on('blur', () => validatePhone($('#phone').val().trim()));

$(document).on("keypress", e => { if (e.which === 13) registerUser(); });

$(document).ready(() => { $("#account").focus(); });

$("#registerBtn").on("click", registerUser);
