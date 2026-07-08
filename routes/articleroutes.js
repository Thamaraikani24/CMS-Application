const express = require("express");
const router = express.Router();
const { celebrate, Segments } = require("celebrate");

const upload = require("../middleware/upload");
const articleController = require("../controllers/articleController");

const createArticleValidator = require("../validations/createArticleValidation");
const updateArticleValidator = require("../validations/updateArticleValidation");
const getArticleValidator = require("../validations/getArticleValidation");
const getAllArticleValidator = require("../validations/getAllArticleValidation");
const deleteArticleValidator = require("../validations/deleteArticleValidation");

// Create Article
router.post(
    "/create",
    upload.single("image"),
    celebrate({
        [Segments.BODY]: createArticleValidator,
    }),
    articleController.createArticle
);

// View All Articles
router.get(
    "/getAll",
    celebrate({
        [Segments.QUERY]: getAllArticleValidator,
    }),
    articleController.getAllArticles
);

// View Single Article
router.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: getArticleValidator,
    }),
    articleController.getArticleById
);

// Update Article
router.put(
    "/:id",
    upload.single("image"),
    celebrate({
        [Segments.PARAMS]: getArticleValidator,
        [Segments.BODY]: updateArticleValidator,
    }),
    articleController.updateArticle
);

// Delete Article
router.delete(
    "/:id",
    celebrate({
        [Segments.PARAMS]: deleteArticleValidator,
    }),
    articleController.deleteArticle
);

module.exports = router;