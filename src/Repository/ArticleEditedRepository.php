<?php

namespace App\Repository;

use App\Entity\ArticleEdited;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ArticleEdited>
 *
 * @method ArticleEdited|null find($id, $lockMode = null, $lockVersion = null)
 * @method ArticleEdited|null findOneBy(array $criteria, array $orderBy = null)
 * @method ArticleEdited[]    findAll()
 * @method ArticleEdited[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleEditedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArticleEdited::class);
    }

//    /**
//     * @return ArticleEdited[] Returns an array of ArticleEdited objects
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

//    public function findOneBySomeField($value): ?ArticleEdited
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
