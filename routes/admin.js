const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const { getDb } = require("../config/connection");
const suggestHelper = require("../helpers/suggestion-helper");
const collection = require("../config/collection");


router.get("/suggestions", async (req, res) => {
  try {
    const database = getDb();
    const suggestionCollection = database.collection(
      collection.SUGGESTION_COLLECTION
    );
    const engineCollection = database.collection(collection.ENGINE_COLLECTION);

    // Fetch engine data for courses and specializations dropdowns
    const engineData = await engineCollection.find().toArray();

    const availableCourses = new Set();
    const courseSpecializationMap = {};

    engineData.forEach((university) => {
      university.courses.forEach((course) => {
        if (course.courseName) {
          const trimmedCourseName = course.courseName.trim();
          availableCourses.add(trimmedCourseName);

          if (!courseSpecializationMap[trimmedCourseName]) {
            courseSpecializationMap[trimmedCourseName] = new Set();
          }

          if (course.specializations) {
            course.specializations.forEach((spec) => {
              if (spec) {
                courseSpecializationMap[trimmedCourseName].add(spec.trim());
              }
            });
          }
        }
      });
    });

    const uniqueCourses = Array.from(availableCourses);
    const specializationMap = Object.fromEntries(
      Object.entries(courseSpecializationMap).map(([key, value]) => [
        key,
        Array.from(value),
      ])
    );

    // Fetch suggestions data to display in the table
    const suggestionsData = await suggestionCollection.find().toArray();

    res.render("user/suggestionscr", {
      layout: "admin-layout",
      title: "Add Suggest",
      engineData,
      availableCourses: uniqueCourses,
      specializationMap,
      suggestionsData, // Pass the suggestions data to the view
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).send("An error occurred while fetching suggestions.");
  }
});

router.get("/suggestions-data", async (req, res) => {
  try {
    const { course, specialization, exposure, budget, type, abroad } =
      req.query;
    const database = getDb();
    const suggestionCollection = database.collection(
      collection.SUGGESTION_COLLECTION
    );

    // Base query with required fields
    const query = {
      course,
      specialization,
      exposure,
      type,
      [`budget.${budget}`]: { $exists: true },
    };

    // Include 'abroad' filter if it's set to "Abroad," "India," or "NIL"
    if (["Abroad", "India"].includes(abroad)) {
      query.abroad = abroad;
    }

    // Find an existing suggestion with the base query
    const existingSuggestion = await suggestionCollection.findOne(query);

    if (existingSuggestion) {
      return res.json({
        selectedUniversities: existingSuggestion.budget[budget], // Return the universities for the selected budget
        exposureLevel: existingSuggestion.exposureLevel || null, // Include exposureLevel if present, otherwise null
      });
    }

    // If no suggestion is found, return an empty array for universities and null for exposureLevel
    res.json({ selectedUniversities: [], exposureLevel: null });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching suggestions." });
  }
});


// POST route to save university suggestions based on user input
router.post("/suggestions", async (req, res) => {
  try {
    let { course, specialization, exposure, type, abroad, university, budget, exposureLevel } = req.body;
    const selectedUniversities = Array.isArray(university) ? university : [university];

    // Validate university count (1 to 6)
    if (selectedUniversities.length < 1 || selectedUniversities.length > 6) {
      return res.status(400).json({ error: "Please select between 1 and 6 universities." });
    }

    // Default type to "Private" if not provided
    type = type || "Private";

    const database = getDb();
    const suggestionCollection = database.collection(collection.SUGGESTION_COLLECTION);

    // Find an existing suggestion with the same parameters (excluding exposureLevel)
    const existingSuggestion = await suggestionCollection.findOne({
      course,
      specialization,
      exposure,
      type,
      abroad
    });

    if (existingSuggestion) {
      if (existingSuggestion.budget[budget]) {
        // Update existing budget range without alert
        await suggestionCollection.updateOne(
          { _id: existingSuggestion._id },
          { $set: { [`budget.${budget}`]: selectedUniversities, exposureLevel } }  // Store the new exposureLevel field
        );
        return res.json({ message: "Suggestion updated successfully!" });
      } else {
        // If updating with a new budget range, alert the user
        await suggestionCollection.updateOne(
          { _id: existingSuggestion._id },
          { $set: { [`budget.${budget}`]: selectedUniversities, exposureLevel } }  // Store the new exposureLevel field
        );
        return res.json({
          message: "Suggestion updated successfully with a new budget range.",
          alert: "New budget range added to the suggestion.",
        });
      }
    }

    // If no existing suggestion found, create a new suggestion entry
    const budgetUniversities = {};
    budgetUniversities[budget] = selectedUniversities;

    const suggestionData = {
      course,
      specialization,
      exposure,
      type,
      abroad,
      exposureLevel,  // Store exposureLevel as a new field in the document
      budget: budgetUniversities,
    };

    await suggestionCollection.insertOne(suggestionData);
    res.json({ message: "Suggestion saved successfully!" });
  } catch (error) {
    console.error("Error saving suggestion:", error);
    res.status(500).json({ error: "An error occurred while saving the suggestion." });
  }
});





module.exports = router;
