<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Bundle\SecurityBundle\Security;


class SecurityController extends AbstractController
{
    private TokenStorageInterface $tokenStorageInterface;
    private JWTTokenManagerInterface $jwtManager;
    private JWSProviderInterface $jwsProvider;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager, JWSProviderInterface $jwsProvider)
    {
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->jwtManager = $jwtManager;
        $this->jwsProvider = $jwsProvider;
    }


    #[Route(path: '/api/logout', name: 'app_logout')]
    public function logout(): Response
    {
        // the sent data
        $data = ['message' => 'Logged out successfully',];

        // $response = $security->logout();
        // Create a JsonResponse object the data
        $response = new JsonResponse($data);

        // Clear the BEARER cookie (the JWT authenticate token)
        $response->headers->clearCookie('BEARER', '/', null, true, true, 'strict');
        $response->headers->clearCookie('refresh_token', '/', null, true, true, 'strict');

        // Return the new header response that delete the cookie and the json data at the same time
        return $response;
    }

    #[Route("/api/user", name: 'show_connected_user')]
    public function getConnectedUser(): JsonResponse
    {
        // get the token from the client
        $token = $_COOKIE['BEARER'];
        try {
            // Load the token as a token Object
            $jws = $this->jwsProvider->load($token);
            // Decode the token to get the content
            $decodedToken = $jws->getPayload();
            if ($decodedToken) {
                return $this->json(['error' => false, 'message' => $decodedToken]);
            } else {
                return $this->json(['error' => true, 'message' => 'No cookie found']);
            }
        } catch (JWTDecodeFailureException $e) {
            return $this->json(['error' => true, 'message' => 'Invalid token']);
        }
    }
}
