// ログイン後にトークンを保存
function saveToken(token) {
    localStorage.setItem("jwtToken", token);
}

// トークンを取得
function getToken() {
    return localStorage.getItem("jwtToken");
}

// ログアウト時にトークンを削除
function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
}

// Authorization ヘッダー付きの fetch 関数
async function authFetch(url, options = {}) {
    const token = getToken();
    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${token}`;
    return fetch(url, options);
}

