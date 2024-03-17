# 1. フォルダー構成

<pre>
root
├── cdk
│    ├── bin
│    │    ├── app.ts
│    │    └── context.ts # CDK context
│    └── lib
│         ├── api-stack.ts # VPC、Fargate、RDS設定
│         ├── iam-stack.ts # IAM設定
│         └── pipeline-stack.ts　# パイプライン設定
├── env # Fargate用の環境変数
│    ├── .env.local
│    ├── .env.it
│    ├── .env.st
│    ├── .env.uat
│    └── .env.prod
├── src
│    ├── controller # 各API
│    ├── model
│    │    ├── index.ts
│    │    ├── error.model.ts # 各種エラーの定義
│    │    └── validation.model.ts # AJV検証用のpropertiesの定義
│    ├── plugin
│    │    ├── ajv.plugin.ts # AJV設定
│    │    ├── db.plugin.ts # TypeORM設定
│    │    ├── error-handler.plugin.ts # Global Error Handler
│    │    └── swagger.plugin.ts # Swagger設定
│    ├── index.ts # Fastifyの入り口
│    └── type.d.ts # type拡張
├── test
│    ├── <テストケース>
│    └── setup.ts # jestのセットアップ（環境変数の設定など）
├── Dockerfile # Fargate用のDockerfile
└── package.json
</pre>

# 2. バリデーションチェック

バリデーションチェックは `AJV` を使います。
具体的な設定は `<root>/src/plugin/ajv.plugin.ts` にあります。

**※ ご注意：**
requestをチェックする際、`body`, `header`, `params`に対して型変換なしでチェックしていますが、`querystring`に対して`coerceTypes: true`にしてチェックしています。

`coerceTypes`に関する説明は下記のサイトをご参照ください。[https://ajv.js.org/guide/modifying-data.html#coercing-data-types](https://ajv.js.org/guide/modifying-data.html#coercing-data-types)

ajvのschemaは各APIのフォルダーの直下に定義します。例：

<pre>
root
└── src
     └── controller
          └── user
               └── create # user create API
                    ├── index.ts
                    └── schema.ts # schema定義ファイル
</pre>

schameはobject形式で定義します。例：

```javascript
const bodyJsonSchema = {
  type: 'object',
  required: ['sub'],
  properties: {
    sub: {
      type: 'string'
    }
  },
  additionalProperties: false,
} as const;
```

次は、`json-schema-to-ts`パッケージを使用してschemaをtypescriptのtypeに変換します。例：

```javascript
import { FromSchema } from 'json-schema-to-ts';

export type Body = FromSchema<typeof bodyJsonSchema>;
```

変換後のtypeはAPI上で、`ジェネリック`として使います。例：

```javascript
import { schema, Body, Reply } from './schema';

fastify.post<{ Body: Body; Reply: Reply }>('/user', { schema: schema }, async (request) => {
  // ロジック
  return { result: 'OK' };
});
```

# 3. TypeORMについて

## 3.1 テーブル作成

まず、`<root>/src/entity/`フォルダーの直下に`<table_name>.entity.ts`のファイル名でEntityファイルを作成します。

> Entityファイルについての説明：[https://typeorm.io/entities](https://typeorm.io/entities)

次、`npm run typeorm:migration:generate`のコマンドを実行して、マイグレーションファイルを生成します。

最後、`npm run typeorm:migration:run`のコマンドを実行して、マイグレーションからテーブルを作成します。

> migrationについての説明： [https://typeorm.io/migrations](https://typeorm.io/migrations)

**ご注意：**

1. Entityファイル名は、必ず`*.entity.ts`の形式にすること
2. 上記の「Entity -> migration -> テーブル生成」のオペレーションは、開発環境のみで行うこと（IT、ST、本番などの環境では、SQL文を使ってテーブルを作成する）

## 3.2 CRUDのやり方

CRUD（作成・検索・更新・削除）のやり方については、`<root>/src/controller/user`フォルダーに例を作成しました。ご参照ください。

# 4. Swagger

swaggerは `@fastify/swagger`、`@fastify/swagger-ui`を使って自動生成するようにしています。

`@fastify/swagger`は、APIに定義されたschemaを参照して自動的にswaggerを生成することができます。

生成されたswaggerを表示したい場合、`npm run dev`コマンドを実行してから、`http://localhost:3000/doc`のURLにアクセスすれば確認できます。

swaggerに関する設定：`<root>/src/plugin/swagger.plugin.ts`

```javascript
import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export default fp((server, _opt, done) => {
  if (process.env.NODE_ENV === 'local') {
    server.register(swagger, {
      swagger: {
        info: {
          title: 'API swagger',
          description: 'Testing the Fastify swagger API',
          version: '0.1.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [{ name: 'user', description: 'User related end-points' }],
      },
    });
    server.register(fastifySwaggerUi, {
      routePrefix: '/doc',
    });
  }
```

schemaを作成時に、propertiesに`description`を追加し、schemaに`summary`、`tags`、`response`の定義を追加する必要があります。

properties:

```javascript
{ type: 'string', description: 'ユーザID', maxLength: 36, minLength: 36 }
```

schema:

```javascript
export const schema: FastifySchema = {
  summary: 'ユーザ追加',
  tags: ['user'],
  body: bodyJsonSchema,
  response: {
    200: replyJsonSchema,
  },
} as const;
```
