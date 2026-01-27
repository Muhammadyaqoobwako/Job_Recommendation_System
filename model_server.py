# model_server.py
import pandas as pd
import numpy as np
import re
import json
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from flask import Flask, request, jsonify
try:
    from flask_cors import CORS
except Exception:
    def CORS(app, **kwargs):
        print("Warning: 'flask-cors' not installed. CORS not enabled. Install with: pip install flask-cors")
        return None
import pickle
import os

# -------- utils for cleaning ----------
def clean_text(s):
    if pd.isna(s):
        return ""
    s = str(s).lower()
    s = re.sub(r'[^a-z0-9,\s\-]+', ' ', s)    # keep letters/numbers/commas/hyphen
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def parse_salary(s):
    # Try to extract numeric salary if possible, return median value or NaN
    if pd.isna(s):
        return np.nan
    s = str(s)
    nums = re.findall(r'\d{3,}', s.replace(',', ''))  # find numbers with 3+ digits
    if not nums:
        return np.nan
    nums = [int(n) for n in nums]
    return int(np.mean(nums))

# -------- Load and preprocess dataset ----------
CSV_PATH = 'job_recommendation_dataset.csv'   # default dataset name (change if needed)

# Allow override via environment variable `JOBS_CSV` or first command-line argument
if 'JOBS_CSV' in os.environ:
    CSV_PATH = os.environ['JOBS_CSV']
elif len(sys.argv) > 1:
    # allow passing dataset path as first CLI arg: `python model_server.py path/to/file.csv`
    CSV_PATH = sys.argv[1]

def load_and_prepare(csv_path=CSV_PATH):
    df = pd.read_csv(csv_path)
    # keep relevant columns and ensure names
    required_cols = ['Job Title','Company','Location','Experience Level','Salary','Industry','Required Skills']
    # if columns exist with slightly different names adjust accordingly
    df = df[[c for c in required_cols if c in df.columns]].copy()

    # Clean text columns
    for col in ['Job Title','Company','Location','Experience Level','Industry','Required Skills']:
        if col in df.columns:
            df[col] = df[col].astype(str).apply(clean_text)

    # parse salary
    if 'Salary' in df.columns:
        df['Salary_num'] = df['Salary'].apply(parse_salary)
    else:
        df['Salary_num'] = np.nan

    # Create a combined text field for TF-IDF
    def make_text(row):
        parts = []
        for c in ['Job Title','Industry','Required Skills','Location','Experience Level']:
            if c in row:
                parts.append(str(row[c]))
        # optionally include company name, not too important
        if 'Company' in row:
            parts.append(str(row['Company']))
        return ' '.join(parts)

    df['combined_text'] = df.apply(make_text, axis=1)
    df['combined_text'] = df['combined_text'].fillna('').astype(str)
    return df

# -------- Build TF-IDF matrix ----------
VEC_PATH = 'tfidf_vectorizer.pkl'
MATRIX_PATH = 'tfidf_matrix.npz'
METADATA_PATH = 'jobs_meta.pkl'   # store job df

def build_model(df):
    texts = df['combined_text'].tolist()
    # Use english stop words, ngram range to catch multi-word skills like "machine learning"
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1,2), max_features=15000)
    tfidf_matrix = vectorizer.fit_transform(texts)
    # Save vectorizer and metadata
    with open(VEC_PATH, 'wb') as f:
        pickle.dump(vectorizer, f)
    with open(METADATA_PATH, 'wb') as f:
        pickle.dump(df, f)
    # Save matrix using scipy sparse if needed, here we keep it in memory. If large, save to disk.
    return vectorizer, tfidf_matrix, df

