const { pool, knex } = require('../../db');
const queries = require("./queries");

// Get All Book
const getBook = (req, res) => {
    pool.query(queries.getBook, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

// Get Book by BookID
const getBookByID = (req, res) => {
    const BookID = parseInt(req.params.BookID);
    pool.query(queries.getBookByID, [BookID], (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

// Add Book
const addBook = (req, res) => {
    const { 
        BookID, 
        BookName, 
        PublicationYear, 
        Pages, 
        Price, 
        Language, 
        ISBN, 
        CategoryID, 
        PublisherID 
    } = req.body;

    // check if book already exist from ISBN
    pool.query(queries.checkISBNExists, [ISBN], (error, results) => {
        if (results.rows.length){
            res.send("Book already exist.");
        } else {
        // add book to db
        pool.query(queries.addBook, 
        [
            BookID, 
            BookName, 
            PublicationYear, 
            Pages, 
            Price, 
            Language, 
            ISBN, 
            CategoryID, 
            PublisherID 
        ], 
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Book added successfully!");
        });
        }    
    });
};

// remove Book
const removeBook = (req, res) => {
    const BookID = parseInt(req.params.BookID);

    pool.query(queries.getBookByID, [BookID], (error, results) => {
        const noBookFound = !results.rows.length;
        if(noBookFound){
            res.send("Book doesn't exist in database, cannot remove.");
        }

        pool.query(queries.removeBook, [BookID], (error, results) => {
            if(error) throw error;
            res.status(200).send("Book have been remove.");
        });
    });
};


// Update Book Price
const updateBook = (req, res) => {
    const BookID = parseInt(req.params.BookID);
    const { Price } = req.body;
  
    pool.query(queries.getBookByID, [BookID], (error, results) => {
        const noBookFound = !results.rows.length;
        if (noBookFound) {
            res.send("Book does not exist in the database");
        }
        pool.query(queries.updateBook, [Price, BookID], (error, results) => {
            if (error) throw error;
            res.status(200).send("Book updated successfully!");
        });
    });
};


// Search Books by Keywords
const searchBooks = (req, res) => {
    const { keyword } = req.query;
  
    if (!keyword || typeof keyword !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid keywords parameter" });
    }
  
    pool.query(queries.searchBooksByKeywords, [`%${keyword}%`], (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    });
};


// Add review and ratings with Transaction
const addRatingReview = (req, res) => {
    const { RatingID, Rating, RatingDate, ReviewID, ReviewText, ReviewDate, BookID, UserID } = req.body;

    pool.query('BEGIN', (err) => {
        if (err) {
            console.error('Error starting transaction', err);
            return res.status(500).send("An error occurred while starting the transaction.");
        }

        // Add Rating
        pool.query(queries.addRating, [RatingID, Rating, RatingDate, BookID, UserID], (err, result) => {
            if (err) {
                console.error('Error adding rating', err);
                return pool.query('ROLLBACK', (rollbackErr) => {
                    if (rollbackErr) {
                        console.error('Error rolling back transaction', rollbackErr);
                    }
                    return res.status(500).send("An error occurred while adding the rating.");
                });
            }

            // Add Review
            pool.query(queries.addReview, [ReviewID, ReviewText, ReviewDate, BookID, UserID], (err, result) => {
                if (err) {
                    console.error('Error adding review', err);
                    return pool.query('ROLLBACK', (rollbackErr) => {
                        if (rollbackErr) {
                            console.error('Error rolling back transaction', rollbackErr);
                        }
                        return res.status(500).send("An error occurred while adding the review.");
                    });
                }

                // Commit Transaction if no errors
                pool.query('COMMIT', (commitErr) => {
                    if (commitErr) {
                        console.error('Error committing transaction', commitErr);
                        return res.status(500).send("An error occurred while committing the transaction.");
                    }
                    res.status(200).send("Thank you for the review and rating!");
                });
            });
        });
    });
};

// Remove Rating and Review with Transaction
const removeRatingReview = (req, res) => {
    const RatingID = parseInt(req.params.RatingID);
    const ReviewID = parseInt(req.params.ReviewID);

    pool.query('BEGIN', (beginErr) => {
        if (beginErr) {
            console.error('Error starting transaction', beginErr);
            return res.status(500).send("An error occurred while starting the transaction.");
        }

        pool.query(queries.getRatingID, [RatingID], (getRatingErr, ratingResults) => {
            if (getRatingErr) {
                console.error('Error retrieving rating', getRatingErr);
                return pool.query('ROLLBACK', (rollbackErr) => {
                    if (rollbackErr) {
                        console.error('Error rolling back transaction', rollbackErr);
                    }
                    return res.status(500).send("An error occurred while retrieving the rating.");
                });
            }

            const noRatingFound = !ratingResults.rows.length;
            if (noRatingFound) {
                return pool.query('ROLLBACK', (rollbackErr) => {
                    if (rollbackErr) {
                        console.error('Error rolling back transaction', rollbackErr);
                    }
                    res.status(404).send("This rating doesn't exist, cannot remove.");
                });
            }

            // Remove Rating
            pool.query(queries.removeRating, [RatingID], (removeRatingErr, removeRatingResults) => {
                if (removeRatingErr) {
                    console.error('Error removing rating', removeRatingErr);
                    return pool.query('ROLLBACK', (rollbackErr) => {
                        if (rollbackErr) {
                            console.error('Error rolling back transaction', rollbackErr);
                        }
                        return res.status(500).send("An error occurred while removing the rating.");
                    });
                }

                pool.query(queries.getReviewID, [ReviewID], (getReviewErr, reviewResults) => {
                    if (getReviewErr) {
                        console.error('Error retrieving review', getReviewErr);
                        return pool.query('ROLLBACK', (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction', rollbackErr);
                            }
                            return res.status(500).send("An error occurred while retrieving the review.");
                        });
                    }

                    const noReviewFound = !reviewResults.rows.length;
                    if (noReviewFound) {
                        return pool.query('ROLLBACK', (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction', rollbackErr);
                            }
                            res.status(404).send("This review doesn't exist, cannot remove.");
                        });
                    }

                    // Remove Review
                    pool.query(queries.removeReview, [ReviewID], (removeReviewErr, removeReviewResults) => {
                        if (removeReviewErr) {
                            console.error('Error removing review', removeReviewErr);
                            return pool.query('ROLLBACK', (rollbackErr) => {
                                if (rollbackErr) {
                                    console.error('Error rolling back transaction', rollbackErr);
                                }
                                return res.status(500).send("An error occurred while removing the review.");
                            });
                        }

                        // Commit Transaction if no errors
                        pool.query('COMMIT', (commitErr) => {
                            if (commitErr) {
                                console.error('Error committing transaction', commitErr);
                                return res.status(500).send("An error occurred while committing the transaction.");
                            }
                            res.status(200).send("Your review and rating have been removed!");
                        });
                    });
                });
            });
        });
    });
};

// Add Wishlist for User
const addUserWishlist = (req, res) => {
    const UserID = parseInt(req.params.UserID);
    const BookID = parseInt(req.params.BookID);

    pool.query(queries.getWishlistByUserID, [UserID], (error, results) => {
        if (error) throw error;

        let WishlistID;
        if (results.rows.length) {
            // User already has a Wishlist
            WishlistID = results.rows[0].WishlistID;
        } else {
            // User does not have a wishlist, create one
            pool.query(queries.addUserWishlist, [UserID, new Date()], (error, results) => {
                if (error) throw error;
                WishlistID = results.rows[0].WishlistID;
            });
        }

        // Check if the book is already in the Wishlist
        pool.query(queries.checkBookInWishlist, [WishlistID, BookID], (error, results) => {
            if (error) throw error;

            if (results.rows.length) {
                res.send("Book is already in Wishlist!");
            } else {
                // Add book to the Wishlist
                pool.query(queries.addBookToWishlist, [WishlistID, BookID], (error, results) => {
                    if (error) throw error;
                    res.status(201).send("Book added to Wishlist successfully!");
                });
            }
        });
    });
};

// Get Wishlist Books from User
const getWishlistBooks = (req, res) => {
    const UserID = parseInt(req.params.UserID);
  
    pool.query(
      queries.getWishlistBooksByUserID,
      [UserID],
      (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Remove Book from User Wishlist
const removeBookFromWishlist = (req, res) => {
    const UserID = parseInt(req.params.UserID);
    const BookID = parseInt(req.params.BookID);

    pool.query(queries.removeBookFromWishlist, [UserID, BookID], (error, results) => {
        if (error) throw error;
        res.status(200).send("Book removed from Wishlist successfully!");
    });
};
  
// Update Quantity in Inventory
const updateInventoryQuantity = (req, res) => {
    const InventoryID = parseInt(req.params.InventoryID);
    const { Quantity } = req.body;

    pool.query(queries.updateInventoryQuantity, [Quantity, InventoryID], (error, results) => {
        if (error) throw error;
        res.status(200).send("Inventory quantity updated successfully!");
    });
};

// Dynamic query based on user input
const dynamicQuery = (req, res) => {
    const { table, columns, where, orderBy, limit } = req.query;
  
    // Start the query builder
    let query = knex.select(columns ? columns.split(',') : '*').from(table);
  
    // Apply where conditions
    if (where) {
      const conditions = JSON.parse(where);
      conditions.forEach(condition => {
        query = query.where(condition.column, condition.operator, condition.value);
      });
    }
  
    // Apply order by
    if (orderBy) {
      const [column, direction] = orderBy.split(':');
      query = query.orderBy(column, direction || 'asc');
    }
  
    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }
  
    // Execute the query
    query
      .then(results => res.status(200).json(results))
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };

module.exports = {
    getBook,
    getBookByID,
    addBook,
    removeBook,
    searchBooks,
    addRatingReview,
    removeRatingReview,
    updateBook,
    addUserWishlist,
    getWishlistBooks,
    removeBookFromWishlist,
    updateInventoryQuantity,
    dynamicQuery
};