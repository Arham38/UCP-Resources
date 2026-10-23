import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder


data = pd.read_csv('income_dataset_200.csv')


X = data.iloc[:, :-1]
y = data.iloc[:, -1]


X_encoded = pd.get_dummies(X)


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_encoded)

le=LabelEncoder()
y=le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=80, random_state=1
)

model = SVC(kernel='rbf', C=1, gamma='scale')


model.fit(X_train, y_train)


y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
