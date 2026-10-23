from flask import Flask, render_template, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib


data = pd.read_csv('income_dataset_200.csv')

X = data.iloc[:, :-1]
y = data.iloc[:, -1]

X_encoded = pd.get_dummies(X)

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y_encoded, test_size=0.2, random_state=1
)


scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


model = SVC(kernel='rbf', C=1, gamma='scale')


model.fit(X_train, y_train)

app = Flask(__name__)


joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoder, 'label.pkl')
joblib.dump(X_encoded.columns, 'columns.pkl')


model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoder = joblib.load('label.pkl')
train_columns = joblib.load('columns.pkl')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():

    new_data = pd.DataFrame(
        [
        [request.form['age'],
        request.form['gender'],
        request.form['workclass'],
        request.form['education'],
        request.form['marital'],
        request.form['occupation'],
        request.form['relationship'],
        request.form['race'],
        request.form['country'],
        request.form['capital_gain'],
        request.form['capital_loss'],
        request.form['hours_per_week'] ]
    ], columns=[
        'age','gender','workclass','education','marital',
        'occupation','relationship','race','country',
        'capital_gain','capital_loss','hours_per_week'
    ])

    num_cols = ['age','capital_gain','capital_loss','hours_per_week']
    new_data[num_cols] = new_data[num_cols].astype(float)

    new_encoded = pd.get_dummies(new_data)

  
    # new_encoded = new_encoded.reindex(columns=train_columns, fill_value=0)

    new_scaled = scaler.transform(new_encoded)


    prediction = model.predict(new_scaled)


    result = label_encoder.inverse_transform(prediction)[0]

    return render_template('index.html', result=f'Prediction: {result}')


if __name__ == '__main__':
    app.run(debug=True)