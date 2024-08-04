# バトエンシミュレーター

- ドラクエバトルえんぴつのキャラクター同志を競わせるシミュレーターです。
- 100回シミュレーションした結果を返す機能と、1回のバトルのログを表示する機能、基本的なモンスターのデータを設定中


## その他

- nodeのバージョンがv15.0.0より前の場合、eslint.conf.mjsを用いてeslintrcが動いてくれないので、eslintを起動したい場合はnodeを更新する必要がある。

### nvmを利用したnodeのアップデート

1. nvmがインストールされていることを確認します。インストールされていない場合は、以下のコマンドでインストールします：

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
```

2. 最新のNode.jsバージョンをインストールします

```
nvm install node
```