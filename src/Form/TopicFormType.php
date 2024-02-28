<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Topic;
use App\Entity\Article;
use App\Entity\Message;
use App\Entity\Equipment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

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

            ->add('Equipment', EntityType::class, [
                'class' => Equipment::class,
                'choice_label' => 'name',
                'attr' => [
                    'class' => 'form-input-select',
                ],
                'required' => false,

                'expanded' => 'true',
                // 'multiple' => 'false',
            ])

            ->add('Article', EntityType::class, [
                'class' => Article::class,
                'choice_label' => 'articleTag',
                'attr' => [
                    'class' => 'form-input-select',
                ],
                'required' => false,
                'expanded' => 'true',
                // 'multiple' => 'false',
            ])

            ->add('msgAuthor', TextareaType::class, [

                // 'entry_type' => TextareaType::class, 
            
                'attr' => [
                    'by_reference' => false, 
                    'class' => 'form-input-text',
                    'data_class' => Message::class,

                ],
                'label' => 'Text',
                // 'class' => Message::class,
                
                // 'allow_add' => true,
                // 'allow_delete' => true,
            ])

        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // 'data_class' => Topic::class,
        ]);
    }
}
