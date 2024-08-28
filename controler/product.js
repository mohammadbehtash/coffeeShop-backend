const fs = require('fs')
const path = require('path')
const productModel = require('../modelse/product')
const categoryModel = require('../modelse/category')
const userModel = require('../modelse/user')
const commentMoel = require('../modelse/comment')
const { default: mongoose } = require('mongoose')


exports.create = async (req, res, next) => {
    try {
        const { error } = productModel.createValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details })
        }

        const { title,
            price,
            description,
            href,
            categoryId,
            discount,
            number,
            weight,
            packageWeight,
            dimensions,
            type,
            numberHygiene,
            brand,
            code ,
            combinations} = req.body
            
        const uniquecode = await productModel.findOne({ code })
        if (uniquecode) {
            return res.json({ message: "This code is already registered" })
        }
        const product = await productModel.create({
            title,
            price,
            description,
            cover: req.file.filename,
            href,
            categoryId,
            discount,
            number,
            weight,
            packageWeight,
            dimensions,
            type,
            numberHygiene,
            brand,
            code,
            combinations,
            creator: req.user._id,
            Score: 0
        })
        if (!product) {

            return res.status(401).json({ message: 'new product is not created' })
        }
        return res.status(201).json({ message: 'new product is created' })
    } catch (err) {
        next(err)
    }
}

exports.getProductByCategory = async (req, res, next) => {
    try {
        const { error } = productModel.hrefValidation(req.params)
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const { href } = req.params;
        const category = await categoryModel.findOne({ href });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const products = await productModel.find({ categoryId: category._id }).lean();

        const comments = await commentMoel.find({ iaAccept: 1 }).lean();

        const updatedProducts = products.map(product => {
            let productScore = 0;
            let productComments = comments.filter(comm => comm.product.toString() === product._id.toString());

            productComments.forEach(comm => {
                if (typeof comm.score === 'number' && !isNaN(comm.score)) {
                    productScore += comm.score;
                }
            });

            const score = productComments.length > 0 ? Math.floor(productScore / productComments.length) : null;

            return {
                ...product,
                Score: score
            };
        });

        return res.status(200).json(updatedProducts);
        // const { href } = req.params;
        // const category = await categoryModel.findOne({ href });

        // if (!category) {
        //     return res.status(404).json({ error: 'Category not found' });
        // }

        // const products = await productModel.find({ categoryId: category._id });

        // const updatedProducts = await Promise.all(
        //     products.map(async (product) => {
        //         const comments = await commentMoel.find({ product: product._id, iaAccept: 1});
        //         console.log(comments);
        //         const score = comments.length > 0 ? comments.reduce((total, comment) => total + comment.score, 0) / comments.length : 0;
                   
        //         return {
        //             ...product.toObject(),
        //             Score: score,
        //         };
        //     })
        // );

        // res.json(updatedProducts);

        /////////////////////////////
        // const { href } = req.params
        // const category = await categoryModel.findOne({ href }).lean()
        // if (category) {
        //     const categoryProduct = await productModel.find({categoryId: category._id}).lean()

        //     const comments = await commentMoel.find().lean()
        //     let allProduct = []
        //     categoryProduct.forEach(product => {
        //         // console.log(product.creator);

        //         let productScore = 0
        //         let comment = comments.filter((comm) => comm.product.toString() === product._id.toString())
        //         comment.forEach(comm => {
        //             // productScore += Number(comm.score)
        //             if (typeof comm.score === 'number' && !isNaN(comm.score)) {
        //                 productScore += comm.score;
        //             } 
        //         })
        //         let score = comment.length > 0 ? Math.floor(productScore / comment.length) : null;

        //         allProduct.push({
        //             ...product,
        //             Score: score,
        //             creator: product.creator,
        //             // Score: Math.floor(
        //             //     productScore / (comment.length + 1)
        //             // )
        //         })
        //     })




        //     return res.json(allProduct)
        // } else {
        //     return res.status(404).json({ mesage: 'category not found' })
        // }
    } catch (err) {
        next(err)
    }
}

