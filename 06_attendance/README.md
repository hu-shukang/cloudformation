# AWS環境構築の流れ

1. インフラ環境の構築
2. アプリケーションのデプロイ
3. 公開

## 1. インフラ環境の構築

### 1.1 ロール設定
ECS(Fargate)を実行する際に必須のロールを作成するために、`01_role.yaml`をCloudFormation上で実行する。

流れ：
1. AWS Management Console
2. [CloudFormation]で検索して開く
3. [スタックの作成]ボタンを押下する
4. [テンプレートの指定]のところに、 [テンプレートファイルのアップロード]を選択する
5. `01_role.yaml`ファイルを選択して、アップロードする
6. 次へ
7. [スタックの名前]の入力欄に **attendance-role** を入力して、次へ
8. そのまま次へ
9. ページ最後の **The following resource(s) require capabilities: [AWS::IAM::Role]** をチェックボックスをチェックする
10. [送信]ボタンを押下する

### 1.2 環境構築
VPC, IntertGateway, S3, LoadBalancer, RDS, CloudWatch, ECR, ECSのAWSサービスを生成する  
流れ：
1. AWS Management Console
2. [CloudFormation]で検索して開く
3. [スタックの作成]ボタンを押下する
4. [テンプレートの指定]のところに、 [テンプレートファイルのアップロード]を選択する
5. `02_infra.yaml`ファイルを選択して、アップロードする
6. 必要に応じてパラメータを変更する
7. 次へ
8. [スタックの名前]の入力欄に **attendance-infra** を入力して、次へ
9. そのまま次へ
10. [送信]ボタンを押下する

## 2. アプリケーションをデプロイ

> 前提条件：jarファイルをDocker化して、ECRにデプロイできていること

流れ：
1. AWS Management Console
2. [CloudFormation]で検索して開く
3. [スタックの作成]ボタンを押下する
4. [テンプレートの指定]のところに、 [テンプレートファイルのアップロード]を選択する
5. `03_application.yaml`ファイルを選択して、アップロードする
6. パラメータを設定する
7. 次へ
8. [スタックの名前]の入力欄に **attendance-application** を入力して、次へ
9. そのまま次へ
10. [送信]ボタンを押下する

## 3. 公開

まず、ドメインを購入する。  
流れ：
1. AWS Management Console
2. [Route 53]で検索して開く
3. 左側のサイドメニューにて、[登録済みドメイン]を押下する
4. [ドメインの登録]ボタンを押下する
5. 登録したいドメインを入力して、[チェック]ボタンを押下する（例：example.com）
6. 購入したいドメインをカートに入れる
7. [継続]ボタンを押下する
8. 登録者の連絡先を入れる
9. [継続]ボタンを押下する

次は、ホストゾーンを作成する。  
流れ：
1. AWS Management Console
2. [Route 53]で検索して開く
3. 左側のサイドメニューにて、[ホストゾーン]を押下する
4. [ホストゾーンの作成]ボタンを押下する
5. [ドメイン名]の入力欄に、先ほど購入したドメインを入れる
6. [タイプ]は **パブリックホストゾーン** にする
7. [ホストゾーンの作成]ボタンを押下する
8. 作成されたホストゾーンに入る
9. NSレコードに書かれた4つの値をメモする
10. 左側のサイドメニューから、[登録済みドメイン]に入る
11. 購入したドメインに入る
12. ここにあるNSレコードをメモの内容に書き換える

次は、ACMで上記のドメインに対して証明書を発行する  
流れ：
1. AWS Management Console
2. [Certificate Manager]で検索して開く
3. 左側のサイドメニューにて、[証明書を一覧]を押下する
4. [リクエスト]ボタンを押下する
5. [証明書タイプ]は **パブリック証明書をリクエスト** にして、次へ
6. [完全修飾ドメイン名]のところに、先ほど購入したドメインを入れる
7. [検証方法]は、**DNS検証** にする
8. [キーアルゴリズム]は、デフォルトにする
9. [リクエスト]ボタンを押下する

最後、`04_cloudfront.yaml`をCloudFormation上で実行する。  
流れ：
1. AWS Management Console
2. [CloudFormation]で検索して開く
3. [スタックの作成]ボタンを押下する
4. [テンプレートの指定]のところに、 [テンプレートファイルのアップロード]を選択する
5. `04_cloudfront.yaml`ファイルを選択して、アップロードする
6. パラメータを設定する
7. 次へ
8. [スタックの名前]の入力欄に **attendance-cloudfront** を入力して、次へ
9. そのまま次へ
10. [送信]ボタンを押下する