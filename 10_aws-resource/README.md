# AWS環境構築の流れ

1. Root UserでAWS Management Consoleに入る
2. S3に入って`<アプリ名>-cdk-work`のBucketを作成する（設定値は全部デフォルト）
   > このBucketはCDK Deploy時に使用するBucketで、Bucket名を`bin/aws-resource.ts`の22行目に設定する必要がある
3. IAMに入って、Admin Userを作成する（作成方法は「1. Admin User作成の流れ」をご参照）
4. AWS-Resourceのプロジェクトの直下で`npm install`のコマンドを実行する
5. `bin/context.ts`に`account`と`appName`を設定する
6. 下記のコマンドを順次に実行する

```shell
# role作成
npm run cdk:deploy:codepipeline-role
npm run cdk:deploy:lambda-access-role
npm run cdk:deploy:ecs-task-role
npm run cdk:deploy:ecs-execution-task-role
npm run cdk:deploy:dev-access-role
npm run cdk:deploy:event-bridge-for-code-pipeline-role
# 開発者用のuser group作成
npm run cdk:deploy:dev-user-group
# codecommitとECRのリポジトリ作成
npm run cdk:deploy:repository
# IT環境のS3 Bucket作成
npm run cdk:deploy:s3:it
# IT環境のVPC関連の資源を作成
npm run cdk:deploy:vpc:it
```

7. 開発者ユーザを作成する（作成方法は「3. 開発者ユーザを作成」をご参照））

## 1. Admin User作成の流れ

1~6の手順は初回だけ必要。

1. AWS Management ConsoleからIAMに入る
2. 左メニューから「ユーザグループ」を選ぶ
3. 「グループを作成」ボタンをクリックする
4. `ユーザーグループ名`の入力欄に`AdminUserGroup`を入れる
5. `許可ポリシーを添付`のところに`AdministratorAccess`のチェックを入れる
6. 一番下の「グループを作成」ボタンをクリックする
7. 左メニューから「ユーザ」を選ぶ
8. 「ユーザーの作成」ボタンをクリックする
9. `ユーザー名`の入力欄にログイン用のユーザ名を入れる
10. `AWS マネジメントコンソールへのユーザーアクセスを提供する`のチェックボックスをチェックする
11. `ユーザーにコンソールアクセスを提供していますか?`から`IAM ユーザーを作成します`をチェックする
12. `コンソールパスワード`にパスワードを設定する
13. `ユーザーは次回のサインイン時に新しいパスワードを作成する必要があります - 推奨`のところは任意で大丈夫
14. 「次へ」ボタンをクリックする
15. `許可のオプション`から`ユーザーをグループに追加`を選ぶ
16. `ユーザーグループ `から`AdminUserGroup`をチェックする
17. 「次へ」ボタンをクリックする
18. 「ユーザーの作成」ボタンをクリックする
19. 左メニューから「ユーザ」を選ぶ
20. 作成されたユーザをクリックする
21. 「概要」にある「アクセスキーを作成」をクリックする
22. `ユースケース`から`コマンドラインインターフェイス (CLI)`を選ぶ
23. 「次へ」ボタンをクリックする
24. 「アクセスキーを作成」ボタンをクリックする
25. 作成された`access_key_id`と`secret_key`を開発環境に設定する（設定方法は「2. AWS Configure設定」をご参照）

## 2. AWS Configure設定

1. AWS CLIをインストール（インストール方法：[https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)）
2. コマンドプロンプトを起動して、`aws configure`のコマンドを実行する

```shell
$ aws configure
AWS Access Key ID [None]: accesskey
AWS Secret Access Key [None]: secretkey
Default region name [None]: ap-northeast-1
Default output format [None]:
```

## 3. 開発者ユーザを作成

1~6の手順は初回だけ必要。

1. AWS Management ConsoleからIAMに入る
2. 左メニューから「ユーザグループ」を選ぶ
3. 「グループを作成」ボタンをクリックする
4. `ユーザーグループ名`の入力欄に`DevUserGroup`を入れる
5. `許可ポリシーを添付`のところに`AWSSupportAccess`、`DevAccessPolicy`、`IAMReadOnlyAccess`のチェックを入れる
6. 一番下の「グループを作成」ボタンをクリックする
7. 左メニューから「ユーザ」を選ぶ
8. 「ユーザーの作成」ボタンをクリックする
9. `ユーザー名`の入力欄にログイン用のユーザ名を入れる
10. `AWS マネジメントコンソールへのユーザーアクセスを提供する`のチェックボックスをチェックする
11. `ユーザーにコンソールアクセスを提供していますか?`から`IAM ユーザーを作成します`をチェックする
12. `コンソールパスワード`にパスワードを設定する
13. `ユーザーは次回のサインイン時に新しいパスワードを作成する必要があります - 推奨`のところは任意で大丈夫
14. 「次へ」ボタンをクリックする
15. `許可のオプション`から`ユーザーをグループに追加`を選ぶ
16. `ユーザーグループ `から`DevUserGroup`をチェックする
17. 「次へ」ボタンをクリックする
18. 「ユーザーの作成」ボタンをクリックする
19. 左メニューから「ユーザ」を選ぶ
20. 作成されたユーザをクリックする
21. 「概要」にある「アクセスキーを作成」をクリックする
22. `ユースケース`から`コマンドラインインターフェイス (CLI)`を選ぶ
23. 「次へ」ボタンをクリックする
24. 「アクセスキーを作成」ボタンをクリックする
25. 作成された`access_key_id`と`secret_key`を開発環境に設定する（設定方法は「2. AWS Configure設定」をご参照）
