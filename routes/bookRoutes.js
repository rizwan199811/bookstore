
const express = require('express');
const { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle, getBookReviews, addModifyReview, deleteReview } = require('../controllers/bookController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllBooks);
router.get('/isbn/:isbn', getBookByISBN);
router.get('/author/:author', getBooksByAuthor);
router.get('/title/:title', getBooksByTitle);
router.get('/reviews/:isbn', getBookReviews);
router.put('/review/:isbn', authMiddleware, addModifyReview);
router.delete('/review/:isbn', authMiddleware, deleteReview);

module.exports = router;
