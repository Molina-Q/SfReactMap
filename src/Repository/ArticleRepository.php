<?php

namespace App\Repository;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Article>
 *
 * @method Article|null find($id, $lockMode = null, $lockVersion = null)
 * @method Article|null findOneBy(array $criteria, array $orderBy = null)
 * @method Article[]    findAll()
 * @method Article[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

//    /**
//     * @return Article[] Returns an array of Article objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Article
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

    public function findOneByCountry($country) {
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('a')
            ->from('App\Entity\Article', 'a')
            ->leftJoin('a.Country', 'co')
            ->where('co.name = :country')
            ->setParameter('country', $country);

        $query = $qb->getQuery();
        return $query->toIterable();
    }   
    // public function findUnregisteredUser($session_id) {
    //     $em = $this->getEntityManager();
    //     $sub = $em->createQueryBuilder();

    //     $qb = $sub;

    //     $qb->select('u')
    //         ->from('App\Entity\User', 'u')
    //         ->leftJoin('u.sessions', 'se')
    //         ->where('se.Session = :id');

    //     $sub = $em->createQueryBuilder();
    //     // sub query ou je recherche tous les student qui ne sont pas reliés à la session actuelle
    //     $sub->select('us')
    //         ->from('App\Entity\User', 'us')
    //         ->where($sub->expr()->notIn('us.id', $qb->getDQL()))
    //         ->setParameter('id', $session_id)
    //         ->orderBy('us.last_name, us.first_name');
    
    //     $query = $sub->getQuery();
    //     return $query->getResult();
    // }
}
