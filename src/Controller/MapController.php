<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
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
    // the index 
    #[Route('/map', name: 'app_map')]
    public function index(): Response
    {
        return $this->render('map/index.html.twig', [
        ]);
    }

    // modal showSection
    #[Route('/dataCountry/section/{id}', name: 'show_section', methods: ['GET'])]
    public function showSection(
        int $id,
        SectionRepository $sectionRepository,
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
        


        // $jsonContent = $serializer->serialize($section, 'json');

        $equipementsSections = [];
        
        $Equipements = [];
        $equipementsImages = [];
        $IMG = [];
        // $equipSections = $sectionSF->getEquipmentSections();

        $sectionSF = $sectionRepository->findOneById($id); // Ma section

        foreach ($sectionSF->getEquipmentSections() as $equip) {
            $equipementsSections[] = $equip->getEquipment(); // Les equipements de la section
        }

        $img = [];
 
        foreach ($equipementsSections as $equipm) {
            $equipementsImages[] = $equipm->getImgObjects();
        }

        foreach ($equipementsImages as $imgObject) {     
            foreach ($imgObject as $image) {
                $img[] = ['path' => $image->getImg()->getPath()];
            }
        }

        foreach ($equipementsSections as $equipm) {
            $Equipements[] = [
                'id' => $equipm->getId(),
                'name' => $equipm->getName(),
                'text' => $equipm->getText(),

                'img' => $img
            ];
        }

        $object = [
            'id' => $sectionSF->getId(),
            'title' => $sectionSF->getTitle(),
            'text' => $sectionSF->getText(),
            'summary' => $sectionSF->getSummary(),

            'Equipments' => $Equipements
        ];

        $jsonContent = $serializer->serialize($object, 'json');
        return new JsonResponse([ 
            'section' => \json_decode($jsonContent)
        ]);

        dd($Equipements);
    }

    // modal showArticle
    #[Route('/dataCountry/{country}/{century}', name: 'show_article', methods: ['GET'])]
    public function dataCount(
        string $country,
        string $century,
        ArticleRepository $articleRepository,
        SerializerInterface $serializer,
        SectionRepository $sectionRepository
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

        $article = $articleRepository->findOneByCountryAndCentury($country, $century);

        // $jsonContent = $serializer->serialize($article, 'json');
        $sectionsSf = $sectionRepository->findByArticle($article->getId());

        $sections = [];

        foreach ($sectionsSf as $section) {
            $sections[] = [
                'id' => $section->getId(),
                'title' => $section->getTitle(),
                'text' => $section->getText(),
                'summary' => $section->getSummary()
            ];
        }
        // dd($article);
        if(!$article) {
            return new JsonResponse(false);
        }

        $object = [
            "title" => $article->getTitle(),
            "summary" => $article->getSummary(),
            "creation_date" => $article->getCreationDate(),

            "Country" => ["name" => $article->getCountry()->getName()],
            "Century" => ["year" => $article->getCentury()->getYear()],

            "sections" => $sections
        ];

        $jsonContent = $serializer->serialize($object, 'json');

        return new JsonResponse([ 
            // 'article' => \json_decode($jsonContent)
            'article' => $object
        ]);

        // return $this->json($article, 200, [], []);
    }


 
}
