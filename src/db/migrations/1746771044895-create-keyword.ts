import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKeyword1746771044895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE keyword (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword VARCHAR(255) NOT NULL,
                writer VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // test 용 Data
    await queryRunner.query(`
    INSERT INTO keyword (keyword, writer) VALUES ('아이폰', '스티브 잡스'), ('갤럭시', '이재용'), ('아이폰', '팀 쿡')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('keyword');
  }
}
