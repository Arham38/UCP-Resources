# AI-Powered Expense Splitter

**Student:** Muhammad Arham
**Roll No:** L1F23BSSE0372
**Course:** Software Construction & Development — 6th Semester
**GitHub:** https://github.com/marhambhatti

---

## Project Description
A JavaFX desktop application that lets groups of users record, split, and settle
shared expenses intelligently. Features AI-powered category prediction, smart debt
settlement using graph algorithms, spending forecasts, and anomaly detection.

---

## Features
- User registration & login with SHA-256 password hashing
- Create and manage expense groups with multiple members
- Add expenses with 3 split modes: Equal, Percentage, Custom
- AI category auto-prediction using Weka Naive Bayes
- Smart debt settlement via Minimize Cash Flow algorithm
- Monthly spending forecast using Weka Linear Regression
- Anomaly detection alerts for unusual spending patterns
- Visual analytics: Pie chart (categories) + Bar chart (monthly)
- Search expenses by keyword, date range, category, or member
- Full CRUD operations for Users, Groups, Expenses, Settlements

---

## Technologies
| Layer | Technology |
|-------|-----------|
| GUI | JavaFX + FXML |
| Backend | Core Java, OOP |
| Database | MySQL + JDBC |
| ML | Weka 3.8.6 |
| IDE | IntelliJ IDEA |
| Build | Maven |
| Version Control | GitHub |

---

## Installation Steps
1. Clone the repository: `git clone https://github.com/marhambhatti/ai-expense-splitter`
2. Open in IntelliJ IDEA
3. Run `database/schema.sql` in MySQL Workbench to create the database
4. Update `DB_PASS` in `DatabaseConnection.java` with your MySQL password
5. Run `mvn clean install` to download dependencies
6. Run `MainApp.java` to launch the application

---

## Package Structure
```
src/main/java/com/expensesplitter/
├── models/       User, Group, Expense, Settlement, SplitStrategy (+ subclasses)
├── dao/          UserDAO, GroupDAO, ExpenseDAO, SettlementDAO
├── controllers/  JavaFX screen controllers
├── ai/           SettlementEngine, MLCategoryPredictor, SpendingForecaster, AnomalyDetector
├── utils/        DatabaseConnection, InputValidator, PasswordHasher, SessionManager, ChartHelper
└── views/        MainApp (entry point)
```

---

## Screenshots
*(Add screenshots here after UI is built)*

---

## Future Enhancements
- Mobile companion app
- Email/SMS settlement reminders
- PDF expense report export
- Multi-currency support
- Cloud database sync
