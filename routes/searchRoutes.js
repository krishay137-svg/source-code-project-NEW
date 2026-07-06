const express          = require("express");
const router           = express.Router();
const searchController = require("../controllers/searchController");

/* ======================================================
   EduShare - Search Routes
   Part 5 — Search & Discovery

   Page routes (HTML):
     GET /search

   JSON API routes:
     GET /search/results
     GET /search/trending
     GET /search/categories
     GET /search/tags
     GET /search/related/:id
====================================================== */

/* ---- Page ---- */

router.get("/search", searchController.showSearch);

/* ---- JSON APIs ---- */

router.get("/search/results",      searchController.searchNotes);

router.get("/search/trending",     searchController.getTrending);

router.get("/search/categories",   searchController.getCategories);

router.get("/search/tags",         searchController.getPopularTags);

router.get("/search/related/:id",  searchController.getRelated);

module.exports = router;
