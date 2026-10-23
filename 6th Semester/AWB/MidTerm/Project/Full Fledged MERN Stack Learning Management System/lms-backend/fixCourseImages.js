const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/LMS_Final_Project');
    console.log('Connected to database');

    // Get all courses
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses`);

    // Get all actual image files in uploads/courses
    const uploadsDir = path.join(__dirname, 'uploads', 'courses');
    const actualFiles = fs.readdirSync(uploadsDir);
    console.log('\nActual files in uploads/courses:');
    actualFiles.forEach(file => console.log(`  - ${file}`));

    // Check each course
    console.log('\n--- Course Image Status ---');
    for (const course of courses) {
      console.log(`\nCourse: ${course.title}`);
      console.log(`  DB Image Path: ${course.image}`);
      
      if (course.image) {
        const filename = path.basename(course.image);
        const exists = actualFiles.includes(filename);
        console.log(`  File exists: ${exists ? '✓' : '✗'}`);
        
        if (!exists) {
          console.log(`  ⚠️  Missing file: ${filename}`);
          // Set to first available image as fallback
          if (actualFiles.length > 0) {
            const fallbackImage = `/uploads/courses/${actualFiles[0]}`;
            console.log(`  → Setting fallback image: ${fallbackImage}`);
            await Course.findByIdAndUpdate(course._id, { image: fallbackImage });
          }
        }
      } else {
        console.log(`  ⚠️  No image set in database`);
        // Set to first available image
        if (actualFiles.length > 0) {
          const fallbackImage = `/uploads/courses/${actualFiles[0]}`;
          console.log(`  → Setting fallback image: ${fallbackImage}`);
          await Course.findByIdAndUpdate(course._id, { image: fallbackImage });
        }
      }
    }

    console.log('\n✓ Image paths updated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
})();
