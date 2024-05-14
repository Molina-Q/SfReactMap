<?php
namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTAuthSuccessHandler implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            'lexik_jwt_authentication.on_authentication_success' => ['onAuthenticationSuccess', 1],
        ];
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $response = $event->getResponse();
        $data = $event->getData();
        $jwt = $data['token'];

        $response->headers->setCookie(
            new Cookie(
                'BEARER',
                $jwt,
                new \DateTime('+1 day'),
                '/',
                null,
                true,
                true,
                false,
                'strict'
            )
        );

        $event->setData($data);
    }
}