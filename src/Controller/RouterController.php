<?php

namespace App\Controller;

use App\Repository\EquipmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RouterController extends AbstractController
{
    #[Route('/', name: 'app_index', methods: ['GET'])]
    public function indexRedirect(): Response
    {
        return $this->redirectToRoute('app_home');
    }

    #[Route('/home', name: 'app_home', methods: ['GET'])]
    #[Route('/forum', name: 'app_forum', methods: ['GET'])]
    #[Route('/forum/topics', name: 'topics_forum', methods: ['GET'])]
    #[Route('/topic/create', name: 'show_create_topic', methods: ['GET'])]
    #[Route('/topic/edit/{topicId}', name: 'show_edit_topic', methods: ['GET'])]

    #[Route('/equipment', name: 'app_equipment', methods: ['GET'])]
    #[Route('/equipment/create', name: 'show_create_equipment', methods: ['GET'])]
    #[Route('/equipment/edit/{id}', name: 'show_create_equipment', methods: ['GET'])]

    #[Route('/article/create', name: 'show_create_article', methods: ['GET'])]
    #[Route('/article/edit/{id}', name: 'show_create_article', methods: ['GET'])]
    #[Route('/section/create', name: 'show_create_section', methods: ['GET'])]
    #[Route('/section/edit/{id}', name: 'show_edit_section', methods: ['GET'])]
    #[Route('/map', name: 'app_map', methods: ['GET'])]

    #[Route('/profile', name: 'app_profile', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }

    #[Route('/login', name: 'app_show_login', methods: ['GET'])]
    #[Route('/register', name: 'app_show_register', methods: ['GET'])]
    public function indexAuth(): Response
    {
        if($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('base.html.twig');
    }

}
