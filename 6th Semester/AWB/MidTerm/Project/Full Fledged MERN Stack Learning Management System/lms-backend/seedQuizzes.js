const mongoose = require('mongoose');
const { Quiz } = require('./models/Quiz.model');
const Course = require('./models/Course.model');

const sampleQuizzes = [
  {
    title: 'React Fundamentals Quiz',
    description: 'Test your knowledge of React basics',
    questions: [
      {
        question: 'What is React?',
        options: [
          'A JavaScript library for building user interfaces',
          'A programming language',
          'A database',
          'A web server'
        ],
        correctIndex: 0,
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces.',
        points: 1
      },
      {
        question: 'What is JSX?',
        options: [
          'A JavaScript extension',
          'A syntax extension for JavaScript',
          'A new programming language',
          'A CSS framework'
        ],
        correctIndex: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.',
        points: 1
      },
      {
        question: 'What is a React component?',
        options: [
          'A function or class that returns HTML',
          'A database table',
          'A CSS file',
          'A JavaScript variable'
        ],
        correctIndex: 0,
        explanation: 'A React component is a reusable piece of UI that can be a function or class returning JSX.',
        points: 1
      },
      {
        question: 'What hook is used for state management in functional components?',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctIndex: 1,
        explanation: 'useState is the primary hook for managing state in functional components.',
        points: 1
      },
      {
        question: 'What is the virtual DOM?',
        options: [
          'A copy of the real DOM kept in memory',
          'A new browser API',
          'A CSS framework',
          'A database'
        ],
        correctIndex: 0,
        explanation: 'The virtual DOM is a lightweight copy of the actual DOM that React uses for efficient updates.',
        points: 1
      }
    ],
    timeLimitMinutes: 10,
    passingScore: 70,
    maxAttempts: 3,
    isPublished: true
  },
  {
    title: 'Database Basics Quiz',
    description: 'Test your understanding of database concepts',
    questions: [
      {
        question: 'What does SQL stand for?',
        options: [
          'Structured Query Language',
          'Simple Question Language',
          'Standard Query Logic',
          'System Query Language'
        ],
        correctIndex: 0,
        explanation: 'SQL stands for Structured Query Language, used for managing relational databases.',
        points: 1
      },
      {
        question: 'What is a primary key?',
        options: [
          'A unique identifier for a record',
          'The first column in a table',
          'A password',
          'A foreign key'
        ],
        correctIndex: 0,
        explanation: 'A primary key is a unique identifier for each record in a database table.',
        points: 1
      },
      {
        question: 'What is normalization?',
        options: [
          'Making data normal',
          'Organizing data to reduce redundancy',
          'Deleting data',
          'Backing up data'
        ],
        correctIndex: 1,
        explanation: 'Normalization is the process of organizing data to minimize redundancy and dependency.',
        points: 1
      },
      {
        question: 'What is a JOIN in SQL?',
        options: [
          'Combining rows from two or more tables',
          'Adding a new table',
          'Deleting records',
          'Creating an index'
        ],
        correctIndex: 0,
        explanation: 'A JOIN clause is used to combine rows from two or more tables based on a related column.',
        points: 1
      },
      {
        question: 'What is an index in a database?',
        options: [
          'A data structure that improves query speed',
          'The first row of a table',
          'A backup file',
          'A user account'
        ],
        correctIndex: 0,
        explanation: 'An index is a data structure that improves the speed of data retrieval operations.',
        points: 1
      }
    ],
    timeLimitMinutes: 15,
    passingScore: 60,
    maxAttempts: 3,
    isPublished: true
  }
];

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/LMS_Final_Project');
    console.log('✓ Connected to database\n');

    // Get courses
    const courses = await Course.find();
    if (courses.length === 0) {
      console.log('❌ No courses found. Please create courses first.');
      process.exit(1);
    }

    console.log(`Found ${courses.length} courses:\n`);
    courses.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title} (ID: ${c._id})`);
    });
    console.log('');

    // Delete existing quizzes
    await Quiz.deleteMany({});
    console.log('✓ Cleared existing quizzes\n');

    // Create quizzes
    const createdQuizzes = [];
    
    // Assign first quiz to first course (React)
    if (courses[0]) {
      const quiz1 = await Quiz.create({
        ...sampleQuizzes[0],
        course: courses[0]._id
      });
      createdQuizzes.push(quiz1);
      console.log(`✓ Created: ${quiz1.title} for ${courses[0].title}`);
    }

    // Assign second quiz to second course (Database) if it exists
    if (courses[1]) {
      const quiz2 = await Quiz.create({
        ...sampleQuizzes[1],
        course: courses[1]._id
      });
      createdQuizzes.push(quiz2);
      console.log(`✓ Created: ${quiz2.title} for ${courses[1].title}`);
    }

    console.log(`\n✅ Successfully created ${createdQuizzes.length} quizzes!`);
    console.log('\nYou can now:');
    console.log('1. Login as a student');
    console.log('2. Enroll in a course');
    console.log('3. Take the quiz from the course details page');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
})();
