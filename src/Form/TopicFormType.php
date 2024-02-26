<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Topic;
use App\Entity\Article;
use App\Entity\Equipment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;

class TopicFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'attr' => [
                    'class' => 'form-input-text',
                ],
            ])

            // ->add('creationDate', DateTimeType::class, [
            //     'attr' => [
            //         'class' => 'form-input-date',
            //     ],
            // ])

            // ->add('Author', EntityType::class, [
            //     'class' => User::class,
            //     'choice_label' => 'username',
            //     'attr' => [
            //         'class' => 'form-input-select',
            //     ],
            // ])

            ->add('Equipment', EntityType::class, [
                'class' => Equipment::class,
                'choice_label' => 'name',
                'attr' => [
                    'class' => 'form-input-select',
                ],
            ])

            ->add('Article', EntityType::class, [
                'class' => Article::class,
                'choice_label' => 'articleTag',
                'attr' => [
                    'class' => 'form-input-select',
                ],
            ])

        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Topic::class,
        ]);
    }
}
