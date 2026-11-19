# CookMyMemories 🍳

海外に移住した日本人のための、**現地で手に入る食材で作れる日本料理のレシピアプリ**です。
手元にある食材から作れる料理を探したり、日本の食材が手に入らないときの「代わりになる食材」を調べたりできます。

日本とベトナムの学生による共同開発プロジェクトです。

## 主な機能

- **ユーザー登録・ログイン**（JWT 認証）
- **食材から検索**：持っている食材を選ぶと、作れる料理を一致率の高い順に表示
- **料理名・条件で検索**：料理名の一部や調理時間、料理の種類で絞り込み
- **代替食材の提案**：足りない食材の代わりに使える食材を提示
- **マイページ**：プロフィールの確認・編集、パスワード変更

## 使用技術

| 区分 | 技術 | バージョン |
| --- | --- | --- |
| フロントエンド | HTML / CSS / JavaScript | ― |
| バックエンド | Java / Spring Boot（Spring Security, Spring Data JPA） | Java **21** / Spring Boot 3.2.5 |
| データベース | MySQL | 8.0 |
| 開発環境 | Docker / Docker Compose | 任意（推奨） |

## ディレクトリ構成

```
CookMyMemories/
├── frontend/            # 画面（HTML / CSS / JS / 画像）
├── backend/             # API サーバー（Spring Boot）
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/  # API の入口（URL ごとの処理）
│   │   ├── service/     # 検索・認証などの処理本体
│   │   ├── repository/  # DB アクセス
│   │   ├── entity/      # DB テーブルに対応するクラス
│   │   ├── dto/         # API の入出力データ
│   │   ├── security/    # JWT 認証
│   │   └── config/      # セキュリティ・CORS 設定
│   ├── src/main/resources/application.properties  # 設定ファイル
│   ├── pom.xml          # 依存ライブラリの定義（Maven）
│   └── Dockerfile
├── sql/mysql/           # テーブル定義と初期データ
├── docker-compose.yml   # DB・API・画面をまとめて起動する設定
└── .env.example         # 環境変数（パスワード等）のひな形
```

## 起動方法

起動方法は 2 通りあります。**Java や MySQL のバージョンを気にしなくてよい「A. Docker」がおすすめです。**

### A. Docker で起動する（推奨）

