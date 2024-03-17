<?php

namespace App\Form;

use App\Entity\Section;
use App\Entity\Equipment;
use App\Entity\EquipmentSection;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class AddEquipFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // ->add('Section', EntityType::class, [
            //     'class' => Section::class,
            //     'choice_label' => 'title',
            // ])
            
            ->add('Equipment', EntityType::class, [
                'class' => Equipment::class,
                'choice_label' => 'name',
                // 'label' => 'Equip',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EquipmentSection::class,
        ]);
    }
}
