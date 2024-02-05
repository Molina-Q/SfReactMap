<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReactController extends AbstractController
{
    #[Route('/react', name: 'app_react')]
    public function index(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }

    
    #[Route('/get-geojson', name: 'get_geojson')]
    public function getGeoJSONPath()
    {
        $geoJSONPath = $this->getParameter('kernel.project_dir') . '/public/Geojson/countries.geojson';

        return new JsonResponse(['path' => $geoJSONPath]);
    }
}
