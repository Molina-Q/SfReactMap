<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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

    ): Response
    {
        $users = $userRepository->findAll();
        $userArray = [];
        foreach ($users as $user) {
            $userArray[] = [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "roles" => $user->getRoles(),
                "password" => $user->getPassword(),
                "username" => $user->getUsername(),
                "comments" => array_map(function($comment) { return $comment->getId(); }, $user->getComments()->toArray()),
                "messages" => array_map(function($message) { return $message->getId(); }, $user->getMessages()->toArray()),
                "topics" => array_map(function($topic) { return $topic->getId(); }, $user->getTopics()->toArray()),
                "articles" => array_map(function($article) { return $article->getId(); }, $user->getArticles()->toArray()),
                "articleEditeds" => array_map(function($articleEdited) { return $articleEdited->getId(); }, $user->getArticleEditeds()->toArray()),
                "articleLikes" => array_map(function($articleLike) { return $articleLike->getId(); }, $user->getArticleLikes()->toArray()),
                "isVerified" => $user->isVerified()
            ];
        }

        return $this->json($userArray, 200);
    }
}
