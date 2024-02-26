<?php

namespace App\Controller;

use App\Repository\TopicRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ForumController extends AbstractController
{
    #[Route('/forum', name: 'app_forum')]
    public function index(TopicRepository $topicRepository): Response
    {

        $topics = $topicRepository->findBy([], ['title' => 'ASC']);

        return $this->render('forum/index.html.twig', [
            'topics' => $topics,
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
}

