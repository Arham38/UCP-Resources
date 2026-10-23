import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score,r2_score
data=pd.read_csv('./Dataset/house_price.csv');

print(data.head())
data=data.dropna()

X=data.drop(columns=['price','lot_size_units','zip_code','size_units'])
Y=data['price']


# X=pd.get_dummies(X)
X_Train,X_Test,Y_Train,Y_Test=train_test_split(X,Y,test_size=0.20,random_state=1);

model=LinearRegression()

model.fit(X_Train,Y_Train)
predicton=model.predict(X_Test)
print("Accuracy: ",r2_score(Y_Test,predicton))
