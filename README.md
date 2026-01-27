# 🚀 AI Career Guide - Job Recommendation System

An intelligent AI-powered career recommendation system that analyzes your skills, interests, and preferences to suggest the most suitable job positions. This project uses machine learning and natural language processing to match candidates with ideal job opportunities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Dataset](#dataset)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## ✨ Features

### Core Functionality

- **AI-Powered Job Matching**: Uses TF-IDF vectorization and cosine similarity to recommend jobs
- **Skill Assessment**: Interactive assessment forms to evaluate user skills and preferences
- **Career Guidance**: Personalized job recommendations based on skills and interests
- **Real-time Processing**: Fast recommendation engine with quick result generation
- **CORS Enabled**: Secure cross-origin requests between frontend and backend

### Frontend Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Gradient effects, smooth animations, and enhanced visual hierarchy
- **Dark/Light Theme Toggle**: Theme switcher for comfortable viewing
- **Multi-Step Assessment**: Intuitive forms for capturing user information
- **Results Dashboard**: Detailed job recommendations with match scores

### AI/ML Features

- **TF-IDF Vectorization**: Text feature extraction for job descriptions
- **Cosine Similarity**: Similarity matching between user profiles and job descriptions
- **Data Preprocessing**: Robust text cleaning and salary parsing
- **Pickle Serialization**: Model persistence for faster recommendations

## 📁 Project Structure

```
Job_Recommendation_System/
├── README.md                          # Project documentation
├── FRONTEND_IMPROVEMENTS.md           # UI/UX enhancement notes
├── model_server.py                    # Flask backend server
├── job_recommendation_dataset.csv     # Job dataset (51k+ records)
├── jobs_meta.pkl                      # Serialized job metadata
├── tfidf_vectorizer.pkl               # Pre-trained TF-IDF vectorizer
├── frontend/                          # Frontend application
│   ├── index.html                     # Home page
│   ├── assessment.html                # Assessment/Recommendation form
│   ├── result.html                    # Results display page
│   ├── about.html                     # About section
│   ├── details.html                   # Job details page
│   ├── contact.html                   # Contact page
│   ├── css/
│   │   └── style.css                  # Modern responsive styling
│   ├── js/
│   │   └── app.js                     # Frontend logic and API integration
│   └── assets/
│       ├── logo.svg                   # Project logo
│       └── placeholder.png            # Image placeholder
└── .git/                              # Git version control
```

## 🛠️ Technology Stack

### Backend

- **Python 3.x** - Programming language
- **Flask** - Web framework for API server
- **Flask-CORS** - Cross-Origin Resource Sharing
- **scikit-learn** - Machine learning and TF-IDF vectorization
- **pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **pickle** - Model serialization

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Responsive styling with gradients and animations
- **JavaScript (Vanilla)** - Frontend logic without dependencies
- **Fetch API** - Backend communication

### Data & ML

- **TF-IDF Vectorizer** - Text feature extraction
- **Cosine Similarity** - Job-candidate matching algorithm
- **Pandas DataFrames** - Data processing

## 📦 Installation

### Prerequisites

- Python 3.7 or higher
- Git
- Modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/Muhammadyaqoobwako/Job_Recommendation_System.git
cd Job_Recommendation_System
```

### Step 2: Create Virtual Environment (Optional but Recommended)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install flask flask-cors pandas numpy scikit-learn
```

### Step 4: Verify Installation

```bash
python -c "import flask, pandas, sklearn; print('All dependencies installed successfully!')"
```

## ⚙️ Configuration

### Backend Configuration

The server can be configured in `model_server.py`:

```python
# Default port
host = '0.0.0.0'
port = 5000

# Dataset path (can be overridden via environment variable)
CSV_PATH = 'job_recommendation_dataset.csv'
```

### Environment Variables

```bash
# Override default dataset path
set JOBS_CSV=path/to/your/dataset.csv

# Or pass as command-line argument
python model_server.py path/to/dataset.csv
```

### Frontend Configuration

Update API endpoint in `frontend/js/app.js` if needed:

```javascript
const API_URL = "http://localhost:5000/api";
```

## 🚀 Usage

### Starting the Backend Server

#### Option 1: Run with Default Settings

```bash
python model_server.py
```

#### Option 2: Run with Custom Dataset

```bash
python model_server.py path/to/custom_dataset.csv
```

#### Option 3: Using Environment Variable

```bash
set JOBS_CSV=path/to/dataset.csv
python model_server.py
```

Server will start at: `http://localhost:5000`

### Accessing the Frontend

#### Option 1: Direct File Access

Open `frontend/index.html` directly in your web browser

#### Option 2: Using a Local Server (Recommended)

```bash
# Using Python
python -m http.server 8000 --directory frontend

# Using Node.js (if installed)
npx http-server frontend -p 8000
```

Then visit: `http://localhost:8000`

### Using the Application

1. **Home Page**: View project overview and features
2. **Start Assessment**: Click "Start Assessment" button
3. **Fill Form**: Enter your:
   - Name
   - Skills (comma-separated)
   - Experience level
   - Preferred job roles
   - Location preferences
   - Salary expectations
4. **Get Recommendations**: System analyzes your profile and suggests matching jobs
5. **View Details**: Click on job cards to see full details
6. **Share Results**: Export or share your recommendations

## 📡 API Endpoints

### Base URL

```
http://localhost:5000
```

### Endpoints

#### 1. Health Check

```
GET /
Response: Welcome message
```

#### 2. Get Recommendations

```
POST /api/recommend
Content-Type: application/json

Request Body:
{
  "skills": "python, machine learning, data analysis",
  "experience": "2-5 years",
  "preferences": "data scientist, ml engineer",
  "location": "remote",
  "salary_range": "80000-120000"
}

Response:
{
  "recommendations": [
    {
      "job_id": 1,
      "title": "Machine Learning Engineer",
      "company": "Tech Corp",
      "description": "...",
      "similarity_score": 0.85,
      "salary": 100000,
      "location": "Remote"
    },
    ...
  ],
  "total_matches": 5,
  "processing_time": 0.23
}
```

#### 3. Get All Jobs

```
GET /api/jobs
Response: List of all available jobs in dataset
```

#### 4. Search Jobs

```
POST /api/search
Content-Type: application/json

Request Body:
{
  "query": "software engineer",
  "limit": 10
}

Response: Filtered list of matching jobs
```

## 🎨 Frontend Pages

### 1. **index.html** - Home Page

- Hero section with project overview
- Feature highlights
- Call-to-action for assessment
- Navigation to other pages

### 2. **assessment.html** - Assessment Form

- Multi-step form for user input
- Skills and preferences collection
- Form validation
- Smooth transitions between steps

### 3. **result.html** - Results Page

- Displays job recommendations
- Match score visualization
- Job cards with key information
- Sorting and filtering options

### 4. **details.html** - Job Details

- Full job description
- Company information
- Salary details
- Application links

### 5. **about.html** - About Section

- Project description
- Team information
- Technology stack overview
- How the system works

### 6. **contact.html** - Contact Page

- Contact form
- Social media links
- Support information

## 📊 Dataset

### Dataset Information

- **File**: `job_recommendation_dataset.csv`
- **Records**: 51,000+ job postings
- **Columns**: Job title, company, description, location, salary, requirements, etc.

### Data Features

- Job title and description
- Company information
- Location and remote work options
- Salary ranges
- Required skills and qualifications
- Experience level
- Industry and sector information

### Data Preprocessing

The system automatically:

- Cleans text data (lowercase, removes special characters)
- Parses salary information
- Handles missing values
- Normalizes text for comparison

## 🤖 How the Recommendation Engine Works

1. **User Input Processing**
   - Receives user skills, preferences, and experience level
   - Cleans and normalizes text input

2. **Feature Extraction**
   - Uses pre-trained TF-IDF vectorizer
   - Converts user profile to numerical features
   - Converts job descriptions to same feature space

3. **Similarity Calculation**
   - Computes cosine similarity between user and each job
   - Generates similarity scores (0-1 range)

4. **Ranking & Filtering**
   - Sorts jobs by similarity score
   - Filters by salary, location, and other criteria
   - Returns top recommendations

5. **Result Generation**
   - Formats results with match scores
   - Includes job metadata
   - Provides detailed information

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### CORS Errors

Ensure Flask-CORS is installed:

```bash
pip install flask-cors
```

### Missing Dataset

Verify `job_recommendation_dataset.csv` exists in the project root directory.

### Slow Recommendations

- Check dataset size
- Verify TF-IDF model is loaded
- Ensure sufficient system memory
- Consider reducing dataset size for testing

### Import Errors

Reinstall all dependencies:

```bash
pip install -r requirements.txt
```

## 📝 Model Files

### Pickle Files

- **jobs_meta.pkl**: Serialized job metadata for fast loading
- **tfidf_vectorizer.pkl**: Pre-trained TF-IDF vectorizer for text feature extraction

These files ensure faster startup and consistent recommendation quality.

## 🔐 Security Considerations

- **Input Validation**: All user inputs are validated and sanitized
- **CORS Protection**: Only allows requests from authorized origins
- **SQL Injection Protection**: Uses pandas for safe data handling (not raw SQL)
- **XSS Prevention**: Frontend escapes user-generated content

## 📈 Performance Metrics

- **Average Recommendation Time**: < 500ms
- **Dataset Loading**: ~2-3 seconds
- **Memory Usage**: ~500MB (with full dataset)
- **Concurrent Users**: Supports multiple simultaneous requests

## 🚦 Future Enhancements

- [ ] User authentication and profile persistence
- [ ] Advanced filtering options
- [ ] Job application tracking
- [ ] Email notifications
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Mobile app version
- [ ] Advanced NLP with BERT/transformers
- [ ] Real-time job market trends
- [ ] Salary prediction model
- [ ] Interview preparation resources

## 📚 Learning Resources

### Machine Learning

- TF-IDF: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
- Cosine Similarity: https://en.wikipedia.org/wiki/Cosine_similarity

### Web Development

- Flask Documentation: https://flask.palletsprojects.com/
- Flask-CORS: https://flask-cors.readthedocs.io/

### Tools & Libraries

- Pandas: https://pandas.pydata.org/docs/
- scikit-learn: https://scikit-learn.org/stable/

## 📄 License

This project is open-source and available under the MIT License. See LICENSE file for details.

## 👤 Author

**Muhammad Yaqoob**

- Email: muhammadyaqoobwako@gmail.com
- GitHub: [@Muhammadyaqoobwako](https://github.com/Muhammadyaqoobwako)
- Project: [Job Recommendation System](https://github.com/Muhammadyaqoobwako/Job_Recommendation_System)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Tips for Users

- **Best Results**: Provide specific, relevant skills for better recommendations
- **Location**: Include location preferences for local opportunities
- **Salary Range**: Set realistic salary expectations
- **Skills Format**: Use comma-separated values for multiple skills
- **Update Profile**: Revisit the system as your skills grow

## 📞 Support

For issues, questions, or suggestions:

1. Open an issue on GitHub
2. Email: muhammadyaqoobwako@gmail.com
3. Check FRONTEND_IMPROVEMENTS.md for UI/UX details

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Active Development
