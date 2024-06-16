<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\Equipment;
use App\Entity\ImgObject;
use App\Repository\ImgRepository;
use App\Repository\UserRepository;
use App\Repository\TopicRepository;
use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use App\Repository\CategoryRepository;
use App\Repository\EquipmentRepository;
use App\Repository\ImgObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\SubCategoryRepository;
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
    #[Route('/api/forum/popularposts', name: 'get_posts', methods: ['GET'])]
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

    #[Route('/api/forum/getSubCat', name: 'get_SubCat')]
    public function getSubCat(
        SubCategoryRepository $subCategoryRepository,
    ): Response {
        $subCatObject = $subCategoryRepository->findBy([], ['label' => 'ASC']);
        $subCategories = [];

        foreach ($subCatObject as $subCat) {
            $subCategories[] = [
                'id' => $subCat->getId(),
                'label' => $subCat->subAndCat(),
            ];
        }

        return new JsonResponse([
            'subCategories' => $subCategories
        ]);
    }

    #[Route('/api/equipment/create', name: 'create_equipment', methods: ['POST'])]
    #[Route('/api/equipment/edit/{equipmentId}', name: 'edit_equipment', methods: ['POST'])]
    public function create(
        int $equipmentId = null,
        UserRepository $userRepository,
        SubCategoryRepository $subCategoryRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        EquipmentRepository $equipmentRepository
    ): Response {

        $isEdit = false;
        if (isset($equipmentId)) {
            $isEdit = true;
        }

        $equipment = isset($equipmentId) ? $equipmentRepository->findOneById($equipmentId) : new Equipment();
        $imgObject = isset($equipmentId) ? $equipment->getFirstImg() : new ImgObject();
        $img = isset($equipmentId) ? $imgObject->getImg() : new Img();

        // $user = $userRepository->findOneById('1'); // get the user currently logged in

        // Get form data from the request
        $data = $request->request->all();
        // dd($data);  
        if ($data) {
            $dateNow = new \DateTime('now');

            if(!$isEdit) {
                $subCategory = $subCategoryRepository->findOneById($data['sub_category']);
                $equipment->setSubCategory($subCategory);
            }
   
            $equipment->setName($data['name']);
            $equipment->setText($data['text']);

            $entityManager->persist($equipment);
            $entityManager->flush();

            // Handle file upload
            $uploadedFile = $request->files->get('image');

            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $newFilename = $originalFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

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

            return new JsonResponse(['message' => 'Equipment created!'], Response::HTTP_CREATED);
        }

        return new JsonResponse(['message' => 'Error: Invalid data'], Response::HTTP_BAD_REQUEST);
    }

    #[Route('/api/equipment/delete/{equipmentId}', name: 'delete_equipment_route', methods: ['DELETE'])]
    public function deleteEquip(
        int $equipmentId,
        EntityManagerInterface $entityManager,
        EquipmentRepository $equipmentRepository
    ): Response {
        $equipment = $equipmentRepository->findOneById($equipmentId);

        if ($equipment) {
            $entityManager->remove($equipment);
            $entityManager->flush();

            return $this->json(['message' => 'Equipment deleted!'], Response::HTTP_OK);
        }

        return $this->json(['message' => 'Equipment not found!'], Response::HTTP_NOT_FOUND);
    }

    #[Route('/api/upload', name: 'upload_file', methods: ['POST'])]
    public function fileUpload(): Response
    {
        $uploadedFile = $_FILES['file'];
        $filename = $uploadedFile['name'];
        $destination = 'img/upload/' . $filename;
        move_uploaded_file($uploadedFile['tmp_name'], $destination);
        return new JsonResponse(['status' => 'File uploaded!']);
    }

    // public function getEquip(
    //     EquipmentRepository $equipmentRepository,
    //     int $id
    // ): Response {
    //     $equipmentsObject = $equipmentRepository->findByCategory($id);

    //     return $this->json([
    //         'equipments' => $equipmentsObject,
    //     ], 200, [], ['groups' => 'equipment']);
    // }

    // The section Modal from the map

    #[Route('/api/article/map/section/{sectionId}', name: 'public_show_section', methods: ['GET'])]
    public function showSection(
        int $sectionId,
        SectionRepository $sectionRepository,
    ): Response {
        // The Section
        $sectionObject = $sectionRepository->findOneById($sectionId);

        // The equipment collection of the Section 
        if (!$sectionObject) {
            return $this->json(['message' => 'The section does not exist']);
        }
    
        $equipmentsObjects = array_map(function($equipmentSection) {
            $equipment = $equipmentSection->getEquipment();
            return [
                'id' => $equipment->getId(),
                'name' => $equipment->getName(),
                'text' => $equipment->getText(),
                'img' => $equipment->getOneImg()
            ];
        }, $sectionObject->getEquipmentSections()->toArray());
    
        $object = [
            'id' => $sectionObject->getId(),
            'title' => $sectionObject->getTitle(),
            'text' => $sectionObject->getText(),
            'summary' => $sectionObject->getSummary(),
            'Article' => $sectionObject->getArticle()->getId(),
            'Equipments' => $equipmentsObjects
        ];
    
        return $this->json(['section' => $object], 201);
    }

    // modal showArticle
    #[Route('/api/article/map/{country}/{century}', name: 'map_show_article', methods: ['GET'])]
    #[Route('/api/article/{articleId}', name: 'show_edit_article', methods: ['GET'])]
    public function dataCount(
        string $country = null,
        string $century = null,
        int $articleId = null,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository
    ): Response {
        $article = '';

        if (isset($articleId)) {

            $article = $articleRepository->findOneById($articleId);

        } else if (isset($country) && isset($century)) {

            $article = $articleRepository->findOneByCountryAndCentury($country, $century);

        } else {

            return $this->json([
                'error' => true, 'message' => 'There was a mistake in the URL. Please try again.'
            ], 500);
        }

        if (!$article) {

            return $this->json([
                'error' => true, 'message' => 'There is no article for this country at this period.'
            ], 204);
        }

        $sectionsObject = $sectionRepository->findByArticle($article->getId());

        $sections = array_map(function ($section) {
            return [
                'id' => $section->getId(),
                'title' => $section->getTitle(),
                'text' => $section->getText(),
                'summary' => $section->getSummary()
            ];
        }, $sectionsObject);

        $object = [
            "id" => $article->getId(),
            "title" => $article->getTitle(),
            "summary" => $article->getSummary(),
            "creation_date" => $article->getCreationDate(),
            "Country" => ["id" => $article->getCountry()->getId(), "name" => $article->getCountry()->getName()],
            "Century" => ["id" => $article->getCentury()->getId(), "year" => $article->getCentury()->getYear()],
            "sections" => $sections
        ];

        return $this->json([
            'error' => false,
            'article' => $object
        ]);
    }

    #[Route('/api/articles/equipments/data', name: 'data_create_topic', methods: ['GET'])]
    public function dataCreateTopic(
        EquipmentRepository $equipmentRepository,
        ArticleRepository $articleRepository,
    ): Response {
        $equipmentsObject = $equipmentRepository->findAll();
        $equipments = [];

        $articlesObject = $articleRepository->findAll();
        $articles = [];

        foreach ($equipmentsObject as $equip) {
            $equipments[] = [
                'id' => $equip->getId(),
                'label' => $equip->equipTag(),
            ];
        }

        foreach ($articlesObject as $article) {
            $articles[] = [
                'id' => $article->getId(),
                'label' => $article->articleTag(),
            ];
        }

        return $this->json([
            'equipments' => $equipments,
            'articles' => $articles,
            'message' => 'Data retrieved successfully!'
        ], 200);
    }
}
