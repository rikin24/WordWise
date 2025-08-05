"""
Consultingo - Corporate Jargon Learning App for New Graduate Analysts
A fun and educational Streamlit app to help newcomers understand workplace terminology.
"""

import streamlit as st
import pandas as pd
import json
import random
import datetime
from typing import List, Dict, Any
import os
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Page configuration
st.set_page_config(
    page_title="Consultingo 🎯",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        color: #1f77b4;
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    .sub-header {
        text-align: center;
        color: #666;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    .score-display {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
    }
    .bingo-cell {
        text-align: center;
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 0.25rem;
        cursor: pointer;
    }
    .bingo-selected {
        background-color: #90EE90;
        border-color: #32CD32;
    }
    .flashcard {
        background-color: #f8f9fa;
        border: 2px solid #dee2e6;
        border-radius: 0.5rem;
        padding: 2rem;
        text-align: center;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .daily-challenge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Data loading functions
@st.cache_data
def load_jargon_data():
    """Load jargon data from JSON file"""
    try:
        # Try the expanded dataset first
        with open('jargon_data_expanded.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        try:
            # Fall back to original dataset
            with open('jargon_data.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Return sample data if no files exist
            return create_sample_data()

def create_sample_data():
    """Create sample jargon data"""
    return {
        "terms": [
            {
                "term": "Synergy",
                "definition": "The interaction of two or more agents to produce a combined effect greater than the sum of their individual effects",
                "example": "We need to find synergy between our teams to maximize efficiency.",
                "category": "Strategy"
            },
            {
                "term": "Low-hanging fruit",
                "definition": "Easy wins or tasks that can be accomplished quickly with minimal effort",
                "example": "Let's tackle the low-hanging fruit first before moving to complex projects.",
                "category": "Strategy"
            },
            {
                "term": "Circle back",
                "definition": "To return to discuss something later",
                "example": "Let's circle back on this topic after the stakeholder meeting.",
                "category": "Communication"
            },
            {
                "term": "Deep dive",
                "definition": "A thorough analysis or detailed examination of a topic",
                "example": "We need to do a deep dive into the customer feedback data.",
                "category": "Analysis"
            },
            {
                "term": "Bandwidth",
                "definition": "Capacity to handle additional tasks or responsibilities",
                "example": "I don't have the bandwidth to take on another project right now.",
                "category": "Resources"
            },
            {
                "term": "Actionable insights",
                "definition": "Information that can be directly used to make decisions or take specific actions",
                "example": "The report provided actionable insights for our marketing strategy.",
                "category": "Analysis"
            },
            {
                "term": "Pivot",
                "definition": "To change direction or strategy, typically in response to market feedback",
                "example": "We need to pivot our approach based on the latest market research.",
                "category": "Strategy"
            },
            {
                "term": "KPI",
                "definition": "Key Performance Indicator - a measurable value that shows progress toward objectives",
                "example": "Our main KPI for this quarter is customer acquisition rate.",
                "category": "Metrics"
            },
            {
                "term": "ROI",
                "definition": "Return on Investment - a measure of the efficiency of an investment",
                "example": "We need to calculate the ROI of our new marketing campaign.",
                "category": "Finance"
            },
            {
                "term": "Stakeholder",
                "definition": "A person or group with an interest in or concern about a business or project",
                "example": "We need buy-in from all key stakeholders before proceeding.",
                "category": "Management"
            },
            {
                "term": "Touch base",
                "definition": "To make contact or communicate briefly",
                "example": "Let's touch base next week to discuss the project status.",
                "category": "Communication"
            },
            {
                "term": "Bleeding edge",
                "definition": "The very forefront of technological development",
                "example": "Our company is working with bleeding edge AI technology.",
                "category": "Technology"
            },
            {
                "term": "Best practice",
                "definition": "A method or technique that has been generally accepted as superior",
                "example": "Following industry best practices will help us avoid common pitfalls.",
                "category": "Process"
            },
            {
                "term": "Game changer",
                "definition": "Something that significantly alters the existing situation or activity",
                "example": "This new software could be a game changer for our productivity.",
                "category": "Innovation"
            },
            {
                "term": "Moving forward",
                "definition": "From this point onward; in the future",
                "example": "Moving forward, we'll need to be more strategic about our investments.",
                "category": "Planning"
            },
            {
                "term": "Scope creep",
                "definition": "The gradual expansion of a project beyond its original parameters",
                "example": "We need to manage scope creep to stay within budget and timeline.",
                "category": "Project Management"
            },
            {
                "term": "Blue sky thinking",
                "definition": "Creative thinking that is not limited by current constraints",
                "example": "Let's have a blue sky thinking session to generate innovative ideas.",
                "category": "Innovation"
            },
            {
                "term": "Buy-in",
                "definition": "Agreement to support a decision or initiative",
                "example": "We need management buy-in before implementing the new policy.",
                "category": "Management"
            },
            {
                "term": "Drill down",
                "definition": "To examine something in greater detail",
                "example": "Let's drill down into the quarterly numbers to understand the trends.",
                "category": "Analysis"
            },
            {
                "term": "Win-win",
                "definition": "A situation where all parties benefit",
                "example": "This partnership creates a win-win situation for both companies.",
                "category": "Strategy"
            },
            {
                "term": "Ideate",
                "definition": "To form ideas or concepts",
                "example": "Let's ideate some solutions for improving customer experience.",
                "category": "Innovation"
            },
            {
                "term": "Deliverable",
                "definition": "A tangible output or result that must be produced",
                "example": "The final report is our key deliverable for this project.",
                "category": "Project Management"
            },
            {
                "term": "Cross-functional",
                "definition": "Involving people from different departments or areas of expertise",
                "example": "We're forming a cross-functional team to tackle this challenge.",
                "category": "Team"
            },
            {
                "term": "Value-add",
                "definition": "Something that enhances or improves a product or service",
                "example": "This feature doesn't provide much value-add for our customers.",
                "category": "Business"
            },
            {
                "term": "Think outside the box",
                "definition": "To think creatively and unconventionally",
                "example": "We need to think outside the box to solve this problem.",
                "category": "Innovation"
            }
        ]
    }

def save_jargon_data(data):
    """Save jargon data to JSON file"""
    with open('jargon_data.json', 'w') as f:
        json.dump(data, f, indent=2)

def load_user_submissions():
    """Load user-submitted terms"""
    try:
        return pd.read_csv('user_submissions.csv')
    except FileNotFoundError:
        return pd.DataFrame(columns=['term', 'definition', 'example', 'submitted_date', 'status'])

def save_user_submission(term, definition, example):
    """Save a new user submission"""
    submissions = load_user_submissions()
    new_submission = pd.DataFrame({
        'term': [term],
        'definition': [definition],
        'example': [example],
        'submitted_date': [datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
        'status': ['pending']
    })
    submissions = pd.concat([submissions, new_submission], ignore_index=True)
    submissions.to_csv('user_submissions.csv', index=False)

# Initialize session state
def initialize_session_state():
    """Initialize all session state variables"""
    if 'quiz_score' not in st.session_state:
        st.session_state.quiz_score = 0
    if 'quiz_total' not in st.session_state:
        st.session_state.quiz_total = 0
    if 'current_quiz_question' not in st.session_state:
        st.session_state.current_quiz_question = None
    if 'quiz_options' not in st.session_state:
        st.session_state.quiz_options = []
    if 'quiz_correct_answer' not in st.session_state:
        st.session_state.quiz_correct_answer = ""
    if 'flashcard_index' not in st.session_state:
        st.session_state.flashcard_index = 0
    if 'show_flashcard_answer' not in st.session_state:
        st.session_state.show_flashcard_answer = False
    if 'bingo_board' not in st.session_state:
        st.session_state.bingo_board = []
    if 'bingo_selected' not in st.session_state:
        st.session_state.bingo_selected = set()
    if 'daily_challenge_date' not in st.session_state:
        st.session_state.daily_challenge_date = datetime.date.today().strftime('%Y-%m-%d')
    if 'daily_challenge_term' not in st.session_state:
        st.session_state.daily_challenge_term = None
    if 'daily_challenge_completed' not in st.session_state:
        st.session_state.daily_challenge_completed = False
    if 'user_streak' not in st.session_state:
        st.session_state.user_streak = 0

# Main application
def main():
    """Main application function"""
    initialize_session_state()
    
    # Load data
    jargon_data = load_jargon_data()
    terms = jargon_data['terms']
    
    # Header
    st.markdown('<h1 class="main-header">🎯 Consultingo</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Master corporate jargon like a pro! 🚀</p>', unsafe_allow_html=True)
    
    # Sidebar with user stats
    with st.sidebar:
        st.header("📊 Your Progress")
        if st.session_state.quiz_total > 0:
            accuracy = (st.session_state.quiz_score / st.session_state.quiz_total) * 100
            st.metric("Quiz Accuracy", f"{accuracy:.1f}%")
        st.metric("Current Streak", st.session_state.user_streak)
        st.metric("Terms in Database", len(terms))
        
        st.header("🎮 Quick Stats")
        st.write(f"**Quiz Score:** {st.session_state.quiz_score}/{st.session_state.quiz_total}")
        st.write(f"**Flashcard Position:** {st.session_state.flashcard_index + 1}/{len(terms)}")
        
        if st.button("🔄 Reset All Progress"):
            st.session_state.clear()
            st.rerun()
    
    # Create tabs
    tabs = st.tabs([
        "🧠 Quiz Mode", 
        "📚 Flashcards", 
        "🎯 Jargon Bingo", 
        "📖 Dictionary", 
        "🌟 Daily Challenge", 
        "➕ Submit Term",
        "📝 Translator"
    ])
    
    # Tab 1: Quiz Mode
    with tabs[0]:
        quiz_mode(terms)
    
    # Tab 2: Flashcards
    with tabs[1]:
        flashcards_mode(terms)
    
    # Tab 3: Jargon Bingo
    with tabs[2]:
        jargon_bingo(terms)
    
    # Tab 4: Dictionary
    with tabs[3]:
        jargon_dictionary(terms)
    
    # Tab 5: Daily Challenge
    with tabs[4]:
        daily_challenge(terms)
    
    # Tab 6: Submit Term
    with tabs[5]:
        submit_term()
    
    # Tab 7: Translator Mode
    with tabs[6]:
        translator_mode(terms)

def quiz_mode(terms):
    """Quiz mode implementation"""
    st.header("🧠 Quiz Mode")
    st.write("Test your knowledge of corporate jargon!")
    
    col1, col2, col3 = st.columns([2, 1, 2])
    
    with col2:
        if st.session_state.quiz_total > 0:
            st.markdown(f'<div class="score-display">Score: {st.session_state.quiz_score}/{st.session_state.quiz_total}</div>', unsafe_allow_html=True)
    
    # Generate new question if needed
    if st.session_state.current_quiz_question is None:
        generate_quiz_question(terms)
    
    # Display current question
    if st.session_state.current_quiz_question:
        st.subheader(f"What does '{st.session_state.current_quiz_question['term']}' mean?")
        
        # Create radio buttons for options
        user_answer = st.radio(
            "Choose the correct definition:",
            st.session_state.quiz_options,
            key="quiz_radio"
        )
        
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col2:
            if st.button("Submit Answer", type="primary"):
                check_quiz_answer(user_answer)
                st.rerun()
        
        # Show explanation if answer was just submitted
        if 'show_quiz_result' in st.session_state and st.session_state.show_quiz_result:
            if st.session_state.last_answer_correct:
                st.success("🎉 Correct! Well done!")
            else:
                st.error(f"❌ Incorrect. The correct answer is: {st.session_state.quiz_correct_answer}")
            
            st.info(f"**Example usage:** {st.session_state.current_quiz_question['example']}")
            
            if st.button("Next Question"):
                st.session_state.current_quiz_question = None
                st.session_state.show_quiz_result = False
                st.rerun()

def generate_quiz_question(terms):
    """Generate a new quiz question with smart incorrect answers"""
    correct_term = random.choice(terms)
    st.session_state.current_quiz_question = correct_term
    st.session_state.quiz_correct_answer = correct_term['definition']
    
    # Create wrong options using different strategies
    wrong_options = []
    
    # Strategy 1: Include the funny literal interpretation if available
    if 'funny_literal' in correct_term:
        wrong_options.append(correct_term['funny_literal'])
    
    # Strategy 2: Get definitions from similar categories
    similar_category_terms = [term for term in terms 
                            if term.get('category', '').lower() == correct_term.get('category', '').lower() 
                            and term['term'] != correct_term['term']]
    if similar_category_terms:
        similar_def = random.choice(similar_category_terms)['definition']
        wrong_options.append(similar_def)
    
    # Strategy 3: Create plausible but incorrect business definitions
    plausible_wrong_answers = generate_plausible_wrong_answers(correct_term)
    wrong_options.extend(plausible_wrong_answers)
    
    # Strategy 4: Get random definitions from other terms as fallback
    other_definitions = [term['definition'] for term in terms if term['term'] != correct_term['term']]
    wrong_options.extend(random.sample(other_definitions, min(2, len(other_definitions))))
    
    # Select the best 3 wrong options
    selected_wrong = list(set(wrong_options))[:3]  # Remove duplicates and limit to 3
    
    # Ensure we have exactly 3 wrong options
    while len(selected_wrong) < 3:
        remaining_options = [term['definition'] for term in terms 
                           if term['term'] != correct_term['term'] 
                           and term['definition'] not in selected_wrong]
        if remaining_options:
            selected_wrong.append(random.choice(remaining_options))
        else:
            break
    
    # Combine and shuffle options
    all_options = [correct_term['definition']] + selected_wrong[:3]
    random.shuffle(all_options)
    st.session_state.quiz_options = all_options

def generate_plausible_wrong_answers(correct_term):
    """Generate plausible but incorrect business definitions"""
    term = correct_term['term'].lower()
    category = correct_term.get('category', '').lower()
    
    # Dictionary of plausible wrong answers based on term patterns
    wrong_answer_patterns = {
        'synergy': [
            "A type of energy drink popular in corporate offices",
            "The process of synchronizing team schedules and calendars"
        ],
        'pivot': [
            "A meeting room booking system used by agile teams",
            "The central point around which all business decisions rotate"
        ],
        'bandwidth': [
            "The speed of internet connection in the office",
            "The range of musical genres played in corporate elevators"
        ],
        'deep dive': [
            "An intensive team-building exercise involving swimming",
            "A detailed financial audit conducted underwater"
        ],
        'circle back': [
            "A circular office layout designed to improve communication",
            "The process of returning borrowed office supplies"
        ],
        'low-hanging fruit': [
            "Healthy snacks provided in the office cafeteria",
            "Entry-level positions that don't require much experience"
        ],
        'move the needle': [
            "Adjusting the office thermostat to improve comfort",
            "Rearranging office furniture to optimize workflow"
        ],
        'touch base': [
            "A baseball-themed team building activity",
            "The practice of high-fiving colleagues after successful meetings"
        ]
    }
    
    # Generic wrong answers based on category
    category_wrong_answers = {
        'strategy': [
            "A detailed plan for office lunch arrangements",
            "The method used to arrange conference room seating"
        ],
        'communication': [
            "A new email encryption protocol for secure messaging",
            "The official company policy for phone etiquette"
        ],
        'analysis': [
            "A software tool for analyzing office coffee consumption",
            "The process of examining employee parking patterns"
        ],
        'teamwork': [
            "A points-based system for tracking group coffee orders",
            "The art of coordinating office holiday party planning"
        ],
        'innovation': [
            "A creative approach to office supply organization",
            "The latest trend in ergonomic office chair design"
        ]
    }
    
    wrong_answers = []
    
    # Try to get specific wrong answers for this term
    if term in wrong_answer_patterns:
        wrong_answers.extend(random.sample(wrong_answer_patterns[term], 
                                         min(1, len(wrong_answer_patterns[term]))))
    
    # Try to get category-based wrong answers
    if category in category_wrong_answers:
        wrong_answers.extend(random.sample(category_wrong_answers[category], 
                                         min(1, len(category_wrong_answers[category]))))
    
    # Add some generic business-sounding wrong answers
    generic_wrong = [
        "A methodology for optimizing coffee break efficiency",
        "The process of measuring employee satisfaction with office temperature",
        "A framework for evaluating the effectiveness of team lunch meetings",
        "The systematic approach to organizing office supply inventories",
        "A metric used to assess the quality of conference room acoustics"
    ]
    
    if len(wrong_answers) < 2:
        wrong_answers.extend(random.sample(generic_wrong, min(2 - len(wrong_answers), len(generic_wrong))))
    
    return wrong_answers

def check_quiz_answer(user_answer):
    """Check if the quiz answer is correct"""
    st.session_state.quiz_total += 1
    if user_answer == st.session_state.quiz_correct_answer:
        st.session_state.quiz_score += 1
        st.session_state.user_streak += 1
        st.session_state.last_answer_correct = True
    else:
        st.session_state.user_streak = 0
        st.session_state.last_answer_correct = False
    
    st.session_state.show_quiz_result = True

def flashcards_mode(terms):
    """Flashcards mode implementation"""
    st.header("📚 Flashcards Mode")
    st.write("Learn terms at your own pace!")
    
    if not terms:
        st.warning("No terms available!")
        return
    
    # Ensure index is within bounds
    if st.session_state.flashcard_index >= len(terms):
        st.session_state.flashcard_index = 0
    
    current_term = terms[st.session_state.flashcard_index]
    
    # Progress indicator
    st.progress((st.session_state.flashcard_index + 1) / len(terms))
    st.write(f"Card {st.session_state.flashcard_index + 1} of {len(terms)}")
    
    # Flashcard display
    st.markdown('<div class="flashcard">', unsafe_allow_html=True)
    
    if not st.session_state.show_flashcard_answer:
        st.markdown(f"<h2 style='text-align: center; color: #1f77b4;'>{current_term['term']}</h2>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; color: #666;'>Click 'Reveal' to see the definition</p>", unsafe_allow_html=True)
    else:
        st.markdown(f"<h3 style='text-align: center; color: #1f77b4;'>{current_term['term']}</h3>", unsafe_allow_html=True)
        st.markdown(f"<p style='text-align: center; font-size: 1.1rem;'>{current_term['definition']}</p>", unsafe_allow_html=True)
        if current_term.get('example'):
            st.markdown(f"<p style='text-align: center; font-style: italic; color: #666;'>Example: {current_term['example']}</p>", unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Control buttons
    col1, col2, col3, col4 = st.columns([1, 1, 1, 1])
    
    with col1:
        if st.button("⬅️ Previous"):
            st.session_state.flashcard_index = (st.session_state.flashcard_index - 1) % len(terms)
            st.session_state.show_flashcard_answer = False
            st.rerun()
    
    with col2:
        if not st.session_state.show_flashcard_answer:
            if st.button("👁️ Reveal", type="primary"):
                st.session_state.show_flashcard_answer = True
                st.rerun()
        else:
            if st.button("🙈 Hide"):
                st.session_state.show_flashcard_answer = False
                st.rerun()
    
    with col3:
        if st.button("➡️ Next"):
            st.session_state.flashcard_index = (st.session_state.flashcard_index + 1) % len(terms)
            st.session_state.show_flashcard_answer = False
            st.rerun()
    
    with col4:
        if st.button("🔀 Shuffle"):
            st.session_state.flashcard_index = random.randint(0, len(terms) - 1)
            st.session_state.show_flashcard_answer = False
            st.rerun()
    
    # Knowledge tracking
    if st.session_state.show_flashcard_answer:
        st.write("---")
        st.write("Did you know this term?")
        col1, col2 = st.columns(2)
        with col1:
            if st.button("👍 Yes, I knew it!"):
                st.success("Great job! Keep it up!")
                st.session_state.user_streak += 1
        with col2:
            if st.button("👎 No, learned something new!"):
                st.info("Learning is a journey - you're doing great!")

def jargon_bingo(terms):
    """Jargon Bingo implementation"""
    st.header("🎯 Jargon Bingo")
    st.write("Mark off the buzzwords as you hear them in meetings!")
    
    # Initialize bingo board if empty
    if not st.session_state.bingo_board:
        st.session_state.bingo_board = random.sample([term['term'] for term in terms], min(25, len(terms)))
        st.session_state.bingo_selected = set()
    
    # Control buttons
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("🎲 New Game"):
            st.session_state.bingo_board = random.sample([term['term'] for term in terms], min(25, len(terms)))
            st.session_state.bingo_selected = set()
            st.rerun()
    
    with col2:
        if st.button("🔄 Reset Board"):
            st.session_state.bingo_selected = set()
            st.rerun()
    
    with col3:
        selected_count = len(st.session_state.bingo_selected)
        st.metric("Terms Marked", f"{selected_count}/25")
    
    # Create 5x5 bingo grid
    st.write("Click on terms as you hear them:")
    
    for row in range(5):
        cols = st.columns(5)
        for col in range(5):
            idx = row * 5 + col
            if idx < len(st.session_state.bingo_board):
                term = st.session_state.bingo_board[idx]
                is_selected = idx in st.session_state.bingo_selected
                
                with cols[col]:
                    button_style = "primary" if is_selected else "secondary"
                    if st.button(term, key=f"bingo_{idx}", type=button_style):
                        if idx in st.session_state.bingo_selected:
                            st.session_state.bingo_selected.remove(idx)
                        else:
                            st.session_state.bingo_selected.add(idx)
                        st.rerun()
    
    # Check for bingo (optional feature)
    if check_bingo():
        st.balloons()
        st.success("🎉 BINGO! You've completed a line!")

def check_bingo():
    """Check if user has achieved bingo"""
    selected = st.session_state.bingo_selected
    
    # Check rows
    for row in range(5):
        if all(row * 5 + col in selected for col in range(5)):
            return True
    
    # Check columns
    for col in range(5):
        if all(row * 5 + col in selected for row in range(5)):
            return True
    
    # Check diagonals
    if all(i * 5 + i in selected for i in range(5)):
        return True
    if all(i * 5 + (4 - i) in selected for i in range(5)):
        return True
    
    return False

def jargon_dictionary(terms):
    """Jargon Dictionary implementation"""
    st.header("📖 Jargon Dictionary")
    st.write("Search and browse all corporate terms and their definitions.")
    
    # Search functionality
    search_term = st.text_input("🔍 Search for a term:", placeholder="Type a term or keyword...")
    
    # Filter terms based on search
    if search_term:
        filtered_terms = [
            term for term in terms 
            if search_term.lower() in term['term'].lower() or 
               search_term.lower() in term['definition'].lower() or
               search_term.lower() in term.get('category', '').lower()
        ]
    else:
        filtered_terms = terms
    
    # Category filter
    categories = list(set(term.get('category', 'Uncategorized') for term in terms))
    selected_category = st.selectbox("Filter by category:", ['All'] + sorted(categories))
    
    if selected_category != 'All':
        filtered_terms = [term for term in filtered_terms if term.get('category', 'Uncategorized') == selected_category]
    
    st.write(f"Showing {len(filtered_terms)} term(s)")
    
    # Display terms
    for term in filtered_terms:
        with st.expander(f"**{term['term']}** - {term.get('category', 'General')}"):
            st.write(f"**Definition:** {term['definition']}")
            if term.get('example'):
                st.write(f"**Example:** *{term['example']}*")
            if term.get('category'):
                st.write(f"**Category:** {term['category']}")

def daily_challenge(terms):
    """Daily Challenge implementation"""
    st.header("🌟 Daily Challenge")
    
    # Check if it's a new day
    today = datetime.date.today().strftime('%Y-%m-%d')
    if st.session_state.daily_challenge_date != today:
        st.session_state.daily_challenge_date = today
        st.session_state.daily_challenge_term = random.choice(terms)
        st.session_state.daily_challenge_completed = False
    
    # Display daily challenge
    if st.session_state.daily_challenge_term:
        st.markdown('<div class="daily-challenge">', unsafe_allow_html=True)
        st.markdown(f"<h3>📅 Challenge for {today}</h3>", unsafe_allow_html=True)
        st.markdown(f"<h2>What does '{st.session_state.daily_challenge_term['term']}' mean?</h2>", unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        if not st.session_state.daily_challenge_completed:
            # Challenge options
            challenge_type = st.radio("Choose challenge type:", ["Multiple Choice", "Free Text"])
            
            if challenge_type == "Multiple Choice":
                # Generate options
                correct_def = st.session_state.daily_challenge_term['definition']
                wrong_options = [term['definition'] for term in terms if term['term'] != st.session_state.daily_challenge_term['term']]
                selected_wrong = random.sample(wrong_options, min(3, len(wrong_options)))
                all_options = [correct_def] + selected_wrong
                random.shuffle(all_options)
                
                user_choice = st.radio("Select the correct definition:", all_options)
                
                if st.button("Submit Challenge Answer", type="primary"):
                    if user_choice == correct_def:
                        st.success("🎉 Correct! Challenge completed!")
                        st.session_state.user_streak += 1
                    else:
                        st.error(f"❌ Incorrect. The correct answer is: {correct_def}")
                        st.session_state.user_streak = 0
                    
                    st.session_state.daily_challenge_completed = True
                    st.info(f"**Example:** {st.session_state.daily_challenge_term['example']}")
                    st.rerun()
            
            else:  # Free Text
                user_definition = st.text_area("Write what you think this term means:")
                
                if st.button("Submit Challenge Answer", type="primary"):
                    st.session_state.daily_challenge_completed = True
                    st.info("Thanks for participating! Here's the actual definition:")
                    st.success(f"**Definition:** {st.session_state.daily_challenge_term['definition']}")
                    st.info(f"**Example:** {st.session_state.daily_challenge_term['example']}")
                    if user_definition.strip():
                        st.write(f"**Your answer:** {user_definition}")
                    st.rerun()
        
        else:
            st.success("✅ Today's challenge completed!")
            st.write(f"**Term:** {st.session_state.daily_challenge_term['term']}")
            st.write(f"**Definition:** {st.session_state.daily_challenge_term['definition']}")
            st.write(f"**Example:** {st.session_state.daily_challenge_term['example']}")
            
            st.info("Come back tomorrow for a new challenge! 🚀")

def submit_term():
    """Submit Term implementation"""
    st.header("➕ Submit a New Term")
    st.write("Help expand our jargon database by submitting new terms!")
    
    with st.form("submit_term_form"):
        new_term = st.text_input("Term/Acronym:", placeholder="e.g., MVP, Stakeholder, etc.")
        new_definition = st.text_area("Definition:", placeholder="What does this term mean?")
        new_example = st.text_area("Example Usage (optional):", placeholder="How is this term used in context?")
        category = st.selectbox("Category:", [
            "Strategy", "Communication", "Analysis", "Resources", "Metrics", 
            "Finance", "Management", "Technology", "Process", "Innovation", 
            "Planning", "Project Management", "Team", "Business", "Other"
        ])
        
        submitted = st.form_submit_button("Submit Term", type="primary")
        
        if submitted:
            if new_term and new_definition:
                save_user_submission(new_term, new_definition, new_example)
                st.success("🎉 Thank you for your submission! Your term has been added to our review queue.")
                st.balloons()
                
                # Show submitted term
                st.write("**Your submission:**")
                st.write(f"**Term:** {new_term}")
                st.write(f"**Definition:** {new_definition}")
                if new_example:
                    st.write(f"**Example:** {new_example}")
                st.write(f"**Category:** {category}")
            else:
                st.error("Please provide at least a term and definition.")
    
    # Show recent submissions
    st.write("---")
    st.subheader("📋 Recent Submissions")
    
    try:
        submissions = load_user_submissions()
        if not submissions.empty:
            # Display recent submissions
            recent_submissions = submissions.tail(5).sort_values('submitted_date', ascending=False)
            for _, submission in recent_submissions.iterrows():
                with st.expander(f"**{submission['term']}** - {submission['submitted_date']}"):
                    st.write(f"**Definition:** {submission['definition']}")
                    if pd.notna(submission['example']) and submission['example']:
                        st.write(f"**Example:** {submission['example']}")
                    st.write(f"**Status:** {submission['status']}")
        else:
            st.info("No submissions yet. Be the first to contribute!")
    except Exception as e:
        st.info("No previous submissions found.")

@st.cache_resource
def load_llm():
    """Load a GPT-2 model for jargon translation"""
    model_name = "gpt2-medium"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    return pipeline("text-generation", model=model, tokenizer=tokenizer)

def translator_mode(terms):
    st.header("📝 Jargon Translator")
    st.write("Translate between plain text and corporate jargon using AI and our jargon database.")
    
    llm = load_llm()

    # Collect jargon terms
    known_terms = {t['term']: t['definition'] for t in terms}
    try:
        user_terms = load_user_submissions()
        for _, row in user_terms.iterrows():
            known_terms[row['term']] = row['definition']
    except Exception:
        pass

    direction = st.radio("Select translation direction:", ["Plain ➡️ Jargon", "Jargon ➡️ Plain"])
    user_input = st.text_area("Enter your text here:", placeholder="Type your sentence...")

    if st.button("Translate", type="primary"):
        if not user_input.strip():
            st.error("Please enter some text to translate.")
            return

        # Build jargon hint string from dictionary
        jargon_hints = ", ".join(random.sample(list(known_terms.keys()), min(8, len(known_terms)))) \
                        if direction == "Plain ➡️ Jargon" and known_terms else ""

        if direction == "Plain ➡️ Jargon":
            prompt = (
                f"You are a professional consultant. Rewrite the following plain English text "
                f"into corporate consulting jargon. Try to naturally use some of these terms "
                f"when relevant: {jargon_hints}.\n\n"
                f"Plain Text: {user_input}\n\nCorporate Jargon Version:"
            )
        else:
            prompt = (
                f"You are a simplification assistant. Rewrite the following corporate jargon text "
                f"into clear, plain English for a general audience.\n\n"
                f"Jargon Text: {user_input}\n\nPlain English Version:"
            )

        with st.spinner("Translating..."):
            raw_response = llm(
                prompt,
                max_new_tokens=120,
                do_sample=True,
                temperature=0.9,
                top_p=0.95,
            )[0]['generated_text']

            # Extract only the generated part (after our marker)
            if "Version:" in raw_response:
                response = raw_response.split("Version:")[-1].strip()
            else:
                response = raw_response.strip()

        st.subheader("💡 Translation Result")
        st.success(response)

        # Show definitions of jargon terms used
        matched_terms = [term for term in known_terms if term.lower() in response.lower()]
        if matched_terms:
            st.write("### 📘 Jargon Used in Translation")
            for term in matched_terms:
                st.write(f"**{term}**: {known_terms[term]}")

if __name__ == "__main__":
    main()
