// queries.js - MongoDB Queries for Week 1 Assignment

use plp_bookstore;

// -------------------- Task 2: Basic CRUD Operations --------------------

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 13.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });

// -------------------- Task 3: Advanced Queries --------------------

// 1. Find books that are both in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// 2. Projection: return only title, author, and price
db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
);

// 3. Sort by price ascending
db.books.find().sort({ price: 1 });

// 4. Sort by price descending
db.books.find().sort({ price: -1 });

// 5. Pagination: page 1 (skip 0), limit 5
db.books.find().skip(0).limit(5);

// 6. Pagination: page 2 (skip 5), limit 5
db.books.find().skip(5).limit(5);

// -------------------- Task 4: Aggregation Pipeline --------------------

// 1. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" }
    }
  }
]);

// 2. Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $subtract: [ { $divide: [ "$published_year", 10 ] }, { $mod: [ { $divide: [ "$published_year", 10 ] }, 1 ] } ] } },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// -------------------- Task 5: Indexing --------------------

// 1. Create index on title
db.books.createIndex({ title: 1 });

// 2. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Use explain to compare performance with index
db.books.find({ title: "1984" }).explain("executionStats");
