<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Section;
use App\Entity\Equipment;
use App\Form\SectionFormType;
use App\Entity\EquipmentSection;
use App\Repository\UserRepository;
use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\EquipmentSectionRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;

class SectionController extends AbstractController
{

    #[Route('/api/map/section/{idSection}', name: 'get_data_section')]
    public function getSection(
        int $idSection,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository,
    ): Response {

        $sectionObject = $sectionRepository->findOneById($idSection);

        $section = [
            'id' => $sectionObject->getId(),
            'title' => $sectionObject->getTitle(),
            'text' => $sectionObject->getText(),
            'summary' => $sectionObject->getSummary(),
        ];

        return $this->json([
            'object' => $section,
        ]);
    }

    #[Route('/api/section/{sectionId}', name: 'show_section_data', methods: ['GET'])]
    public function showSectionLight(
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
            ];
        }, $sectionObject->getEquipmentSections()->toArray());
    
        $object = [
            'id' => $sectionObject->getId(),
            'title' => $sectionObject->getTitle(),
            'text' => $sectionObject->getText(),
            'summary' => $sectionObject->getSummary(),
            'category' => $sectionObject->sectionCategoryId(),
            'Article' => ['id' => $sectionObject->getArticle()->getId(), 'title' => $sectionObject->getArticle()->getTitle()],
            'Equipments' => $equipmentsObjects
        ];
    
        return $this->json(['section' => $object], 201);
    }


    #[Route('/api/section/create/{idArticle}', name: 'create_section')]
    #[Route('/api/section/edit/{idSection}', name: 'edit_section')]
    public function index(
        int $idArticle = null,
        int $idSection = null,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository,
        EquipmentSectionRepository $equipmentSectionRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWSProviderInterface $jwsProvider,
        EquipmentRepository $equipmentRepository,
        UserRepository $userRepository,
    ): Response {
        $isEdit = false;
        $section = '';

        if ($idSection) {
            $isEdit = true;
        }

        // get the json data from the form
        $requestData = json_decode($request->getContent(), true);

        if (isset($requestData)) {

            // if the it is an edit the section is fetched then modified
            if ($isEdit) {
                $section = $sectionRepository->findOneById($idSection);
            } else {
                // else a new one is created
                $section = new Section();
            }

            $userId = $request->attributes->get('tokenUserId');
            $author = $userRepository->findOneById($userId);

            $title = filter_var($requestData['title'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $text = filter_var($requestData['text'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $summary = filter_var($requestData['summary'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $equipmentSections = $requestData['equipmentSections'];

            $id = filter_var($idArticle, FILTER_SANITIZE_NUMBER_INT);

            $section->setTitle($title);
            $section->setText($text);
            $section->setSummary($summary);
            $section->setAuthor($author);
            $section->setCreationDate(new \DateTime('now'));

            if (!$isEdit) {
                $section->setArticle($articleRepository->findOneById($id));
            }

            /**
             * Update the EquipmentSection based on the form data.
             *
             * This function compares two arrays: 
             * 1. The ids of the EquipmentSection from the form.
             * 2. The ids of the EquipmentSection from the database.
             * 
             * If the ids from the form are not in the database, they are added.
             * If the ids from the database are not in the form, they are removed.
             * If the ids are in both arrays, they are not touched.
             */

            // Get the existing EquipmentSections from the database
            $existingEquipmentSections = $section->getEquipmentSections()->toArray();

            // Get the ids of the existing EquipmentSections from the database
            $existingEquipmentSectionIds = array_map(function($equipmentSection) {
                return $equipmentSection->getId();
            }, $existingEquipmentSections);

            // Get the ids of the EquipmentSections from the form
            $formEquipmentSectionIds = array_map(function($equipmentSection) {
                return $equipmentSection['equip'];
            }, $equipmentSections);

            // Remove EquipmentSections not in the form
            foreach ($existingEquipmentSections as $existingEquipmentSection) {
                if (!in_array($existingEquipmentSection->getId(), $formEquipmentSectionIds)) {
                    $section->removeEquipmentSection($existingEquipmentSection);
                }
            }

            // Add EquipmentSections from the form that are not in the database
            foreach ($equipmentSections as $equipmentSection) {
                if (!in_array($equipmentSection['equip'], $existingEquipmentSectionIds)) {
                    $equipment = $equipmentRepository->findOneById($equipmentSection['equip']);

                    $equipmentSect = new EquipmentSection();
                    $equipmentSect->setSection($section);
                    $equipmentSect->setEquipment($equipment);

                    $section->addEquipmentSection($equipmentSect);
                }
            }

            $entityManager->persist($section);
            $entityManager->flush();
            $message = $isEdit ? 'Section edited successfully' : 'Section created successfully';

            return $this->json([
                'error' => false,
                'message' => $message,
            ], 201);
        }

        return $this->json([
            'error' => true,
            'message' => 'There was an error editing the section',
        ], 400);
    }

    #[Route('/api/section/delete/{sectionId}', name: 'delete_section', methods: ['DELETE'])]
    public function deleteSection(
        int $sectionId,
        SectionRepository $sectionRepository,
        EntityManagerInterface $entityManager,
    ): Response {
        $section = $sectionRepository->findOneById($sectionId);

        if (!$section) {
            return $this->json([
                'error' => true,
                'message' => 'The section does not exist',
            ], 404);
        }

        $entityManager->remove($section);
        $entityManager->flush();

        return $this->json([
            'error' => false,
            'message' => 'The section was deleted successfully',
        ], 204);
    }

    // #[Route('/section/edit/{idSection}', name: 'edit_section')]
    // public function edit(
    //     ArticleRepository $articleRepository,
    //     SectionRepository $sectionRepository,
    //     EntityManagerInterface $entityManager,
    //     Request $request,
    //     int $idSection,
    // ): Response
    // {
    //     $section = $sectionRepository->findOneById($idSection);

    //     $form = $this->createForm(SectionFormType::class, $section, ['attr' => ['class' => 'form-create']]);
    //     $form->handleRequest($request);

    //     if($form->isSubmitted() && $form->isValid()) {

    //         $entityManager->persist($section);
    //         $entityManager->flush();

    //         // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

    //         return $this->redirectToRoute('app_map');
    //     }

    //     return $this->render('map/createSection.html.twig', [
    //         'createSectionForm' => $form->createView(),
    //     ]);
    // }
}
