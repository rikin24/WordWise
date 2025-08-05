# 🎯 Consultingo - Corporate Jargon Learning App

A fun and educational Streamlit app designed to help new graduate analysts understand and engage with corporate jargon and workplace terminology.

## Features

### 🧠 Quiz Mode
- Random jargon term with multiple choice definitions
- Real-time score tracking
- Immediate feedback with explanations and examples
- Progressive difficulty

### 📚 Flashcards Mode
- Interactive flashcards with terms and definitions
- Progress tracking through the deck
- Self-assessment with thumbs up/down
- Shuffle and navigation controls

### 🎯 Jargon Bingo
- 5x5 bingo grid with random buzzwords
- Click to mark terms heard in meetings
- Automatic bingo detection (rows, columns, diagonals)
- Reset and new game functionality

### 📖 Jargon Dictionary
- Searchable database of all terms
- Filter by category
- Comprehensive definitions with examples
- Easy browsing interface

### 🌟 Daily Challenge
- Daily term challenge that refreshes each day
- Multiple choice or free text options
- Streak tracking for consistency
- Encourages regular engagement

### ➕ Submit Term
- User contribution system
- Form to submit new jargon terms
- Review queue for submissions
- Community-driven content expansion

## Installation

1. Make sure you have Python 3.7+ installed
2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the App

```bash
streamlit run consultingo_app.py
```

The app will open in your default web browser at `http://localhost:8501`

## File Structure

```
├── consultingo_app.py      # Main Streamlit application
├── jargon_data.json       # Database of jargon terms and definitions
├── requirements.txt       # Python dependencies
├── user_submissions.csv   # User-submitted terms (created automatically)
└── README.md             # This file
```

## Data Management

- **jargon_data.json**: Contains all the corporate jargon terms, definitions, examples, and categories
- **user_submissions.csv**: Automatically created to store user-submitted terms for review

## Customization

### Adding New Terms
You can add new terms directly to `jargon_data.json` or use the "Submit Term" feature in the app.

### Categories
Current categories include:
- Strategy
- Communication  
- Analysis
- Resources
- Metrics
- Finance
- Management
- Technology
- Process
- Innovation
- Planning
- Project Management
- Team
- Business

### Styling
The app includes custom CSS for improved visual appeal. You can modify the styling in the `st.markdown()` sections of the main application file.

## Features Overview

### Session State Management
- Quiz scores and progress
- Flashcard position
- Bingo board state
- Daily challenge completion
- User streaks

### Responsive Design
- Works on desktop and mobile devices
- Clean, professional interface
- Intuitive navigation with tabs

### Progress Tracking
- Quiz accuracy metrics
- Learning streaks
- Progress through flashcards
- Daily challenge participation

## Future Enhancements

Potential features for future versions:
- User authentication and profiles
- Multiplayer bingo games
- Advanced analytics dashboard
- Integration with corporate learning systems
- Mobile app version
- Gamification badges and achievements

## Contributing

This app is designed to be easily extensible. You can:
1. Add new game modes by creating new tab functions
2. Expand the jargon database with industry-specific terms
3. Enhance the UI with additional Streamlit components
4. Add new categories or metadata fields

## Support

For questions or suggestions, please refer to the code comments or create an issue in your repository.

---

**Built with ❤️ for new graduate analysts starting their corporate journey!**
