//login.js
/***** main *****/
let main = document.getElementsByTagName("main")[0];

//breadcrumbs
breadcrumbsFn(main,"login");

//main title
mainTitleFn(main,"login");

//form error
let formError = document.createElement("p");
formError.classList.add("form_error");
formError.innerHTML = "";
main.appendChild(formError);

//form
let formDiv = document.createElement("div");
formDiv.classList.add("form");
main.appendChild(formDiv);

let formName = document.createElement("div");
formDiv.appendChild(formName);

let formNameP = document.createElement("p");
formNameP.innerHTML = "ニックネーム";
formName.appendChild(formNameP);

let formNameInput = document.createElement("input");
formNameInput.type = "text";
formNameInput.name = "text";
formName.appendChild(formNameInput);

let formPassword = document.createElement("div");
formDiv.appendChild(formPassword);

let formPasswordP = document.createElement("p");
formPasswordP.innerHTML = "パスワード";
formPassword.appendChild(formPasswordP);

let formPasswordInput = document.createElement("input");
formPasswordInput.type = "password";
formPasswordInput.name = "password";
formPasswordInput.autocomplete = "off";
formPassword.appendChild(formPasswordInput);

let loginButton = document.createElement("a");
loginButton.classList.add("login_button");
loginButton.href = "index.html";
loginButton.innerHTML = "ログイン";
main.appendChild(loginButton);

let hr = document.createElement("hr");
hr.classList.add("login_hr");
main.appendChild(hr);

let registerButton = document.createElement("a");
registerButton.classList.add("register_button");
registerButton.href = "registration.html";
registerButton.innerHTML = "アカウント未登録の方";
main.appendChild(registerButton);

// loginButton.addEventListener("click", async function (e) {
//     e.preventDefault();

//     const username = formNameInput.value.trim();
//     const password = formPasswordInput.value.trim();

//     if (!username || !password) {
//         formError.innerHTML = "すべての項目を入力してください。";
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:8080/api/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, password })
//         });

//         if (response.ok) {
//             // const data = await response.json();
//             // saveToken(data.token); // auth.js より
//             localStorage.setItem("token", response.token);
//             window.location.href = "profile.html";
//         } else {
//             const err = await response.text();
//             formError.innerHTML = err || "ログインに失敗しました。";
//         }
//     } catch (error) {
//         console.error(error);
//         formError.innerHTML = "サーバー接続中にエラーが発生しました。";
//     }
// });

// loginButton.addEventListener("click", async function (e) {
//     e.preventDefault();
//     formError.innerHTML = "";

//     const username = formNameInput.value.trim();
//     const password = formPasswordInput.value.trim();

//     if (!username || !password) {
//         formError.innerHTML = "すべての項目を入力してください。";
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:8080/api/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, password })
//         });

//         if (response.ok) {
//             // parse JSON body
//             let data;
//             try {
//                 data = await response.json();
//             } catch (err) {
//                 console.error("ログインレスポンスの JSON を解析できません:", err);
//                 formError.innerHTML = "サーバーから不正なデータが返されました。";
//                 return;
//             }

//             // よく使われるフィールドからトークンを探す
//             const token = data.token || data.jwt || data.accessToken || data.jwtToken;
//             if (!token) {
//                 console.log("Login response (no token):", data);
//                 formError.innerHTML = "ログイン失敗：サーバーがトークンを返しませんでした。";
//                 return;
//             }

//             // profile.js と同じキーでトークンを保存
//             localStorage.setItem("jwtToken", token);

//             // profile へ遷移
//             window.location.href = "profile.html";
//         } else {
//             // エラーメッセージを取得（テキストまたは JSON）
//             let errText = await response.text();
//             try {
//                 const errObj = JSON.parse(errText);
//                 errText = errObj.message || errObj.error || JSON.stringify(errObj);
//             } catch (e) { /* JSON でなければ errText をそのまま使う */ }
//             formError.innerHTML = errText || "ログインに失敗しました。";
//         }
//     } catch (error) {
//         console.error("ログイン API 呼び出しエラー:", error);
//         formError.innerHTML = "サーバー接続中にエラーが発生しました。";
//     }
// });

loginButton.addEventListener("click", async function (e) {
    e.preventDefault();
    formError.innerHTML = "";

    const username = formNameInput.value.trim();
    const password = formPasswordInput.value.trim();

    if ( !username ) {
        formError.innerHTML = "ニックネームを入力してください．";
        return;
    } else if ( !password ) {
        formError.innerHTML = "パスワードを入力してください．";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json(); // バックエンドは { token: "..." } を返す
            if (!data.token) {
                console.error("トークンなしのログイン応答:", data);
                formError.innerHTML = "ログイン失敗: サーバーがトークンを返しません。";
                return;
            }

            // トークンを保存（profile.js と同じキー）
            window.auth.onLoginSuccess(data.token);
        } else {
            let errText = await response.text();
            try {
                const errObj = JSON.parse(errText);
                errText = errObj.message || errObj.error || JSON.stringify(errObj);
            } catch (_) {}
            formError.innerHTML = errText || "ログインに失敗しました";
        }
    } catch (error) {
        console.error("APIログイン時のエラー:", error);
        formError.innerHTML = "サーバー接続時にエラーが発生しました。";
    }
});



