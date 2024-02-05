<?php

namespace App\Repository;

use App\Entity\Century;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Century>
 *
 * @method Century|null find($id, $lockMode = null, $lockVersion = null)
 * @method Century|null findOneBy(array $criteria, array $orderBy = null)
 * @method Century[]    findAll()
 * @method Century[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CenturyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Century::class);
    }

//    /**
//     * @return Century[] Returns an array of Century objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Century
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
