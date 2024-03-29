<?php

namespace App\Form;

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

            // ->add('sub_category', CollectionType::class, [
            //       // each entry in the array will be an "email" field
            //     'entry_type' => TextType::class,
            //     // these options are passed to each "email" type
            //     'entry_options' => [
            //         'attr' => ['class' => 'email-box'],
            //     ],
            // ])

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
