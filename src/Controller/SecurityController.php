<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class SecurityController extends AbstractController
{
    private CsrfTokenManagerInterface $csrfTokenManager;

    public function __construct(CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->csrfTokenManager = $csrfTokenManager;
    }

    #[Route(path: '/api/logout', name: 'app_logout')]
    public function logout(LogoutEvent $event): void
    {
        $response = $event->getResponse();
        $response->headers->clearCookie('BEARER');
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/api/login/show', name: 'app_get_login', methods: ['GET'])]
    public function login(): Response
    {

        $token = $this->csrfTokenManager->getToken('authenticate')->getValue();

        return new JsonResponse(['_csrf_token' => $token]);
    }

    #[Route("/api/user/getuser", name: 'get_user')]
    public function getConnectedUser(): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            return $this->json([
                'user' => $user,
            ]);
        }

        return $this->json([
            'error' => true, 'message' => 'No user session found',
        ], 404);
    }
}
