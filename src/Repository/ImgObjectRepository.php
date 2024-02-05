<?php

namespace App\Repository;

use App\Entity\ImgObject;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ImgObject>
 *
 * @method ImgObject|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImgObject|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImgObject[]    findAll()
 * @method ImgObject[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImgObjectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImgObject::class);
    }

//    /**
//     * @return ImgObject[] Returns an array of ImgObject objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ImgObject
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
