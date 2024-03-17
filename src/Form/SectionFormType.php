<?php

namespace App\Form;

use App\Entity\Article;
use App\Entity\Section;
use App\Form\AddEquipFormType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class SectionFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [])
            ->add('text', TextType::class, [])
            ->add('summary', TextareaType::class, [])

            ->add('Article', EntityType::class, [
                'class' => Article::class,
                'choice_label' => 'articleTag',
                // 'disabled' => 'true'
            ])

            ->add('equipmentSections', CollectionType::class, [
                'entry_type' => AddEquipFormType::class,
                'entry_options' => ['label' => 'Sections Equipment'],
                'allow_add' => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Section::class,
        ]);
    }
}
