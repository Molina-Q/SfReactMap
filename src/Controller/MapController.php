<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
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
        SerializerInterface $serializer,
    ): Response
    {
        $encoder = new JsonEncoder();
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, string $format, array $context): string {
                return $object->getId();
            },
        ];
        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);
        
        $serializer = new Serializer([$normalizer], [$encoder]);

        // {"name":"Les-Tilleuls.coop","members":[{"name":"K\u00e9vin", organization: "Les-Tilleuls.coop"}]}
        // $encoders = [new XmlEncoder(), new JsonEncoder()];
        // $normalizers = [new ObjectNormalizer()];

        // $serializer = new Serializer($normalizers, $encoders);

        // $article = $articleRepository->findOneByCountry($country);
        $article = $articleRepository->findOneByCountry($country, $century);
        // $articleJSON = json_encode($article);

        $jsonContent = $serializer->serialize($article, 'json');

        if(!$article) {
            $dataCountry = "Sorry this country doesn't have an Article for this period.";
            return new JsonResponse(false);
        }


        return new JsonResponse([ 
            // 'id_article' => $article->getId(),
            'article' => \json_decode($jsonContent)
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
