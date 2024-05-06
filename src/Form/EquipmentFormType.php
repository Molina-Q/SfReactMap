<?php

namespace App\Form;

use App\Entity\Img;
use App\Entity\Equipment;
use App\Entity\SubCategory;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class EquipmentFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [])
            ->add('text', TextareaType::class, [])

            ->add('sub_category', EntityType::class, [
                'class' => SubCategory::class,
                'choice_label' => 'subAndCat',
            ])

            ->add('path', FileType::class, [

                // 'entry_type' => TextareaType::class, 
                'required' => false,
                'mapped' => false,
                'attr' => [
                    'by_reference' => false, 
                    'class' => 'form-input-text',
                    'data_class' => Img::class,
                ],
                'label' => 'Picture'

            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // 'data_class' => Equipment::class,
        ]);
    }
}
