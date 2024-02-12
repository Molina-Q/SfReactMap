<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
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

    #[Route('/dataCountry/{country}/{century}', name: 'show_count')]
    public function dataCount(
        string $country,
        string $century,
        ArticleRepository $articleRepository,
    ): Response
    {
        // $article = $articleRepository->findOneByCountry($country);
        $article = $articleRepository->findOneById(1);
        // $articleJSON = json_encode($article);

        if(!$article) {
            $dataCountry = "Sorry but this country doesn't have an Article for this period";
            return new JsonResponse($dataCountry);
        }


        // $jsonContent = $serializer->serialize($article, 'json');

        return new JsonResponse(([ 
            'title' => $article->getTitle(),
            'summary' => $article->getSummary(),
            'country' => $article->getCountry()->getName(),
            'century' => $article->getCentury()->getYear(),
        ]));

        // return new JsonResponse(json_encode([
        //     "article" => $jsonContent,
        // ]));
    }

 
}
