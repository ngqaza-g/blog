const express = require('express');
const Article = require('../models/Article');
const router = express.Router();


router.get('/new', (req, res)=>{
    res.render('new', {article: new Article()});
});

router.get('/edit/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id);
    res.render('edit', {article});
});

router.get('/:slug', async (req, res)=>{
    const article = await Article.findOne({slug: req.params.slug});
    if( article === null) res.redirect('/');

    res.render('show', {article});
});

function saveArticleAndredirect(path){
    return async (req, res)=>{
        let article  = req.article;

        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
    
        try{
           article =  await article.save();
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            console.log(e);
            res.render(path, {article});
        }
    }
}

router.post('/', (req, res, next)=>{
    req.article = new Article();
    next()
}, saveArticleAndredirect('new'));

router.delete('/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.put('/:id', async (req, res, next)=>{
    req.article = await Article.findById(req.params.id);
    next()
}, saveArticleAndredirect('edit'));

module.exports = router;