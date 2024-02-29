<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 *
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

//    /**
//     * @return Message[] Returns an array of Message objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Message
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

    public function findOneByTopic($id) {
        
        $em = $this->getEntityManager();
        $sub = $em->createQueryBuilder();

        $qb = $sub; 

        $qb->select('m')
            ->from('App\Entity\Message', 'm')
            ->leftJoin('m.Topic', 't')
            ->where('m.Topic = :id')
            ->setParameter('id', $id)
            ->andWhere('m.creationDate = t.creationDate');

        // $sub = $em->createQueryBuilder();

        // $sub->select('me')
        //     ->from('App\Entity\Message', 'me')
        //     ->where($sub->expr()->notIn('me.id', $qb->getDQL()))
        //     ->setParameter('id', $id)
        //     ->orderBy('me.creationDate');

        $query = $qb->getQuery();
        return $query->getOneOrNullResult();
        
    }

    public function findMessages($id) {
        
        $em = $this->getEntityManager();
        $sub = $em->createQueryBuilder();

        $qb = $sub; 

        $qb->select('m')
            ->from('App\Entity\Message', 'm')
            ->leftJoin('m.Topic', 't')
            ->where('m.Topic = :id')
            ->setParameter('id', $id)
            ->andWhere('m.creationDate != t.creationDate');

        // $sub = $em->createQueryBuilder();

        // $sub->select('me')
        //     ->from('App\Entity\Message', 'me')
        //     ->where($sub->expr()->notIn('me.id', $qb->getDQL()))
        //     ->setParameter('id', $id)
        //     ->orderBy('me.creationDate');

        $query = $qb->getQuery();
        return $query->getResult();
        
    }
}
