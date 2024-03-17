import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1709882853488 implements MigrationInterface {
    name = 'CreateTable1709882853488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sme_user" ADD "deleteDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updateDate" IS '更新日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleteDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleteDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."updateDate" IS '更新日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "deleteDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "deleteDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."updateDate" IS '更新日時'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."updateDate" IS '更新日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "sme_user" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "deleteDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "deleteDate" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."updateDate" IS '更新日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_master"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "sme_master" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "sme_master" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleteDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleteDate" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updateDate" IS '更新日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createDate" IS '作成日時'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "sme_user"."deleteDate" IS '削除日時'`);
        await queryRunner.query(`ALTER TABLE "sme_user" DROP COLUMN "deleteDate"`);
    }

}
