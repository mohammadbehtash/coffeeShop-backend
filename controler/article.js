const fs = require('fs')
const path = require('path')
const articleModel = require('../modelse/article')
const { default: mongoose } = require('mongoose')


exports.create = async (req, res, next) => {
    try {
        const { error } = articleModel.validation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const { title, description, body, href, categoryID } = req.body;
        const cover = req.file.filename;

       
        if (!href || href.trim() === '') {
            return res.status(400).json({ message: 'href الزامی است و نباید خالی باشد' });
        }

        const duplicatedHref = await articleModel.findOne({ href });
        if (duplicatedHref) {
            return res.status(409).json({ message: 'این href تکراری است' });
        }

        const article = await articleModel.create({
            title, 
            description, 
            body,
            href, 
            categoryID, 
            cover,
            creator: req.user._id,
            publish: 0
        });

        const populatedArticle = await article.populate('creator', '-password');

        return res.status(201).json(populatedArticle);
    } catch (err) {
        next(err);
    }
};



exports.getAllAdmin = async (req, res, next) => {
try{
    const articles=await articleModel.find({}).populate('creator','-password').populate('categoryID','title').sort({_id:-1}).lean()
    if(articles.length===0){
        return res.status(404).json({message:'no Article Avalable!'})
    }
    return res.json(articles)
}catch(err){
next(err)
}
}

exports.getAllclient=async(req,res,next)=>{
    try{
        const articles=await articleModel.find({publish:1})
        if(articles.length===0){
            return res.status(404).json({message:'no Article Avalable!'})
        }
        return res.json(articles)
    }catch(err){
        next(err)
    }
}

exports.getOne = async (req, res, next) => {
    try{
        const { error } = articleModel.hrefvalidation(req.params);

        if (error) {
          return res.status(400).json({ error: error.details });
        }
        const {href}=req.params
        const article=await articleModel.findOne({href}).populate('creator','username').lean()
        if(!article){
            return res.status(404).json({message:'Article not Found'})
        }
        return res.json(article)
    }catch(err){
        next(err)
    }
}

exports.RelatedProduct = async (req, res, next) => {
    try {
        const { error } = articleModel.hrefvalidation(req.params);
        if (error) {
          return res.status(400).json({ error: error.details });
        }
        const { href } = req.params
        const article = await articleModel.findOne({ href })
        if (!article) {
            return res.status(404).json({ message: 'Article Not Found' })
        }
        let relatedArticle = await articleModel.find({ categoryID: article.categoryID,publish:1 })
        relatedArticle = relatedArticle.filter(p => p.href !== href)
        return res.json(relatedArticle)

    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
        const { error } = articleModel.validation(req.body);

        if (error) {
          return res.status(400).json({ error: error.details });
        }
        const { id } = req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(406).json({ message: "category Id is not valid" })
        }
        const { title, description, body, href, categoryID } = req.body;
        const cover = req.file.filename
        const article=await articleModel.findByIdAndUpdate({_id:id},{
            title, description, href, body,
            creator: req.user._id,
            cover, categoryID
        })
        const pupulatedArticle = await article.populate('creator', '-password')
        return res.status(201).json(pupulatedArticle)
 
    } catch (err) {
        next(err)
    }
}

exports.publishOne = async (req, res, next) => {
try{
    const{id}=req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) {
        return res.status(406).json({ message: "category Id is not valid" })
    }
    await articleModel.findByIdAndUpdate({_id:id},{
        publish:1
    })
    return res.json({message:'publish:1 OK'})
}catch(err){
next(err)
}
}

exports.publishZero = async (req, res, next) => {
    try{
        const{id}=req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(406).json({ message: "category Id is not valid" })
        }
        await articleModel.findByIdAndUpdate({_id:id},{
            publish:0
        })
        return res.json({message:'publish:0 OK'})
    }catch(err){
    next(err)
    }
}

exports.remove = async (req, res, next) => {
    try{
        const {id}=req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(406).json({ message: "category Id is not valid" })
        }
        const deleteArticle=await articleModel.findByIdAndDelete({_id:id})
        if(!deleteArticle){
            return res.status(404).json({message:"article not found"})
        }
        const imgpath=path.join(__dirname,'..','public','img',deleteArticle.cover)
        fs.unlink(imgpath,async(err)=>{
            if(err)console.log(err);
        })
        return res.json(deleteArticle)
    }catch(err){
        next(err)
    }
}
