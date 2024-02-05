<?php

namespace App\Entity;

use App\Repository\SectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SectionRepository::class)]
class Section
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\Column(length: 255)]
    private ?string $summary = null;

    #[ORM\OneToMany(mappedBy: 'Section', targetEntity: EquipmentSection::class)]
    private Collection $equipmentSections;

    #[ORM\ManyToOne(inversedBy: 'sections')]
    private ?Article $Article = null;

    public function __construct()
    {
        $this->equipmentSections = new ArrayCollection();
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

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

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

    /**
     * @return Collection<int, EquipmentSection>
     */
    public function getEquipmentSections(): Collection
    {
        return $this->equipmentSections;
    }

    public function addEquipmentSection(EquipmentSection $equipmentSection): static
    {
        if (!$this->equipmentSections->contains($equipmentSection)) {
            $this->equipmentSections->add($equipmentSection);
            $equipmentSection->setSection($this);
        }

        return $this;
    }

    public function removeEquipmentSection(EquipmentSection $equipmentSection): static
    {
        if ($this->equipmentSections->removeElement($equipmentSection)) {
            // set the owning side to null (unless already changed)
            if ($equipmentSection->getSection() === $this) {
                $equipmentSection->setSection(null);
            }
        }

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
