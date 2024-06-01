<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240601173713 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article CHANGE author_id author_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE article_like CHANGE author_id author_id INT DEFAULT NULL, CHANGE article_id article_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE category CHANGE picture picture VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE country ADD country_code VARCHAR(15) DEFAULT NULL');
        $this->addSql('ALTER TABLE equipment CHANGE sub_category_id sub_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE equipment_section DROP FOREIGN KEY FK_5B08B500517FE9FE');
        $this->addSql('ALTER TABLE equipment_section DROP FOREIGN KEY FK_5B08B500D823E37A');
        $this->addSql('ALTER TABLE equipment_section ADD CONSTRAINT FK_5B08B500517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id)');
        $this->addSql('ALTER TABLE equipment_section ADD CONSTRAINT FK_5B08B500D823E37A FOREIGN KEY (section_id) REFERENCES section (id)');
        $this->addSql('ALTER TABLE img_object DROP FOREIGN KEY FK_75881B8C517FE9FE');
        $this->addSql('ALTER TABLE img_object DROP FOREIGN KEY FK_75881B8CC06A9F55');
        $this->addSql('ALTER TABLE img_object CHANGE img_id img_id INT DEFAULT NULL, CHANGE equipment_id equipment_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE img_object ADD CONSTRAINT FK_75881B8C517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id)');
        $this->addSql('ALTER TABLE img_object ADD CONSTRAINT FK_75881B8CC06A9F55 FOREIGN KEY (img_id) REFERENCES img (id)');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F1F55203D');
        $this->addSql('ALTER TABLE message CHANGE author_id author_id INT DEFAULT NULL, CHANGE topic_id topic_id INT DEFAULT NULL, CHANGE picture picture VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1F55203D FOREIGN KEY (topic_id) REFERENCES topic (id)');
        $this->addSql('ALTER TABLE section DROP FOREIGN KEY FK_2D737AEF7294869C');
        $this->addSql('ALTER TABLE section ADD CONSTRAINT FK_2D737AEF7294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE topic CHANGE author_id author_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE is_verified is_verified TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `user` CHANGE is_verified is_verified INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F1F55203D');
        $this->addSql('ALTER TABLE message CHANGE author_id author_id INT DEFAULT 1 NOT NULL, CHANGE topic_id topic_id INT NOT NULL, CHANGE picture picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1F55203D FOREIGN KEY (topic_id) REFERENCES topic (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE topic CHANGE author_id author_id INT DEFAULT 1 NOT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT NOT NULL');
        $this->addSql('ALTER TABLE article CHANGE author_id author_id INT NOT NULL');
        $this->addSql('ALTER TABLE equipment_section DROP FOREIGN KEY FK_5B08B500D823E37A');
        $this->addSql('ALTER TABLE equipment_section DROP FOREIGN KEY FK_5B08B500517FE9FE');
        $this->addSql('ALTER TABLE equipment_section ADD CONSTRAINT FK_5B08B500D823E37A FOREIGN KEY (section_id) REFERENCES section (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_section ADD CONSTRAINT FK_5B08B500517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE section DROP FOREIGN KEY FK_2D737AEF7294869C');
        $this->addSql('ALTER TABLE section ADD CONSTRAINT FK_2D737AEF7294869C FOREIGN KEY (article_id) REFERENCES article (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE country DROP country_code');
        $this->addSql('ALTER TABLE img_object DROP FOREIGN KEY FK_75881B8CC06A9F55');
        $this->addSql('ALTER TABLE img_object DROP FOREIGN KEY FK_75881B8C517FE9FE');
        $this->addSql('ALTER TABLE img_object CHANGE img_id img_id INT NOT NULL, CHANGE equipment_id equipment_id INT NOT NULL');
        $this->addSql('ALTER TABLE img_object ADD CONSTRAINT FK_75881B8CC06A9F55 FOREIGN KEY (img_id) REFERENCES img (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE img_object ADD CONSTRAINT FK_75881B8C517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE article_like CHANGE author_id author_id INT NOT NULL, CHANGE article_id article_id INT NOT NULL');
        $this->addSql('ALTER TABLE category CHANGE picture picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE equipment CHANGE sub_category_id sub_category_id INT NOT NULL');
    }
}
