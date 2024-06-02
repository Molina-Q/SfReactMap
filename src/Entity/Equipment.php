<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\EquipmentRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;

#[ORM\Entity(repositoryClass: EquipmentRepository::class)]
class Equipment
{
    #[Groups('equipment')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups('equipment')]
    #[ORM\Column(length: 255)]
    private ?string $name = null;
    
    #[Groups('equipment')]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\ManyToOne(inversedBy: 'equipment')]
    private ?SubCategory $sub_category = null;

    #[ORM\OneToMany(mappedBy: 'Equipment', targetEntity: ImgObject::class)]
    private Collection $imgObjects;

    #[ORM\OneToMany(mappedBy: 'Equipment', targetEntity: EquipmentSection::class)]
    private Collection $equipmentSections;

    #[ORM\OneToMany(mappedBy: 'Equipment', targetEntity: Topic::class)]
    private Collection $topics;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\ManyToOne(inversedBy: 'equipments')]
    private ?User $author = null;

    public function __construct()
    {
        $this->imgObjects = new ArrayCollection();
        $this->equipmentSections = new ArrayCollection();
        $this->topics = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

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

    public function getSubCategory(): ?SubCategory
    {
        return $this->sub_category;
    }

    public function setSubCategory(?SubCategory $sub_category): static
    {
        $this->sub_category = $sub_category;

        return $this;
    }

    /**
     * @return Collection<int, ImgObject>
     */
    public function getImgObjects(): Collection
    {
        return $this->imgObjects;
    }

    public function addImgObject(ImgObject $imgObject): static
    {
        if (!$this->imgObjects->contains($imgObject)) {
            $this->imgObjects->add($imgObject);
            $imgObject->setEquipment($this);
        }

        return $this;
    }

    public function removeImgObject(ImgObject $imgObject): static
    {
        if ($this->imgObjects->removeElement($imgObject)) {
            // set the owning side to null (unless already changed)
            if ($imgObject->getEquipment() === $this) {
                $imgObject->setEquipment(null);
            }
        }

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
            $equipmentSection->setEquipment($this);
        }

        return $this;
    }

    public function removeEquipmentSection(EquipmentSection $equipmentSection): static
    {
        if ($this->equipmentSections->removeElement($equipmentSection)) {
            // set the owning side to null (unless already changed)
            if ($equipmentSection->getEquipment() === $this) {
                $equipmentSection->setEquipment(null);
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
            $topic->setEquipment($this);
        }

        return $this;
    }

    public function removeTopic(Topic $topic): static
    {
        if ($this->topics->removeElement($topic)) {
            // set the owning side to null (unless already changed)
            if ($topic->getEquipment() === $this) {
                $topic->setEquipment(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }

    public function equipTag()
    {
        return $this->name . ' - ' . $this->sub_category->getLabel();
    }

        
    #[Groups('equipment')]    
    #[SerializedName('img')]
    public function getOneImg()
    {
        return $this->imgObjects->first()->getImg()->getPath();
    }

    public function getFirstImg()
    {
        return $this->imgObjects->first();
    }

    public function showObjectCategory()
    {
        return $this->sub_category->getCategory();
    }

    public function getSubCatLabel()
    {
        return $this->sub_category->getLabel();
    }

    public function getSubCatId()
    {
        return $this->sub_category->getLabel();
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

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }
}
