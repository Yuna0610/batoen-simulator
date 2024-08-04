# バトエンシミュレーター




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