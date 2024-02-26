<?php

namespace App\Repository;

use App\Entity\Topic;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Topic>
 *
 * @method Topic|null find($id, $lockMode = null, $lockVersion = null)
 * @method Topic|null findOneBy(array $criteria, array $orderBy = null)
 * @method Topic[]    findAll()
 * @method Topic[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TopicRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Topic::class);
    }

//    /**
//     * @return Topic[] Returns an array of Topic objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Topic
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

public function findUnregisteredUser($session_id) {
    $em = $this->getEntityManager();
    $sub = $em->createQueryBuilder();

    $qb = $sub;

    $qb->select('u')
        ->from('App\Entity\User', 'u')
        ->leftJoin('u.sessions', 'se')
        ->where('se.Session = :id');

    $sub = $em->createQueryBuilder();
    // sub query ou je recherche tous les student qui ne sont pas reliés à la session actuelle
    $sub->select('us')
        ->from('App\Entity\User', 'us')
        ->where($sub->expr()->notIn('us.id', $qb->getDQL()))
        ->setParameter('id', $session_id)
        ->orderBy('us.last_name, us.first_name');

    $query = $sub->getQuery();
    return $query->getResult();
}

    public function findByEquip($id)
    {
        $em = $this->getEntityManager();
        $sub = $em->createQueryBuilder();

        $qb = $sub; 

        $qb->select('t')
            ->from('App\Entity\Topic', 't')
            ->leftJoin('t.Equipment', 'e')
            ->leftJoin('e.sub_category', 'sub')
            ->where('sub.Category = :id')
            ->setParameter('id', $id);

        $query = $qb->getQuery();
        return $query->getResult();
    }

    public function findByArticle()
    {
        $em = $this->getEntityManager();
        $sub = $em->createQueryBuilder();

        $qb = $sub; 

        $qb->select('t')
            ->from('App\Entity\Topic', 't')
            ->where('t.Equipment IS NULL');

        $query = $qb->getQuery();
        return $query->getResult();
    }
    
}
