const express = require("express");
const { PrismaClient } = require("@prisma/client");

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
          users: users
        },
      });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});