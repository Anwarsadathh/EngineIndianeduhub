const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const db = require("../config/connection").getClient();
const { getDb } = require("../config/connection");
const suggestHelper = require("../helpers/suggestion-helper");
const collection = require("../config/collection");
const multer = require("multer");
const { ObjectId } = require("mongodb");
const fontkit = require("fontkit");
const sharp = require("sharp");

async function getImageBytes(imagePath) {
  if (imagePath.endsWith(".webp")) {
    // Convert .webp to .png
    return await sharp(imagePath).toFormat("png").toBuffer();
  } else {
    // For .jpg or .png, read directly
    return fs.readFileSync(imagePath);
  }
}
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const database = getDb(); // Use existing helper function to get the DB instance
    const engineCollection = database.collection(collection.ENGINE_COLLECTION);
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

    res.render("user/index", {
      layout: "user-layout",
      title: "Suggest me the Best Online/Distance University - Indian Edu Hub",
      engineData,
      availableCourses: uniqueCourses,
      specializationMap,
    });
  } catch (error) {
    console.error("Error fetching engine data:", error);
    res.status(500).send("An error occurred while fetching engine data.");
  }
});

router.post("/submit-form-sug", async (req, res) => {
  const formData = req.body;

  // Set timestamp
  const currentISTTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  formData.timeStamp = currentISTTime;

  try {
    // Submit form data
    const result = await suggestHelper.submitFormDataSug(formData);

    if (!result.success) {
      console.error("Submission Failed:", result.message);
      return res.status(400).json({ success: false, message: result.message });
    }

    console.log("Form data stored successfully.");
    const documentId = result.insertedId;

    const database = getDb();
    const suggestionCollection = database.collection("suggest");

    // Define matching criteria for suggestions
    const matchCriteria = {
      course: formData.course,
      specialization: formData.specialization,
      exposure: formData.exposure,
      abroad: formData.empLocation,
      type: formData.sector,
      [`budget.${formData.budget}`]: { $exists: true },
    };

    // Find the matching document to retrieve the exposureLevel
    const existingDoc = await suggestionCollection.findOne(matchCriteria);

    if (existingDoc) {
      // Retrieve the exposureLevel from the existing document
      const exposureLevel = existingDoc.exposureLevel;

      // Determine additional text content based on exposureLevel
      let additionalText;
      if (exposureLevel === "AA") {
        additionalText = `
      After considering your background and desire for opportunities in top corporate organizations within your budget, we have conducted thorough research and identified the best university and career options that align with the current market opportunities and can fulfill your requirements. 
If you require further assistance or would like to discuss this matter further, please feel free to contact our certified mentors.
        `;
      } else if (exposureLevel === "A") {
        additionalText = `
        We have conducted thorough research and identified the best university and career options that align with the 
        current market opportunities and can fulfill your requirements.
        `;
      } else if (exposureLevel === "B") {
        additionalText = `
        After considering your background and desire for opportunities in top corporate organizations within your budget, 
        we have conducted thorough research and identified the best university.
        `;
      } else {
        // Default text if exposureLevel does not match any of the expected values
        additionalText = `
        We have conducted thorough research and identified the best university options that align with the current market opportunities.
        `;
      }

      // Query universities in budget options
      const engineCollection = database.collection("enginedata");
      const universityDetails = await engineCollection
        .find({ universityName: { $in: existingDoc.budget[formData.budget] } })
        .toArray();

      // Determine PDF template based on university count
      let templateFileName = "pdf2.pdf"; // Default for 2 universities
      if (universityDetails.length === 1) templateFileName = "pdf1.pdf";
      else if (universityDetails.length === 3) templateFileName = "pdf3.pdf";
      else if (universityDetails.length === 4) templateFileName = "pdf4.pdf";
      else if (universityDetails.length === 5) templateFileName = "pdf5.pdf";
      else if (universityDetails.length >= 6) templateFileName = "pdf6.pdf";




      const templatePdfPath = path.join(
        __dirname,
        "../public/pdf",
        templateFileName
      );
      const templatePdfBytes = fs.readFileSync(templatePdfPath);
      const pdfDoc = await PDFDocument.load(templatePdfBytes);
      pdfDoc.registerFontkit(fontkit);

      // Load custom font
      const customFontPath = path.join(
        __dirname,
        "../public/fonts/Helvetica-Bold-Font.ttf"
      );

      // Load Proxima Nova font for additional text
      const proximaFontPath = path.join(
        __dirname,
        "../public/fonts/ProximaNova-Regular.ttf"
      );
      const proximaFontBytes = fs.readFileSync(proximaFontPath);
      const proximaFont = await pdfDoc.embedFont(proximaFontBytes);

      const customFontBytes = fs.readFileSync(customFontPath);
      const customFont = await pdfDoc.embedFont(customFontBytes);

      // Draw matched criteria details on the first page
      const firstPage = pdfDoc.getPage(0); // First page
   
      firstPage.drawText(formData.name, {
        x: 272, // Start after "Greetings "
        y: 128,
        size: 16,
        font: proximaFont, // Bold font for name
        color: rgb(0.945, 0.796, 0.208), // Use the specified yellow color
      });

      // Define footer text (common for all exposure levels)
   const footerText =
     "For more information on university approvals, please visit the Indian government website at https://deb.ugc.ac.in";

      // Determine page index and coordinates for additional text based on the number of universities
      let additionalTextPageIndex;
      let textPosition = { x: 50, y: 50 }; // Default position

      if (universityDetails.length === 1) {
        additionalTextPageIndex = 1; // Add to 2nd page for 1 university
        textPosition = { x: 50, y: 290 };
      } else if (universityDetails.length === 2) {
        additionalTextPageIndex = 2; // Add to 3rd page for 2 universities
        textPosition = { x: 50, y: 760 };
      } else if (universityDetails.length === 4) {
        additionalTextPageIndex = 2; // Add to 3rd page for 3 or 4 universities
        textPosition = { x: 50, y: 170 };
      } else if (universityDetails.length === 3) {
        additionalTextPageIndex = 2; // Add to 4th page for 5 universities
        textPosition = { x: 50, y: 460 };
      } else if (universityDetails.length === 5) {
        additionalTextPageIndex = 3; // Add to 4th page for 5 universities
        textPosition = { x: 50, y: 460 };
      } else if (universityDetails.length === 6) {
        additionalTextPageIndex = 3; // Add to 4th page for 6 universities
        textPosition = { x: 50, y: 170 };
      }

      // Add additional text to the specified page at the bottom with unique positions for each page
      if (
        additionalTextPageIndex !== undefined &&
        pdfDoc.getPageCount() > additionalTextPageIndex
      ) {
        const additionalTextPage = pdfDoc.getPage(additionalTextPageIndex);

        // Draw the main additional text at the specified position for that page
        additionalTextPage.drawText(additionalText, {
          x: textPosition.x,
          y: textPosition.y, // Unique y-coordinate for main text
          size: 12,
          font: proximaFont,
          color: rgb(1, 1, 1),
          maxWidth: 500, // Ensure text doesn't go outside the page width
          lineHeight: 18,
        });

        // Draw the smaller footer text below the main text
        additionalTextPage.drawText(footerText, {
          x: textPosition.x,
          y: textPosition.y - 120, // Position below the main text; adjust as necessary
          size: 10, // Smaller font size
          font: proximaFont,
          color: rgb(1, 1, 1),
          maxWidth: 500,
          lineHeight: 10,
        });
      }

      // Add greeting text to the second page
      const secondPage = pdfDoc.getPage(1); // Access the second page of the PDF

      // Define a maximum line width for text wrapping
      const maxLineWidth = 500; // Adjust this value as needed for page width

      // Construct and style greeting message
      const greetingBoldText = `Greetings ${formData.name},`; // Name should be yellow
      const courseInfoText = `Based on your choice of pursuing the '${formData.course}' program with a specialization in '${formData.specialization}', we recommend the following universities, along with its details and background information.`;

      // Set initial y-coordinate for drawing text
      let currentYPosition = 790;

      // Define the yellow color in RGB format
      const yellowColor = rgb(0.945, 0.796, 0.208); // Equivalent to #f1cb35

      // Draw bold greeting text with name in yellow
      secondPage.drawText("Greetings ", {
        x: 50,
        y: currentYPosition,
        size: 16,
        font: customFont, // Bold font for "Greetings"
        color: rgb(1, 1, 1), // White color
      });

      const nameWidth = customFont.widthOfTextAtSize(`Greetings `, 16); // Calculate width for positioning

      secondPage.drawText(`${formData.name},`, {
        x: 50 + nameWidth, // Start after "Greetings "
        y: currentYPosition,
        size: 16,
        font: customFont, // Bold font for name
        color: yellowColor, // Use the specified yellow color
      });

      // Update y-position for the next line
      currentYPosition -= 30; // Adjust spacing as needed

      // Wrap courseInfoText into lines
      const courseInfoLines = wrapText(
        courseInfoText,
        maxLineWidth,
        12,
        proximaFont
      );

      // Draw each line of course information text with specific words in yellow
      courseInfoLines.forEach((line) => {
        let xPosition = 50; // Starting x-position for each line
        const words = line.split(" ");

        words.forEach((word) => {
          let textColor = rgb(1, 1, 1); // Default color (white)

          // Check if the word contains course, specialization, or quotes for yellow color
          if (
            word.includes(formData.course) ||
            word.includes(formData.specialization)
          ) {
            textColor = yellowColor; // Use the specified yellow color
          }

          // Draw each word with the specified color
          secondPage.drawText(word + " ", {
            x: xPosition,
            y: currentYPosition,
            size: 12,
            font: proximaFont,
            color: textColor,
          });

          // Update xPosition for the next word
          xPosition += proximaFont.widthOfTextAtSize(word + " ", 12);
        });

        // Move down to the next line
        currentYPosition -= 20; // Adjust spacing between lines as needed
      });

      // Helper function to wrap text based on width
      function wrapText(text, maxWidth, fontSize, font) {
        const words = text.split(" ");
        let lines = [];
        let currentLine = "";

        words.forEach((word) => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines;
      }

      let currentPageIndex = 1; // Start from page 2
      let currentPage = pdfDoc.getPage(currentPageIndex);
      // Define default positions for each university's details
      let universityPositions = [
        { x: 80, y: 556 }, // University 1 on Page 1
        { x: 80, y: 268 }, // University 2 on Page 1
        { x: 80, y: 724 }, // University 3 on Page 2 (default)
        { x: 80, y: 437 }, // University 4 on Page 2 (default)
        { x: 80, y: 750 }, // University 5 on Page 3
        { x: 80, y: 450 }, // University 6 on Page 3
      ];

      // Adjust positions of University 3 and 4 if there are 5 or 6 universities
      if (universityDetails.length === 5 || universityDetails.length === 6) {
        universityPositions[2] = { x: 80, y: 630 }; // Adjusted position for University 3
        universityPositions[3] = { x: 80, y: 300 }; // Adjusted position for University 4
        universityPositions[4] = { x: 80, y: 725 }; // Adjusted position for University 5
        universityPositions[5] = { x: 80, y: 440 }; // Adjusted position for University 6
      }

      for (let i = 0; i < universityDetails.length; i++) {
        const uni = universityDetails[i];
        const position = universityPositions[i];
        const textXPosition = position.x;
        const textYPosition = position.y;

        // Truncate university name if it has more than four words
        let universityName = uni.universityName || "N/A";
        const nameWords = universityName.split(" ");
        if (nameWords.length > 4) {
          universityName = nameWords.slice(0, 4).join(" ") + "...";
        }

        // Determine x-position based on the number of words in the university name
        const adjustedXPosition =
          nameWords.length === 2 ? textXPosition + 140 : textXPosition + 70;

        // Check if we need to move to a new page
        if (i % 2 === 0 && i !== 0) {
          currentPageIndex++;
          if (pdfDoc.getPageCount() > currentPageIndex) {
            currentPage = pdfDoc.getPage(currentPageIndex);
          } else {
            currentPage = pdfDoc.addPage();
          }
        }

        console.log(`Processing university: ${universityName}`);

        // Draw university name with adjusted x-position
        currentPage.drawText(universityName, {
          x: adjustedXPosition,
          y: textYPosition + 50,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        });

        // Draw other university details with default positioning
        currentPage.drawText(`» Established : ${uni.estYear || "N/A"}`, {
          x: textXPosition,
          y: textYPosition - 20,
          size: 12,
        });
        currentPage.drawText(`» Approved by : ${uni.approvedBy || "N/A"}`, {
          x: textXPosition,
          y: textYPosition - 50,
          size: 12,
        });
        currentPage.drawText(`» Type : ${uni.type || "N/A"}`, {
          x: textXPosition,
          y: textYPosition - 80,
          size: 12,
        });
        currentPage.drawText(`» NAAC Grade : ${uni.naacGrade || "N/A"}`, {
          x: textXPosition,
          y: textYPosition - 110,
          size: 12,
        });
        currentPage.drawText(`»  Ranked by : ${uni.rankedBy || "N/A"}`, {
          x: textXPosition,
          y: textYPosition - 140,
          size: 12,
        });

        // Embed and draw image if it exists
        if (uni.imagePath) {
          const imagePath = path.resolve(
            __dirname,
            "../uploads",
            path.basename(uni.imagePath)
          );
          if (fs.existsSync(imagePath)) {
            try {
              const imageBytes = await getImageBytes(imagePath);
              let image;
              if (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg")) {
                image = await pdfDoc.embedJpg(imageBytes);
              } else {
                image = await pdfDoc.embedPng(imageBytes);
              }
              currentPage.drawImage(image, {
                x: textXPosition + 332,
                y: textYPosition - 130,
                width: 100,
                height: 100,
              });
            } catch (embedError) {
              console.error(
                `Error embedding image for ${universityName}:`,
                embedError
              );
            }
          }
        }
      }

    pdfDoc.setTitle("University Recommendations");
    pdfDoc.setAuthor("Indian Edu Hub");
    pdfDoc.setSubject("Personalized University and Career Options");
    pdfDoc.setKeywords(["University Recommendations", "Career Options"]);
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());

    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });


      // Define file path and generate a unique filename if needed
      const pdfDir = path.join(__dirname, "../public/pdf");
      const baseFilename = `${formData.name.replace(/ /g, "_")}_Report`;
      let pdfFilename = `${baseFilename}.pdf`;
      let pdfFilePath = path.join(pdfDir, pdfFilename);
      let counter = 1;

      // Check if file exists, and if so, create a new filename with a counter
      while (fs.existsSync(pdfFilePath)) {
        pdfFilename = `${baseFilename}_${counter}.pdf`;
        pdfFilePath = path.join(pdfDir, pdfFilename);
        counter++;
      }

      const pdfUrl = `https://crm.indianeduhub.in/pdf/${pdfFilename}`;

      // Ensure PDF directory exists
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      // Save PDF file and handle potential errors
      try {
        fs.writeFileSync(pdfFilePath, pdfBytes);
        console.log("PDF generated and saved successfully:", pdfFilePath);
      } catch (fileError) {
        console.error("Error saving PDF file:", fileError);
        return res.status(500).json({
          success: false,
          message: "Failed to save the PDF file.",
        });
      }

      // Update document in dummy_COLLECTION with the PDF link
      const clientsCollection = database.collection("dummy");
      await clientsCollection.updateOne(
        { _id: documentId },
        { $set: { pdfLink: pdfUrl } }
      );

      // Send the PDF as a downloadable attachment in the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${pdfFilename}"`
      );
      res.send(Buffer.from(pdfBytes));
    } else {
      console.log("No matching document found or no university details.");
      res.status(404).json({
        success: false,
        message: "No matching document found.",
      });
    }
  } catch (error) {
    console.error("Error occurred while processing the form submission:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the form submission.",
    });
  }
});