# -------- Recommendation function ----------
def recommend(user_skills_text, vectorizer, tfidf_matrix, df, top_n=10, preferences=None):
    """
    user_skills_text: string describing user (skills + interests + optional location or exp)
    preferences: dict e.g. {'location':'karachi','experience':'entry','remote':True}
    """
    # Clean input and vectorize
    user_text = clean_text(user_skills_text)
    user_vec = vectorizer.transform([user_text])

    # Compute cosine similarities
    cosine_similarities = linear_kernel(user_vec, tfidf_matrix).flatten()  # shape (n_jobs,)

    # Create scores dataframe
    scores = pd.DataFrame({
        'score': cosine_similarities,
        'index': np.arange(len(cosine_similarities))
    })
    # optional: boost by salary or location or experience match
    if preferences:
        # Example: if user has preferred location, boost jobs with that location text
        pref_loc = preferences.get('location')
        pref_exp = preferences.get('experience_level')
        if pref_loc:
            pref_loc = clean_text(pref_loc)
            loc_mask = df['Location'].fillna('').str.contains(pref_loc)
            scores.loc[loc_mask, 'score'] += 0.05  # small boost
        if pref_exp:
            pref_exp = clean_text(pref_exp)
            exp_mask = df['Experience Level'].fillna('').str.contains(pref_exp)
            scores.loc[exp_mask, 'score'] += 0.05

        # If salary_min provided, penalize jobs below that salary
        if 'salary_min' in preferences and not np.isnan(preferences['salary_min']):
            salmin = float(preferences['salary_min'])
            sal_mask = df['Salary_num'].fillna(0) < salmin
            scores.loc[sal_mask, 'score'] -= 0.03

    scores = scores.sort_values(by='score', ascending=False).head(top_n)
    results = []
    for _, r in scores.iterrows():
        idx = int(r['index'])
        job = df.iloc[idx].to_dict()
        results.append({
            'title': job.get('Job Title',''),
            'company': job.get('Company',''),
            'location': job.get('Location',''),
            'experience_level': job.get('Experience Level',''),
            'salary': job.get('Salary',''),
            'industry': job.get('Industry',''),
            'required_skills': job.get('Required Skills',''),
            'score': float(r['score'])
        })
    return results

# -------- Build or load model on startup ----------
print("Loading dataset and building model (this may take few seconds)...")

# Check dataset existence early and provide helpful error if missing
if not os.path.exists(CSV_PATH):
    # list CSV files in current directory to help user
    files = [f for f in os.listdir('.') if f.lower().endswith('.csv')]
    print(f"ERROR: Dataset file '{CSV_PATH}' not found in {os.path.abspath('.')}")
    if files:
        print("Available CSV files:")
        for f in files:
            print(" -", f)
    else:
        print("No CSV files found in the current directory.")
    raise SystemExit(1)

df = load_and_prepare(CSV_PATH)
if df is None or len(df) == 0:
    print("ERROR: Loaded dataframe is empty or invalid. Check the CSV and required columns.")
    raise SystemExit(1)

vectorizer, tfidf_matrix, df = build_model(df)
print("Model ready. Number of jobs:", getattr(tfidf_matrix, 'shape', (0,))[0])

# -------- Flask API ----------
app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend_endpoint():
    data = request.get_json()
    # Accept both frontend payloads and the original API shape.
    # Frontend currently posts: { "skill": "Python" }
    # Original API expected: { "skills": "python, sql", "preferences": {...}, "top_n": 10 }
    if data is None:
        return jsonify([])
    # prefer 'skill' or 'skills'
    skill = ''
    if 'skill' in data:
        skill = data.get('skill') or ''
    elif 'skills' in data:
        skill = data.get('skills') or ''

    preferences = data.get('preferences', {}) if isinstance(data, dict) else {}
    try:
        top_n = int(data.get('top_n', 10)) if isinstance(data, dict) else 10
    except Exception:
        top_n = 10

    # Build recommendations using existing model
    recs = recommend(skill, vectorizer, tfidf_matrix, df, top_n=top_n, preferences=preferences)

    # Convert internal recs to the shape the frontend expects: array of items
    out = []
    for r in recs:
        title = r.get('title') or r.get('Job Title') or ''
        company = r.get('company') or r.get('Company') or ''
        location = r.get('location') or r.get('Location') or ''
        score = r.get('score', 0)
        required_skills = r.get('required_skills') or []
        suggested = ''
        # simple suggested course heuristic
        if isinstance(required_skills, (list, tuple)) and len(required_skills) > 0:
            suggested = f"Recommended learning: {required_skills[0]} basics"
        else:
            # fallback using the skill sent
            s0 = (skill or '').split(',')[0]
            suggested = f"Recommended learning: {s0.strip().title()}"

        out.append({
            'Job Title': title,
            'Company': company,
            'Location': location,
            'title': title,
            'score': float(score),
            'requiredSkills': required_skills,
            'suggestedCourse': suggested
        })

    return jsonify(out)

if __name__ == '__main__':
    # run on localhost:5000
    app.run(host='0.0.0.0', port=5000, debug=True)
