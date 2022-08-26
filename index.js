const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Article = require('./models/Article');
const articleRouter = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.urlencoded({ extended: true}));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use('/articles', articleRouter);

app.get('/', async (req, res)=>{

    const articles = await Article.find().sort({
        createdAt: 'desc'
    });
    res.render('index', {articles});
})

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));