const mongoose = require('mongoose');
const { Quiz } = require('./models/Quiz.model');
const Course = require('./models/Course.model');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/LMS_Final_Project');
    console.log('Connected to database\n');
    
    const quizzes = await Quiz.find().populate('course', 'title');
    console.log(`Found ${quizzes.length} quizzes:\n`);
    
    if (quizzes.length === 0) {
      console.log('❌ No quizzes found in database');
      console.log('\nTo create a quiz:');
      console.log('1. Login as instructor');
      console.log('2. Create a quiz for your course');
      console.log('3. Or run a seed script to add sample quizzes');
    } else {
      quizzes.forEach((quiz, idx) => {
        console.log(`${idx + 1}. ${quiz.title}`);
        console.log(`   Course: ${quiz.course?.title || 'Unknown'}`);
        console.log(`   Questions: ${quiz.questions?.length || 0}`);
        console.log(`   Published: ${quiz.isPublished ? 'Yes' : 'No'}`);
        console.log(`   Passing Score: ${quiz.passingScore}%`);
        console.log(`   Max Attempts: ${quiz.maxAttempts}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
})();
