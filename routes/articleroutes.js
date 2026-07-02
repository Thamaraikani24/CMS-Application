const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const articleController = require("../controllers/articleController");

// Create Article
router.post(
    "/create",
    upload.single("image"),
    articleController.createArticle
);

// View All Articles
router.get(
    "/getAll",
    articleController.getAllArticles
);

//View Single Article
router.get(
    "/:id",
    articleController.getArticleById
);

//Update Article
router.put(
    "/:id",
    upload.single("image"),
    articleController.updateArticle
);

// Delete Article
router.delete(
    "/:id",
    articleController.deleteArticle
);

module.exports = router;