exports.RelatedProduct = async (req, res, next) => {
    try {
        const { error } = productModel.hrefValidation(req.params)
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const { href } = req.params
        const product = await productModel.findOne({ href })
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' })
        }
        let relatedProduct = await productModel.find({ categoryId: product.categoryId })
        relatedProduct = relatedProduct.filter(p => p.href !== href)
        return res.json(relatedProduct)

    } catch (err) {
        next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const products = await productModel.find({}).populate('categoryId').lean().sort({ _id: -1 });
        if (products.length == 0) {
            return res.status(404).json({ message: "No Product Available" });
        }
        const comments = await commentMoel.find({ iaAccept: 1 }).lean();

        const allProduct = products.map(product => {
            let productScore = 0;
            let productComments = comments.filter(comm => comm.product.toString() === product._id.toString());

            productComments.forEach(comm => {
                if (typeof comm.score === 'number' && !isNaN(comm.score)) {
                    productScore += comm.score;
                }
            });

            const score = productComments.length > 0 ? Math.floor(productScore / productComments.length) : null;

            return {
                ...product,
                Score: score
            };
        });

        return res.status(200).json(allProduct);
      
    } catch (err) {
        next(err);
    }
};


exports.getOne = async (req, res, next) => {
    try {
        const { error } = productModel.hrefValidation(req.params);
        if (error) {
            return res.status(400).json({ error: error.details });
        }
        const { href } = req.params;
        const product = await productModel.findOne({ href })
            .populate('categoryId')
            .lean();
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }
        const comments = await commentMoel.find({ product: product._id, iaAccept: 1 })
            .populate('create', '-password -cart')
            .lean();

        let allProduct = [];
        let productScore = 0;

        comments.forEach(comm => {
            if (typeof comm.score === 'number' && !isNaN(comm.score)) {
                productScore += comm.score;
            } 
            // else {
            //     console.log('Invalid Comment Score:', comm.score);
            // }
        });

        // console.log('Final productScore:', productScore);

        let allComment = [];
        comments.forEach((comment) => {
            let mainCommentAnswerInfo = null;
            comments.forEach((answerComment) => {
                if (String(comment._id) === String(answerComment.mainCommendID)) {
                    mainCommentAnswerInfo = { ...answerComment };
                }
            });
            if (!comment.mainCommendID) {
                allComment.push({
                    ...comment,
                    answerComment: mainCommentAnswerInfo,
                });
            }
        });

        const score = comments.length ? Math.floor(productScore / comments.length) : 0;

        allProduct.push({
            product,
            Score: score,
            comment: allComment,
        });

        return res.json(allProduct);
    } catch (err) {
        next(err);
    }
};



exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(409).json({ message: "course ID Not Found" })
        }
        const product = await productModel.findOneAndDelete({_id:id})

        if (!product) {
            return res.status(404).json({ message: 'product not found' })
        }
        const imgPath = path.join(__dirname, '..', 'public', 'img', product.cover)
        fs.unlink(imgPath, async (err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.json({ message: "product is Deleted" })
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
        const { error } = productModel.createValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const { id } = req.params
        const { title,
            price,
            description,
            href,
            categoryId,
            discount,
            number,
            weight,
            packageWeight,
            dimensions,
            type,
            numberHygiene,
            brand,
            combinations } = req.body
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(409).json({ message: "course ID Not Found" })
        }
        const productUpdate = await productModel.findByIdAndUpdate({ _id: id }, {
            title,
            price,
            description,
            cover: req.file.filename,
            href,
            categoryId,
            discount,
            number,
            weight,
            packageWeight,
            dimensions,
            type,
            numberHygiene,
            brand,
            combinations
        }, { new: true })
        if (!productUpdate) {
            return res.json({ mesage: 'Product Not Updated' })
        }
        return res.json(productUpdate)
    } catch (err) {
        next(err)
    }
}


exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure user is properly fetched
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        await user.addToCart(product);
        res.status(200).json({ message: 'Product added to cart' });
    } catch (err) {
        next(err);
    }
}
//////////////

exports.incrementCartItemQuantity = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        await user.incrementCartItemQuantity(product);
        res.status(200).json({ message: 'Product quantity incremented' });
    } catch (err) {
        next(err);
    }
};


exports.decrementCartItemQuantity = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        await user.decrementCartItemQuantity(product);
        res.status(200).json({ message: 'Product quantity decremented' });
    } catch (err) {
        next(err);
    }
};



//////////
exports.minesCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure user is properly fetched
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        await user.minesProduct(product);
        res.status(200).json({ message: 'Product -' });
    } catch (err) {
        next(err);
    }
}

exports.removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params
        // const user=req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        await user.removeFromCart(id)
        return res.json({ message: "Product remove from cart" })
    } catch (err) {
        next(err)
    }
}

exports.clearCart = async (req, res, next) => {
    try {
        //    const user=req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        await user.clearCart()
        return res.status(200).json({ message: 'cart cleared' })

    } catch (err) {
        next(err)
    }
}