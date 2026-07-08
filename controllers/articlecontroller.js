const Article = require("../models/articleModel");
const { uploadToS3, deleteFromS3 } = require("../utils/uploadToS3");


// Create Article
const createArticle = async (req, res) => {

    try {

        // Image Validation
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        let { content, tags } = req.body;

        // Convert Tags into Array
        tags = Array.isArray(tags) ? tags : [tags];

        // Remove HTML Tags
        const plainText = content.replace(/<[^>]*>/g, "");

        // Count Words
        const wordCount = plainText.trim().split(/\s+/).length;

        // Calculate Read Time
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        // Upload Image to AWS S3
        const imageKey = await uploadToS3(req.file, "article-images");

        const article = await Article.create({

           image: imageKey,
           content,
           tags,
           readTime

           });

        return res.status(201).json({

            success: true,
            message: "Article created successfully",
            data: article

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// View All Articles with pagination search and filter

const getAllArticles = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1; 
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const tag = req.query.tag || "";

        const sortOption =
            req.query.sort === "oldest"

                ? { createdAt: 1 }
                : { createdAt: -1 };
                // console.log(sortOption);

        const filter = {};
        
        if (search) {   
            filter.content = {
                $regex: search,     // regex operator  means search for the content ( regular expression) and that matches the search term in the content field of the articles collection.
                $options: "i"     // i option means case - insensitivs search, so it will match the search term regardless of whether it is uppercase or lowercase.
            };
        }

        if (tag) {
            filter.tags = tag; // if tags are available 
        }

        const totalArticles = await Article.countDocuments(filter);

const articles = await Article.find(filter) // this
    .sort(sortOption)               
    .skip(skip)
    .limit(limit);

const currentCount = articles.length;

const totalPages = Math.ceil(totalArticles / limit);

return res.status(200).json({
    success: true,
    currentPage: page,
    totalPages,
    totalArticles,
    currentCount,
    data: articles
});

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// View single Article by ID

const getArticleById = async (req, res) => {

    try {

        const article = await Article.findById(req.params.id);

        if (!article) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }

        return res.status(200).json({
            success: true,
            data: article
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Article

const updateArticle = async (req, res) => {

    try {

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        // Update Content
        if (req.body.content) {

            article.content = req.body.content;

            // Remove HTML Tags
            const plainText = req.body.content.replace(/<[^>]*>/g, "");

            // Count Words
            const wordCount = plainText.trim().split(/\s+/).length;

            // Calculate Read Time
            article.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        }

        // Update Tags
        if (req.body.tags) {

            article.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : [req.body.tags];

        }

        // Update Image
        if (req.file) {

            
            if (article.image) {
                await deleteFromS3(article.image);
            }

            
            const imageKey = await uploadToS3(req.file, "article-images");

            
            article.image = imageKey;

        }

        // Save Changes
        await article.save();

        return res.status(200).json({

            success: true,
            message: "Article updated successfully",
            data: article

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Delete Article

const deleteArticle = async (req, res) => {

    try {

        // Find Article
        const article = await Article.findById(req.params.id);

        if (!article) {

            return res.status(404).json({

                success: false,
                message: "Article not found"

            });

        }

        // Delete Image from AWS S3
        if (article.image) {

            await deleteFromS3(article.image);

        }

        // Delete Article from MongoDB
        await Article.findByIdAndDelete(req.params.id);

        return res.status(200).json({

            success: true,
            message: "Article deleted successfully"

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};