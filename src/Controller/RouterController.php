<?php

namespace App\Controller;

use App\Repository\EquipmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RouterController extends AbstractController
{
    #[Route('/', name: 'public_app_index', methods: ['GET'])]
    public function indexRedirect(): Response
    {
        return $this->redirectToRoute('public_app_home');
    }

    // all of my page's routes
    #[Route('/home', name: 'public_app_home', methods: ['GET'])]
    #[Route('/forum', name: 'public_app_forum', methods: ['GET'])]
    #[Route('/forum/topic/{id}', name: 'public_one_topic_forum', methods: ['GET'])]
    #[Route('/forum/topics', name: 'public_all_topics_forum', methods: ['GET'])]
    #[Route('/topic/create', name: 'public_show_create_topic', methods: ['GET'])]
    #[Route('/topic/edit/{topicId}', name: 'show_edit_topic', methods: ['GET'])]

    #[Route('/equipment', name: 'public_app_equipment', methods: ['GET'])]
    #[Route('/equipment/create', name: 'public_show_create_equipment', methods: ['GET'])]
    #[Route('/equipment/edit/{id}', name: 'public_show_edit_equipment', methods: ['GET'])]

    #[Route('/article/create', name: 'public_show_create_article', methods: ['GET'])]
    #[Route('/article/edit/{id}', name: 'public_show_edit_article', methods: ['GET'])]

    #[Route('/section/create', name: 'public_show_create_section', methods: ['GET'])]
    #[Route('/section/edit/{id}', name: 'public_show_edit_section', methods: ['GET'])]

    #[Route('/map', name: 'public_app_map', methods: ['GET'])]

    #[Route('/profile', name: 'app_profile', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }

    // unlogged user routes
    #[Route('/login', name: 'public_app_show_login', methods: ['GET'])]
    #[Route('/register', name: 'public_app_show_register', methods: ['GET'])]
    public function indexAuth(): Response
    {
        if($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('base.html.twig');
    }

}
