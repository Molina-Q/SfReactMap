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
    #[Route('/api/equipment/{id}', name: 'public_get_one_equipment', methods: ['GET'])]
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
            'sub_cat' => $equipObject->getSubCatLabel(),
            'sub_cat_id' => $equipObject->getSubCatId(),
        ];

        return new JsonResponse([
            'equipment' => $equipment
        ]);
    }

    // get every equipment from the specified category
    #[Route('/api/equipments/type/{id}', name: 'public_get_equipments', methods: ['GET'])]
    public function getEquip(
        EquipmentRepository $equipmentRepository,
        int $id
    ): Response {

        $catId = filter_var($id, FILTER_VALIDATE_INT, FILTER_SANITIZE_NUMBER_INT);

        $equipmentsObject = $equipmentRepository->findByCategory($catId);

        if(!isset($equipmentsObject)) {
            return new JsonResponse([
                'error' => true, 'message' => 'Something went wrong'
            ]);
        }


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
    }

    // update an equipment item
    #[Route('/equipment/update/{id}', name: 'update_equipment')]
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
    #[Route('/api/equipment/data/{categoryId}', name: 'public_show_light_equipment')]
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
