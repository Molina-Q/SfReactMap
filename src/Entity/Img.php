<?php

namespace App\Entity;

use App\Repository\ImgRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImgRepository::class)]
class Img
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $path = null;

    #[ORM\OneToMany(mappedBy: 'Img', targetEntity: ImgObject::class)]
    private Collection $imgObjects;

    public function __construct()
    {
        $this->imgObjects = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

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
            $imgObject->setImg($this);
        }

        return $this;
    }

    public function removeImgObject(ImgObject $imgObject): static
    {
        if ($this->imgObjects->removeElement($imgObject)) {
            // set the owning side to null (unless already changed)
            if ($imgObject->getImg() === $this) {
                $imgObject->setImg(null);
            }
        }

        return $this;
    }
}
