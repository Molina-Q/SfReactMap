<?php

namespace App\Service;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class TokenService
{
    private $requestStack;
    private $jwsProvider;

    public function __construct(RequestStack $requestStack, JWSProviderInterface $jwsProvider)
    {
        $this->requestStack = $requestStack;
        $this->jwsProvider = $jwsProvider;
    }

    // check if the token is good and return the userId inside it
    public function getUserIdFromToken()
    {
        // get the token
        $request = $this->requestStack->getCurrentRequest();
        $tokenGet = $request->cookies->get('BEARER');

        // check if it exist
        if (!$tokenGet) {
            // return $this->json(['error' => true, 'message' => 'Not connected. Please log in.'], 401);
            return ['error' => true, 'message' => 'Not connected. Please log in.'];
        }

        $token = filter_var($tokenGet, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // verify the signature
        try {
            $jws = $this->jwsProvider->load($token);
        } catch (\Exception $e) {
            return ['error' => true, 'message' => 'Invalid or expired token.'];
        }

        // decode it
        $decodedToken = $jws->getPayload();

        // check if userId is set
        if (!isset($decodedToken['userId'])) {
            return ['error' => true, 'message' => 'Something went wrong.'];
        }

        return $decodedToken['userId'];
    }
}
