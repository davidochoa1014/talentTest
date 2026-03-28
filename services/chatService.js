const bookModel = require("../models/bookModel");

exports.askAI = async (message) => {
  const msg = message.toLowerCase();

  const books = await bookModel.findAll();

  if (msg.includes("recomienda")) {
    return "Te recomiendo: " + books.slice(0, 3).map(b => b.title).join(", ");
  }

  if (msg.includes("disponibles")) {
    const available = books.filter(b => b.available);
    return "Libros disponibles: " + available.map(b => b.title).join(", ");
  }

  return "No entendí, intenta preguntar por recomendaciones o disponibilidad 📚";
};