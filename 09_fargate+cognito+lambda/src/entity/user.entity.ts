import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn } from 'typeorm';
import { SMEUserEntity } from './sme-user.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({
    type: 'char',
    length: 36,
    primaryKeyConstraintName: 'PK_USER',
    comment: 'ユーザID',
  })
  sub: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '氏名',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '電話番号',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'メールアドレス',
  })
  email: string;

  @Column({
    type: 'char',
    length: 1,
    comment: 'ロール',
  })
  role: '1' | '2' | '3';

  @CreateDateColumn({ type: 'timestamp with time zone', comment: '作成日時' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', comment: '更新日時' })
  updateDate: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', comment: '削除日時' })
  deleteDate: Date;

  @OneToOne(() => SMEUserEntity, (s) => s.user)
  smeUser: SMEUserEntity;
}
