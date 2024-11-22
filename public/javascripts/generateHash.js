const bcrypt = require("bcrypt");

async function generateHashes() {
  try {
    // Your specific passwords
    const adminPassword = "$2b$10$AgA0e0bCkKTmfYYX7PcsyOpMi2PYE/3PrHVwzAcA/oco0vlv79iF2";
    const dataPassword = "$2bA/oco0vlv79iF2";

    // Generate hashes
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const dataHash = await bcrypt.hash(dataPassword, 10);

    console.log("=== ADMIN CREDENTIALS ===");
    console.log(`Password: ${adminPassword}`);
    console.log(`Hash: ${adminHash}`);
    console.log(
      "Verification:",
      await bcrypt.compare(adminPassword, adminHash)
    );

    console.log("\n=== DATA MANAGER CREDENTIALS ===");
    console.log(`Password: ${dataPassword}`);
    console.log(`Hash: ${dataHash}`);
    console.log("Verification:", await bcrypt.compare(dataPassword, dataHash));

    console.log("\n=== ENV FILE FORMAT ===");
    console.log(`ADMIN_EMAIL=admin@example.com`);
    console.log(`ADMIN_PASSWORD=${adminHash}`);
    console.log(`DATA_EMAIL=data@example.com`);
    console.log(`DATA_PASSWORD=${dataHash}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

generateHashes();
