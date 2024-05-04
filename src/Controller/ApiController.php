<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use App\Repository\CategoryRepository;
use App\Repository\EquipmentRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiController extends AbstractController
{
    // get all equipment categories
    #[Route('/api/equipment/types', name: 'get_categories')]
    public function getCategories(
        CategoryRepository $categoryRepository,
    ): Response {
        $categoriesObject = $categoryRepository->findAll();
        $categories = [];

        foreach ($categoriesObject as $cat) {
            $categories[] = [
                'id' => $cat->getId(),
                'label' => $cat->getLabel()
            ];
        }

        return new JsonResponse([
            'categories' => $categories
        ]);
    }


    // get a single equipment item
    #[Route('/api/equipment/{id}', name: 'get_one_equipment')]
    public function getSingleEquip(
        EquipmentRepository $equipmentRepository,
        int $id
    ): Response {
        $equipObject = $equipmentRepository->findOneById($id);

        $equipment = [
            'id' => $equipObject->getId(),
            'name' => $equipObject->getName(),
            'text' => $equipObject->getText(),
            'img' => $equipObject->getOneImg(),
        ];

        return new JsonResponse([
            'equipment' => $equipment
        ]);

    }

    // get every equipment from the specified category
    #[Route('/api/equipment/type/{id}', name: 'get_equipment', methods:['GET'])]
    public function getEquip(
        EquipmentRepository $equipmentRepository,
        int $id
    ): Response {
        $equipmentsObject = $equipmentRepository->findByCategory($id);
        $equipments = [];

        foreach ($equipmentsObject as $equip) {
            $equipments[] = [
                'id' => $equip->getId(),
                'name' => $equip->getName(),
                'text' => $equip->getText(),
                'img' => $equip->getOneImg(),
            ];
        }
        // dd($equipmentsObject);
        return new JsonResponse([
            'equipments' => $equipments,
        ]);
           
        // return $this->json($equipmentsObject, 200, [],  ['equipments' => 'equipment.name']);
    }

    // modal showSection
    #[Route('/dataCountry/section/{id}', name: 'show_section', methods: ['GET'])]
    public function showSection(
        int $id,
        SectionRepository $sectionRepository,
    ): Response {
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
    ): Response {
        $article = $articleRepository->findOneByCountryAndCentury($country, $century);

        if (!$article) {
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
            "id" => $article->getId(),
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
