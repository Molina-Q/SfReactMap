<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $summary = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\Column]
    private array $border = [];

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Century $Century = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Country $Country = null;

    #[ORM\OneToMany(mappedBy: 'Article', targetEntity: Section::class)]
    private Collection $sections;

    #[ORM\OneToMany(mappedBy: 'Article', targetEntity: Topic::class)]
    private Collection $topics;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    private ?User $Author = null;

    #[ORM\OneToMany(mappedBy: 'Article', targetEntity: ArticleEdited::class)]
    private Collection $articleEditeds;

    #[ORM\OneToMany(mappedBy: 'Article', targetEntity: ArticleLike::class)]
    private Collection $articleLikes;

    public function __construct()
    {
        $this->sections = new ArrayCollection();
        $this->topics = new ArrayCollection();
        $this->articleEditeds = new ArrayCollection();
        $this->articleLikes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getSummary(): ?string
    {
        return $this->summary;
    }

    public function setSummary(string $summary): static
    {
        $this->summary = $summary;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): static
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getBorder(): array
    {
        return $this->border;
    }

    public function setBorder(array $border): static
    {
        $this->border = $border;

        return $this;
    }

    public function getCentury(): ?Century
    {
        return $this->Century;
    }

    public function setCentury(?Century $Century): static
    {
        $this->Century = $Century;

        return $this;
    }

    public function getCountry(): ?Country
    {
        return $this->Country;
    }

    public function setCountry(?Country $Country): static
    {
        $this->Country = $Country;

        return $this;
    }

    /**
     * @return Collection<int, Section>
     */
    public function getSections(): Collection
    {
        return $this->sections;
    }

    public function addSection(Section $section): static
    {
        if (!$this->sections->contains($section)) {
            $this->sections->add($section);
            $section->setArticle($this);
        }

        return $this;
    }

    public function removeSection(Section $section): static
    {
        if ($this->sections->removeElement($section)) {
            // set the owning side to null (unless already changed)
            if ($section->getArticle() === $this) {
                $section->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Topic>
     */
    public function getTopics(): Collection
    {
        return $this->topics;
    }

    public function addTopic(Topic $topic): static
    {
        if (!$this->topics->contains($topic)) {
            $this->topics->add($topic);
            $topic->setArticle($this);
        }

        return $this;
    }

    public function removeTopic(Topic $topic): static
    {
        if ($this->topics->removeElement($topic)) {
            // set the owning side to null (unless already changed)
            if ($topic->getArticle() === $this) {
                $topic->setArticle(null);
            }
        }

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

    /**
     * @return Collection<int, ArticleEdited>
     */
    public function getArticleEditeds(): Collection
    {
        return $this->articleEditeds;
    }

    public function addArticleEdited(ArticleEdited $articleEdited): static
    {
        if (!$this->articleEditeds->contains($articleEdited)) {
            $this->articleEditeds->add($articleEdited);
            $articleEdited->setArticle($this);
        }

        return $this;
    }

    public function removeArticleEdited(ArticleEdited $articleEdited): static
    {
        if ($this->articleEditeds->removeElement($articleEdited)) {
            // set the owning side to null (unless already changed)
            if ($articleEdited->getArticle() === $this) {
                $articleEdited->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ArticleLike>
     */
    public function getArticleLikes(): Collection
    {
        return $this->articleLikes;
    }

    public function addArticleLike(ArticleLike $articleLike): static
    {
        if (!$this->articleLikes->contains($articleLike)) {
            $this->articleLikes->add($articleLike);
            $articleLike->setArticle($this);
        }

        return $this;
    }

    public function removeArticleLike(ArticleLike $articleLike): static
    {
        if ($this->articleLikes->removeElement($articleLike)) {
            // set the owning side to null (unless already changed)
            if ($articleLike->getArticle() === $this) {
                $articleLike->setArticle(null);
            }
        }

        return $this;
    }
}
