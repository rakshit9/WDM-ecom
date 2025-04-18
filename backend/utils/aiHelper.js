const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateProductDescription = async (name, category) => {
  const prompt = `
  Write a detailed and compelling product description for "${name}" in the "${category}" category.
  - The description should be **between 100-150 words**.
  - Clearly mention **features, benefits, nutritional value, and ideal usage**.
  - Make it **engaging for online grocery buyers**.
  - Use **persuasive marketing language** to highlight quality.
  - Use **short paragraphs** to improve readability.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use the latest available model
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100, // Allow enough room for 200-300 words
      temperature: 0.7, // Balance between creativity and accuracy
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Description Error:", error);
    return "Premium grocery product, carefully selected for freshness and quality.";
  }
};

module.exports = generateProductDescription;
