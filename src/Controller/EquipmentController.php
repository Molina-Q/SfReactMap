<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\Equipment;
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

class EquipmentController extends AbstractController
{
    #[Route('/equipment', name: 'app_equipment')]
    public function index(EquipmentRepository $equipmentRepository): Response
    {
        $equipments = $equipmentRepository->findAll();

        return $this->render('equipment/index.html.twig', [
            'equipments' => $equipments,
        ]);
    }

    #[Route('/equipment/create', name: 'create_equipment')]
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

        $form = $this->createForm(EquipmentFormType::class, $equipment, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');



            $entityManager->persist($equipment);
            $entityManager->flush();

            $uploadedFile = $form->get('path')->getData();

            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                // this is needed to safely include the file name as part of the URL
                // $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $originalFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();

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


            $entityManager->persist($img);
            $entityManager->flush();

            $imgObject->setEquipment($equipment);
            $imgObject->setImg($img);

            $entityManager->persist($imgObject);
            $entityManager->flush();


            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully created');
            return $this->redirectToRoute('app_equipment');
        }

        return $this->render('equipment/create.html.twig', [
            'createEquipForm' => $form->createView(),
        ]);
    }

    #[Route('/equipment/update/{id}', name: 'update_equipment')]
    public function update(
        EquipmentRepository $equipmentRepository,
        ImgRepository $imgRepository,
        ImgObjectRepository $imgObjectRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        Int $id
        ): Response
    {
        $equipment = $equipmentRepository->findOneById($id);
        $img = new Img();
        $imgObject = new ImgObject();

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(EquipmentFormType::class, $equipment, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            $entityManager->persist($equipment);
            $entityManager->flush();

            $uploadedFile = $form->get('path')->getData();

            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                // this is needed to safely include the file name as part of the URL
                // $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $originalFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();

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

    #[Route('/equipment/delete/{id}', name: 'delete_equipment')]
    public function delete(
        EquipmentRepository $equipmentRepository,
        EntityManagerInterface $entityManager,
        Int $id
        ): Response
    {
        $equipment = $equipmentRepository->findOneById($id);

        if(isset($equipment)) {
            $entityManager->remove($equipment);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_equipment');
    }


}
