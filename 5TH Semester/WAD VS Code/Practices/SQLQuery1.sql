
CREATE DATABASE stu;
GO

USE stu;
GO

CREATE TABLE students (
    student_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    age INT NOT NULL,
    department NVARCHAR(50) NOT NULL,
    email NVARCHAR(100),
    phone NVARCHAR(20),
    address NVARCHAR(200),
    enrollment_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'Active'
);
GO

CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    department NVARCHAR(50) NOT NULL,
    qualification NVARCHAR(100),
    experience_years INT DEFAULT 0,
    hire_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'Active'
);
GO

CREATE TABLE courses (
    course_id INT PRIMARY KEY IDENTITY(1,1),
    course_code NVARCHAR(20) UNIQUE NOT NULL,
    course_name NVARCHAR(100) NOT NULL,
    department NVARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    description NVARCHAR(500),
    teacher_id INT FOREIGN KEY REFERENCES teachers(teacher_id),
    status NVARCHAR(20) DEFAULT 'Active'
);
GO

CREATE TABLE student_courses (
    enrollment_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES students(student_id),
    course_id INT FOREIGN KEY REFERENCES courses(course_id),
    enrollment_date DATETIME DEFAULT GETDATE(),
    grade NVARCHAR(5),
    status NVARCHAR(20) DEFAULT 'Enrolled'
);
GO

CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES students(student_id),
    course_id INT FOREIGN KEY REFERENCES courses(course_id),
    date DATE NOT NULL,
    status NVARCHAR(10) NOT NULL,
    marked_by INT FOREIGN KEY REFERENCES teachers(teacher_id),
    marked_time DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE exams (
    exam_id INT PRIMARY KEY IDENTITY(1,1),
    course_id INT FOREIGN KEY REFERENCES courses(course_id),
    exam_name NVARCHAR(100) NOT NULL,
    exam_date DATETIME NOT NULL,
    total_marks INT NOT NULL,
    duration_minutes INT NOT NULL,
    exam_type NVARCHAR(50) NOT NULL,
    status NVARCHAR(20) DEFAULT 'Scheduled'
);
GO

CREATE TABLE exam_results (
    result_id INT PRIMARY KEY IDENTITY(1,1),
    exam_id INT FOREIGN KEY REFERENCES exams(exam_id),
    student_id INT FOREIGN KEY REFERENCES students(student_id),
    marks_obtained INT NOT NULL,
    grade NVARCHAR(5),
    remarks NVARCHAR(200),
    evaluated_by INT FOREIGN KEY REFERENCES teachers(teacher_id),
    evaluation_date DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(100) NOT NULL,
    role NVARCHAR(20) NOT NULL,
    email NVARCHAR(100),
    status NVARCHAR(20) DEFAULT 'Active',
    created_date DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO users (username, password, role, email) VALUES 
('admin', 'admin123', 'Admin', 'admin@sms.com'),
('teacher', 'teacher123', 'Teacher', 'teacher@sms.com'),
('student', 'student123', 'Student', 'student@sms.com');
GO

INSERT INTO teachers (name, email, phone, department, qualification, experience_years) VALUES 
('Dr. Muhammad Ali', 'ali@sms.com', '03001234567', 'Computer Science', 'PhD in CS', 15),
('Prof. Sarah Khan', 'sarah@sms.com', '03112345678', 'Software Engineering', 'MS in SE', 10),
('Mr. Ahmed Hassan', 'ahmed@sms.com', '03223456789', 'Information Technology', 'MIT', 8);
GO

INSERT INTO courses (course_code, course_name, department, credits, description, teacher_id) VALUES 
('CS101', 'Introduction to Programming', 'Computer Science', 3, 'Basic programming concepts', 1),
('SE201', 'Software Engineering', 'Software Engineering', 4, 'Software development lifecycle', 2),
('IT301', 'Database Systems', 'Information Technology', 3, 'Database design and management', 3);
GO

SELECT 'Database schema created successfully!' as message;
select*from students;