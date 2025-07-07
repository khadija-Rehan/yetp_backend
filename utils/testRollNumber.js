const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Test script to verify roll number generation
 */
async function testRollNumberGeneration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Test generating multiple roll numbers
    console.log('Testing roll number generation...');
    
    const rollNumbers = [];
    for (let i = 0; i < 5; i++) {
      const rollNumber = await User.generateRollNumber();
      rollNumbers.push(rollNumber);
      console.log(`Generated roll number ${i + 1}: ${rollNumber}`);
    }

    // Check for duplicates
    const uniqueRollNumbers = new Set(rollNumbers);
    if (uniqueRollNumbers.size === rollNumbers.length) {
      console.log('✅ All generated roll numbers are unique!');
    } else {
      console.log('❌ Duplicate roll numbers found!');
    }

    // Check format
    const formatRegex = /^HM-\d{4}-\d{4}$/;
    const validFormat = rollNumbers.every(rn => formatRegex.test(rn));
    if (validFormat) {
      console.log('✅ All roll numbers follow the correct format (HM-YYYY-XXXX)!');
    } else {
      console.log('❌ Some roll numbers don\'t follow the correct format!');
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testRollNumberGeneration();
}

module.exports = testRollNumberGeneration; 