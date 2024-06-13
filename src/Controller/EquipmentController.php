<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\ImgObject;
use App\Form\EquipmentFormType;
use App\Repository\ImgRepository;
use App\Repository\EquipmentRepository;
use App\Repository\ImgObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class EquipmentController extends AbstractController
{

    // get a single equipment item
    #[Route('/api/equipment/{id}', name: 'get_one_equipment', methods: ['GET'])]
    public function getSingleEquip(
        EquipmentRepository $equipmentRepository,
        int $id
    ): Response {
        $equipId = filter_var($id, FILTER_VALIDATE_INT, FILTER_SANITIZE_NUMBER_INT);

        $equipObject = $equipmentRepository->findOneById($equipId);

        $equipment = [
            'id' => $equipObject->getId(),
            'name' => $equipObject->getName(),
            'text' => $equipObject->getText(),
            'img' => $equipObject->getOneImg(),
            'sub_cat' => $equipObject->getSubCatLabel(),
            'sub_cat_id' => $equipObject->getSubCatId(),
        ];

        return $this->json([
            'error' => false,
            'equipment' => $equipment
        ], 200);
    }

    // get every equipment from the specified category
    #[Route('/api/equipments/type/{id}', name: 'get_equipments', methods: ['GET'])]
    public function getEquip(
        EquipmentRepository $equipmentRepository,
        int $id
    ): Response {
        // filter the the given category id
        $catId = filter_var($id, FILTER_VALIDATE_INT, FILTER_SANITIZE_NUMBER_INT);
        
        // get all the equipments from the given category
        $equipments = $equipmentRepository->findByCategory($id);

        // if equipments is empty, early return
        if(!isset($equipmentsObject)) {
            return  $this->json([
                'error' => true, 'message' => 'Something went wrong'
            ], 500);
        }
 
        // return of the equipments data
        return $this->json([
            'error' => false,
            'equipments' => $equipments,
        ], 200);
    }

    // update an equipment item
    #[Route('/equipment/update/{id}', name: 'private_update_equipment')]
    public function update(
        EquipmentRepository $equipmentRepository,
        ImgRepository $imgRepository,
        ImgObjectRepository $imgObjectRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        Int $id
    ): Response {
        $equipment = $equipmentRepository->findOneById($id);
        $img = new Img();
        $imgObject = new ImgObject();

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(EquipmentFormType::class, $equipment, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            $entityManager->persist($equipment);
            $entityManager->flush();

            $uploadedFile = $form->get('path')->getData();

            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                // this is needed to safely include the file name as part of the URL
                // $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $originalFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

                // Move the file to the directory where brochures are stored
                try {
                    $uploadedFile->move(
                        'img/upload',
                        $newFilename
                    );
                } catch (FileException $e) {
                    dd($e);
                }

                $img->setPath($newFilename);
            }

            return $this->redirectToRoute('app_equipment');
        }

        return $this->render('equipment/create.html.twig', [
            'createEquipForm' => $form->createView(),
        ]);
    }

    // get the name and id only of an equipment item
    #[Route('/api/equipment/data/{categoryId}', name: 'show_light_equipment')]
    public function getDataEquipment(
        EquipmentRepository $equipmentRepository,
        int $categoryId,
    ): Response {

        $equipmentsObject = $equipmentRepository->findByCategory($categoryId);

        foreach ($equipmentsObject as $equipment) {
            $equipments[] = [
                'id' => $equipment->getId(),
                'name' => $equipment->getName(),
            ];
        }

        if (!isset($equipments)) {
            return $this->json([
                'error' => true,
            ]);
        }

        return $this->json([
            'error' => false, 'object' => $equipments,
        ]);
    }

    // delete an equipment item
    #[Route('/equipment/delete/{id}', name: 'delete_equipment')]
    public function delete(
        EquipmentRepository $equipmentRepository,
        EntityManagerInterface $entityManager,
        Int $id
    ): Response {
        $equipment = $equipmentRepository->findOneById($id);

        if (isset($equipment)) {
            $entityManager->remove($equipment);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_equipment');
    }
}
