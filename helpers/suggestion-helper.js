const { ObjectId } = require("mongodb");
const collection = require("../config/collection");
const db = require("../config/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Define saltRounds
const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");


module.exports = {
// Inside suggestHelper file
submitFormDataSug: async (formData) => {
  try {
    const database = db.getDb();
    const clientsCollection = database.collection(collection.REFERRAL_COLLECTION);

    // Queries for email and mobile uniqueness
    const emailQuery = { email: formData.email };
    const mobileQuery = { mobile: formData.mobile };

    // Check if email or mobile already exists
    const existingEmail = await clientsCollection.findOne(emailQuery);
    const existingMobile = await clientsCollection.findOne(mobileQuery);

    if (existingEmail || existingMobile) {
      const message = `${existingEmail ? "Email already exists." : ""} ${
        existingMobile ? "Mobile number already exists." : ""
      }`.trim();
      return { success: false, message };
    }

    // Insert form data
    const result = await clientsCollection.insertOne(formData);

    return {
      success: result.acknowledged,
      insertedId: result.insertedId,
      message: result.insertedId ? "Form submitted successfully" : "Failed to submit form",
    };
  } catch (error) {
    console.error("Error submitting form data:", error);
    return {
      success: false,
      message: "Internal Server Error: " + error.message,
    };
  }
},
};