// GET route for engine data
router.get("/engine", async (req, res) => {
  try {
    const database = getDb();
    const engineCollection = database.collection(collection.ENGINE_COLLECTION);
    const engineData = await engineCollection.find().toArray();
    res.render("user/engine-data", { layout: false, engineData });
  } catch (error) {
    console.error("Error fetching engine data:", error);
    res.status(500).send("An error occurred while fetching engine data.");
  }
});

router.post(
  "/submitUniversityForm",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        universityName,
        estYear,
        approvedBy,
        type,
        naacGrade,
        rankedBy,
        rankingNum,
        courses, // Assume `courses` is directly an object/array
      } = req.body;

      // Construct document to insert
      const universityData = {
        universityName,
        estYear,
        approvedBy,
        type,
        naacGrade,
        rankedBy,
        rankingNum,
        courses: Array.isArray(courses) ? courses : JSON.parse(courses), // Use courses directly if it's already an object or array
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add image if uploaded
      if (req.file) {
        universityData.imagePath = req.file.path;
      }

      // Insert to MongoDB
      const database = getDb();
      const engineCollection = database.collection(
        collection.ENGINE_COLLECTION
      );
      const result = await engineCollection.insertOne(universityData);

      res.json({
        success: result.acknowledged,
        message: result.acknowledged
          ? "Form submitted successfully"
          : "Failed to submit form",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error: " + error.message,
      });
    }
  }
);

