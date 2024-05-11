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
    public function logout(Request $request, EventDispatcherInterface $eventDispatcher, TokenStorageInterface $tokenStorage): Response
    {
        // the sent data
        $data = ['message' => 'Logged out successfully',];

        // Create a JsonResponse object the data
        $response = new JsonResponse($data);

        // Clear the BEARER cookie (the JWT authenticate token)
        $response->headers->clearCookie('BEARER', '/', null, true, true, 'strict');

        // Return the new header response that delete the cookie and the json data at the same time
        return $response;
        // try { 
        //    $eventDispatcher->dispatch(new LogoutEvent($request, $tokenStorage->getToken()));

        // $response = new Response();
        // $response->headers->clearCookie('BEARER', '/', null, true, true, 'strict');
        // //    $request->cookies->get('BEARER');
        // return $this->render('base.html.twig', [], $response);
        //    return $this->json('base.html.twig',[], $response);
        //    return new JsonResponse($response);

        // } catch (\Throwable $th) {
        //     return new JsonResponse($th);
        // } 

        // dd($request->cookies->get('BEARER'));

        // try {   
        // $response = new Response();
        // $response->headers->clearCookie('BEARER', '/', null, true, true, 'strict');
        // dd($response);
        // return $this->json( 'User has been logged out!', 200, ['response' => $response]);
        // return new JsonResponse('User has been logged out!', 200, ['response' => $response]);

        // } catch (\Throwable $th) {
        //     // dd($th);
        //     return $this->json('error', 500);
        // }

        // $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        // dd($decodedJwtToken);

        // // res.clearCookie("access_token");
        // // res.status(200).json("User has been logged out!");

        // return $this->json(['message' => 'User has been logged out!'], 200);


        // throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    // #[Route(path: '/api/login/show', name: 'app_get_login', methods: ['GET'])]
    // public function login(): Response
    // {

    //     return new JsonResponse(['_csrf_token' => $token]);
    // }

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
