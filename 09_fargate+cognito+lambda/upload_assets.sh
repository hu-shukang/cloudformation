#!/bin/bash

# ======================
# LambdaアセットをS3 Bucketにアップロードする
# ======================

cd ${CODEBUILD_SRC_DIR}/cdk.out

# <root>/cdk.outフォルダの直下で名前に「asset」を含むフォルダを探して繰り返す
for asset_folder in $(find . -type d -name "asset.*"); do
  # フォルダ名を取得
  folder_name=$(basename "$asset_folder")

  # ZIPファイルを作成する
  zip_file="${folder_name}.zip"
  echo "zip: ${zip_file}"
  cd "$asset_folder"
  zip -rq $zip_file .

  # S3にアップロードする
  aws s3 cp "$zip_file" "s3://${ASSET_BUCKET}/${zip_file}"
  cd ${CODEBUILD_SRC_DIR}/cdk.out
done
