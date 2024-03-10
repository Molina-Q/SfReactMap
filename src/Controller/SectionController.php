<?php

namespace App\Controller;

use App\Entity\Section;
use App\Form\SectionFormType;
use App\Repository\ArticleRepository;
use App\Repository\SectionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SectionController extends AbstractController
{
    #[Route('/section/create/{id}', name: 'create_section')]
    public function index(
        int $id,
        ArticleRepository $articleRepository,
        SectionRepository $sectionRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): Response
    {
        $article = $articleRepository->findOneById($id);

        $section = new Section();
        $section->setArticle($article);

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(SectionFormType::class, $section, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($section);
            $entityManager->flush();

            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

            return $this->redirectToRoute('app_map');
        }

        return $this->render('map/createSection.html.twig', [
            'createSectionForm' => $form->createView(),
        ]);
    }

    #[Route('/section/edit/{id}', name: 'edit_section')]
    public function edit(): Response
    {
        return $this->render('section/index.html.twig', [
            'controller_name' => 'SectionController',
        ]);
    }

    #[Route('/section/delete/{id}', name: 'delete_section')]
    public function delete(): Response
    {
        return $this->render('section/index.html.twig', [
            'controller_name' => 'SectionController',
        ]);
    }
}
