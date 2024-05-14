<?php
// src/App/EventListener/JWTCreatedListener.php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\PreAuthenticatedToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;

class JWTCreatedListener
{
    private TokenStorageInterface $tokenStorageInterface;
    private JWTEncoderInterface $jwtEncoder;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTEncoderInterface $jwtEncoder)
    {
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->jwtEncoder = $jwtEncoder;
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser(); // Get the user object from the event

        $payload = $event->getData();
        $payload['userId'] = $user->getId(); // Get the ID from the user object and add it to the payload

        $event->setData($payload);

        $header = $event->getHeader();
        $header['cty'] = 'JWT';

        $event->setHeader($header);

        // // Create a new JWT token
        // $jwt = $this->jwtEncoder->encode($payload);

        // // Create a new token object
        // $token = new PreAuthenticatedToken(
        //     $user,
        //     'login', // This should be your firewall name
        //     $user->getRoles()
        // );

        // $this->tokenStorageInterface->setToken($token);
    }
}
