<?php

namespace App\Entity;

use App\Repository\TopicRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TopicRepository::class)]
class Topic
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 80)]
    private ?string $title = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\ManyToOne(inversedBy: 'topics')]
    private ?User $Author = null;

    #[ORM\ManyToOne(inversedBy: 'topics')]
    private ?Equipment $Equipment = null;

    #[ORM\ManyToOne(inversedBy: 'topics')]
    private ?Article $Article = null;

    #[ORM\OneToMany(mappedBy: 'Topic', targetEntity: Message::class)]
    private Collection $messages;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
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
        return $this->Author;
    }

    public function setAuthor(?User $Author): static
    {
        $this->Author = $Author;

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

    public function getArticle(): ?Article
    {
        return $this->Article;
    }

    public function setArticle(?Article $Article): static
    {
        $this->Article = $Article;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setTopic($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getTopic() === $this) {
                $message->setTopic(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->getTitle();
    }

    public function showStrCategory()
    {
        if(empty($this->Article)) {
            return $this->Equipment->getSubCategory()->getCategory()->getLabel();
        } else {
            return "Article";
        }
    } 

    public function showCategory() 
    {
        if(empty($this->Article)) {
            return $this->Equipment;
        } else {
            return $this->Article;
        }
    }

    public function showCategId() 
    {
        if(empty($this->Article)) {
            return $this->Equipment->getSubCategory()->getCategory()->getId();
        } else {
            return $this->Article->getId();
        }
    }

    public function categories()
    {
        $cat = ['Century', 'Country', 'Ceapon', 'Armour', 'Tool']; 
        return $cat;
    }
}
