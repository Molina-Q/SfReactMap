<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Optional;
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;

class UserController extends AbstractController
{
    #[Route('/profile/user', name: 'app_user')]
    public function index(): Response
    {

        return $this->render('user/index.html.twig', [
            'user' => $this->getUser(),
        ]);
    }

    #[Route('/api/getUsers', name: 'get_users', methods: ['GET'])]
    public function getUsers(
        UserRepository $userRepository

    ): Response {
        $users = $userRepository->findAll();
        $userArray = [];
        foreach ($users as $user) {
            $userArray[] = [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "roles" => $user->getRoles(),
                "password" => $user->getPassword(),
                "username" => $user->getUsername(),
                "comments" => array_map(function ($comment) {
                    return $comment->getId();
                }, $user->getComments()->toArray()),
                "messages" => array_map(function ($message) {
                    return $message->getId();
                }, $user->getMessages()->toArray()),
                "topics" => array_map(function ($topic) {
                    return $topic->getId();
                }, $user->getTopics()->toArray()),
                "articles" => array_map(function ($article) {
                    return $article->getId();
                }, $user->getArticles()->toArray()),
                "articleEditeds" => array_map(function ($articleEdited) {
                    return $articleEdited->getId();
                }, $user->getArticleEditeds()->toArray()),
                "articleLikes" => array_map(function ($articleLike) {
                    return $articleLike->getId();
                }, $user->getArticleLikes()->toArray()),
                "isVerified" => $user->isVerified()
            ];
        }

        return $this->json($userArray, 200);
    }

    #[Route('/api/user/edit/self', name: 'edit_user', methods: ['PUT'])]
    public function editUser(
        Request $request,
        UserRepository $userRepository,
        JWSProviderInterface $jwsProvider,
        ValidatorInterface $validator,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response {
        $tokenGet = $request->cookies->get('BEARER');
        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $jws = $jwsProvider->load($token);
        $decodedToken = $jws->getPayload();

        $data = json_decode($request->getContent(), true);
        $constraints = '';

        if ($data['password']) {
            $constraints = new Collection([
                'username' => [
                    new Length(['min' => 4, 'max' => 50]),
                ],
                'email' => [
                    new NotBlank(),
                    new Email()
                ],
                'password' => [
                    new Optional(),
                    new Length(['min' => 5]),
                    new Regex([
                        'pattern' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/',
                        'message' => 'Password must be at least 5 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
                    ]),
                ],
            ]);
        } else {
            $constraints = new Collection([
                'username' => [
                    new Length(['min' => 4, 'max' => 50]),
                ],
                'email' => [
                    new NotBlank(),
                    new Email()
                ],
                'password' => [
                    new Optional(),
                ],
            ]);
        }


        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }

            return $this->json(['message' => $errors], 400);
        }

        $userId = $decodedToken['userId'];

        $user = $userRepository->findOneById($userId);

        if (!$user) {
            return $this->json(["message" => "User not found"], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (isset($data['password'])) {
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $data['password']
                )
            );
        
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(["message" => "User updated"], 200);
    }

    #[Route('/api/user/self', name: 'get_user', methods: ['GET'])]
    public function getOneUser(
        Request $request,
        UserRepository $userRepository,
        JWSProviderInterface $jwsProvider,
    ): Response {
        $tokenGet = $request->cookies->get('BEARER');
        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $jws = $jwsProvider->load($token);
        $decodedToken = $jws->getPayload();

        $userId = $decodedToken['userId'];

        $user = $userRepository->findOneById($userId);

        if (!$user) {
            return $this->json(["message" => "User not found"], 404);
        }

        $userArray = [
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "username" => $user->getUsername(),

            "roles" => $user->getRoles(),
            "comments" => array_map(function ($comment) {
                return $comment->getId();
            }, $user->getComments()->toArray()),
            "messages" => array_map(function ($message) {
                return $message->getId();
            }, $user->getMessages()->toArray()),
            "topics" => array_map(function ($topic) {
                return $topic->getId();
            }, $user->getTopics()->toArray()),
            "articles" => array_map(function ($article) {
                return $article->getId();
            }, $user->getArticles()->toArray()),
            "articleEditeds" => array_map(function ($articleEdited) {
                return $articleEdited->getId();
            }, $user->getArticleEditeds()->toArray()),
            "articleLikes" => array_map(function ($articleLike) {
                return $articleLike->getId();
            }, $user->getArticleLikes()->toArray()),
            "isVerified" => $user->isVerified()
        ];

        return $this->json($userArray, 200);
    }
}
