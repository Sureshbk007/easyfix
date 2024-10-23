import { Service } from "../models/index.js"; // Assuming your models are in './models'
import natural from "natural";
import cosineSimilarity from "cosine-similarity";

let cachedTfidf = null; // Cache for the TF-IDF matrix
let cachedServices = null; // Cache for the services list
let lastFetchTime = null;
const CACHE_EXPIRATION = 3600000; // 1 hour in milliseconds

const getTFIDFMatrix = async () => {
  // Check if cache is still valid
  if (
    cachedTfidf &&
    cachedServices &&
    lastFetchTime &&
    Date.now() - lastFetchTime < CACHE_EXPIRATION
  ) {
    return { services: cachedServices, tfidf: cachedTfidf };
  }

  // Fetch all services with the category name included
  const services = await Service.find().populate("category").lean();

  // Combine 'category name', 'service name', 'description', and 'keywords' into a single document for each service
  const documents = services.map((service) => {
    const keywordsString = service.keywords.join(" ");
    const categoryName = service.category.name ? service.category.name : "";
    return `${categoryName} ${service.name} ${service.description} ${keywordsString}`;
  });

  // Create a TF-IDF vectorizer
  const tfidf = new natural.TfIdf();

  // Add each document to the TF-IDF model
  documents.forEach((doc) => {
    tfidf.addDocument(doc);
  });

  return { services, tfidf };
};

const getSimilarServices = async (serviceId) => {
  const { services, tfidf } = await getTFIDFMatrix();

  // Find the index of the service the user viewed
  const targetIndex = services.findIndex(
    (s) => s._id.toString() === serviceId.toString()
  );

  if (targetIndex === -1) return [];

  const similarities = [];

  // Compare the target service's TF-IDF vector with all other services
  tfidf.documents.forEach((doc, index) => {
    if (index !== targetIndex) {
      const targetVector = tfidf.listTerms(targetIndex);
      const compareVector = tfidf.listTerms(index);

      // Compute cosine similarity between the two services
      const similarityScore = cosineSimilarity(
        targetVector.map((term) => term.tfidf), // Convert to numeric vector
        compareVector.map((term) => term.tfidf)
      );

      similarities.push({
        service: services[index],
        similarity: similarityScore,
      });
    }
  });

  // Sort the services by similarity score, highest first
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return top 10 similar services
  return similarities.slice(0, 10);
};

export { getSimilarServices };
