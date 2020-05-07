<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;


class ArticleController extends AbstractController
{
    /**
     * @Route("/", name="app_homepage")
     */
    public function homepage()
    {
        return $this->render('homepage.html.twig');
    }

    /**
     * @Route("/articles/{slug}", name="single_art")
     */
    public function article($slug)
    {
        return $this->render('articles/article.html.twig', [
            'title' => $slug,
            'comments' => [
                'comment1',
                'comment2',
                'comment3'
            ]
        ]);
    }
}
