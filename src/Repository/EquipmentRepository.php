<?php

namespace App\Repository;

use App\Entity\Equipment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Equipment>
 *
 * @method Equipment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Equipment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Equipment[]    findAll()
 * @method Equipment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EquipmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Equipment::class);
    }

    //    /**
    //     * @return Equipment[] Returns an array of Equipment objects
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

    //    public function findOneBySomeField($value): ?Equipment
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findByCategory($id)
    {
        $qb = $this->createQueryBuilder('e');

        $qb->select('e.id, e.name, e.text, i.path as img')
        ->leftJoin('e.sub_category', 'sb')
        ->leftJoin('e.imgObjects', 'ei')
        ->leftJoin('ei.Img', 'i')
        ->where('sb.Category = :id')
        ->setParameter('id', $id);

        $query = $qb->getQuery();
        return $query->getResult();
    }

    // public function findByCountryWithArticle($century)
    // {
    //     $qb = $this->createQueryBuilder('e');

    //     $qb->select('e.id, e.name, e.text, e.img')
    //     ->from('App\Entity\Equipment', 'e')
    //     ->leftJoin('e.sub_category', 'sb')
    //     ->where('sb.Category = :id')
    //     ->setParameter('id', $id);

    //     $query = $qb->getQuery()->getResult();
    //     return $countryCodes;
    // }
}
