import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComment1746685556719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create table comment(
                id int auto_increment primary key,
                writer varchar (255) not null,
                content varchar (255) not null,
                created_at timestamp default CURRENT_TIMESTAMP not null,
                post_id int not null,
                parent_id int null,
                constraint FK_POST_ID
                foreign key (post_id) references post (id)
                on delete cascade,
                constraint FK_PARENT_ID
                foreign key (parent_id) references comment (id)
                on delete cascade
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comment');
  }
}
