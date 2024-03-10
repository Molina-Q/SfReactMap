<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Article;
use App\Entity\Century;
use App\Entity\Country;
use App\Form\SectionFormType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class ArticleFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('summary')
            ->add('Century', EntityType::class, [
                'class' => Century::class,
                'choice_label' => 'year',
                'disabled' => true,
            ])
            ->add('Country', EntityType::class, [
                'class' => Country::class,
                'choice_label' => 'name',
                // 'disabled' => true,
            ])

            ->add('sections', CollectionType::class, [
                'entry_type' => SectionFormType::class,
                'entry_options' => ['label' => 'Section'],
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
            'data_class' => Article::class,
        ]);
    }
}