router.get("/editUniversity", async (req, res) => {
  try {
    const universityId = req.query.id;
    const database = getDb();
    const engineCollection = database.collection(collection.ENGINE_COLLECTION);

    // Fetch the university data by ID
    const universityData = await engineCollection.findOne({
      _id: new ObjectId(universityId),
    });

    if (!universityData) {
      return res.status(404).send("University not found");
    }

    res.render("user/edit-university", {
      layout: false,
      universityData,
    });
  } catch (error) {
    console.error("Error loading edit page:", error);
    res.status(500).send("An error occurred while loading the edit page.");
  }
});

router.post("/updateUniversity", upload.single("image"), async (req, res) => {
  try {
    const {
      universityId,
      universityName,
      estYear,
      approvedBy,
      type,
      naacGrade,
      rankedBy,
      rankingNum,
      courses, // Make sure to properly parse if needed, as in the original example
    } = req.body;

    const updateData = {
      universityName,
      estYear,
      approvedBy,
      type,
      naacGrade,
      rankedBy,
      rankingNum,
      courses: Array.isArray(courses) ? courses : JSON.parse(courses),
      updatedAt: new Date(),
    };

    // Add image if uploaded
    if (req.file) {
      updateData.imagePath = req.file.path;
    }

    const database = getDb();
    const engineCollection = database.collection(collection.ENGINE_COLLECTION);

    // Update the document
    const result = await engineCollection.updateOne(
      { _id: new ObjectId(universityId) },
      { $set: updateData }
    );

    res.json({
      success: result.modifiedCount > 0,
      message:
        result.modifiedCount > 0
          ? "University updated successfully"
          : "No changes made to the university",
    });
  } catch (error) {
    console.error("Error updating university:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
});

module.exports = router;