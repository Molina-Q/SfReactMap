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

    // #[Route('/dataCountry/Germany/{century}', name: 'show_germ')]
    // public function dataGerm(
    //     string $century
    // ): Response
    // {

    //     $country = "Germany";
    //     $dataCountry = 'Bonjour, ceci est la '+$country+' du backend de '+$century;

    //     return new JsonResponse($dataCountry);
    // }

    #[Route('/dataCountry/{country}', name: 'show_count')]
    public function dataCount(
        string $country,
    ): Response
    {
        $dataCountry = "Bonjour, ceci est la $country du backend";

        return new JsonResponse($dataCountry);
    }

//    #[Route('/dataCountry/{country}/{century}', name: 'show_map')]
//     public function data(
//         string $country,
//         string $century
//     ): Response
//     {
//         $dataCountry = 'Bonjour, ceci est la '+$country+' du backend de '+$century;

//         return new JsonResponse($dataCountry);
//     }

    // #[Route('/dataCountry/France/1900', name: 'show_france')]
    // public function dataShow(): Response
    // {
    //     $dataCountry = 'Bonjour, ceci est la france du backend de 1900';

    //     return new JsonResponse($dataCountry);
    // }
 
}
