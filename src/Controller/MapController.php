<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


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

        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $serializer = new Serializer($normalizers, $encoders);
        // $article = $articleRepository->findOneByCountry($country);
        $article = $articleRepository->findOneByCountry($country, $century);
        // $articleJSON = json_encode($article);

        if(!$article) {
            $dataCountry = "Sorry but this country doesn't have an Article for this period";
            return new JsonResponse(['title' => $dataCountry]);
        }

        $jsonContent = $serializer->serialize($article->getCountry(), 'json');

        return new JsonResponse([ 
            'id_article' => $article->getId(),
            'article' => $jsonContent
            // 'title' => $article->getTitle(),
            // 'summary' => $article->getSummary(),
            // 'country' => $article->getCountry()->getName(),
            // 'century' => $article->getCentury()->getYear(),
            
            // 'sectionsTitle' => $jsonSection,
            // 'sectionsContent' => $article->getSections(),
        ]);

        // return new JsonResponse(json_encode([
        //     "article" => $jsonContent,
        // ]));
    }
 
}
