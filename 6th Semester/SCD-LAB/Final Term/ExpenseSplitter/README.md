# Expense Splitter Application

## Student Info
- **Student Name:** [Insert Your Name Here]
- **Roll Number:** [Insert Your Roll Number Here]
- **Course:** Software Construction & Development

## Project Description
A Java-based desktop application to manage and split shared expenses among groups of people. Users can register, create groups, log expenses, and automatically calculate who owes whom.

## Features
- User Authentication (Login & Register)
- Group Management
- Add / Edit / Delete Expenses
- Equal, Custom & Percentage Split
- Balance Dashboard
- Settle Up
- Search & Filter by date, category, person

## Technologies Used
- Java (Core + OOP)
- JavaFX / Java Swing (GUI)
- MySQL (Database)
- JDBC (Database Connectivity)
- IntelliJ IDEA (IDE)

## Installation Steps
1. Clone the repository
2. Open project in IntelliJ IDEA
3. Add `mysql-connector-j-8.x.x.jar` to project libraries (File → Project Structure → Libraries → + → JAR). Download from https://dev.mysql.com/downloads/connector/j/
4. Import `database/expense_splitter_db.sql` into your MySQL server
5. Update DB credentials in `src/com/expensesplitter/dao/DatabaseConnection.java`
6. Run `com.expensesplitter.Main`

## Screenshots
See `/screenshots` folder.

## Future Enhancements
- Export reports to PDF/CSV
- Email notifications for pending settlements
- Mobile application version
