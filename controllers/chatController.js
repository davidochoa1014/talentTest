const bookService = require("../services/bookService");
const { GEMINI_API_KEY } = require('../config/constants');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.talkToAgent = async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-001",//model
      
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are a professional librarian for 'Smart Library'. Always respond in English. Use the tools provided for inventory checks." }]
      }
    });

    const tools = [{
      functionDeclarations: [{
        name: "check_library_inventory",
        description: "Check if a book is available in the library database by its title.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING", description: "The title of the book to search for." }
          },
          required: ["title"]
        }
      }]
    }];

   
    const chat = model.startChat({
      tools: tools
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const calls = response.functionCalls();

    if (calls && calls.length > 0) {
      const call = calls[0];
      const { title } = call.args;

      //request the service
      const book = await bookService.findByName(title);

      const inventoryData = book 
        ? `Result: The book '${book.title}' by ${book.author} is available.` 
        : `Result: Book '${title}' not found in inventory.`;

      
      const finalResult = await chat.sendMessage([{
        functionResponse: {
          name: "check_library_inventory",
          response: { content: inventoryData }
        }
      }]);

      return res.json({ reply: finalResult.response.text() });
    }

    res.json({ reply: response.text() });

  } catch (error) {
    console.error("Detailed Error:", error);

    if (error.status === 429) {
      return res.json({ reply: "I'm a bit busy. Please wait a moment (Quota)." });
    }

    res.status(500).json({ reply: "I had an issue processing that. Please try again." });
  }
};