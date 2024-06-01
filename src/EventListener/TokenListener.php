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

        // Early return when route name start with public
        if (strpos($request->get('_route'), 'public') === 0) {
            return;
        }

        // Early return when route's name do not start with /api
        if (strpos($request->getPathInfo(), '/api') !== 0) {
            // If not, return early
            return;
        }

        $userId = $this->tokenService->getUserIdFromToken();

        // If the token is invalid or expired
        if (isset($userId['error'])) {
            $response = new JsonResponse(['error' => true, 'message' => $userId], 401);
            $event->setResponse($response);
        } else {
            $request->attributes->set('tokenUserId', $userId);
        }
    }
}