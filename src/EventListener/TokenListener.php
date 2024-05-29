<?php 

namespace App\EventListener;

use App\Service\TokenService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class TokenListener
{
    private $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();

        // Make it so every route with a name that start with "public" will do an early return
        if (strpos($request->get('_route'), 'public') === 0) {
            return;
        }

        $userId = $this->tokenService->getUserIdFromToken();

        if (isset($userId['error'])) {
            $response = new JsonResponse($userId, 401);
            $event->setResponse($response);
        } else {
            $request->attributes->set('tokenUserId', $userId);
        }
    }
}