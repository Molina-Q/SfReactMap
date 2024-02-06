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
            'controller_name' => 'MapController',
        ]);
    }

    #[Route('/get-geojson', name: 'get_geojson')]
    public function getGeoJSONPath()
    {
        $geoJSONPath = $this->getParameter('kernel.project_dir') . '/public/Geojson/countries.geojson';

        return new JsonResponse(['path' => $geoJSONPath]);
    }
}
