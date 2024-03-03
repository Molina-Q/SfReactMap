<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        // The Section
        $sectionSF = $sectionRepository->findOneById($id);

        // The equipment collection of the Section 
        $equipementsSection = [];
        foreach ($sectionSF->getEquipmentSections() as $equip) {
            $equipementsSection[] = $equip->getEquipment();
        }

        // all individual Equipment entity and their attribut
        $equipementsObjects = [];
        foreach ($equipementsSection as $equip) {
            $equipementsObjects[] = [
                'id' => $equip->getId(),
                'name' => $equip->getName(),
                'text' => $equip->getText(),
                'img' => $equip->getOneImg()
            ];
        }

        // the final object that's going to be fetched by React
        $object = [
            'id' => $sectionSF->getId(),
            'title' => $sectionSF->getTitle(),
            'text' => $sectionSF->getText(),
            'summary' => $sectionSF->getSummary(),
            'Equipments' => $equipementsObjects
        ];

        return new JsonResponse([ 
            'section' => $object
        ]);
    }

    // modal showArticle
    #[Route('/dataCountry/{country}/{century}', name: 'show_article', methods: ['GET'])]
    public function dataCount(
        string $country,
        string $century,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository
    ): Response
    {
        $article = $articleRepository->findOneByCountryAndCentury($country, $century);   
        
        if(!$article) {
            return new JsonResponse(false);
        }

        $sectionsObject = $sectionRepository->findByArticle($article->getId());

        $sections = [];

        // object witht the structure of Section
        foreach ($sectionsObject as $section) {
            $sections[] = [
                'id' => $section->getId(),
                'title' => $section->getTitle(),
                'text' => $section->getText(),
                'summary' => $section->getSummary()
            ];
        }

        // object witht the structure of Article
        $object = [
            "title" => $article->getTitle(),
            "summary" => $article->getSummary(),
            "creation_date" => $article->getCreationDate(),

            "Country" => ["name" => $article->getCountry()->getName()],
            "Century" => ["year" => $article->getCentury()->getYear()],

            "sections" => $sections
        ];

        return new JsonResponse([ 
            'article' => $object
        ]);
    }
}
