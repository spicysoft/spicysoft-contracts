# スパイシーソフト外部向けの契約書

src 内のマークダウンファイルを更新して push すると GitHub Actions で dist 内に自動的に契約書が生成されます

```sh
git pull # 最新の状態に更新をする
: # マークダウンを修正する
git add <更新したファイル>.md
git commit -m <編集理由>
git push
```
