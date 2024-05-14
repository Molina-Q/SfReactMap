<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;


class JWTAuthSuccessHandler implements EventSubscriberInterface
{

    public function __construct()
    {

    }

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