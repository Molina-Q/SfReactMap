<?php

namespace App\Controller;

use Date;
use DateTime;
use App\Entity\Topic;
use App\Entity\Comment;
use App\Entity\Message;
use App\Form\TopicFormType;
use App\Form\CommentFormType;
use App\Form\MessageFormType;
use App\Repository\UserRepository;
use App\Repository\TopicRepository;
use App\Repository\CommentRepository;
use App\Repository\MessageRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ForumController extends AbstractController
{

    #[Route('/fauxrum', name: 'app_forum')]
    public function index(
        TopicRepository $topicRepository,
        CategoryRepository $categoryRepository

    ): Response {
        $topics = $topicRepository->findBy([], ['title' => 'ASC']);
        $equipCateg = $categoryRepository->findAll();

        return $this->render('forum/index.html.twig', [
            'topics' => $topics,
            'equipCateg' => $equipCateg
        ]);
    }

    // create forum route
    #[Route('/forum/create', name: 'create_topic')]
    public function create(
        TopicRepository $topicRepository,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager

    ): Response {
        $topic = new Topic();
        $message = new Message();

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(TopicFormType::class, null, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            // first set topic's fields
            $topic->setAuthor($user);
            $topic->setTitle($form->get('title')->getData());
            $topic->setEquipment($form->get('Equipment')->getData());
            $topic->setArticle($form->get('Article')->getData());
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

            $this->addFlash('success', 'The Topic ' . $topic->getTitle() . ' was successfully created');

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

    ): Response {
        $topic = $topicRepository->findOneById($id);
        $message = $messageRepository->findOneByTopic($id);

        $form = $this->createForm(TopicFormType::class, $topic, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $message->setText($form->get('msgAuthor')->getData());

            $entityManager->persist($topic);
            $entityManager->flush();

            $entityManager->persist($message);
            $entityManager->flush();

            $this->addFlash('success', 'The Topic ' . $topic->getTitle() . ' was successfully updated');

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

    ): Response {
        $topic = $topicRepository->findOneById($id);

        $entityManager->remove($topic);
        $entityManager->flush();

        $this->addFlash('success', 'The session was successfully deleted');

        return $this->redirectToRoute('app_forum');
    }

    #[Route('/forum/topic/comment', name: 'create_comment')]
    public function createComment(
        MessageRepository $messageRepository,
        EntityManagerInterface $entityManager
    ): Response {

        $comment = new Comment();
        $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $text = filter_input(INPUT_POST, 'comment', FILTER_SANITIZE_FULL_SPECIAL_CHARS);


        $message = $messageRepository->findOneById($id);

        $errorCheck = false;

        if (!$message) {
            $errorCheck = true;
            $this->redirectToRoute('app_forum');
        }

        if (empty($id)) {
            $errorCheck = true;
            $this->addFlash('error', 'The session was successfully deleted');
        }

        if (empty($text)) {
            $errorCheck = true;
            $this->addFlash('error', 'Text cannot be empty');
        }

        if (!$errorCheck) {
            $dateNow = new \DateTime('now');

            $comment->setText($text);
            $comment->setCreationDate($dateNow);
            $comment->setAuthor($this->getUser());
            $comment->setMessage($message);

            $entityManager->persist($comment);
            $entityManager->flush();
        }

        $idTopic = $message->getTopic()->getId();

        return $this->redirectToRoute('show_topic', ['id' => $idTopic]);
    }

    #[Route('/forum/topic/{id}', name: 'get_topic', methods: ['GET'])]
    public function getTopic(): Response
    {
        return $this->render('base.html.twig');
    }

    #[Route('/api/forum/topic/{id}', name: 'show_topic', methods: ['GET'])]
    public function showTopic(
        int $id,
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        $topicObject = $topicRepository->findOneById($id);
        $responsesObject = $messageRepository->findMessages($id);

        // Prepare the topic data
        $topic = [
            'id' => $topicObject->getId(),
            'title' => $topicObject->getTitle(),
            'creationDate' => $topicObject->getCreationDate(),
            'author' => $topicObject->getAuthor()->getUsername(),
            'message' => $topicObject->msgAuthor(),
            'cat' => $topicObject->showCategory(),
        ];

        // Prepare the responses data
        $responses = [];
        foreach ($responsesObject as $response) {
            $comments = [];
            foreach ($response->getComments() as $comment) {
                $comments[] = [
                    'id' => $comment->getId(),
                    'Author' => $comment->getAuthor()->getUsername(),
                    'text' => $comment->getText(),
                    'creationDate' => $comment->getCreationDate()->format('Y-m-d'),
                    // Add other comment fields as needed
                ];
            }

            $responses[] = [
                'id' => $response->getId(),
                'text' => $response->getText(),
                'creationDate' => $response->getCreationDate()->format('Y-m-d'),
                'author' => $response->getAuthor()->getUsername(),
                'comments' => $comments,
            ];
        }

        // Prepare the final data
        $data = [
            'topic' => $topic,
            'responses' => $responses,
        ];

        // Return the data as a JSON response
        return $this->json(
            $data
        );
    }


    #[Route('/forum/topic/list/{sortBy}/{id?}', name: 'list_topic', defaults: ['id' => null])]
    public function listTopics(
        string $sortBy,
        int $id = null,
        TopicRepository $topicRepository,
    ): Response {
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

    #[Route('/forum/message/update/{id}', name: 'update_message')]
    public function updateMessage(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id

    ): Response {
        $message = $messageRepository->findOneById($id);
        $topic = $message->getTopic();

        $form = $this->createForm(MessageFormType::class, $message, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($message);
            $entityManager->flush();

            return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
        }

        return $this->render('forum/message.html.twig', [
            'updateMessageForm' => $form->createView(),
        ]);
    }

    #[Route('/forum/message/delete/{id}', name: 'delete_message')]
    public function deleteMessage(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id

    ): Response {
        $message = $messageRepository->findOneById($id);
        $topic = $message->getTopic();

        $entityManager->remove($message);
        $entityManager->flush();

        $this->addFlash('success', 'The session was successfully deleted');

        return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    }

    #[Route('/forum/comment/update/{id}', name: 'update_comment')]
    public function updateComment(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        CommentRepository $commentRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id

    ): Response {
        $comment = $commentRepository->findOneById($id);
        $topic = $comment->getMessage()->getTopic();

        $form = $this->createForm(CommentFormType::class, $comment, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($comment);
            $entityManager->flush();

            return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
        }

        return $this->render('forum/comment.html.twig', [
            'updateCommentForm' => $form->createView(),
        ]);
    }

    #[Route('/forum/comment/delete/{id}', name: 'delete_comment')]
    public function deleteComment(
        TopicRepository $topicRepository,
        MessageRepository $messageRepository,
        CommentRepository $commentRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        int $id

    ): Response {
        $comment = $commentRepository->findOneById($id);
        $topic = $comment->getMessage()->getTopic();

        $entityManager->remove($comment);
        $entityManager->flush();

        $this->addFlash('success', 'The session was successfully deleted');

        return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    }
}
