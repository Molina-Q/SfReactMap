<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\Equipment;
use App\Entity\ImgObject;
use App\Repository\ImgRepository;
use App\Repository\TopicRepository;
use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use App\Repository\CategoryRepository;
use App\Repository\EquipmentRepository;
use App\Repository\ImgObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

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

    // get the 5 most popular posts
    #[Route('/api/forum/popularposts', name: 'get_posts')]
    public function getPosts(
        TopicRepository $topicRepository,
    ): Response {
        $topicsObject = $topicRepository->findBy([], ['title' => 'ASC'], 5);
        $topics = [];

        foreach ($topicsObject as $topic) {
            $topics[] = [
                'id' => $topic->getId(),
                'title' => $topic->getTitle(),
                'date' => $topic->getCreationDate(),
                'user' => $topic->getAuthor()->getUsername()
            ];
        }

        return new JsonResponse([
            'topics' => $topics
        ]);
    }

    // create an Equipment
    #[Route('/api/equipment/create-entity', name: 'create_equipment', methods:['POST'])]
    public function create(
        EquipmentRepository $equipmentRepository,
        ImgRepository $imgRepository,
        ImgObjectRepository $imgObjectRepository,
        Request $request,
        EntityManagerInterface $entityManager
        ): Response
    {
        $equipment = new Equipment();
        $img = new Img();
        $imgObject = new ImgObject();
    
        $user = $this->getUser(); // get the user currently logged in
    
        // Get form data from the request
        $data = $request->request->all();
    
        if ($data) {
            $dateNow = new \DateTime('now');
    
            $equipment->setName($data['name']);
            $equipment->setText($data['text']);
            $equipment->setSubCategory($data['sub_category']);
    
            $entityManager->persist($equipment);
            $entityManager->flush();
    
            // Handle file upload
            $uploadedFile = $request->files->get('image');
    
            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $newFilename = $originalFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();
    
                // Move the file to the directory where brochures are stored
                try {
                    $uploadedFile->move(
                        'img/upload',
                        $newFilename
                    );
                } catch (FileException $e) {
                    // Handle exception
                }
    
                $img->setPath($newFilename);
            }
    
            $entityManager->persist($img);
            $entityManager->flush();
    
            $imgObject->setEquipment($equipment);
            $imgObject->setImg($img);
    
            $entityManager->persist($imgObject);
            $entityManager->flush();
    
            return new JsonResponse(['status' => 'Equipment created!'], Response::HTTP_CREATED);
        }
    
        return new JsonResponse(['status' => 'Error: Invalid data'], Response::HTTP_BAD_REQUEST);
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

    // The section Modal from the map
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
