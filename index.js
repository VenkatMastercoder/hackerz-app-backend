const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { generateMultipleUniqueIds } = require("./generateUniqueId.js");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API HACKERZ APP WORKING");
});

// ✅ GET API to fetch all users
app.get("/v1/app/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res
      .status(200)
      .json({
        success: true,
        message: "Users retrieved successfully",
        data: {
          users: users,
          meta: {
            users: users.length
          }
        },
      });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/v1/app/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if admin exists
    let admin = await prisma.adminUser.findUnique({
      where: {
        admin_email: email,
      },
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email address." });
    }

    // Update admin's last login time
    await prisma.adminUser.update({
      where: {
        admin_email: email,
      },
      data: {
        last_login: new Date(),
      },
    });

    // Respond with admin details
    return res.status(200).json({
      message: "Login successful.",
      admin: {
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    return res.status(500).json({ message: "An error occurred during login." });
  }
});

app.post("/v1/app/generate-ids", async (req, res) => {
  const { count = 250, length = 4 } = req.body; // Defaults: 250 IDs, 4 characters long

  if (count > 1000) {
    return res.status(400).json({ message: "Cannot generate more than 1000 IDs at once." });
  }

  try {
    const uniqueIds = await generateMultipleUniqueIds(count, length);
    return res.status(200).json({
      message: "Unique IDs generated successfully.",
      uniqueIds,
    });
  } catch (error) {
    console.error("❌ Error generating unique IDs:", error);
    return res.status(500).json({ message: "An error occurred while generating IDs." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});