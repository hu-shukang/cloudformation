import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SMEMasterEntity } from './sme-master.entity';

@Entity({ name: 'sme_user' })
export class SMEUserEntity {
  @PrimaryColumn({
    type: 'char',
    length: 36,
    primaryKeyConstraintName: 'PK_SME_USER',
    comment: 'ユーザID',
  })
  sub: string;

  @CreateDateColumn({ type: 'timestamp with time zone', comment: '作成日時' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', comment: '更新日時' })
  updateDate: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', comment: '削除日時' })
  deleteDate: Date;

  @ManyToOne(() => SMEMasterEntity, (s) => s.smeUserList)
  @JoinColumn({ name: 'smeId' })
  sme: SMEMasterEntity;

  @OneToOne(() => UserEntity, (u) => u.smeUser)
  @JoinColumn({ name: 'sub' })
  user: UserEntity;
}
