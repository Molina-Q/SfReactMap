<?php

namespace App\Controller;

use App\Entity\Equipment;
use App\Form\EquipmentFormType;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
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
        Request $request,
        EntityManagerInterface $entityManager
        ): Response
    {
        $equipment = new Equipment();

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(EquipmentFormType::class, $equipment, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            $entityManager->persist($equipment);
            $entityManager->flush();

            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully created');
            return $this->redirectToRoute('app_equipment');
        }

        return $this->render('equipment/create.html.twig', [
            'createEquipForm' => $form->createView(),
        ]);
    }
}
