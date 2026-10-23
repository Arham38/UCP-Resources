from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.cluster import KMeans, DBSCAN
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)


# ──────────────────────────────────────────────
#  SHARED PREPROCESSING FUNCTION
# ──────────────────────────────────────────────
def preprocess(df):
    info = []

    before = len(df)
    df = df.drop_duplicates()
    dropped = before - len(df)
    if dropped:
        info.append(f"Removed {dropped} duplicate row(s).")

    cat_cols = df.select_dtypes(include=['object']).columns.tolist()
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
    if cat_cols:
        info.append(f"Encoded categorical columns: {', '.join(cat_cols)}.")

    missing_before = df.isnull().sum().sum()
    df = df.fillna(df.mean(numeric_only=True))
    if missing_before:
        info.append(f"Filled {int(missing_before)} missing value(s) with column mean.")

    info.append(f"Final dataset: {df.shape[0]} rows x {df.shape[1]} columns.")
    return df, info


# ──────────────────────────────────────────────
#  HOME
# ──────────────────────────────────────────────
@app.route('/')
def home():
    return render_template('index.html',
                           linear_result=None, kmeans_result=None,
                           dbscan_result=None, linear_error=None,
                           kmeans_error=None, dbscan_error=None)


# ──────────────────────────────────────────────
#  LINEAR REGRESSION
# ──────────────────────────────────────────────
@app.route('/linear', methods=['POST'])
def linear():
    file = request.files['file']
    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path)

    df = pd.read_csv(path)
    df, preprocess_info = preprocess(df)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    if len(numeric_cols) < 2:
        return render_template('index.html',
                               linear_result=None, linear_error="Need at least 2 numeric columns.",
                               kmeans_result=None, dbscan_result=None,
                               kmeans_error=None, dbscan_error=None)

    X = df[[numeric_cols[0]]]
    y = df[numeric_cols[1]]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    x_train, x_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)

    mse  = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2   = r2_score(y_test, y_pred)

    # Plot
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    fig.patch.set_facecolor('#0f172a')
    for ax in axes:
        ax.set_facecolor('#1e3a8a')
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')
        for spine in ax.spines.values():
            spine.set_edgecolor('#3b82f6')

    axes[0].scatter(y_test, y_pred, color='#06b6d4', alpha=0.7, s=60,
                    edgecolors='white', linewidths=0.4)
    mn = min(float(y_test.min()), float(y_pred.min()))
    mx = max(float(y_test.max()), float(y_pred.max()))
    axes[0].plot([mn, mx], [mn, mx], 'r--', lw=2, label='Perfect fit')
    axes[0].set_xlabel('Actual Values')
    axes[0].set_ylabel('Predicted Values')
    axes[0].set_title('Actual vs Predicted')
    axes[0].legend(facecolor='#1e3a8a', labelcolor='white')

    residuals = y_test.values - y_pred
    axes[1].bar(range(len(residuals[:50])), residuals[:50],
                color='#3b82f6', alpha=0.8)
    axes[1].axhline(0, color='red', linestyle='--', lw=1.5)
    axes[1].set_xlabel('Sample Index')
    axes[1].set_ylabel('Residual')
    axes[1].set_title('Residuals (first 50 samples)')

    plt.tight_layout()
    plt.savefig('static/linear.png', dpi=120, bbox_inches='tight')
    plt.close()

    result = {
        'feature': numeric_cols[0], 'target': numeric_cols[1],
        'mse': f"{mse:.4f}", 'rmse': f"{rmse:.4f}", 'r2': f"{r2:.4f}",
        'coef': f"{model.coef_[0]:.4f}", 'intercept': f"{model.intercept_:.4f}",
        'train_size': len(x_train), 'test_size': len(x_test),
        'preprocess': preprocess_info,
    }

    return render_template('index.html',
                           linear_result=result, linear_error=None,
                           kmeans_result=None, dbscan_result=None,
                           kmeans_error=None, dbscan_error=None)


