# AI-Powered Expense Splitter - Startup Checklist

## Database Setup
1. [ ] MySQL Server is running on localhost:3306
2. [ ] Database `expense_splitter` is created
3. [ ] Execute schema.sql to create all tables (Users, Groups, GroupMembers, Expenses, Settlements)
4. [ ] Update DatabaseConnection.java with correct MySQL credentials:
   - DB_USER (default: "root")
   - DB_PASS (your MySQL password)

## Maven Dependencies
5. [ ] Weka 3.8.6 dependency is in pom.xml:
   ```xml
   <dependency>
       <groupId>nz.ac.waikato.cms.weka</groupId>
       <artifactId>weka-stable</artifactId>
       <version>3.8.6</version>
   </dependency>
   ```
6. [ ] MySQL Connector/J dependency is in pom.xml:
   ```xml
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
       <version>8.0.33</version>
   </dependency>
   ```
7. [ ] Run `mvn clean install` to download all dependencies

## Resource Files
8. [ ] categories.arff file exists at: src/main/resources/com/expensesplitter/data/categories.arff
9. [ ] categories.arff contains training data for MLCategoryPredictor
10. [ ] Verify categories.arff has at least 30+ training examples

## Code Verification
11. [ ] All screens use pure JavaFX (no FXML files)
12. [ ] MainApp.java uses LoginView (not LoginScreen)
13. [ ] LoginView.java navigates to DashboardScreen (not DashboardView)
14. [ ] DashboardScreen.java uses ScreenNavigator for logout
15. [ ] DashboardScreen.java navigates to GroupScreen for Add Expense and Settlements
16. [ ] All CSS classes replaced with inline setStyle() calls
17. [ ] StyleConstants.java exists and has all required style constants

## Navigation Flow Test
18. [ ] MainApp.start() creates LoginView and sets it as scene root
19. [ ] LoginView successfully validates email and password
20. [ ] LoginView successfully navigates to DashboardScreen on successful login
21. [ ] RegisterView successfully creates user and navigates to LoginView
22. [ ] DashboardScreen sidebar buttons navigate to correct screens
23. [ ] DashboardScreen logout clears session and navigates to LoginView
24. [ ] GroupScreen successfully loads user's groups
25. [ ] AddExpenseScreen requires Group parameter (accessed via GroupScreen)
26. [ ] SettlementScreen requires Group parameter (accessed via GroupScreen)

## Database Connection Test
27. [ ] DatabaseConnection.getInstance() successfully connects
28. [ ] UserDAO.getUserByEmail() returns valid User
29. [ ] UserDAO.createUser() successfully inserts new user
30. [ ] GroupDAO.getGroupsByUser() returns user's groups
31. [ ] ExpenseDAO.getExpensesByGroup() returns group expenses

## AI Modules Test
32. [ ] MLCategoryPredictor.loadModel() successfully loads categories.arff
33. [ ] MLCategoryPredictor.predictCategory() returns valid category
34. [ ] SettlementEngine.calculateNetBalances() returns valid balances
35. [ ] SettlementEngine.calculateSettlements() returns valid settlements

## Final Checks
36. [ ] No compilation errors in IDE
37. [ ] No runtime exceptions on startup
38. [ ] Application window opens with correct title
39. [ ] Login screen displays correctly with inline styles
40. [ ] All navigation buttons are responsive

## Run Application
41. [ ] Run MainApp.main() or use Maven: `mvn javafx:run`
42. [ ] Test login with existing user credentials
43. [ ] Test registration with new user
44. [ ] Test navigation between all screens
45. [ ] Test logout functionality
