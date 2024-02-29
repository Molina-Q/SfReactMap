<?php

namespace App\Controller;

use Date;
use DateTime;
use App\Entity\Topic;
use App\Entity\Message;
use App\Form\TopicFormType;
use App\Form\MessageFormType;
use App\Repository\UserRepository;
use App\Repository\TopicRepository;
use App\Repository\MessageRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ForumController extends AbstractController
{

    #[Route('/forum', name: 'app_forum')]
    public function index(
        TopicRepository $topicRepository,
        CategoryRepository $categoryRepository
        
    ): Response
    {
        $topics = $topicRepository->findBy([], ['title' => 'ASC']);
        $equipCateg = $categoryRepository->findAll();

        return $this->render('forum/index.html.twig', [
            'topics' => $topics,
            'equipCateg' => $equipCateg
        ]);
    }

    #[Route('/forum/create', name: 'create_topic')]
    public function create(
        TopicRepository $topicRepository,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager
        
    ): Response
    {
        $topic = new Topic();
        $message = new Message();

        $user = $userRepository->findOneById(1);

        $form = $this->createForm(TopicFormType::class, null, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            // first set topic's fields
            $topic->setAuthor($user);
            $topic->setTitle($form->get('title')->getData());
            $topic->setEquipment($form->get('Equipment')->getData());
            $topic->setArticle($form->get('Article')->getData());

            $topic->setAuthor($user);
            $topic->setCreationDate($dateNow);
            
            $entityManager->persist($topic);
            $entityManager->flush();

            // then message fields
            $message->setAuthor($user);
            $message->setTopic($topic);

            $message->setCreationDate($dateNow);
            $message->setText($form->get('msgAuthor')->getData());
        
            $entityManager->persist($message);
            $entityManager->flush();

            $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully created');

            return $this->redirectToRoute('app_forum');
        }

        return $this->render('forum/create.html.twig', [
            'createTopicForm' => $form->createView(),
        ]);
    }

    #[Route('/forum/update/{id}', name: 'update_topic')]
    public function update(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id
        
    ): Response
    {
        $topic = $topicRepository->findOneById($id);
        $message = $messageRepository->findOneByTopic($id);

        $form = $this->createForm(TopicFormType::class, $topic, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {

            $message->setText($form->get('msgAuthor')->getData());

            $entityManager->persist($topic);
            $entityManager->flush();

            $entityManager->persist($message);
            $entityManager->flush();

            $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

            return $this->redirectToRoute('app_forum');
        }

        return $this->render('forum/create.html.twig', [
            'createTopicForm' => $form->createView(),
        ]);
    }

    #[Route('/forum/delete/{id}', name: 'delete_topic')]
    public function delete(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id
        
    ): Response
    {
        $topic = $topicRepository->findOneById($id);

        $entityManager->remove($topic);
        $entityManager->flush();

        $this->addFlash('success', 'The session was successfully deleted');

        return $this->redirectToRoute('app_forum');
    }

    #[Route('/forum/topic/{id}', name: 'show_topic')]
    public function showTopic(
        int $id,
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): Response
    {
        $message = new Message();
        $topic = $topicRepository->findOneById($id);

        $form = $this->createForm(MessageFormType::class, $message, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            $message->setCreationDate($dateNow);
            $message->setAuthor($topic->getAuthor());
            $message->setTopic($topic);

            $entityManager->persist($message);
            $entityManager->flush();

            return $this->redirectToRoute('show_topic', ['id' => $id]);
        }

        $responses = $messageRepository->findMessages($id);

        return $this->render('forum/show.html.twig', [
            'topic' => $topic,
            'responses' => $responses,
            'createMessageForm' => $form->createView(),
        ]);
    }   

    #[Route('/forum/topic/list/{sortBy}/{id?}', name: 'list_topic', defaults: ['id' => null])]
    public function listTopics(
        string $sortBy,
        int $id = null,
        TopicRepository $topicRepository,
    ): Response
    {
        $topics = '';
        switch ($sortBy) {
            case 'equip':
                $topics = $topicRepository->findByEquip($id);
                break;
            case 'article':
                $topics = $topicRepository->findByArticle();
                break;

            default:
                $this->redirectToRoute('app_forum');
                break;
        }

        // $topics = $topicRepository->findBy($id);

        return $this->render('forum/list.html.twig', [
            'topics' => $topics,
        ]);
    }
}