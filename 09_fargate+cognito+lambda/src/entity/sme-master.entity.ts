import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { SMEUserEntity } from './sme-user.entity';

@Entity({ name: 'sme_master' })
export class SMEMasterEntity {
  @PrimaryColumn({
    type: 'char',
    length: 12,
    primaryKeyConstraintName: 'PK_SME_MASTER',
    comment: 'SME企業コード',
  })
  smeId: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '会社名',
  })
  name: string;

  @Column({
    type: 'char',
    length: 13,
    comment: '法人番号',
  })
  corporateId: string;

  @CreateDateColumn({ type: 'timestamp with time zone', comment: '作成日時' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', comment: '更新日時' })
  updateDate: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', comment: '削除日時' })
  deleteDate: Date;

  @OneToMany(() => SMEUserEntity, (s) => s.sme)
  smeUserList: SMEUserEntity[];
}
