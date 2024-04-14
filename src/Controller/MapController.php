<?php

namespace App\Controller;

use App\Entity\Article;
use App\Form\ArticleFormType;
use App\Repository\ArticleRepository;
use App\Repository\CenturyRepository;
use App\Repository\CountryRepository;
use App\Repository\SectionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class MapController extends AbstractController
{
    // the index 
    #[Route('/map', name: 'app_map')]
    public function index(): Response
    {
        return $this->render('map/index.html.twig', [
        ]);
    }

    #[Route('/map/create/article/{countryStr}/{centuryStr}', name: 'create_article')]
    public function createArticle(
        Request $request,
        CountryRepository $countryRepository,
        CenturyRepository $centuryRepository,
        EntityManagerInterface $entityManager,
        string $countryStr,
        string $centuryStr
    ):Response
    {
        $country = $countryRepository->findOneByName($countryStr);
        $century = $centuryRepository->findOneByYear($centuryStr);
        $article = new Article();
        $article->setCountry($country);
        $article->setCentury($century);

        $user = $this->getUser(); // get the user currently logged in

        $form = $this->createForm(ArticleFormType::class, $article, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $dateNow = new \DateTime('now');

            $article->setCreationDate($dateNow);
            $article->setAuthor($user);

            $entityManager->persist($article);
            $entityManager->flush();

            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

            return $this->redirectToRoute('app_map');
        }

        return $this->render('map/createArticle.html.twig', [
            'createArticleForm' => $form->createView(),
        ]);
    }

    #[Route('/map/edit/article/{id}', name: 'edit_article')]
    public function editArticle(
        Request $request,
        ArticleRepository $articleRepository,
        EntityManagerInterface $entityManager,
        int $id
    ):Response
    {
 
        $article = $articleRepository->findOneById($id);

        $form = $this->createForm(ArticleFormType::class, $article, ['attr' => ['class' => 'form-create']]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($article);
            $entityManager->flush();

            // $this->addFlash('success', 'The Topic '.$topic->getTitle().' was successfully updated');

            return $this->redirectToRoute('app_map');
        }

        return $this->render('map/createArticle.html.twig', [
            'createArticleForm' => $form->createView(),
        ]);
    }

    #[Route('/map/delete/article/{id}', name: 'delete_article')]
    public function deleteArticle(
        Request $request,
        ArticleRepository $articleRepository,
        EntityManagerInterface $entityManager,
        int $id
    ):Response
    {
 
        $article = $articleRepository->findOneById($id);

        $entityManager->remove($article);
        $entityManager->flush();
        
        return $this->redirectToRoute('app_map');
    }
}
