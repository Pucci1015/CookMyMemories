let main = document.getElementsByTagName("main")[0];

//breadcrumbs
breadcrumbsFn(main, "cooking");

//main title
mainTitleFn(main, "cooking");

// country select
const countrySelect2 = () => {
    let countryDiv = document.createElement("div");
    countryDiv.classList.add("country");
    main.appendChild(countryDiv);

    //母国
    let homeCountryP = document.createElement("p");
    homeCountryP.innerHTML = "居住国";
    countryDiv.appendChild(homeCountryP);

    let homeCountryDiv = document.createElement("div");
    homeCountryDiv.classList.add("home_country");
    countryDiv.appendChild(homeCountryDiv);

    let homeCountry = document.createElement("select");
    homeCountryDiv.appendChild(homeCountry);

    // 居住国
    let residenceCountryP = document.createElement("p");
    residenceCountryP.innerHTML = "母国";
    countryDiv.appendChild(residenceCountryP);

    let residenceCountryDiv = document.createElement("div");
    residenceCountryDiv.classList.add("residence_country");
    countryDiv.appendChild(residenceCountryDiv);

    let residenceCountry = document.createElement("select");
    residenceCountryDiv.appendChild(residenceCountry);

    // DB に関係する2つの値のみ追加
    let countries = [
        { value: "Vie", name: "ベトナム" },
        { value: "Jap", name: "日本" }
    ];

    countries.forEach(c => {
        let option1 = document.createElement("option");
        option1.value = c.value;
        option1.innerHTML = c.name;
        homeCountry.appendChild(option1);
    });

    // 母国は日本のみ（日本料理だけを表示するため）
    let option2 = document.createElement("option");
    option2.value = "Jap";
    option2.innerHTML = "日本";
    residenceCountry.appendChild(option2);
    return { homeCountry, residenceCountry };
};

// maxTime
const maxTime2 = () => {
    let timeDiv = document.createElement("div");
    timeDiv.classList.add("max_time");
    main.appendChild(timeDiv);

    let timeP = document.createElement("p");
    timeP.innerHTML = "最大時間(分)";
    timeDiv.appendChild(timeP);

    let timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.name = "number";
    timeDiv.appendChild(timeInput);

    return timeInput;
};

// select と input を初期化
const { residenceCountry } = countrySelect2();
const timeInput = maxTime2();

// search UI
let search = document.createElement("div");
search.classList.add("search");
main.appendChild(search);

let searchBox = document.createElement("input");
searchBox.type = "search";
searchBox.name = "search";
searchBox.placeholder = "料理名を入力";
searchBox.classList.add("search_box");
search.appendChild(searchBox);

let searchButton = document.createElement("input");
searchButton.type = "submit";
searchButton.name = "submit";
searchButton.value = "検索";
searchButton.classList.add("search_button");
search.appendChild(searchButton);

// 結果表示用の div を作成
let resultDiv = document.createElement("div");
resultDiv.classList.add("result");
main.appendChild(resultDiv);

// 結果をシンプルに描画する関数
function renderSearchResults(data) {
    resultDiv.innerHTML = ""; // 前回の結果を消去

    if (!data.recipes || data.recipes.length === 0) {
        resultDiv.innerHTML = "<p>検索結果がありません。</p>";
        return;
    }

    data.recipes.forEach(recipe => {
        let card = document.createElement("div");
        card.classList.add("recipe-card");

        let title = document.createElement("h3");
        title.textContent = recipe.name || "No name";
        card.appendChild(title);

        if (recipe.description) {
            let desc = document.createElement("p");
            desc.textContent = recipe.description;
            card.appendChild(desc);
        }

        if (recipe.url_img) {
            let img = document.createElement("img");
            img.src = recipe.url_img;
            img.alt = recipe.name || "recipe image";
            card.appendChild(img);
        }

        resultDiv.appendChild(card);
    });
}

// 検索関数（修正版）。searchBox から取得した a_part_of_name パラメータを追加
// searchButton.addEventListener("click", async () => {
//     if (!window.auth.isLogged()) {
//         alert("ログインが必要です。ログインページに移動します。");
//         window.location.href = "login.html";
//         return;
//     }

//     let cuisineType = residenceCountry.value;
//     let maxTimeVal = timeInput.value;
//     let aPartOfName = searchBox.value.trim();

//     if (!cuisineType) {
//         alert("居住国を選択してください。");
//         return;
//     }

//     // URL のクエリパラメータを組み立て
//     let url = `http://localhost:8080/api/recipes/filter?cuisine_type=${encodeURIComponent(cuisineType)}`;
//     if (maxTimeVal) url += `&max_time=${encodeURIComponent(maxTimeVal)}`;
//     if (aPartOfName) url += `&a_part_of_name=${encodeURIComponent(aPartOfName)}`;

//     try {
//         searchButton.disabled = true;
//         searchButton.value = "検索中...";

//         const res = await window.auth.authFetch(url);

//         if (!res.ok) {
//             if (res.status === 401) {
//                 alert("セッションが終了しました。再度ログインしてください。");
//                 window.auth.logout();
//                 return;
//             } else if (res.status === 403) {
//                 alert("アクセス権限がありません。");
//                 return;
//             } else if (res.status === 404) {
//                 alert("検索結果が見つかりませんでした。");
//                 resultDiv.innerHTML = "<p>検索結果が見つかりませんでした。</p>";
//                 return;
//             } else {
//                 throw new Error(`API Error: ${res.status} - ${res.statusText}`);
//             }
//         }

//         const data = await res.json();
//         console.log("検索結果:", data);

//         renderSearchResults(data);

//     } catch (err) {
//         console.error("検索エラー:", err);
//         if (err.name === 'TypeError' && err.message.includes('fetch')) {
//             alert("サーバーに接続できません。ネットワーク接続を確認してください。");
//         } else {
//             alert("検索中にエラーが発生しました。もう一度お試しください。");
//         }
//     } finally {
//         searchButton.disabled = false;
//         searchButton.value = "検索";
//     }
// });
// 検索ボタン：クエリパラメータ付きで result.html へ遷移
searchButton.addEventListener("click", (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    // if (!window.auth.isLogged()) {
    //     alert("ログインが必要です。ログインページに移動します。");
    //     window.location.href = "login.html";
    //     return;
    // }

    let cuisineType = residenceCountry.value;
    let maxTimeVal = timeInput.value;
    let aPartOfName = searchBox.value.trim();

    if (!cuisineType) {
        alert("居住国を選択してください。");
        return;
    }

    // クエリ文字列を作成
    let queryParams = new URLSearchParams();
    queryParams.append("cuisine_type", cuisineType);
    if (maxTimeVal) queryParams.append("max_time", maxTimeVal);
    if (aPartOfName) queryParams.append("a_part_of_name", aPartOfName);

    // 結果ページへ遷移
    window.location.href = `result.html?${queryParams.toString()}`;
});
