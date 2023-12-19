// const FoundItem = require("../model/FoundItem");
// const Joi = require("joi");

// // Server side validation for found items

// const FoundItemSchema = Joi.object({
//   name: Joi.string().required(),

//   category: Joi.string().required(),

//   description: Joi.string().required(),

//   created_by: Joi.string().alphanum().required(),
// });

// // For getting found items

// const index = async (req, res, next) => {
//   try {
//     let founditem = await FoundItem.find();
//     res.send(founditem);
//   } catch (err) {
//     next(err);
//   }
// };

// // For creating found items

// const create = async (req, res, next) => {
//   // Server side validation

//   let { error } = FoundItemSchema.validate(req.body, {
//     abortEarly: false,
//     allowUnknown: true,
//   });

//   if (error?.details) {
//     res.status(400).send({
//       errors: error?.details,
//     });
//     return;
//   }

//   try {
//     let founditem = await FoundItem.create({
//       ...req.body,
//       created_by: req.user_id,
//     });
//     res.send(founditem);
//     console.log(res.body);
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   index,
//   create,
// };

const FoundItem = require("../model/FoundItem");
const LostItem = require("../model/lostitem");
const Joi = require("joi");

// Cosine similarity calculation function
function cosineSimilarity(vector1, vector2) {
  const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (magnitude1 * magnitude2);
}

// Server side validation for found items
const FoundItemSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  created_by: Joi.string().alphanum().required(),
});

// For getting found items
const index = async (req, res, next) => {
  try {
    let foundItems = await FoundItem.find();
    res.send(foundItems);
  } catch (err) {
    next(err);
  }
};

// For creating found items
const create = async (req, res, next) => {
  // Server side validation
  let { error } = FoundItemSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error?.details) {
    res.status(400).send({
      errors: error?.details,
    });
    return;
  }

  try {
    let foundItem = await FoundItem.create({
      ...req.body,
      created_by: req.user_id,
    });

    // Example: Calculate cosine similarity with lost items
    const lostItems = await LostItem.find();

    // Array to store similarity results
    const similarityResults = calculateCosineSimilarities(foundItem, lostItems);

    // Sort the similarity results array in descending order based on similarity scores
    similarityResults.sort((a, b) => b.similarity - a.similarity);

    // Output sorted results to console
    similarityResults.forEach(({ lostItem, similarity }) => {
      console.log(`Cosine Similarity with Lost Item (${lostItem.name}): ${similarity}`);
    });

    res.send(foundItem);
  } catch (err) {
    next(err);
  }
};

// Helper function for manual tokenization
function tokenize(text) {
  // Convert to lowercase and remove non-alphanumeric characters
  const cleanedText = text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');

  // Split the cleaned text into an array of words
  const tokens = cleanedText.split(/\s+/);

  return tokens;
}

// Function to calculate cosine similarities
function calculateCosineSimilarities(foundItem, lostItems) {
  const similarityResults = [];

  lostItems.forEach((lostItem) => {
    const similarity = cosineSimilarity(
      tokenize(foundItem.description),
      tokenize(lostItem.description)
    );

    // Store similarity scores and lost item details
    similarityResults.push({ lostItem, similarity });
  });

  return similarityResults;
}

module.exports = {
  index,
  create,
};