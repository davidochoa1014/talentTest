const bookService = require("../services/bookService");

exports.create = async (req, res) => {
  try {
    const result = await bookService.createBook(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const books = await bookService.getBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await bookService.updateBook(req.params.id, req.body);
    res.json({ msg: "Updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.toggle = async (req, res) => {
  try {
    await bookService.toggleBook(req.params.id);
    res.json({ msg: "Updated availability" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const books = await bookService.searchBooks(req.query.q);
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};