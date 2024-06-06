# Good Reading Bookstore REST API

## Overview

The Good Reading Bookstore REST API is designed to manage the operations of the Good Reading Bookstore. The application is built using Node.js and Express.js, with PostgreSQL as the database. The project is modularly organized to enhance maintainability and scalability, with each functionality encapsulated in separate files.

## Project Structure

- **controller.js**: Contains the business logic of the API. All the core functionalities and operations are defined here.
- **queries.js**: Stores the SQL queries used to interact with the PostgreSQL database.
- **routes.js**: Defines the API endpoint routes and maps them to the appropriate controller functions.
- **db.js**: Manages the database connection using the PostgreSQL Pool. Database credentials are securely stored in the .env file.
- **server.js**: Acts as the entry point of the backend, initializing and configuring the Express application.
- **.env**: Contains environment variables, including database credentials.

## Features

- **Books Management**: Add, retrieve, update, and delete book records.
- **Reviews and Ratings**: Add and delete reviews and ratings for books.
- **Wishlist Management**: Manage user wishlists, including adding and removing books.
- **Inventory Management**: Update inventory quantities for books.
- **Dynamic Queries**: Execute dynamic SQL queries based on user input.

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database
- Express.js
- knex.js

### Usage (Endpoint)

You can interact with the API using tools like Postman. Below are some example endpoints:

- **Get all books**: `GET /Book/get`
- **Get a book by ID**: `GET /Book/:BookID/get`
- **Get a book by Keyword**: `GET /Book/search?keyword=`
- **Add a new book**: `POST /Book/add`
- **Update a book**: `PUT /Book/:BookID`
- **Delete a book**: `DELETE /Book/remove/:BookID`
- **Add a review and rating**: `POST /Rating-Review/add`
- **Remove a review and rating**: `DELETE /Rating-Review/remove/:RatingID/:ReviewID`
- **Add a book to wishlist**: `POST /Wishlist/User/:UserID/add/:BookID`
- **Get wishlist books for a user**: `GET /Wishlist/User/:UserID/get`
- **Remove a book from wishlist**: `DELETE /Wishlist/User/:UserID/remove/:BookID`
- **Update inventory quantity**: `PUT /Inventory/update-quantity/:InventoryID`
- **Execute dynamic query**: `GET /dynamic-query`

For a detailed report on the API implementation, please refer to the provided PDF document.
