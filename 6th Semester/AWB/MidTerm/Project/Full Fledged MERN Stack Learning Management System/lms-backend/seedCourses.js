const mongoose = require("mongoose");
const Course = require("./models/Course.model");
const User = require("./models/User.model");

const seedCourses = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    const conn = await mongoose.connect("mongodb://localhost:27017/LMS_Final_Project");
    console.log("✅ MongoDB connected successfully");
    console.log(`Connected to: ${conn.connection.host}`);

    // Get instructors (create if they don't exist)
    const instructors = [
      {
        email: "ahmed@lms.com",
        name: "Ahmed Ali",
        password: "password123",
        role: "instructor",
      },
      {
        email: "ali@lms.com",
        name: "Ali Khan",
        password: "password123",
        role: "instructor",
      },
      {
        email: "sara@lms.com",
        name: "Sara Ahmed",
        password: "password123",
        role: "instructor",
      },
    ];

    console.log("👥 Creating/Finding instructors...");
    const createdInstructors = [];

    for (const instructor of instructors) {
      let user = await User.findOne({ email: instructor.email });
      if (!user) {
        user = await User.create(instructor);
        console.log(`  ✅ Created instructor: ${instructor.name}`);
      } else {
        console.log(`  ℹ️  Found instructor: ${instructor.name}`);
      }
      createdInstructors.push(user);
    }

    // Sample courses
    const sampleCourses = [
      {
        title: "Node.js Complete Course",
        description: "Learn Node.js from scratch and build production-ready applications",
        category: "Programming",
        price: 40,
        instructor: createdInstructors[0]._id,
      },
      {
        title: "React for Beginners",
        description: "Master React.js fundamentals and build interactive web applications",
        category: "Programming",
        price: 50,
        instructor: createdInstructors[1]._id,
      },
      {
        title: "JavaScript Mastery",
        description: "Complete JavaScript tutorial covering ES6+ and advanced concepts",
        category: "Programming",
        price: 35,
        instructor: createdInstructors[2]._id,
      },
    ];

    // Clear existing courses
    console.log("🗑️  Clearing existing courses...");
    await Course.deleteMany({});

    // Insert new courses
    console.log("📚 Creating sample courses...");
    const courses = await Course.insertMany(sampleCourses);
    console.log(`\n✅ ${courses.length} sample courses created successfully!\n`);

    console.log("Sample courses:");
    courses.forEach((course) => {
      console.log(
        `  • ${course.title} ($${course.price}) - ID: ${course._id}`
      );
    });

    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding courses:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedCourses();
