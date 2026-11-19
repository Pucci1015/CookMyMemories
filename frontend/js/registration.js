// /***** main *****/
// let main = document.getElementsByTagName("main")[0];

// //breadcrumbs
// breadcrumbsFn(main,"registration");

// //main title
// mainTitleFn(main,"registration");

// //form error
// let formError = document.createElement("p");
// formError.classList.add("form_error");
// formError.innerHTML = "";
// main.appendChild(formError);

// //form
// let formDiv = document.createElement("div");
// formDiv.classList.add("form");
// main.appendChild(formDiv);

// let formName = document.createElement("div");
// formDiv.appendChild(formName);

// let formNameP = document.createElement("p");
// formNameP.innerHTML = "ニックネーム";
// formName.appendChild(formNameP);

// let formNameInput = document.createElement("input");
// formNameInput.type = "text";
// formNameInput.name = "text";
// formName.appendChild(formNameInput);

// let formMailAdress = document.createElement("div");
// formDiv.appendChild(formMailAdress);

// let formMailAdressP = document.createElement("p");
// formMailAdressP.innerHTML = "メールアドレス";
// formMailAdress.appendChild(formMailAdressP);

// let formMailAdressInput = document.createElement("input");
// formMailAdressInput.type = "email";
// formMailAdressInput.name = "email";
// formMailAdress.appendChild(formMailAdressInput);

// let formPassword = document.createElement("div");
// formDiv.appendChild(formPassword);

// let formPasswordP = document.createElement("p");
// formPasswordP.innerHTML = "パスワード";
// formPassword.appendChild(formPasswordP);

// let formPasswordInput = document.createElement("input");
// formPasswordInput.type = "password";
// formPasswordInput.name = "password";
// formPasswordInput.autocomplete = "off";
// formPassword.appendChild(formPasswordInput);

// let formPassword2 = document.createElement("div");
// formDiv.appendChild(formPassword2);

// let formPassword2P = document.createElement("p");
// formPassword2P.innerHTML = "パスワード(確認用)";
// formPassword2.appendChild(formPassword2P);

// let formPassword2Input = document.createElement("input");
// formPassword2Input.type = "password";
// formPassword2Input.name = "password";
// formPassword2Input.autocomplete = "off";
// formPassword2.appendChild(formPassword2Input);


// // for ( var i = 0 ; i < country.length ; i++ ) {
// //     let formCountryOption = document.createElement("option");
// //     formCountryOption.value = country[i].value;
// //     formCountryOption.innerHTML = country[i].name;
// //     formCountrySelect.appendChild(formCountryOption);
// // }
// // 国の配列（画面表示は日本語、API に送る value は英語）
// const country2 = [
//     { name: "日本", value: "Japan" },
//     { name: "ベトナム", value: "Vietnam" }
// ];
// let formCountry = document.createElement("div");
// formCountry.classList.add("formCountry");
// formDiv.appendChild(formCountry);

// let formCountryP = document.createElement("p");
// formCountryP.innerHTML = "母国";
// formCountry.appendChild(formCountryP);

// let formCountrySelect = document.createElement("select");
// formCountry.appendChild(formCountrySelect);
// // 表示名と API 送信用 value を持つ option を作成
// for (var i = 0; i < country2.length; i++) {
//     let formCountryOption = document.createElement("option");
//     formCountryOption.value = country2[i].value; // API に送信
//     formCountryOption.innerHTML = country2[i].name; // 表示用
//     if (i === 0) formCountryOption.selected = true;
//     formCountrySelect.appendChild(formCountryOption);
// }

// let registerButton = document.createElement("a");
// registerButton.classList.add("register_button");
// registerButton.href = "index.html";
// registerButton.innerHTML = "登録";
// main.appendChild(registerButton);

// registerButton.addEventListener("click", async function (e) {
//     e.preventDefault();

//     const username = formNameInput.value.trim();
//     const email = formMailAdressInput.value.trim();
//     const password = formPasswordInput.value.trim();
//     const password2 = formPassword2Input.value.trim();
//     const countryVal = formCountrySelect.value;

