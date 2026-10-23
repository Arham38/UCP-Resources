# UI/UX Verification Checklist

## LoginView.java
- [ ] Login card is centered on all window sizes
- [ ] Card uses CARD_STYLE with dropshadow
- [ ] App icon emoji + title Label (HEADING_STYLE)
- [ ] Subtitle Label (SUBHEADING_STYLE)
- [ ] TextField uses INPUT_STYLE
- [ ] TextField switches to INPUT_FOCUS_STYLE on focus
- [ ] TextField fills full card width (setMaxWidth(Double.MAX_VALUE))
- [ ] PasswordField uses INPUT_STYLE
- [ ] PasswordField switches to INPUT_FOCUS_STYLE on focus
- [ ] Error label hidden by default (setVisible(false))
- [ ] Error label uses ERROR_LABEL_STYLE
- [ ] Login button uses BTN_PRIMARY_STYLE
- [ ] Login button full card width
- [ ] Login button hover effect (BTN_PRIMARY_HOVER)
- [ ] Register link styled as plain text link
- [ ] Background covers full window (SECONDARY_COLOR)
- [ ] Spacing: 8px for label-field pairs, 16px between groups

## RegisterView.java
- [ ] Register card same style as LoginView (width 440)
- [ ] Title: "Create Account" (HEADING_STYLE)
- [ ] Subtitle: "Join and start splitting expenses" (SUBHEADING_STYLE)
- [ ] All 4 fields use INPUT_STYLE with focus effect
- [ ] Confirm password mismatch shows inline error (not Alert)
- [ ] All fields clear after successful registration
- [ ] Success label shows green message before navigating
- [ ] Success label uses SUCCESS_LABEL_STYLE
- [ ] 1 second delay then auto-navigate to LoginView (PauseTransition)
- [ ] Register button uses BTN_PRIMARY_STYLE
- [ ] Register button full card width
- [ ] Back to Login link below button

## DashboardScreen.java
- [ ] Sidebar fixed width 220, never shrinks
- [ ] Sidebar uses SIDEBAR_STYLE
- [ ] App emoji + name Label white bold 16px
- [ ] All sidebar buttons use SIDEBAR_BTN_STYLE
- [ ] Sidebar button hover uses SIDEBAR_BTN_HOVER
- [ ] Active sidebar button uses SIDEBAR_BTN_ACTIVE
- [ ] Only one button active at a time
- [ ] Active button updates on every navigation click
- [ ] Logout button uses BTN_DANGER_STYLE
- [ ] Logout button at bottom with margin-top auto
- [ ] Top bar uses TOPBAR_STYLE
- [ ] Top bar screen title updates to match current screen
- [ ] Top bar welcome label shows username
- [ ] Center content fills all remaining space (HBox.setHgrow ALWAYS)
- [ ] Logout clears session AND resets active button state
- [ ] Default view shows welcome card when no screen selected

## GroupScreen.java
- [ ] Title "👥 My Groups" (HEADING_STYLE)
- [ ] [+ Create Group] button uses BTN_PRIMARY_STYLE
- [ ] Left panel width 280, CARD_STYLE, margin right 16
- [ ] Left panel ListView fills remaining height
- [ ] ListView items show group name, 14px, padding 10px
- [ ] Selected item has blue highlight
- [ ] Right panel uses CARD_STYLE
- [ ] Right panel fills remaining width
- [ ] Empty state shows "← Select a group to view details"
- [ ] Group selected shows name (HEADING_STYLE)
- [ ] Group selected shows description (SUBHEADING_STYLE)
- [ ] Separator line between details and members
- [ ] Members Label bold 13px
- [ ] [+ Add Member] button on right
- [ ] Member ListView fills space
- [ ] Remove Member button uses BTN_DANGER_STYLE
- [ ] Delete Group button uses BTN_DANGER_STYLE
- [ ] Add/Remove member refreshes both ListViews immediately
- [ ] Delete group removes from left ListView and clears right panel
- [ ] Empty group list shows "No groups yet. Create one!" placeholder

## AddExpenseScreen.java
- [ ] Title "➕ Add New Expense" (HEADING_STYLE)
- [ ] Subtitle "Fill in expense details below" (SUBHEADING_STYLE)
- [ ] Form card uses CARD_STYLE
- [ ] GridPane 2 columns (labels left, inputs right)
- [ ] Group ComboBox fills full width
- [ ] Expense Title TextField uses INPUT_STYLE
- [ ] AI prediction label shows below title (blue italic 12px)
- [ ] AI prediction updates on every keystroke (textProperty listener)
- [ ] Amount TextField uses INPUT_STYLE
- [ ] Amount TextField rejects non-numeric input (addEventFilter)
- [ ] DatePicker fills full width
- [ ] DatePicker defaults to today's date
- [ ] Paid By ComboBox loads group members
- [ ] Category ComboBox auto-filled by AI
- [ ] Split type card uses CARD_STYLE
- [ ] 3 RadioButtons in ToggleGroup (Equal, Percentage, Custom)
- [ ] Dynamic split table appears on Percentage/Custom toggle
- [ ] Dynamic split table shows all group members
- [ ] Cancel button uses BTN_SECONDARY_STYLE
- [ ] Save Expense button uses BTN_PRIMARY_STYLE
- [ ] Save shows success Alert then clears all fields
- [ ] All ComboBox items loaded on screen init
- [ ] Group ComboBox change reloads payer ComboBox and member table

