// controllers/lostitem.js
const LostItem = require("../model/lostitem")
const FoundItem = require("../model/FoundItem")
const  {ObjectId} = require("mongoose").Types;

// Tokenize and clean text
function tokenizeAndClean(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split into words
    .filter(word => word.length > 0); // Remove empty words
}

// Calculate cosine similarity between two text strings
function calculateCosineSimilarity(text1, text2) {
  const words1 = tokenizeAndClean(text1);
  const words2 = tokenizeAndClean(text2);

  const uniqueWords = new Set([...words1, ...words2]);

  const vector1 = Array.from(uniqueWords).map(word =>
    words1.includes(word) ? 1 : 0
  );
  const vector2 = Array.from(uniqueWords).map(word =>
    words2.includes(word) ? 1 : 0
  );

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < uniqueWords.size; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] ** 2;
    magnitude2 += vector2[i] ** 2;
  }

  const similarity =
    dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));

  return similarity;
}

const create = async (req, res, next) => {
  try {
    const { name, category, description, date, created_by } = req.body;

    const lostItem = await LostItem.create({
      name,
      category,
      description,
      date,
      created_by: new ObjectId(),
    });

    const foundItems = await FoundItem.find();

    const similarityResults = foundItems.map(foundItem => ({
      foundItem,
      similarity: calculateCosineSimilarity(lostItem.description, foundItem.description),
    }));

    similarityResults.sort((a, b) => b.similarity - a.similarity);

    similarityResults.forEach(({ foundItem, similarity }) => {
      console.log(`Cosine Similarity with Found Item (${foundItem.name}): ${similarity}`);
    });

    res.status(201).send({
      msg: "Lost item created successfully",
      lostItem,
      similarityResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
};
