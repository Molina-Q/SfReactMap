<?php

namespace App\Entity;

use App\Repository\ArticleEditedRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleEditedRepository::class)]
class ArticleEdited
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateEdit = null;

    #[ORM\ManyToOne(inversedBy: 'articleEditeds')]
    private ?User $Author = null;

    #[ORM\ManyToOne(inversedBy: 'articleEditeds')]
    private ?Article $Article = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateEdit(): ?\DateTimeInterface
    {
        return $this->dateEdit;
    }

    public function setDateEdit(\DateTimeInterface $dateEdit): static
    {
        $this->dateEdit = $dateEdit;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->Author;
    }

    public function setAuthor(?User $Author): static
    {
        $this->Author = $Author;

        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->Article;
    }

    public function setArticle(?Article $Article): static
    {
        $this->Article = $Article;

        return $this;
    }
}