## SearchScreen.java
- [ ] Title "🔍 Search Expenses" (HEADING_STYLE)
- [ ] Filter card uses CARD_STYLE
- [ ] GridPane 2 rows, 4 columns
- [ ] Keyword TextField uses INPUT_STYLE
- [ ] From Date DatePicker fills width
- [ ] To Date DatePicker fills width
- [ ] Category ComboBox fills width
- [ ] Search button uses BTN_PRIMARY_STYLE
- [ ] Clear button uses BTN_SECONDARY_STYLE
- [ ] Buttons aligned right
- [ ] Result count updates after every search
- [ ] Clear button resets ALL filters and clears table
- [ ] Date validation: show error if From > To
- [ ] TableView uses TABLE_STYLE
- [ ] TableView fills remaining height
- [ ] Table columns properly sized
- [ ] Amount column shows "Rs. X,XXX.00" formatted
- [ ] Empty state shows placeholder centered in table
- [ ] Placeholder: "No expenses found. Try different search criteria."

## SettlementScreen.java
- [ ] Title "💸 Settlements" (HEADING_STYLE)
- [ ] Group ComboBox loads all user's groups on init
- [ ] Recalculate button uses BTN_PRIMARY_STYLE
- [ ] Summary card uses HBox of 3 metric cards
- [ ] Metric cards use METRIC_CARD_STYLE
- [ ] Total Debts shows count (large bold blue)
- [ ] Pending Amount shows "Rs. X,XXX" (large bold red)
- [ ] Settled shows count (large bold green)
- [ ] Settlements table uses TABLE_STYLE
- [ ] Table fills height
- [ ] Columns: From, To, Amount, Status, Action
- [ ] Status shows green "✅ Settled" or orange "⏳ Pending"
- [ ] Mark Settled button uses BTN_PRIMARY_STYLE (small)
- [ ] Mark Settled disabled if already settled
- [ ] Already settled rows show disabled button and grayed text
- [ ] Empty state shows "No expenses in this group yet."
- [ ] Recalculate runs SettlementEngine fresh
- [ ] Recalculate saves new settlements
- [ ] Mark Settled updates DB and refreshes table
- [ ] Mark Settled updates summary cards

## AnalyticsScreen.java
- [ ] Title "📈 Analytics" (HEADING_STYLE)
- [ ] Month/Group selectors present
- [ ] Refresh button uses BTN_PRIMARY_STYLE
- [ ] Metric cards use METRIC_CARD_STYLE
- [ ] Metric cards in HBox with spacing 16
- [ ] This Month shows "Rs. X,XXX" (24px bold #4A6FA5)
- [ ] Next Month Forecast shows "Rs. X,XXX" (24px bold #27AE60)
- [ ] 6-Month Average shows "Rs. X,XXX" (24px bold #7F8C8D)
- [ ] Total Groups shows count (24px bold #2C3E50)
- [ ] Metric cards show "Rs. 0" not null/error when no data
- [ ] Charts row uses HBox with spacing 16
- [ ] Left chart card width 50%
- [ ] PieChart title "Spending by Category" (bold 14px)
- [ ] PieChart height 280
- [ ] PieChart legend position BOTTOM
- [ ] PieChart shows "No data available" placeholder when 0 expenses
- [ ] Right chart card width 50%
- [ ] BarChart title "Monthly Spending Trend" (bold 14px)
- [ ] BarChart height 280
- [ ] BarChart X-axis shows short month names (Jan, Feb, Mar...)
- [ ] BarChart shows "No data available" placeholder when 0 expenses
- [ ] Anomaly alert VBox.setVisible(false) by default
- [ ] Anomaly alert HBox CARD_STYLE with red left border (4px)
- [ ] Anomaly alert shows "⚠" emoji (24px)
- [ ] Anomaly alert shows "Spending Anomaly Detected" (bold red 14px)
- [ ] Anomaly alert shows actual message from getAnomalyMessage()
- [ ] Refresh button reloads ALL data including charts and metric cards

## Global UI Standards
- [ ] All screens use pure JavaFX (no FXML)
- [ ] All screens use inline setStyle() (no CSS files)
- [ ] All screens use StyleConstants for consistent styling
- [ ] Font family: Segoe UI / Arial
- [ ] Theme: Professional blue (#4A6FA5) + white + light gray (#F5F7FA)
- [ ] All TextFields have focus border effect
- [ ] All buttons have hover effects
- [ ] All empty states show placeholder messages
- [ ] All success/error messages use correct colors
- [ ] Navigation uses ScreenNavigator with fade transition (150ms)
- [ ] Scene dimensions: 1000x650
- [ ] All screens compile without errors
- [ ] All screens run without runtime exceptions
