<?php

namespace App\Entity;

use App\Repository\ImgObjectRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImgObjectRepository::class)]
class ImgObject
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'imgObjects')]
    private ?Img $Img = null;

    #[ORM\ManyToOne(inversedBy: 'imgObjects')]
    private ?Equipment $Equipment = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImg(): ?Img
    {
        return $this->Img;
    }

    public function setImg(?Img $Img): static
    {
        $this->Img = $Img;

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
