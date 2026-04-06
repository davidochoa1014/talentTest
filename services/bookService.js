const bookModel = require("../models/bookModel");

exports.createBook = async (data) => {
  return await bookModel.create(data);
};

exports.getBooks = async () => {
  return await bookModel.findAll();
};

exports.updateBook = async (id, data) => {
  return await bookModel.update(id, data);
};

exports.deleteBook = async (id) => {
  return await bookModel.remove(id);
};

exports.toggleBook = async (id) => {
  const book = await bookModel.findById(id);

  if (!book) throw new Error("BOOK_NOT_FOUND");

  return await bookModel.toggleAvailability(id, !book.available);
};

exports.findByName = async (title) => {

   const book = await bookModel.search(term);
   return boot != null ? rows[0] : null;
  }

exports.searchBooks = async (term) => {
  return await bookModel.search(term);
};