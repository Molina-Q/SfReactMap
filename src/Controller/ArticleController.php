<?php

namespace App\Controller;

use DateTime;
use App\Entity\Article;
use App\Entity\Country;
use App\Repository\UserRepository;
use App\Repository\ArticleRepository;
use App\Repository\CenturyRepository;
use App\Repository\CountryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;

class ArticleController extends AbstractController
{
    #[Route('/article', name: 'app_article')]
    public function index(): Response
    {
        return $this->render('article/index.html.twig', [
            'controller_name' => 'ArticleController',
        ]);
    }

    #[Route('/api/article/country-century/data', name: 'app_article')]
    public function getCountryAndCentury(
        CountryRepository $countryRepository,
        CenturyRepository $centuryRepository
    ): Response {

        $countriesObject = $countryRepository->findAll();
        $centuriesObject = $centuryRepository->findAll();

        foreach ($countriesObject as $country) {
            $countries[] = [
                'id' => $country->getId(),
                'name' => $country->getName(),
            ];
        }

        $centuries = [];
        foreach ($centuriesObject as $century) {
            $centuries[] = [
                'id' => $century->getId(),
                'year' => $century->getYear(),
            ];
        }

        return $this->json([
            'countries' => $countries,
            'centuries' => $centuries,
        ]);
    }

    #[Route('/api/article/create', name: 'create_form_article', methods: ['POST'])]
    #[Route('/api/article/edit/{articleId}', name: 'edit_form_article', methods: ['POST'])]
    public function createArticle(
        int $articleId = null,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        EntityManagerInterface $entityManager,
        JWSProviderInterface $jwsProvider,
        UserRepository $userRepository,
        CountryRepository $countryRepository,
        CenturyRepository $centuryRepository,
        ArticleRepository $articleRepository,
    ): Response {

        $isEdit = false;
        $article = '';

        if(isset($articleId)) {
            $isEdit = true;
        }

        $requestData = json_decode($request->getContent(), true);

        $tokenGet = $request->cookies->get('BEARER');
        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $jws = $jwsProvider->load($token);
        $decodedToken = $jws->getPayload();
        $userId = $decodedToken['userId'];

        if (!$userId) {
            return $this->json([
                'error' => true,
                'message' => 'User not found',
            ], 400);
        }

        $user = $userRepository->find($userId);

        if (!$user) {
            return $this->json([
                'error' => true,
                'message' => 'User not found',
            ], 400);
        }

        if (isset($requestData)) {

            // Sanitize all elements in the array
            $title = filter_var($requestData['title'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $summary = filter_var($requestData['summary'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $countryId = filter_var($requestData['country'], FILTER_SANITIZE_NUMBER_INT);
            $centuryId = filter_var($requestData['century'], FILTER_SANITIZE_NUMBER_INT);
            $creationDate = new DateTime('now');

            try {
                // if isEdit is false the goal is to create a new entity
                // if true the goal is to edit the entity
                $isEdit ? 
                    $article = $articleRepository->findOneById($articleId) : 
                    $article = new Article()
                ;

                $article->setTitle($title);
                $article->setSummary($summary);
                $article->setCreationDate($creationDate);

                $country = $countryRepository->findOneById($countryId);
                $century = $centuryRepository->findOneById($centuryId);

                $article->setCountry($country);
                $article->setCentury($century);

                $article->setAuthor($user);

                $entityManager->persist($article);
                $entityManager->flush();

            } catch (NotEncodableValueException $e) {
                return $this->json([
                    'error' => true,
                    'message' => 'Invalid data',
                ], 400);
            }

            return $this->json([
                'error' => false,
                'message' => $isEdit ? 'Article edited successfully' : 'Article created successfully',
            ], 201);
        } else {

            return $this->json([
                'error' => true,
                'message' => 'Article not created/edited',
            ], 400);
        }
    }

    #[Route('/api/articles/data', name: 'data_article_section', methods: ['GET'])]
    public function getArticles(
        ArticleRepository $articleRepository,
    ): Response {

        $articlesObject = $articleRepository->findAll();

        if (!$articlesObject) {
            return $this->json([
                'error' => true,
                'message' => 'Article not found',
            ], 404);
        }

        $articles =[];

        foreach ($articlesObject as $article) {
            $articles[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'category' => $article->articleTag(),
            ];
        }
     

        return $this->json([
            'error' => false,
            'object' => $articles,
        ]);
    }
    
}
