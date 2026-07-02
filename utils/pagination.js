const getAllArticles = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const sortOption =
            req.query.sort === "oldest"
                ? { createdAt: 1 }
                : { createdAt: -1 };

        const totalArticles = await Article.countDocuments();

        const articles = await Article.find()
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalArticles / limit),
            totalArticles,
            data: articles
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};