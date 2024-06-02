<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240602145630 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        // $this->addSql('ALTER TABLE comment ADD is_edited TINYINT(1) NOT NULL');
        // $this->addSql('ALTER TABLE equipment ADD author_id INT DEFAULT NULL, ADD creation_date DATETIME NOT NULL');
        // $this->addSql('ALTER TABLE equipment ADD CONSTRAINT FK_D338D583F675F31B FOREIGN KEY (author_id) REFERENCES `user` (id)');
        // $this->addSql('CREATE INDEX IDX_D338D583F675F31B ON equipment (author_id)');
        $this->addSql('ALTER TABLE message ADD is_edited TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1F55203D FOREIGN KEY (topic_id) REFERENCES topic (id)');
        // $this->addSql('ALTER TABLE section DROP FOREIGN KEY FK_2D737AEF7294869C');
        // $this->addSql('ALTER TABLE section ADD author_id INT NOT NULL, ADD creation_date DATETIME NOT NULL');
        // $this->addSql('ALTER TABLE section ADD CONSTRAINT FK_2D737AEFF675F31B FOREIGN KEY (author_id) REFERENCES `user` (id)');
        // $this->addSql('ALTER TABLE section ADD CONSTRAINT FK_2D737AEF7294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        // $this->addSql('CREATE INDEX IDX_2D737AEFF675F31B ON section (author_id)');
        // $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        // $this->addSql('ALTER TABLE topic ADD allow_picture TINYINT(1) NOT NULL, ADD is_edited TINYINT(1) NOT NULL, CHANGE author_id author_id INT DEFAULT NULL');
        // $this->addSql('ALTER TABLE user ADD creation_date DATETIME NOT NULL, CHANGE is_verified is_verified TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE equipment DROP FOREIGN KEY FK_D338D583F675F31B');
        $this->addSql('DROP INDEX IDX_D338D583F675F31B ON equipment');
        $this->addSql('ALTER TABLE equipment DROP author_id, DROP creation_date');
        $this->addSql('ALTER TABLE section DROP FOREIGN KEY FK_2D737AEFF675F31B');
        $this->addSql('ALTER TABLE section DROP FOREIGN KEY FK_2D737AEF7294869C');
        $this->addSql('DROP INDEX IDX_2D737AEFF675F31B ON section');
        $this->addSql('ALTER TABLE section DROP author_id, DROP creation_date');
        $this->addSql('ALTER TABLE section ADD CONSTRAINT FK_2D737AEF7294869C FOREIGN KEY (article_id) REFERENCES article (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F1F55203D');
        $this->addSql('ALTER TABLE message DROP is_edited, CHANGE author_id author_id INT DEFAULT 1 NOT NULL, CHANGE topic_id topic_id INT NOT NULL, CHANGE picture picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE comment DROP is_edited');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT NOT NULL');
        $this->addSql('ALTER TABLE topic DROP allow_picture, DROP is_edited, CHANGE author_id author_id INT DEFAULT 1 NOT NULL');
        $this->addSql('ALTER TABLE `user` DROP creation_date, CHANGE is_verified is_verified INT DEFAULT 0 NOT NULL');
    }
}
