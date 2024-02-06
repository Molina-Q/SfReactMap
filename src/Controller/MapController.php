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

    #[Route('/geojson', name: 'geojson')]
    public function getGeoJSONPath()
    {
        // // the path to my file
        // $geoJSONPath = $this->getParameter('kernel.project_dir') . '/public/geojson/countries.geojson.js';

        // // convert/read the entire file as a string
        // $geoJSONContent = file_get_contents($geoJSONPath);

        // // return new JsonResponse(['path' => $geoJSONPath]);
        // return new JsonResponse(json_decode($geoJSONContent), Response::HTTP_OK, [], true);

    }
}
