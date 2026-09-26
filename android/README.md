# CleanLog Android（Play Store 用 TWA パッケージ）

Bubblewrap で作った Trusted Web Activity。アプリ本体は https://cleanlog.doitmyself.net/ の PWA で、
サイトを更新すれば、Android アプリも自動で最新になる（Play への再提出は不要）。
位置情報は、Chrome の許可をアプリに引き継ぐ設定（locationDelegation）を有効にしてある。
オフラインでも開けるよう、サイトに service worker（sw.js）を入れてある。

## 作り直し（Windows / PowerShell）
```powershell
$env:JAVA_HOME = "C:\Users\user\.bubblewrap\jdk-17.0.20.1+1"
$env:Path = "$env:JAVA_HOME\bin;C:\Program Files\nodejs;C:\Users\user\CleanLog\android;$env:Path"   # android を PATH に足すのは gradlew.bat を見つけさせるため
$pw = (Get-Content C:\Users\user\.bubblewrap\keys\cleanlog-keystore-password.txt -Raw).Trim()
$env:BUBBLEWRAP_KEYSTORE_PASSWORD = $pw; $env:BUBBLEWRAP_KEY_PASSWORD = $pw
cd C:\Users\user\CleanLog\android
# 新しい版を出す時は twa-manifest.json の appVersionCode を 1 つ増やす（appVersionName は自由）
bubblewrap update --skipVersionUpgrade
bubblewrap build --skipPwaValidation      # → app-release-bundle.aab（Play にアップロード） / app-release-signed.apk（実機テスト）
```

## 署名鍵（アップロード鍵）
- ファイル: C:\Users\user\.bubblewrap\keys\cleanlog-upload.keystore（別名 cleanlog）、パスワードは同じフォルダーの txt
- **この2つは Git に入れない。必ず別の場所にもバックアップする**（紛失すると更新を出せなくなる）
- Play アプリ署名を使うので、配布用の本当の署名鍵は Google が管理する。この鍵は「アップロード用」

## サイトとの紐づけ（Digital Asset Links）
.well-known/assetlinks.json に、アップロード鍵の SHA-256 が入っている（実機に APK を直接入れて試す時に必要）。
Play に上げた後は、Play Console の「アプリの完全性 → アプリの署名」に表示される
**アプリ署名鍵の SHA-256** を、同じ配列に追加して再デプロイする（これが無いとアドレスバーが出てしまう）。
.nojekyll は、GitHub Pages が .well-known を公開するために必要。消さないこと。

## Play Store 掲載用
store/ に掲載文（listing-ja.md）、フィーチャーグラフィック、アイコンがある。
