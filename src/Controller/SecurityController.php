<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;



class SecurityController extends AbstractController
{
    private TokenStorageInterface $tokenStorageInterface;
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager)
    {
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->jwtManager = $jwtManager;
    }


    #[Route(path: '/api/logout', name: 'app_logout')]
    public function logout(): Response
    {
        // the sent data
        $data = ['message' => 'Logged out successfully',];

        // Create a JsonResponse object the data
        $response = new JsonResponse($data);

        // Clear the BEARER cookie (the JWT authenticate token)
        $response->headers->clearCookie('BEARER', '/', true, true, 'strict');

        // Return the new header response that delete the cookie and the json data at the same time
        return $response;
    }

    #[Route("/api/user/getuser", name: 'get_user')]
    public function getConnectedUser(): JsonResponse
    {

        if ($this->getUser()) {
            $userObj = $this->getUser();
            $user = [
                'username' => $userObj->getUsername(),
                'email' => $userObj->getEmail(),
                'roles' => $userObj->getRoles(),
            ];

            return $this->json(['error' => false, 'username' => $user]);
        }

        return $this->json(
            [
                'error' => true,
                'message' => 'No user session found',
            ]
        );
    }
}
