const express = require("express");
const router = express.Router();

const { authorController } = require("../controllers/index");

router.post("/authors", authorController.addAuthor);

router.get("/authors", authorController.getAuthors);

router.put("/authors/:id", authorController.updateAuthor);

router.delete("/authors/:id", authorController.deleteAuthor);

module.exports = router;
