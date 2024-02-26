<?php

namespace App\Controller;

use App\Entity\Topic;
use App\Form\TopicFormType;
use App\Repository\TopicRepository;
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
        Request $request,
        EntityManagerInterface $entityManager
        
    ): Response
    {
        $topic = new Topic();

        $form = $this->createForm(TopicFormType::class, $topic, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($topic);
            $entityManager->flush();

            $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully created');

            return $this->redirectToRoute('app_forum');
        }

        return $this->render('forum/create.html.twig', [
            'createTopicForm' => $form->createView(),
        ]);
    }



    #[Route('/forum/topic/{id}', name: 'show_topic')]
    public function showTopic(
        int $id,
        TopicRepository $topicRepository,
    ): Response
    {

        $topic = $topicRepository->findOneById($id);

        return $this->render('forum/show.html.twig', [
            'topic' => $topic,
        ]);
    }   

    #[Route('/forum/topic/list/{sortBy}/{id?}', name: 'list_topic', defaults: ['id' => null])]
    public function listTopics(
        string $sortBy,
        int $id = null,
        TopicRepository $topicRepository,
    ): Response
    {
        $topics;
        switch ($sortBy) {
            case 'equip':
                $topics = $topicRepository->findByEquip($id);
                break;
            case 'article':
                $topics = $topicRepository->findByArticle();
                break;

            default:
                redirectToRoute('app_forum');
                break;
        }

        // $topics = $topicRepository->findBy($id);

        return $this->render('forum/list.html.twig', [
            'topics' => $topics,
        ]);
    }

}

