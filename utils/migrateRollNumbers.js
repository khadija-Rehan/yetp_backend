const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Migration script to assign roll numbers to existing users
 * Run this script if you have existing users without roll numbers
 */
async function migrateRollNumbers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Find all users without roll numbers
    const usersWithoutRollNumbers = await User.find({ 
      $or: [
        { rollNumber: { $exists: false } },
        { rollNumber: null },
        { rollNumber: "" }
      ]
    });

    console.log(`Found ${usersWithoutRollNumbers.length} users without roll numbers`);

    if (usersWithoutRollNumbers.length === 0) {
      console.log('All users already have roll numbers. Migration not needed.');
      return;
    }

    // Assign roll numbers to each user
    for (const user of usersWithoutRollNumbers) {
      const rollNumber = await User.generateRollNumber();
      user.rollNumber = rollNumber;
      await user.save();
      console.log(`Assigned roll number ${rollNumber} to user ${user.email}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateRollNumbers();
}

module.exports = migrateRollNumbers; 