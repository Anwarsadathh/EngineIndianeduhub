// Load environment variables
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoStore = require("connect-mongo");
var flash = require("express-flash");
var exphbs = require("express-handlebars"); // Import Handlebars
var db = require("./config/connection"); // MongoDB connection

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");

var app = express();

const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "user-layout",
  layoutsDir: path.join(__dirname, "views/layout"),
  partialsDir: path.join(__dirname, "views/partials"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// Register the json helper
hbs.handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

// Updated countUniversities helper to handle arrays with comma-separated universities
hbs.handlebars.registerHelper('countUniversities', function (value) {
  if (Array.isArray(value)) {
    // For each array element, split by commas, filter out empty values, and count all universities
    return value.reduce((total, item) => {
      return total + item.split(',').filter(university => university.trim() !== '').length;
    }, 0);
  } else if (typeof value === 'string') {
    // If it's a string, split by commas and count the items
    return value.split(',').filter(item => item.trim() !== '').length;
  } else {
    console.error("Unexpected data type:", value); // Log the type if it's neither string nor array
    return 0;
  }
});

// Register the increment helper
hbs.handlebars.registerHelper("increment", function (value) {
  return parseInt(value) + 1;
});

app.engine("hbs", hbs.engine); // Register Handlebars engine
app.set("views", path.join(__dirname, "views")); // Specify views directory
app.set("view engine", "hbs"); // Set view engine to Handlebars

db.connectToServer(function (err) {
  if (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the app if the database connection fails
  } else {
    console.log("Database connected successfully");

    // Start your server or set up routes only after the DB is connected
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});


// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads')); // Serve the upload directory statically

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Fallback if environment variable is missing
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      client: db.getClient(), // Use getClient() to pass the MongoClient instance
      dbName: "engineind", // Your database name
      collectionName: "sessions", // The collection to store session data
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);


// Flash middleware
app.use(flash());

// Routes
app.use("/", usersRouter);
app.use("/admin", adminRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
