<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MapController extends AbstractController
{
    #[Route('/map', name: 'app_map')]
    public function index(): Response
    {
        return $this->render('map/index.html.twig', [
        ]);
    }

    #[Route('/dataCountry', name: 'show_data')]
    public function dataTest(): Response
    {
        $dataCountry = 'Bonjour, ceci vient du backend';

        $jsonData = json_encode($dataCountry);

        return new JsonResponse($dataCountry);
    }
}
