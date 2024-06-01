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
use App\Repository\ArticleRepository;
use App\Repository\UserRepository;
use App\Repository\TopicRepository;
use App\Repository\CommentRepository;
use App\Repository\MessageRepository;
use App\Repository\CategoryRepository;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ForumController extends AbstractController
{

    private TokenStorageInterface $tokenStorageInterface;
    private JWTTokenManagerInterface $jwtManager;
    private JWSProviderInterface $jwsProvider;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager, JWSProviderInterface $jwsProvider)
    {
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->jwtManager = $jwtManager;
        $this->jwsProvider = $jwsProvider;
    }

    #[Route('/api/forum/topic/create', name: 'create_topic', methods: ['POST'])]
    #[Route('/api/forum/topic/edit/{topicId}', name: 'edit_topic', methods: ['POST'])]
    public function createTopic(
        Request $request,
        int $topicId = null,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TopicRepository $topicRepository,
        EquipmentRepository $equipmentRepository,
        ArticleRepository $articleRepository,
        MessageRepository $messageRepository
    ): Response {
        $isEdit = $topicId ? true : false;
        $topic = $topicId ? $topicRepository->findOneById($topicId) : new Topic();
        $message = $topicId ? $messageRepository->findOneById($topic->messageTopic()->getId()) : new Message();

        $tokenGet = $request->cookies->get('BEARER');
        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $jws = $this->jwsProvider->load($token);
        $decodedToken = $jws->getPayload();
        $userId = $decodedToken['userId'];

        $currentUser = $userRepository->findOneById($userId);

        $requestData = json_decode($request->getContent(), true);

        $data = filter_var_array($requestData, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (isset($data)) {

            // there can only be one.
            if ($data['Equipment']) {
                $equipment = $equipmentRepository->findOneById($data['Equipment']);
                $topic->setEquipment($equipment);
            } else if ($data['Article']) {
                $article = $articleRepository->findOneById($data['Article']);
                $topic->setArticle($article);
            }

            // all the codes that only needs to be executed on topic create
            if (!$isEdit) {
                $date = new DateTime('now');

                $topic->setCreationDate($date);
                $topic->setAuthor($currentUser);

                $message->setAuthor($currentUser);
                $message->setCreationDate($date);
                $message->setTopic($topic);
            }

            $topic->setTitle($data['title']);

            $message->setText($data['Message']);

            $entityManager->persist($topic);
            $entityManager->flush();

            $entityManager->persist($message);
            $entityManager->flush();

            $dataTopic = [
                'author' => $topic->getAuthor()->getUsername(),
                'cat' => $topic->showCategory(),
                'creationDate' => $topic->getCreationDate(),
                'id' => $topic->getId(),
                'title' => $topic->getTitle(),
            ];
        } else {
            return $this->json(
                ['error' => true, 'message' => 'Topic not created'],
                Response::HTTP_BAD_REQUEST
            );
        }


        return $this->json(
            ['error' => false, 'message' => 'Topic created successfully', 'object' => $dataTopic],
            Response::HTTP_CREATED
        );
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
        // $responsesObject = $messageRepository->findMessages($id);
        $responsesObject = $topicObject->showUserMessages();
        // dd($responsesObject);
        // Prepare the topic data
        $topic = [
            'id' => $topicObject->getId(),
            'title' => $topicObject->getTitle(),
            'creationDate' => $topicObject->getCreationDate(),
            'author' => $topicObject->getAuthor()->getUsername(),
            'message' => $topicObject->msgAuthor(),
            'messageId' => $topicObject->messageTopic()->getId(),
            'cat' => $topicObject->showCategory(),
            'equipId' => $topicObject->getEquipment() ? $topicObject->getEquipment()->getId() : '',
            'articleId' => $topicObject->getArticle() ? $topicObject->getArticle()->getId() : '',
        ];

        // Prepare the responses data
        $responses = [];
        foreach ($responsesObject as $response) {
            $comments = [];
            foreach ($response->getComments() as $comment) {
                $comments[] = [
                    'id' => $comment->getId(),
                    'author' => $comment->getAuthor()->getUsername(),
                    'text' => $comment->getText(),
                    'creationDate' => $comment->getCreationDate()->format('Y-m-d'),
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

    #[Route('/api/topic/delete/{id}', name: 'delete_topic', methods: ['DELETE'])]
    public function deleteTopic(
        int $id,
        TopicRepository $topicRepository,
        EntityManagerInterface $entityManager
    ): Response {
        $topic = $topicRepository->findOneById($id);

        $entityManager->remove($topic);
        $entityManager->flush();

        return $this->json(
            ['error' => false, 'message' => 'Topic deleted successfully'],
            Response::HTTP_OK
        );
    }


    #[Route('/api/forum/message/create/{topicId}', name: 'create_message', methods: ['POST'])]
    #[Route('/api/forum/message/edit/{messageId}', name: 'edit_message', methods: ['POST'])]
    public function createMessage(
        Request $request,
        TopicRepository $topicRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        MessageRepository $messageRepository,
        int $topicId = null,
        int $messageId = null,
    ): Response {
        $isEdit = $messageId ? true : false;
        $message = $messageId ? $messageRepository->findOneById($messageId) : new Message();

        $token = $_COOKIE['BEARER'];

        $jws = $this->jwsProvider->load($token);
        $decodedToken = $jws->getPayload();
        $userId = $decodedToken['userId'];

        $topic = $topicRepository->findOneById($topicId);
        $currentUser = $userRepository->findOneById($userId);

        $data = json_decode($request->getContent(), true);
        $requestData = filter_var_array($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (isset($requestData)) {

            if (!$isEdit) {
                $message->setAuthor($currentUser);
                $message->setTopic($topic);
                $message->setCreationDate(new DateTime('now'));
            }

            $message->setText($requestData['text']);

            $entityManager->persist($message);
            $entityManager->flush();

            $dataMessage = [
                'author' => $message->getAuthor()->getUsername(),
                'comments' => [],
                'creationDate' => $message->getCreationDate(),
                'id' => $message->getId(),
                'text' => $message->getText(),
            ];
        } else {
            return $this->json(
                ['error' => true, 'message' => 'Message not created'],
                Response::HTTP_BAD_REQUEST
            );
        }


        return $this->json(
            ['error' => false, 'message' => 'Message created successfully', 'object' => $dataMessage],
            Response::HTTP_CREATED
        );
    }

    #[Route('/api/forum/comment/create/{messageId}', name: 'create_comment', methods: ['POST'])]
    #[Route('/api/forum/comment/edit/{commentId}', name: 'edit_comment', methods: ['POST'])]
    public function createComment(
        Request $request,
        MessageRepository $messageRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        CommentRepository $commentRepository,
        int $messageId = null,
        int $commentId = null,
    ): Response {
        $isEdit = $commentId ? true : false;
        $comment = $commentId ? $commentRepository->findOneById($commentId) : new Comment();

        $tokenGet = $request->cookies->get('BEARER');
        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $jws = $this->jwsProvider->load($token);
        $decodedToken = $jws->getPayload();
        $userId = $decodedToken['userId'];

        $message = $messageRepository->findOneById($messageId);
        $currentUser = $userRepository->findOneById($userId);

        $data = json_decode($request->getContent(), true);
        $requestData = filter_input_array($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (isset($requestData)) {
            if (!$isEdit) {
                $comment->setAuthor($currentUser);
                $comment->setMessage($message);
                $comment->setCreationDate(new DateTime('now'));
            }

            $comment->setText($requestData['text']);
            
            $entityManager->persist($comment);
            $entityManager->flush();

            $dataComment = [
                'author' => $comment->getAuthor()->getUsername(),
                'creationDate' => $comment->getCreationDate(),
                'id' => $comment->getId(),
                'text' => $comment->getText(),
            ];
        } else {
            return $this->json(
                ['error' => true, 'message' => 'Comment not created'],
                Response::HTTP_BAD_REQUEST
            );
        }


        return $this->json(
            ['error' => false, 'message' => 'Comment created successfully', 'object' => $dataComment],
            Response::HTTP_CREATED
        );
    }

    #[Route('/api/forum/topics/category', name: 'public_show_message', methods: ['GET'])]
    public function topicsByCategory(
        Request $request,
        TopicRepository $topicRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ): Response {
        $categories = ['weapon', 'armour', 'tool', 'country', 'century'];
        $isValid = false;
        $showGet = $request->query->get('show');
        $show = filter_var($showGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $showCateg = '';

        // $topicsObject = $topicRepository->findByCategory($showCateg);
        $topicsObject = $topicRepository->findBy([], ['creationDate' => 'DESC']);
        $topics = [];

        foreach ($topicsObject as $topic) {
            $topics[] = [
                'id' => $topic->getId(),
                'title' => $topic->getTitle(),
                'creationDate' => $topic->getCreationDate(),
                'interval' => $topic->timeSinceCreation(),
                'author' => $topic->getAuthor()->getUsername(),
                'message' => $topic->msgAuthor(),
                'countReplies' => $topic->countReplies(),
                'countLike' => '1',
                'cat' => $topic->showCategory(),
            ];
        }

        return $this->json(
            ['error' => false, 'message' => 'Category found', 'object' => $topics],
            Response::HTTP_OK
        );

        // foreach($categories as $category) {
        //     if($show === $category) {
        //         $isValid = true;
        //         if($show === 'weapon' || $show === 'armour' || $show === 'tool') {
        //             $showCateg = 'equipment';
        //         } else {
        //             $showCateg = 'article';
        //         }
        //     }
        // }

        // if($isValid) {

        //     $topics = $topicRepository->findByCategory($showCateg);

        //     return $this->json(
        //         ['error' => false, 'message' => 'Category found', 'object' => $topics], Response::HTTP_OK
        //     );
        // }

        // return $this->json(
        //     ['error' => true, 'message' => 'There was a mistake'], Response::HTTP_BAD_REQUEST
        // );
    }


    // #[Route('/forum/topic/list/{sortBy}/{id?}', name: 'list_topic', defaults: ['id' => null])]
    // public function listTopics(
    //     string $sortBy,
    //     int $id = null,
    //     TopicRepository $topicRepository,
    // ): Response {
    //     $topics = '';
    //     switch ($sortBy) {
    //         case 'equip':
    //             $topics = $topicRepository->findByEquip($id);
    //             break;
    //         case 'article':
    //             $topics = $topicRepository->findByArticle();
    //             break;

    //         default:
    //             $this->redirectToRoute('app_forum');
    //             break;
    //     }

    //     // $topics = $topicRepository->findBy($id);

    //     return $this->render('forum/list.html.twig', [
    //         'topics' => $topics,
    //     ]);
    // }

    // #[Route('/forum/message/update/{id}', name: 'update_message')]
    // public function updateMessage(
    //     TopicRepository $topicRepository,
    //     MessageRepository $messageRepository,
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     int $id

    // ): Response {
    //     $message = $messageRepository->findOneById($id);
    //     $topic = $message->getTopic();

    //     $form = $this->createForm(MessageFormType::class, $message, ['attr' => ['class' => 'form-create']]);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {

    //         $entityManager->persist($message);
    //         $entityManager->flush();

    //         return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    //     }

    //     return $this->render('forum/message.html.twig', [
    //         'updateMessageForm' => $form->createView(),
    //     ]);
    // }

    // #[Route('/forum/message/delete/{id}', name: 'delete_message')]
    // public function deleteMessage(
    //     TopicRepository $topicRepository,
    //     MessageRepository $messageRepository,
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     int $id

    // ): Response {
    //     $message = $messageRepository->findOneById($id);
    //     $topic = $message->getTopic();

    //     $entityManager->remove($message);
    //     $entityManager->flush();

    //     $this->addFlash('success', 'The session was successfully deleted');

    //     return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    // }

    // #[Route('/forum/comment/update/{id}', name: 'update_comment')]
    // public function updateComment(
    //     TopicRepository $topicRepository,
    //     MessageRepository $messageRepository,
    //     CommentRepository $commentRepository,
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     int $id

    // ): Response {
    //     $comment = $commentRepository->findOneById($id);
    //     $topic = $comment->getMessage()->getTopic();

    //     $form = $this->createForm(CommentFormType::class, $comment, ['attr' => ['class' => 'form-create']]);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {

    //         $entityManager->persist($comment);
    //         $entityManager->flush();

    //         return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    //     }

    //     return $this->render('forum/comment.html.twig', [
    //         'updateCommentForm' => $form->createView(),
    //     ]);
    // }

    // #[Route('/forum/comment/delete/{id}', name: 'delete_comment')]
    // public function deleteComment(
    //     TopicRepository $topicRepository,
    //     MessageRepository $messageRepository,
    //     CommentRepository $commentRepository,
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     int $id

    // ): Response {
    //     $comment = $commentRepository->findOneById($id);
    //     $topic = $comment->getMessage()->getTopic();

    //     $entityManager->remove($comment);
    //     $entityManager->flush();

    //     $this->addFlash('success', 'The session was successfully deleted');

    //     return $this->redirectToRoute('show_topic', ['id' => $topic->getId()]);
    // }
}
