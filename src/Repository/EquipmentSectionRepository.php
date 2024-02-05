<?php

namespace App\Repository;

use App\Entity\EquipmentSection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EquipmentSection>
 *
 * @method EquipmentSection|null find($id, $lockMode = null, $lockVersion = null)
 * @method EquipmentSection|null findOneBy(array $criteria, array $orderBy = null)
 * @method EquipmentSection[]    findAll()
 * @method EquipmentSection[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EquipmentSectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EquipmentSection::class);
    }

//    /**
//     * @return EquipmentSection[] Returns an array of EquipmentSection objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('e.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?EquipmentSection
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
