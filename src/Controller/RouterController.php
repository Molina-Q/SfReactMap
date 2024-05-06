<?php

namespace App\Controller;

use App\Repository\EquipmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RouterController extends AbstractController
{
    #[Route('/home', name: 'app_home', methods: ['GET'])]
    #[Route('/equipment', name: 'app_equipment', methods: ['GET'])]
    #[Route('/equipment/create', name: 'show_create_equipment', methods: ['GET'])]
    #[Route('/map', name: 'app_map', methods: ['GET'])]
    #[Route('/forum', name: 'app_forum', methods: ['GET'])]
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