# ──────────────────────────────────────────────
#  K-MEANS CLUSTERING
# ──────────────────────────────────────────────
@app.route('/kmeans', methods=['POST'])
def kmeans():
    file = request.files['file']
    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path)

    df = pd.read_csv(path)
    df, preprocess_info = preprocess(df)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    if len(numeric_cols) < 2:
        return render_template('index.html',
                               linear_result=None, kmeans_result=None,
                               dbscan_result=None, linear_error=None,
                               kmeans_error="Need at least 2 numeric columns.",
                               dbscan_error=None)

    data = df[numeric_cols[:2]]
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data)

    inertias = []
    k_range = range(2, min(9, len(df)))
    for k in k_range:
        km_temp = KMeans(n_clusters=k, random_state=42, n_init=10)
        km_temp.fit(data_scaled)
        inertias.append(km_temp.inertia_)

    best_k = 3

    km = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    labels = km.fit_predict(data_scaled)
    df['Cluster'] = labels

    colors_map = ['#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#a855f7']

    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    fig.patch.set_facecolor('#0f172a')
    for ax in axes:
        ax.set_facecolor('#1e3a8a')
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')
        for spine in ax.spines.values():
            spine.set_edgecolor('#3b82f6')

    for i in range(best_k):
        mask = df['Cluster'] == i
        axes[0].scatter(df.loc[mask, numeric_cols[0]],
                        df.loc[mask, numeric_cols[1]],
                        color=colors_map[i % len(colors_map)],
                        label=f'Cluster {i}', alpha=0.75, s=60,
                        edgecolors='white', linewidths=0.3)

    centers_orig = scaler.inverse_transform(km.cluster_centers_)
    axes[0].scatter(centers_orig[:, 0], centers_orig[:, 1],
                    color='red', marker='*', s=350, zorder=5,
                    label='Centroids', edgecolors='white', linewidths=0.5)
    axes[0].set_xlabel(numeric_cols[0])
    axes[0].set_ylabel(numeric_cols[1])
    axes[0].set_title(f'K-Means Clustering (k={best_k})')
    axes[0].legend(facecolor='#1e3a8a', labelcolor='white', fontsize=9)

    axes[1].plot(list(k_range), inertias, marker='o', color='#06b6d4',
                 linewidth=2, markersize=7, markerfacecolor='white')
    axes[1].set_xlabel('Number of Clusters (k)')
    axes[1].set_ylabel('Inertia')
    axes[1].set_title('Elbow Method — Best k Selection')
    axes[1].axvline(best_k, color='#f59e0b', linestyle='--', lw=1.5,
                    label=f'Selected k={best_k}')
    axes[1].legend(facecolor='#1e3a8a', labelcolor='white')

    plt.tight_layout()
    plt.savefig('static/kmeans.png', dpi=120, bbox_inches='tight')
    plt.close()

    cluster_counts = df['Cluster'].value_counts().sort_index().to_dict()

    result = {
        'k': best_k, 'inertia': f"{km.inertia_:.2f}",
        'feature1': numeric_cols[0], 'feature2': numeric_cols[1],
        'cluster_counts': cluster_counts,
        'preprocess': preprocess_info,
    }

    return render_template('index.html',
                           linear_result=None, kmeans_result=result,
                           dbscan_result=None, linear_error=None,
                           kmeans_error=None, dbscan_error=None)


# ──────────────────────────────────────────────
#  DBSCAN CLUSTERING
# ──────────────────────────────────────────────
@app.route('/dbscan', methods=['POST'])
def dbscan():
    file = request.files['file']
    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path)

    df = pd.read_csv(path)
    df, preprocess_info = preprocess(df)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    if len(numeric_cols) < 2:
        return render_template('index.html',
                               linear_result=None, kmeans_result=None,
                               dbscan_result=None, linear_error=None,
                               kmeans_error=None,
                               dbscan_error="Need at least 2 numeric columns.")

    data = df[numeric_cols[:2]]
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data)

    db = DBSCAN(eps=0.5, min_samples=5)
    labels = db.fit_predict(data_scaled)
    df['Cluster'] = labels

    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise    = int(list(labels).count(-1))

    palette = ['#06b6d4', '#f59e0b', '#10b981', '#a855f7',
               '#ef4444', '#ec4899', '#84cc16']

    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    fig.patch.set_facecolor('#0f172a')
    for ax in axes:
        ax.set_facecolor('#1e3a8a')
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')
        for spine in ax.spines.values():
            spine.set_edgecolor('#3b82f6')

    unique_labels = sorted(set(labels))
    for idx, label in enumerate(unique_labels):
        mask = df['Cluster'] == label
        if label == -1:
            axes[0].scatter(df.loc[mask, numeric_cols[0]],
                            df.loc[mask, numeric_cols[1]],
                            color='#6b7280', alpha=0.5, s=30,
                            marker='x', label='Noise')
        else:
            axes[0].scatter(df.loc[mask, numeric_cols[0]],
                            df.loc[mask, numeric_cols[1]],
                            color=palette[idx % len(palette)],
                            alpha=0.75, s=60, edgecolors='white',
                            linewidths=0.3, label=f'Cluster {label}')

    axes[0].set_xlabel(numeric_cols[0])
    axes[0].set_ylabel(numeric_cols[1])
    axes[0].set_title(f'DBSCAN — {n_clusters} cluster(s), {n_noise} noise point(s)')
    axes[0].legend(facecolor='#1e3a8a', labelcolor='white', fontsize=9)

    cluster_sizes = {str(l): int((labels == l).sum())
                     for l in unique_labels if l != -1}
    if cluster_sizes:
        bar_colors = [palette[i % len(palette)] for i in range(len(cluster_sizes))]
        keys   = list(cluster_sizes.keys())
        values = list(cluster_sizes.values())
        if n_noise:
            keys.append('Noise')
            values.append(n_noise)
            bar_colors.append('#6b7280')
        axes[1].bar(keys, values, color=bar_colors,
                    edgecolor='white', linewidth=0.5)
        axes[1].set_xlabel('Cluster Label')
        axes[1].set_ylabel('Number of Points')
        axes[1].set_title('Cluster Size Distribution')

    plt.tight_layout()
    plt.savefig('static/dbscan.png', dpi=120, bbox_inches='tight')
    plt.close()

    result = {
        'n_clusters': n_clusters, 'n_noise': n_noise,
        'eps': 0.5, 'min_samples': 5,
        'total_points': len(labels),
        'feature1': numeric_cols[0], 'feature2': numeric_cols[1],
        'preprocess': preprocess_info,
    }

    return render_template('index.html',
                           linear_result=None, kmeans_result=None,
                           dbscan_result=result, linear_error=None,
                           kmeans_error=None, dbscan_error=None)


if __name__ == '__main__':
    app.run(debug=True)