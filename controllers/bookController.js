
const Book = require('../models/Book');

// Task 1: Get all books
exports.getAllBooks = async (req, res) => {
    // const books = await Book.find();
    const books = await Book.find().select('-__v -_id -isbn');
    const transformedObject = books.reduce((acc, item, index) => {
        acc['books'][index + 1] = item; // Start keys from 1
        return acc;
    }, { books: {} });
    res.json(transformedObject);
    // res.json(transformedObject);
};

// Task 2: Get book by ISBN
exports.getBookByISBN = async (req, res) => {
    const { isbn } = req.params;
    const query = {};
    if (isbn) query.isbn = isbn;
    const book = await Book.findOne(query).select('-__v -_id -isbn');
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
};

exports.searchBookByISBN = (req, res) => {
    const { isbn } = req.params; // Get ISBN from request parameters
    const query = {};
    // Create a regex pattern to match the ISBN
    if (isbn) {
        query.isbn = { $regex: isbn, $options: 'i' }; // Case-insensitive match
    }
    Book.find(query)
        .select('-__v -_id -isbn') // Select fields to exclude from the response
        .then(books => {
            if (books.length === 0) {
                return res.status(404).send('No books found with the provided ISBN');
            }
            res.json(books); // Return the found books
        })
        .catch(err => {
            console.error(err); // Log the error for debugging
            res.status(500).send('Server error'); // Respond with a 500 status code
        });
};


exports.getBookByISBN = async (req, res) => {
    const { isbn } = req.params;
    const query = {};
    if (isbn) query.isbn = isbn;
    const book = await Book.findOne(query).select('-__v -_id -isbn');
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
};

// Task 3: Get books by Author
exports.getBooksByAuthor = async (req, res) => {
    const { author } = req.params;
    // const books = await Book.find({ author });
    // const { authorName } = req.params;
    const books = await Book.find({ author: author }).select('-__v -_id -author');
    const transformedObject = books.reduce((acc, item, index) => {
        acc['booksbyauthor'] = [...books]; // Start keys from 1
        return acc;
    }, {})
    res.json(transformedObject);
    // res.json(books);
};

exports.searchBookByAuthor = async (req, res) => {
    const { author } = req.params;
    // const books = await Book.find({ author });
    // const { authorName } = req.params;
    const books = await Book.find({ author: { $regex: author, $options: 'i' } }).select('-__v -_id -author');
    const transformedObject = books.reduce((acc, item, index) => {
        acc['searchbooksbyauthor'] = [...books]; // Start keys from 1
        return acc;
    }, {})
    res.json(transformedObject);
    // res.json(books);
};


// Task 4: Get books by Title
exports.getBooksByTitle = async (req, res) => {
    const { title } = req.params;
    const books = await Book.find({ title });
    const transformedObject = books.reduce((acc, item, index) => {
        acc['booksbytitle'] = [...books]; // Start keys from 1
        return acc;
    }, {})
    res.json(transformedObject);
};

exports.searchBooksByTitle = async (req, res) => {
    const { title } = req.params;
    const books = await Book.find({ title:{ $regex: title, $options: 'i' } });
    const transformedObject = books.reduce((acc, item, index) => {
        acc['searchbooksbytitle'] = [...books]; // Start keys from 1
        return acc;
    }, {})
    res.json(transformedObject);
};



// Task 5: Get book reviews
exports.getBookReviews = async (req, res) => {
    const { isbn } = req.params;
    const { reviews } = await Book.findOne({ isbn: isbn }).select('reviews -_id');
    console.log({ reviews })
    // const transformedObject = Object.values(reviews).length> 0 ? Object.values(reviews).reduce((acc, item, index) => {
    //     acc['reviews'][index + 1] = item; // Start keys from 1
    //     return acc;
    // }, {
    //     reviews: {}
    // }):{}
    res.json(reviews);
};

// Task 8: Add/Modify Review
exports.addModifyReview = async (req, res) => {
    const { review } = req.query;
    const { isbn } = req.params;

    // const existingReview = await Book.findOne({ user: req.user.userId, isbn: isbn });
    // if (existingReview) {
    //     existingReview.review = review;
    //     await existingReview.save();
    // } else {
    await Book.findOneAndUpdate(
        { isbn },  // The condition to find the book
        {
             $set: { [`reviews.${isbn}`]: review } 
        },
        { new: true }  // Optionally return the updated document
    );
    // }
    res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);
};

// Task 9: Delete Review
exports.deleteReview = async (req, res) => {
    const { isbn } = req.params;
    await Book.findOneAndUpdate({ isbn }, {
        $set: {
            'reviews': {}  // Set the comments array to an empty array
        }
    }, { new: true });
    res.status(200).send('Review deleted.');
};
