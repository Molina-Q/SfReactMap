<?php

namespace App\Controller;

use App\Entity\EquipmentSection;
use App\Entity\Section;
use App\Form\SectionFormType;
use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;

class SectionController extends AbstractController
{
    #[Route('/api/section/create/{idArticle}', name: 'create_section')]
    public function index(
        int $idArticle,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWSProviderInterface $jwsProvider,
        EquipmentRepository $equipmentRepository,
    ): Response
    {
        $requestData = json_decode($request->getContent(), true);

        if(isset($requestData)) {
            $tokenGet = $request->cookies->get('BEARER');
            $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    
            $jws = $jwsProvider->load($token);
            $decodedToken = $jws->getPayload();
            $userId = $decodedToken['userId'];

            $title = filter_var($requestData['title'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $text = filter_var($requestData['text'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $summary = filter_var($requestData['summary'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $equipmentSections = $requestData['equipmentSections']; 

    
            $id = filter_var($idArticle, FILTER_SANITIZE_NUMBER_INT);
    
            $article = $articleRepository->findOneById($id);
    
            $section = new Section();
            $section->setTitle($title);
            $section->setText($text);
            $section->setSummary($summary);

            $section->setArticle($article);

            
            foreach($equipmentSections as $equipmentSection) {
                $equipment = $equipmentRepository->findOneById($equipmentSection['equip']);

                $equipmentSect = new EquipmentSection();
                $equipmentSect->setSection($section);
                $equipmentSect->setEquipment($equipment);

                $section->addEquipmentSection($equipmentSect);
            }

            $entityManager->persist($section);
            $entityManager->flush();

            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

            return $this->json([
                'error' => false,
                'message' => 'Section created',
            ], 201);
        }

        return $this->json([
            'error' => true,
            'message' => 'Section not created',
        ], 400);
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
