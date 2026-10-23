package com.expensesplitter.views;

import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class GroupScreen extends BorderPane {

    /** Fixed height per ListView row — prevents gray skeleton virtual cells */
    private static final double GROUP_ROW_HEIGHT = 36.0;

    /** Group list on the left */
    private ListView<String> groupListView;

    /** Member list on the right */
    private ListView<String> memberListView;

    /** Placeholder when no group is selected */
    private Label placeholderLabel;

    /** Container for group detail content (hidden until selection) */
    private VBox groupDetailsVBox;

    /** Group name heading */
    private Label groupNameLabel;

    /** Group description */
    private Label groupDescLabel;

    /** Inline error message — hidden when empty (fixes red dot artifact) */
    private Label errorLabel;

  /** Add member button */
    private Button addMemberButton;

    /** Remove / delete action row */
    private HBox actionButtons;

    /** DAO for group operations */
    private final GroupDAO groupDAO = new GroupDAO();

    /** DAO for user lookup when adding members */
    private final UserDAO userDAO = new UserDAO();

    /** Map group name → Group for fast lookup on selection */
    private final Map<String, Group> groupMap = new HashMap<>();

    /** Currently selected group with full member list */
    private Group currentGroup;

    /** Logged-in user */
    private final User currentUser = SessionManager.getCurrentUser();

    /**
     * Constructor — builds UI and loads groups from database.
     */
    public GroupScreen() {
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");
        setTop(createTopBar());
        setCenter(createCenterPanel());
        refreshGroupList();
    }

    /**
     * Creates top bar with title and Create Group button.
     *
     * @return top HBox
     */
    private HBox createTopBar() {
        HBox topBar = new HBox(20);
        topBar.setPadding(new Insets(20, 20, 0, 20));
        topBar.setAlignment(Pos.CENTER_LEFT);

        Label titleLabel = new Label("👥 My Groups");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        HBox spacer = new HBox();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button createGroupButton = new Button("+ Create Group");
        createGroupButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        createGroupButton.setOnAction(e -> handleCreateGroup());
        StyleConstants.applyPrimaryHover(createGroupButton);

        topBar.getChildren().addAll(titleLabel, spacer, createGroupButton);
        return topBar;
    }

    /**
     * Creates the split center layout (group list | group details).
     *
     * @return center HBox
     */
    private HBox createCenterPanel() {
        HBox splitPanel = new HBox(16);
        splitPanel.setPadding(new Insets(20));
        splitPanel.setAlignment(Pos.TOP_LEFT);
        splitPanel.getChildren().addAll(createLeftPanel(), createRightPanel());
        return splitPanel;
    }

    /**
     * Creates left panel with group ListView.
     *
     * @return left VBox
     */
    private VBox createLeftPanel() {
        VBox panel = new VBox(10);
        panel.setStyle(StyleConstants.CARD_STYLE);
        panel.setPrefWidth(280);
        panel.setMinWidth(280);
        panel.setMaxWidth(280);
        panel.setPadding(new Insets(16));

        Label titleLabel = new Label("Your Groups");
        titleLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + ";");

        groupListView = new ListView<>();
        groupListView.setStyle("-fx-background-color: transparent; -fx-background-insets: 0;");
        groupListView.setFixedCellSize(GROUP_ROW_HEIGHT);

        // Simple cell factory — empty virtual cells stay transparent (no gray bars)
        groupListView.setCellFactory(lv -> new ListCell<String>() {
            @Override
            protected void updateItem(String item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null || item.isEmpty()) {
                    setText(null);
                    setGraphic(null);
                    setStyle("-fx-background-color: transparent; -fx-padding: 0;");
                } else {
                    setText(item);
                    setStyle("-fx-padding: 10 16; -fx-font-size: 13px; -fx-cursor: hand; " +
                            "-fx-background-color: transparent;");
                }
            }
        });

        // Selection listener — load details when group name selected
        groupListView.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal != null && !newVal.isEmpty()) {
                Group selected = groupMap.get(newVal);
                if (selected != null) {
                    loadGroupDetails(selected);
                }
            }
        });

        // Mouse click backup for selection
        groupListView.setOnMouseClicked(event -> {
            String selected = groupListView.getSelectionModel().getSelectedItem();
            if (selected != null && !selected.isEmpty()) {
                Group g = groupMap.get(selected);
                if (g != null) {
                    loadGroupDetails(g);
                }
            }
        });

        Label emptyPlaceholder = new Label("No groups yet.\nCreate one!");
        emptyPlaceholder.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + "; -fx-font-style: italic;");
        groupListView.setPlaceholder(emptyPlaceholder);

        panel.getChildren().addAll(titleLabel, groupListView);
        VBox.setVgrow(groupListView, Priority.NEVER);
        return panel;
    }

    /**
     * Creates right panel with placeholder and group details.
     *
     * @return right VBox
     */
    private VBox createRightPanel() {
        VBox panel = new VBox(12);
        panel.setStyle(StyleConstants.CARD_STYLE);
        panel.setPadding(new Insets(20));
        HBox.setHgrow(panel, Priority.ALWAYS);

        // Placeholder shown when nothing selected
        placeholderLabel = new Label("← Select a group to view details");
        placeholderLabel.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + "; -fx-font-style: italic; -fx-font-size: 14px;");
        placeholderLabel.setAlignment(Pos.CENTER);
        placeholderLabel.setMaxWidth(Double.MAX_VALUE);

        // Detail section — hidden until a group is selected
        groupDetailsVBox = new VBox(12);
        groupDetailsVBox.setVisible(false);
        groupDetailsVBox.setManaged(false);

        groupNameLabel = new Label();
        groupNameLabel.setStyle(StyleConstants.HEADING_STYLE);

        groupDescLabel = new Label();
        groupDescLabel.setStyle(StyleConstants.SUBHEADING_STYLE);
        groupDescLabel.setWrapText(true);

        Separator separator = new Separator();

        HBox membersHeader = new HBox(10);
        membersHeader.setAlignment(Pos.CENTER_LEFT);
        Label membersLabel = new Label("Members");
        membersLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 13px; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + ";");
        addMemberButton = new Button("+ Add Member");
        addMemberButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        addMemberButton.setOnAction(e -> handleAddMember());
        StyleConstants.applyPrimaryHover(addMemberButton);
        membersHeader.getChildren().addAll(membersLabel, addMemberButton);

        memberListView = new ListView<>();
        memberListView.setStyle("-fx-background-color: transparent;");
        memberListView.setFixedCellSize(32);
        memberListView.setPrefHeight(180);
        memberListView.setCellFactory(lv -> new ListCell<String>() {
            @Override
            protected void updateItem(String item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                    setGraphic(null);
                    setStyle("-fx-background-color: transparent;");
                } else {
                    setText(item);
                    setStyle("-fx-font-size: 13px; -fx-padding: 8 12; -fx-background-color: transparent;");
                }
            }
        });

        actionButtons = new HBox(10);
        actionButtons.setAlignment(Pos.CENTER_LEFT);
        Button removeMemberButton = new Button("Remove Selected Member");
        removeMemberButton.setStyle(StyleConstants.BTN_DANGER_STYLE);
        removeMemberButton.setOnAction(e -> handleRemoveMember());
        StyleConstants.applyDangerHover(removeMemberButton);
        Button deleteGroupButton = new Button("Delete Group");
        deleteGroupButton.setStyle(StyleConstants.BTN_DANGER_STYLE);
        deleteGroupButton.setOnAction(e -> handleDeleteGroup());
        StyleConstants.applyDangerHover(deleteGroupButton);
        actionButtons.getChildren().addAll(removeMemberButton, deleteGroupButton);

        groupDetailsVBox.getChildren().addAll(
                groupNameLabel, groupDescLabel, separator, membersHeader, memberListView, actionButtons
        );

        // Error label — only visible when there is actual error text (no red dot)
        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);
        errorLabel.setVisible(false);
        errorLabel.setManaged(false);

        panel.getChildren().addAll(placeholderLabel, groupDetailsVBox, errorLabel);
        VBox.setVgrow(groupDetailsVBox, Priority.ALWAYS);
        return panel;
    }

    /**
     * Loads full group details into the right panel.
     *
     * @param group the selected group (used for ID lookup)
     */
    private void loadGroupDetails(Group group) {
        clearError();

        try {
            // Fetch fresh group with members from database
            Group fullGroup = groupDAO.getGroupById(group.getId());
            if (fullGroup == null) {
                System.err.println("Group not found: " + group.getId());
                showError("Group not found.");
                return;
            }

            currentGroup = fullGroup;

            // Update header labels
            groupNameLabel.setText(fullGroup.getName());
            groupDescLabel.setText(fullGroup.getDescription() != null ? fullGroup.getDescription() : "");

            // Populate members list
            memberListView.getItems().clear();
            if (fullGroup.getMembers() != null) {
                for (User member : fullGroup.getMembers()) {
                    if (member != null && member.getName() != null) {
                        memberListView.getItems().add(member.getName() + " (" + member.getEmail() + ")");
                    }
                }
            }

            // Show details, hide placeholder
            placeholderLabel.setVisible(false);
            placeholderLabel.setManaged(false);
            groupDetailsVBox.setVisible(true);
            groupDetailsVBox.setManaged(true);

        } catch (Exception e) {
            showError("Error loading group details: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Clears the right panel back to placeholder state.
     */
    private void clearRightPanel() {
        currentGroup = null;
        placeholderLabel.setVisible(true);
        placeholderLabel.setManaged(true);
        groupDetailsVBox.setVisible(false);
        groupDetailsVBox.setManaged(false);
        memberListView.getItems().clear();
    }

    /**
     * Reloads groups from database into the ListView.
     */
    private void refreshGroupList() {
        if (currentUser == null) {
            return;
        }

        String previouslySelected = groupListView.getSelectionModel().getSelectedItem();

        try {
            groupListView.getItems().clear();
            groupMap.clear();

            List<Group> groups = groupDAO.getGroupsByUser(currentUser.getId());

            for (Group g : groups) {
                if (g != null && g.getName() != null && !g.getName().trim().isEmpty()) {
                    groupMap.put(g.getName(), g);
                    groupListView.getItems().add(g.getName());
                }
            }

            // Resize ListView to fit actual item count — eliminates gray skeleton rows
            int count = groupListView.getItems().size();
            double listHeight = Math.max(80, count * GROUP_ROW_HEIGHT + 4);
            groupListView.setPrefHeight(listHeight);
            groupListView.setMaxHeight(listHeight);

            // Restore previous selection if still present
            if (previouslySelected != null && groupMap.containsKey(previouslySelected)) {
                groupListView.getSelectionModel().select(previouslySelected);
                loadGroupDetails(groupMap.get(previouslySelected));
            }

        } catch (Exception e) {
            showError("Error loading groups: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Handles Create Group dialog and database insert.
     */
    private void handleCreateGroup() {
        clearError();

        TextInputDialog nameDialog = new TextInputDialog();
        nameDialog.setTitle("Create Group");
        nameDialog.setHeaderText("Enter Group Name");
        nameDialog.setContentText("Group Name:");

        nameDialog.showAndWait().ifPresent(groupName -> {
            if (groupName.trim().isEmpty()) {
                showError("Group name cannot be empty.");
                return;
            }

            TextInputDialog descDialog = new TextInputDialog();
            descDialog.setTitle("Create Group");
            descDialog.setHeaderText("Enter Group Description");
            descDialog.setContentText("Description (optional):");

            descDialog.showAndWait().ifPresent(description -> {
                try {
                    Group newGroup = new Group();
                    newGroup.setName(groupName.trim());
                    newGroup.setDescription(description.trim());
                    newGroup.setCreatedBy(currentUser.getId());

                    if (groupDAO.createGroup(newGroup)) {
                        refreshGroupList();
                        groupListView.getSelectionModel().select(newGroup.getName());
                        loadGroupDetails(newGroup);
                    } else {
                        showError("Failed to create group.");
                    }
                } catch (Exception e) {
                    showError("Error creating group: " + e.getMessage());
                }
            });
        });
    }

    /**
     * Handles Add Member by email lookup.
     */
    private void handleAddMember() {
        if (currentGroup == null) {
            showError("Please select a group first.");
            return;
        }
        clearError();

        TextInputDialog emailDialog = new TextInputDialog();
        emailDialog.setTitle("Add Member");
        emailDialog.setHeaderText("Enter User Email");
        emailDialog.setContentText("Email:");

        emailDialog.showAndWait().ifPresent(email -> {
            if (email.trim().isEmpty()) {
                showError("Email cannot be empty.");
                return;
            }
            try {
                User userToAdd = userDAO.getUserByEmail(email.trim());
                if (userToAdd == null) {
                    showError("No user found with this email.");
                    return;
                }

                if (currentGroup.getMembers() != null) {
                    for (User member : currentGroup.getMembers()) {
                        if (member.getId() == userToAdd.getId()) {
                            showError("User is already a member of this group.");
                            return;
                        }
                    }
                }

                if (groupDAO.addMember(currentGroup.getId(), userToAdd.getId())) {
                    refreshGroupList();
                    loadGroupDetails(currentGroup);
                } else {
                    showError("Failed to add member.");
                }
            } catch (Exception e) {
                showError("Error adding member: " + e.getMessage());
            }
        });
    }

    /**
     * Handles Remove Member for the selected member row.
     */
    private void handleRemoveMember() {
        if (currentGroup == null) {
            showError("Please select a group first.");
            return;
        }

        String selectedMember = memberListView.getSelectionModel().getSelectedItem();
        if (selectedMember == null) {
            showError("Please select a member to remove.");
            return;
        }
        clearError();

        try {
            String email = selectedMember.substring(selectedMember.indexOf("(") + 1, selectedMember.indexOf(")"));
            User userToRemove = null;
            if (currentGroup.getMembers() != null) {
                for (User member : currentGroup.getMembers()) {
                    if (member.getEmail().equals(email)) {
                        userToRemove = member;
                        break;
                    }
                }
            }

            if (userToRemove == null) {
                showError("User not found.");
                return;
            }
            if (userToRemove.getId() == currentGroup.getCreatedBy()) {
                showError("Cannot remove the group creator.");
                return;
            }

            if (groupDAO.removeMember(currentGroup.getId(), userToRemove.getId())) {
                refreshGroupList();
                loadGroupDetails(currentGroup);
            } else {
                showError("Failed to remove member.");
            }
        } catch (Exception e) {
            showError("Error removing member: " + e.getMessage());
        }
    }

    /**
     * Handles Delete Group with confirmation dialog.
     */
    private void handleDeleteGroup() {
        if (currentGroup == null) {
            showError("Please select a group first.");
            return;
        }
        clearError();

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Delete Group");
        alert.setHeaderText("Delete Group: " + currentGroup.getName());
        alert.setContentText("Are you sure? This deletes the group and all its expenses.");

        alert.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                try {
                    int deletedId = currentGroup.getId();
                    if (groupDAO.deleteGroup(deletedId)) {
                        clearRightPanel();
                        refreshGroupList();
                    } else {
                        showError("Failed to delete group.");
                    }
                } catch (Exception e) {
                    showError("Error deleting group: " + e.getMessage());
                }
            }
        });
    }

    /**
     * Shows an error message and makes the label visible.
     *
     * @param message error text
     */
    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.setVisible(true);
        errorLabel.setManaged(true);
    }

    /**
     * Clears and hides the error label.
     */
    private void clearError() {
        errorLabel.setText("");
        errorLabel.setVisible(false);
        errorLabel.setManaged(false);
    }
}
