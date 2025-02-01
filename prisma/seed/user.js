// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Adjust the path if your JSON file is located elsewhere
  const dataPath = path.join(__dirname, './data.json');
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Loop through each user in the JSON and create a record in the database
  for (const user of jsonData.users) {
    await prisma.user.create({
      data: {
        // Use the provided user_id instead of generating a new one
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        department: user.department,
        mobile_number: user.mobile_number,
        // Assuming the gender string from JSON matches the enum values ("MALE", "FEMALE", or "NPS")
        gender: user.gender,
        year: user.year,
        college: user.college,
        role: user.role,
        // Map JSON field is_registration_completed to is_registration_online in the model
        is_registration_online: user.is_registration_completed,
        // The fields is_registration_onspot and is_attended are not provided in the JSON,
        // so they will use their default values (false)
        created_at: new Date(user.createdAt),
        updated_at: new Date(user.updatedAt),
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seeding completed.');
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
