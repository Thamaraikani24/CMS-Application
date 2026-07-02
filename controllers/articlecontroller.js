const Article = require("../models/articleModel");
const validateArticle = require("../validations/articlevalidation");

// Create Article
const createArticle = async (req, res) => {

    try {

        // Validate Request
        const { error } = validateArticle(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Check Image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        let { content, tags } = req.body;

        // Convert Tags into Array
        tags = Array.isArray(tags) ? tags : [tags];

        // Remove HTML Tags from React Quill Content
        const plainText = content.replace(/<[^>]*>/g, "");

        // Count Words
        const wordCount = plainText.trim().split(/\s+/).length;

        // Calculate Read Time
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        // Create Article
        const article = await Article.create({

            image: `uploads/images/${req.file.filename}`,
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

        const filter = {};
        
        if (search) {
            filter.content = {
                $regex: search,
                $options: "i"
            };
        }

        if (tag) {
            filter.tags = tag;
        }

        const totalArticles = await Article.countDocuments(filter);

const articles = await Article.find(filter)
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

        const { error } = validateArticle(req.body, true);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        if (req.body.content) {

            article.content = req.body.content;

            const plainText = req.body.content.replace(/<[^>]*>/g, "");

            const wordCount = plainText.trim().split(/\s+/).length;

            article.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        }

        if (req.body.tags) {

            article.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : [req.body.tags];

        }

        if (req.file) {

            article.image = `uploads/images/${req.file.filename}`;

        }

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

        const article = await Article.findById(req.params.id);

        if (!article) {

            return res.status(404).json({
 
                success: false,
                message: "Article not found"

            });

        }

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