必要なもの：[Docker Desktop](https://www.docker.com/products/docker-desktop/) のみ（Java・MySQL のインストールは不要です）

```bash
# 1. リポジトリを取得
git clone https://github.com/<ユーザー名>/CookMyMemories.git
cd CookMyMemories

# 2. 環境変数ファイルを作成（中身はそのままでも動きます）
cp .env.example .env

# 3. 起動（初回はダウンロードとビルドに数分かかります）
docker compose up --build
```

起動したらブラウザで以下を開きます。

| 用途 | URL |
| --- | --- |
| アプリ画面 | http://localhost:5500 |
| API | http://localhost:8080 |
| MySQL（外部ツールから接続する場合） | `localhost:3307`（ユーザー `root`、パスワードは `.env` の `DB_PASSWORD`） |

停止・リセット：

```bash
docker compose down        # 停止（データは残る）
docker compose down -v     # 停止してDBも削除（次回起動時に初期データを入れ直す）
```

> 初期データ（`sql/mysql/` の SQL）は **DB を初めて作成したときだけ** 投入されます。SQL を編集したら `docker compose down -v` してから起動し直してください。

### B. Java と MySQL を直接インストールして起動する

#### 1. 必要なソフトを入れる（macOS / Homebrew の例）

```bash
brew install openjdk@21 mysql@8.0
brew services start mysql@8.0
```

**Java は必ず 21 を使ってください。** 他のバージョン（11 や 17 など）ではビルドできません。

```bash
java -version   # "21" と表示されれば OK
```

別のバージョンが表示される場合は、21 を使うように切り替えます。

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

Maven は同梱の `./mvnw` が自動でダウンロードするため、インストール不要です。

#### 2. データベースを作成して初期データを入れる

`sql/mysql/` の SQL を**以下の順番で**実行します（順番を変えると、レシピと食材の紐付けが正しく入りません）。

```bash
cd sql/mysql
mysql --default-character-set=utf8mb4 -u root -p < Cmm.sql                                   # テーブル作成
mysql --default-character-set=utf8mb4 -u root -p recipe_management < H_ingredients.sql       # 食材（ベトナム）
mysql --default-character-set=utf8mb4 -u root -p recipe_management < H_recipes.sql           # レシピ（ベトナム）
mysql --default-character-set=utf8mb4 -u root -p recipe_management < V_ing.sql               # 食材・レシピ（日本）
mysql --default-character-set=utf8mb4 -u root -p recipe_management < H_ri.sql                # レシピと食材の紐付け
mysql --default-character-set=utf8mb4 -u root -p recipe_management < H_is.sql                # 代替食材
cd ../..
```

#### 3. バックエンドを起動する

```bash
cd backend
export DB_PASSWORD='MySQLのrootパスワード'   # パスワードを設定していなければ不要
./mvnw spring-boot:run
```

`Started IngredientApiApplication` と表示されれば起動成功です（http://localhost:8080）。

#### 4. フロントエンドを開く

別のターミナルで：

```bash
cd frontend
python3 -m http.server 5500
```

http://localhost:5500 を開きます（VS Code の Live Server 拡張機能を使っても構いません）。

## 環境変数

バックエンドの設定は `backend/src/main/resources/application.properties` にあり、以下の環境変数で上書きできます。
**パスワードや秘密鍵をソースコードに直接書かないでください。**

| 変数名 | 説明 | 既定値 |
| --- | --- | --- |
| `DATABASE_URL` | DB の接続先 | `jdbc:mysql://localhost:3306/recipe_management?...` |
| `DB_USER` | DB ユーザー名 | `root` |
| `DB_PASSWORD` | DB パスワード | （空） |
| `JWT_SECRET` | ログイントークンの署名鍵（32文字以上） | 開発用の仮の値 |
| `CORS_ALLOWED_ORIGINS` | API へのアクセスを許可する画面の URL（カンマ区切り） | `http://localhost:*,http://127.0.0.1:*` |
| `PORT` | API のポート番号 | `8080` |

## API 一覧

| メソッド | パス | 内容 | 認証 |
| --- | --- | --- | --- |
| POST | `/api/users/register` | ユーザー登録 | 不要 |
| POST | `/api/users/login` | ログイン（JWT を返す） | 不要 |
| GET / PUT | `/api/users/profile` | プロフィール取得・更新 | 必要 |
| PUT | `/api/users/change-password` | パスワード変更 | 必要 |
| GET | `/api/recipes` | レシピ一覧 | 不要 |
| GET | `/api/recipes/{id}` | レシピ詳細 | 不要 |
| GET | `/api/recipes/filter` | 条件でレシピを絞り込み | 不要 |
| POST | `/api/recipes/search-by-ingredients` | 食材からレシピを検索 | 不要 |
| GET | `/api/ingredients` | 食材一覧 | 不要 |
| GET | `/api/ingredients/{id}` | 食材詳細 | 不要 |
| GET | `/api/ingredients/substitutes/{ingredientId}` | 代替食材 | 不要 |

認証が必要な API には、ヘッダー `Authorization: Bearer <トークン>` を付けて呼び出します。

## よくあるトラブル

- **`release version 21 not supported` / `invalid target release: 21`**
  Java 21 以外で実行しています。`java -version` を確認し、上の「Java は必ず 21」の手順で切り替えてください。
- **`Communications link failure` / `Access denied for user 'root'`**
  MySQL が起動していない、またはパスワードが違います。`brew services list` で起動を確認し、`DB_PASSWORD` を見直してください。
- **画面から API を呼ぶとエラー（CORS）**
  画面を `file://` で直接開かず、`http://localhost:5500` のようにサーバー経由で開いてください。
- **ポートが使用中（`port is already allocated` など）**
  他のアプリが 8080 / 5500 / 3307 番を使っています。そのアプリを止めるか、`docker-compose.yml` のポート番号を変更してください。

## 開発メンバー

- フロントエンド：日本側メンバー
- バックエンド：ベトナム側メンバー

## ライセンス

ライセンスは設定していません（All rights reserved）。
ソースコードの閲覧は自由ですが、無断での複製・再配布・改変はご遠慮ください。