//     if (!username || !email || !password || !password2) {
//         formError.innerHTML = "すべての項目を入力してください。";
//         return;
//     }
//     if (password !== password2) {
//         formError.innerHTML = "確認用パスワードが一致しません。";
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:8080/api/users/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, email, password, country: countryVal })
//         });

//         if (response.ok) {
//             alert("登録しました！ログインしてください。");
//             window.location.href = "login.html";
//         } else {
//             const err = await response.text();
//             formError.innerHTML = err || "登録に失敗しました。";
//         }
//     } catch (error) {
//         console.error(error);
//         formError.innerHTML = "サーバー接続中にエラーが発生しました。";
//     }
// });

let main = document.getElementsByTagName("main")[0];

breadcrumbsFn(main, "registration");
mainTitleFn(main, "registration");

let formError = document.createElement("p");
formError.classList.add("form_error");
main.appendChild(formError);

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

let formMailAdress = document.createElement("div");
formDiv.appendChild(formMailAdress);
let formMailAdressP = document.createElement("p");
formMailAdressP.innerHTML = "メールアドレス";
formMailAdress.appendChild(formMailAdressP);
let formMailAdressInput = document.createElement("input");
formMailAdressInput.type = "email";
formMailAdressInput.name = "email";
formMailAdress.appendChild(formMailAdressInput);

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

let formPassword2 = document.createElement("div");
formDiv.appendChild(formPassword2);
let formPassword2P = document.createElement("p");
formPassword2P.innerHTML = "パスワード(確認用)";
formPassword2.appendChild(formPassword2P);
let formPassword2Input = document.createElement("input");
formPassword2Input.type = "password";
formPassword2Input.name = "password";
formPassword2Input.autocomplete = "off";
formPassword2.appendChild(formPassword2Input);

const countryOptions = [
    { name: "日本", value: "Japan" },
    { name: "ベトナム", value: "Vietnam" }
];
let formCountry = document.createElement("div");
formDiv.appendChild(formCountry);
let formCountryP = document.createElement("p");
formCountryP.innerHTML = "母国";
formCountry.appendChild(formCountryP);
let formCountryDiv = document.createElement("div");
formCountryDiv.classList.add("formCountry");
formCountry.appendChild(formCountryDiv);
let formCountrySelect = document.createElement("select");
formCountryDiv.appendChild(formCountrySelect);

countryOptions.forEach((c, i) => {
    let option = document.createElement("option");
    option.value = c.value;
    option.innerHTML = c.name;
    if (i === 0) option.selected = true;
    formCountrySelect.appendChild(option);
});

let registerButton = document.createElement("a");
registerButton.classList.add("register_button");
registerButton.href = "index.html";
registerButton.innerHTML = "登録";
main.appendChild(registerButton);

registerButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = formNameInput.value.trim();
    const email = formMailAdressInput.value.trim();
    const password = formPasswordInput.value.trim();
    const password2 = formPassword2Input.value.trim();
    const countryVal = formCountrySelect.value;

    if ( !username ) {
        formError.innerHTML = "ニックネームを入力してください．";
        return;
    } else if ( !email ) {
        formError.innerHTML = "メールアドレスを入力してください．";
        return;
    } else if ( !password ) {
        formError.innerHTML = "パスワードを入力してください．";
        return;
    } else if ( !password2 ) {
        formError.innerHTML = "パスワード(確認用)を入力してください．";
        return;
    } else if (password !== password2) {
        formError.innerHTML = "パスワードが一致していません．";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, country: countryVal })
        });

        if (response.ok) {
            alert("登録完了！ログインしてください。");
            window.location.href = "login.html";
        } else {
            const err = await response.text();
            formError.innerHTML = err || "登録に失敗しました。";
        }
    } catch (error) {
        console.error(error);
        formError.innerHTML = "サーバー接続時にエラーが発生しました。";
    }
});

