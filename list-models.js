const { GEMINI_API_KEY } = require('./config/constants');

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("=== MODELS AVAILABLE FOR YOUR KEY ===");
    data.models.forEach((model) => {
      console.log(`> Name: ${model.name}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Methods: ${model.supportedGenerationMethods.join(", ")}`);
      console.log("--------------------------------------");
    });
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
  }
}

listModels();