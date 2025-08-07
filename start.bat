@echo off
echo.
echo ========================================
echo  🎯 Consultingo React Setup
echo ========================================
echo.

echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error installing dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting development server...
echo.
echo 💡 The app will open automatically in your browser
echo    If not, visit: http://localhost:3000
echo.
echo 🎮 Features to explore:
echo    • 🧠 Quiz Mode - Test your knowledge
echo    • 📚 Flashcards - Interactive learning
echo    • 🎯 Jargon Bingo - Make meetings fun
echo    • 📖 Dictionary - Browse all terms
echo    • 🌟 Daily Challenge - Daily learning goals
echo    • ➕ Submit Term - Contribute to the community
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo.

call npm start

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error starting the development server!
    echo Please check the error messages above.
    pause
    exit /b 1
)
