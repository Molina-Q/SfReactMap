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
        if ($this->Equipment !== null) {
            return $this->Equipment->equipTag();
        } elseif ($this->Article !== null) {
            return $this->Article->articleTag();
        } else {
            return null;
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

    // return the text of the message of the author
    public function msgAuthor() 
    {
        if(isset($this->messages[0])) {
            return $this->messages->first()->getText();
        } 
        return "";
    }

    // return the message entity of the author
    public function messageTopic() 
    {

        if(isset($this->messages[0])) {
            return $this->messages->first();
        } 

        return "";
    }

    // unused, might delete
    public function setMsgAuthor(string $newMsg) 
    {
        $this->messages->first()->setText($newMsg);
        return $this;
    }

    // show all messages except the first one of the author
    public function showMessages()
    {     
        $messages = $this->messages;
        // needs to return array with all messages except the one in the header
        return $this->messages;
        // $messages = $this->messages;
        // $messages->remove(0);
        // return $messages;
    }

    // show all messages except the first one of the author
    // needs to be optimized
    public function showUserMessages()
    {     
        $messages = $this->messages;
        $updatedMessages = new ArrayCollection();

        foreach ($messages as $key => $message) {
            if ($key !== 0) {
                $updatedMessages->add($message);
            }
        }
    
        return $updatedMessages;
    }


    // return a string of the category of the topic
    public function returnCategory()
    {
        if ($this->Equipment !== null) {
            return 'equipment';
        } elseif ($this->Article !== null) {
            return 'article';
        } else {
            return null;
        }
    }

    // return the id of the category of the equipment 
    public function returnEquipmentCategory()
    {
        if ($this->Equipment !== null) {
            return $this->Equipment->getSubCategory()->getCategory()->getId();
        } else {
            return null;
        }
    }

    // return the length of time that has passed since the topic was created
    // automaticaly changed the end string to according to the amount of time
    public function timeSinceCreation()
    {
        $now = new \DateTime();
        $interval = $now->diff($this->creationDate);
        if ($interval->y > 0) {
            return $interval->y . ' years';
        } elseif ($interval->m > 0) {
            return $interval->m . ' months';
        } elseif ($interval->d > 0) {
            return $interval->d . ' days';
        } elseif ($interval->h > 0) {
            return $interval->h . ' hours';
        } elseif ($interval->i > 0) {
            return $interval->i . ' minutes';
        } else {
            return 'now';
        }
    }

    // number of comments and messages
    public function countReplies(): int
    {
 
        $nbMessages = count($this->messages);

        if ($nbMessages <= 1) {
            return 0;
        }

        // i do this to not count the message of the author

        $nbComments = 0;

        foreach ($this->messages as $message) {
            $nbComments += count($message->getComments());
        }

        return $nbMessages + $nbComments - 1;
    }
    
}
