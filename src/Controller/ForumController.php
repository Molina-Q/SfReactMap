<?php

namespace App\Controller;

use App\Repository\TopicRepository;
use App\Repository\CategoryRepository;
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

