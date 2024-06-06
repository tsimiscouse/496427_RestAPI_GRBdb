// Get all Book in database sorted by BookID
const getBook = 'SELECT * FROM "Book" ORDER BY "BookID"';

// Get ALL Book by BookID
const getBookByID = 'SELECT * FROM "Book" WHERE "BookID" = $1';

// Check if ISBN already exist in database
const checkISBNExists = 'SELECT i FROM "Book" i WHERE i."ISBN" = $1';

// Add new Book to database
const addBook = 'INSERT INTO "Book" ("BookID", "BookName", "PublicationYear", "Pages", "Price", "Language", "ISBN", "CategoryID", "PublisherID") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

// Remove Book from database
const removeBook = 'DELETE FROM "Book" WHERE "BookID" = $1';

// Search Books by Keyword
const searchBooksByKeywords = 'SELECT * FROM "Book" WHERE "BookName" ILIKE $1 ORDER BY "BookID" ASC';

// Add Rating
const addRating = 'INSERT INTO "Ratings" ("RatingID", "Rating", "RatingDate", "BookID", "UserID") VALUES ($1, $2, $3, $4, $5)';

// Add Review
const addReview = 'INSERT INTO "Review" ("ReviewID", "ReviewText", "ReviewDate", "BookID", "UserID") VALUES ($1, $2, $3, $4, $5)';

// Get ALL Ratings by RatingID
const getRatingID = 'SELECT * FROM "Ratings" WHERE "RatingID" = $1';

// Get ALL Review by ReviewID
const getReviewID = 'SELECT * FROM "Review" WHERE "ReviewID" = $1';

// Remove Rating from database
const removeRating = 'DELETE FROM "Ratings" WHERE "RatingID" = $1';

// Remove Review from database
const removeReview = 'DELETE FROM "Review" WHERE "ReviewID" = $1';

// Update Book Price
const updateBook = 'UPDATE "Book" SET "Price" = $1 WHERE "BookID" = $2';

// Get Wishlist by UserID
const getWishlistByUserID = 'SELECT * FROM "Wishlist" WHERE "UserID" = $1';

// Add Wishlist for User
const addUserWishlist = 'INSERT INTO "Wishlist" ("UserID", "DateAdded") VALUES ($1, $2) RETURNING "WishlistID"';

// Check if Book is in Wishlist
const checkBookInWishlist = 'SELECT * FROM "Book_Wishlist" WHERE "Wishlist_WishlistID" = $1 AND "Book_BookID" = $2';

// Add Book to Wishlist
const addBookToWishlist = 'INSERT INTO "Book_Wishlist" ("Wishlist_WishlistID", "Book_BookID") VALUES ($1, $2)';

// Get Book in User Wishlist 
const getWishlistBooksByUserID = `
  SELECT b.*
  FROM "Book" b
  JOIN "Book_Wishlist" bw ON b."BookID" = bw."Book_BookID"
  JOIN "Wishlist" w ON bw."Wishlist_WishlistID" = w."WishlistID"
  WHERE w."UserID" = $1
`;

// Delete Book from User Wishlist
const removeBookFromWishlist = `
  DELETE FROM "Book_Wishlist"
  WHERE "Wishlist_WishlistID" = (
    SELECT "WishlistID" FROM "Wishlist" WHERE "UserID" = $1
  ) AND "Book_BookID" = $2
`;

// Update Book Quantity in Inventory
const updateInventoryQuantity = `
  UPDATE "Inventory"
  SET "Quantity" = $1
  WHERE "InventoryID" = $2
`;

module.exports = {
    getBook,
    getBookByID,
    checkISBNExists,
    addBook,
    removeBook,
    searchBooksByKeywords,
    addRating,
    addReview,
    getRatingID,
    getReviewID,
    removeRating,
    removeReview,
    updateBook,
    getWishlistByUserID,
    addUserWishlist,
    checkBookInWishlist,
    addBookToWishlist,
    getWishlistBooksByUserID,
    removeBookFromWishlist,
    updateInventoryQuantity
};