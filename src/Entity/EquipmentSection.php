<?php

namespace App\Entity;

use App\Repository\EquipmentSectionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EquipmentSectionRepository::class)]
class EquipmentSection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'equipmentSections')]
    private ?Section $Section = null;

    #[ORM\ManyToOne(inversedBy: 'equipmentSections')]
    private ?Equipment $Equipment = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSection(): ?Section
    {
        return $this->Section;
    }

    public function setSection(?Section $Section): static
    {
        $this->Section = $Section;

        return $this;
    }

    public function getEquipment(): ?Equipment
    {
        return $this->Equipment;
    }

    public function setEquipment(?Equipment $Equipment): static
    {
        $this->Equipment = $Equipment;

        return $this;
    }
}
