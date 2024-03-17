import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1709877608313 implements MigrationInterface {
    name = 'CreateTable1709877608313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sme_master" ("smeId" character(12) NOT NULL, "name" character varying(100) NOT NULL, "corporateId" character(13) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "deleteDate" TIMESTAMP, CONSTRAINT "PK_SME_MASTER" PRIMARY KEY ("smeId")); COMMENT ON COLUMN "sme_master"."smeId" IS 'SME企業コード'; COMMENT ON COLUMN "sme_master"."name" IS '会社名'; COMMENT ON COLUMN "sme_master"."corporateId" IS '法人番号'; COMMENT ON COLUMN "sme_master"."createDate" IS '作成日時'; COMMENT ON COLUMN "sme_master"."updateDate" IS '更新日時'; COMMENT ON COLUMN "sme_master"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`CREATE TABLE "sme_user" ("sub" character(36) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "smeId" character(12), CONSTRAINT "PK_SME_USER" PRIMARY KEY ("sub")); COMMENT ON COLUMN "sme_user"."sub" IS 'ユーザID'; COMMENT ON COLUMN "sme_user"."createDate" IS '作成日時'; COMMENT ON COLUMN "sme_user"."updateDate" IS '更新日時'; COMMENT ON COLUMN "sme_user"."smeId" IS 'SME企業コード'`);
        await queryRunner.query(`CREATE TABLE "user" ("sub" character(36) NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(100) NOT NULL, "role" character(1) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "deleteDate" TIMESTAMP, CONSTRAINT "PK_USER" PRIMARY KEY ("sub")); COMMENT ON COLUMN "user"."sub" IS 'ユーザID'; COMMENT ON COLUMN "user"."name" IS '氏名'; COMMENT ON COLUMN "user"."phone" IS '電話番号'; COMMENT ON COLUMN "user"."email" IS 'メールアドレス'; COMMENT ON COLUMN "user"."role" IS 'ロール'; COMMENT ON COLUMN "user"."createDate" IS '作成日時'; COMMENT ON COLUMN "user"."updateDate" IS '更新日時'; COMMENT ON COLUMN "user"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD CONSTRAINT "FK_d6d5a44e4e44575f057def18aed" FOREIGN KEY ("smeId") REFERENCES "sme_master"("smeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD CONSTRAINT "FK_dad13c9470bddb06bbe3639bac7" FOREIGN KEY ("sub") REFERENCES "user"("sub") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sme_user" DROP CONSTRAINT "FK_dad13c9470bddb06bbe3639bac7"`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP CONSTRAINT "FK_d6d5a44e4e44575f057def18aed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "sme_user"`);
        await queryRunner.query(`DROP TABLE "sme_master"`);
    }

}
