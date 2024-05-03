<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class SecurityController extends AbstractController
{
    private CsrfTokenManagerInterface $csrfTokenManager;

    public function __construct(CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->csrfTokenManager = $csrfTokenManager;
    }

    #[Route(path: '/login', name: 'app_login')]
    public function loginPage(): Response
    {    
        return $this->render('security/index.html.twig');
    }

    #[Route(path: '/api/login', name: 'app_login_post', methods: ['POST'])]
    public function loginPost(Request $request, UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository, CsrfTokenManagerInterface $csrfTokenManager, AuthenticationUtils $authenticationUtils): Response
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];
        $csrfToken = $data['_csrf_token'];

        // Validate CSRF token
        if (!$csrfTokenManager->isTokenValid(new CsrfToken('authenticate', $csrfToken))) {
            return new JsonResponse(['error' => 'Invalid CSRF token.'], Response::HTTP_FORBIDDEN);
        }
    
        // Load the user
        $user = $userRepository->findOneBy(['email' => $email]);
    
        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            // Invalid email or password
            return new JsonResponse(['error' => 'Invalid email or password.'], Response::HTTP_UNAUTHORIZED);
        }
    
    
        return new JsonResponse(['status' => 'ok'], Response::HTTP_OK);
    }

    #[Route(path: '/api/login/show', name: 'app__get_login', methods: ['GET'])]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $token = $this->csrfTokenManager->getToken('authenticate')->getValue();
        
        return new JsonResponse(['_csrf_token' => $token]);
    }


   

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
