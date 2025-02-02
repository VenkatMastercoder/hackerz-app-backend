const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateBase62Id(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generateUniqueBase62Id(length) {
  let id = '';
  let isUnique = false;

  while (!isUnique) {
    id = generateBase62Id(length);

    try {
      await prisma.generatedId.create({
        data: {
          value: id,
        },
      });
      isUnique = true; // If insertion succeeds, the ID is unique
    } catch (error) {
      continue; // If insertion fails, generate a new ID
    }
  }

  return id;
}

async function generateMultipleUniqueIds(count, length) {
  const ids = [];
  for (let i = 0; i < count; i++) {
    const id = await generateUniqueBase62Id(length);
    ids.push(id);
  }
  return ids;
}

module.exports = {
  generateMultipleUniqueIds,
};
