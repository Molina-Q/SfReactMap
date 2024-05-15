<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;



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

        // Create a JsonResponse object the data
        $response = new JsonResponse($data);

        // Clear the BEARER cookie (the JWT authenticate token)
        $response->headers->clearCookie('BEARER', '/', null, true, true, 'strict');

        // Return the new header response that delete the cookie and the json data at the same time
        return $response;
    }

    #[Route(path: '/api/login', name: 'app_login_check')]
    public function signin(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        UserRepository $userRepository,
        JWTTokenManagerInterface $JWTManager,
    ) {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];

        $user = $userRepository->findByEmail($email);

        if (!$user) {
            throw new AuthenticationException('User not found!');
        }

        $isValid = $passwordHasher->isPasswordValid($user, $password);

        if (!$isValid) {
            throw new AuthenticationException('Wrong credentials!');
        }

        $token = $JWTManager->create($user);
        return new JsonResponse(['token' => $JWTManager->create($user)]);
        $response = new JsonResponse();
        // $response->headers->set('Authorization', "Bearer $token");
        $response->headers->setCookie(
            new Cookie(
                'BEARER',
                $token,
                new \DateTime('+1 day'),
                '/',
                null,
                true,
                true,
                false,
                'strict'
            )
        );
        $response->setData([
            'username' => $user->getUsername(),
            'id' => $user->getId(),
            // add more user data here
        ]);

        return $response;
    }

    #[Route("/api/user/getuser", name: 'get_user')]
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
