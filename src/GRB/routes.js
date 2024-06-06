const { Router } = require("express");
const controller = require('./controller');

const router = Router();

// GET (READ)
router.get("/Book/get", controller.getBook);
router.get("/Book/:BookID/get", controller.getBookByID);
router.get("/Book/search", controller.searchBooks);
router.get("/Wishlist/User/:UserID/get", controller.getWishlistBooks);
router.get('/dynamic-query', controller.dynamicQuery);

// POST (CREATE)
router.post("/Book/add", controller.addBook);
router.post("/Rating-Review/add", controller.addRatingReview)
router.post("/Wishlist/User/:UserID/add/:BookID", controller.addUserWishlist)

// DELETE (REMOVE)
router.delete("/Book/remove/:BookID", controller.removeBook);
router.delete("/Rating-Review/remove/:RatingID/:ReviewID", controller.removeRatingReview);
router.delete("/Wishlist/User/:UserID/remove/:BookID", controller.removeBookFromWishlist);

// PUT (UPDATE)
router.put("/Book/update-book-price/:BookID", controller.updateBook);
router.put("/Inventory/update-quantity/:InventoryID", controller.updateInventoryQuantity);

module.exports = router;