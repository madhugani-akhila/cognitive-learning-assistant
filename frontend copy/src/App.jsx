import { useState } from "react";
import {
  Brain,
  UserRound,
  Volume2,
  Target,
  Lightbulb,
  GraduationCap,
  Bot,
  BarChart3,
  ClipboardCheck,
  Trophy,
  CircleCheck,
  CircleX,
  Send,
} from "lucide-react";

import "./App.css";

function App() {
  // ==============================
  // STATE
  // ==============================

  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("beginner");

  const [answer, setAnswer] = useState(
    "Your personalized explanation will appear here."
  );

  const [visual, setVisual] = useState(
    "Your visual explanation\nwill appear here."
  );

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [loading, setLoading] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);

  // ==============================
  // ASK TUTOR
  // ==============================

  async function askTutor() {
    const trimmedQuestion = question.trim();

    if (trimmedQuestion === "") {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("🤔 Your tutor is thinking...");
    setQuiz(null);
    setQuizResult("");
    setSelectedAnswer("");

    try {
        const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          level: level,
        }),
      });

      const data = await response.json();
      console.log("QUIZ FROM FLASK:", data.quiz);

      if (data.error) {
        alert(data.error);
        setAnswer("Something went wrong.");
        return;
      }

      // Explanation
      setAnswer(data.explanation);
      setCanSpeak(true);

      // Visual
      setVisual(data.visual);

      // Quiz
      setQuiz(data.quiz);

      // Progress
      setQuestionsAnswered((previous) => previous + 1);
    } catch (error) {
      console.error(error);

      setAnswer("Something went wrong. Please check that Flask is running.");
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // CHECK QUIZ ANSWER
  // ==============================

  function checkAnswer(option) {
    if (!quiz || selectedAnswer !== "") {
      return;
    }

    setSelectedAnswer(option);

    if (option === quiz.answer) {
      setQuizResult("✅ Correct! Excellent work.");

      setCorrectAnswers((previous) => previous + 1);
    } else {
      setQuizResult(
        "❌ Not quite. Correct answer: " + quiz.answer
      );

      setWrongAnswers((previous) => previous + 1);
    }
  }

  // ==============================
  // PROGRESS
  // ==============================

  const totalQuiz = correctAnswers + wrongAnswers;

  let percentage = 0;

  if (totalQuiz > 0) {
    percentage = Math.round(
      (correctAnswers / totalQuiz) * 100
    );
  }

  // ==============================
  // RECOMMENDATION
  // ==============================

  function generateRecommendation() {
    if (wrongAnswers > correctAnswers) {
      return (
        "🧠 You may need more practice. " +
        "Review the explanation, listen to it again, " +
        "and try another example."
      );
    }

    if (correctAnswers >= 3) {
      return (
        "🌟 Great progress! You understand these concepts well. " +
        "Try moving to the Intermediate or Advanced level."
      );
    }

    return (
      "👍 Good start. Continue practicing and complete " +
      "more quizzes to strengthen your understanding."
    );
  }

  // ==============================
  // TEXT TO SPEECH
  // ==============================

  function speakAnswer() {
    if (!answer || !canSpeak) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(answer);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="app">

      {/* ==========================
          HEADER
      =========================== */}

      <header className="header">
        <h1>
          <Brain size={34} />
          Cognitive AI Learning Assistant
        </h1>

        <p>
          Understand • Visualize • Listen • Practice • Improve
        </p>
      </header>


      {/* ==========================
          MAIN CONTENT
      =========================== */}

      <main className="container">


        {/* ==========================
            AI TUTOR INTRODUCTION
        =========================== */}

        <section className="card tutor-card">

          <div className="tutor-icon">
            <UserRound size={50} />
          </div>

          <div className="tutor-content">

            <h2>
              Your AI Tutor
            </h2>

            <p id="tutor-message">

              Hello everyone! 👋
              Welcome to your Cognitive AI Learning Assistant.

              <br />
              <br />

              I am your personal AI tutor, here to help you
              learn Python, Artificial Intelligence, and
              Machine Learning in a simple and understandable way.

              <br />
              <br />

              Ask me a question and I will explain the concept
              step by step, provide practical examples, show
              visual representations, and help you test your
              understanding with interactive quizzes.

              <br />
              <br />

              You can choose Beginner, Intermediate, or Advanced
              learning levels according to your knowledge.

              <br />
              <br />

              Let's learn, practice, and improve together! 🚀

            </p>

          </div>

        </section>


        {/* ==========================
            TUTOR AUDIO
        =========================== */}

        <section className="card audio-card">

          <h2>
            <Volume2 size={25} />
            Tutor Voice
          </h2>

          <p>
            Listen to your AI tutor introduction.
          </p>

          <audio
            id="tutorAudio"
            controls
            preload="metadata"
          >
            <source
              src="/static/audio/guido_audio.mp3"
              type="audio/mpeg"
            />

            Your browser does not support the audio element.
          </audio>

        </section>


        {/* ==========================
            LEARNING LEVEL
        =========================== */}

        <section className="card">

          <h2>
            <Target size={25} />
            Choose Your Learning Level
          </h2>

          <p>
            Select the level that matches your
            current understanding.
          </p>

          <select
            id="level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >

            <option value="beginner">
              🌱 Beginner
            </option>

            <option value="intermediate">
              📚 Intermediate
            </option>

            <option value="advanced">
              🚀 Advanced
            </option>

          </select>

        </section>


        {/* ==========================
            ASK THE AI TUTOR
        =========================== */}

        <section className="card question-card">

          <h2>
            <Lightbulb size={25} />
            Ask Your Tutor
          </h2>

          <p>
            Ask a question about Python,
            Artificial Intelligence, or
            Machine Learning.
          </p>

          <textarea
            id="question"
            rows="6"
            placeholder="Example: Explain Python for loop in simple terms..."
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <button
            id="askButton"
            onClick={askTutor}
            disabled={loading}
          >

            {loading ? (
              <>
                <Bot size={20} />
                Thinking...
              </>
            ) : (
              <>
                <Send size={20} />
                Ask Tutor
              </>
            )}

          </button>

        </section>


        {/* ==========================
            AI EXPLANATION
        =========================== */}

        <section className="card answer-card">

          <h2>
            <Bot size={25} />
            Personalized Explanation
          </h2>

          <div id="answer">
            {answer}
          </div>

          <button
            id="speakButton"
            onClick={speakAnswer}
            disabled={!canSpeak}
          >

            <Volume2 size={20} />

            Listen to Explanation

          </button>

        </section>


        {/* ==========================
            VISUAL LEARNING
        =========================== */}

        <section className="card visual-card">

          <h2>
            <BarChart3 size={25} />
            Visual Learning
          </h2>

          <p>
            Understand the concept through
            a simple visual representation.
          </p>

          <pre id="visual">
            {visual}
          </pre>

        </section>


        {/* ==========================
            MINI QUIZ
        =========================== */}

        {quiz && (

          <section
            className="card"
            id="quizSection"
          >

            <h2>
              <ClipboardCheck size={25} />
              Test Your Understanding
            </h2>

            <p>
              Answer this question to check
              your understanding.
            </p>

            <h3 id="quizQuestion">
              {quiz.question}
            </h3>

            <div id="quizOptions">

              {quiz.options.map((option, index) => (

                <button
                  key={index}
                  className="quiz-option"
                  onClick={() => checkAnswer(option)}
                  disabled={selectedAnswer !== ""}
                >
                  <span style={{ color: "black", fontWeight: "600" }}>
  {option || "EMPTY OPTION"}
</span>
                </button>

              ))}

            </div>

            <p id="quizResult">
              {quizResult}
            </p>

          </section>

        )}


        {/* ==========================
            LEARNING PROGRESS
        =========================== */}

        <section className="card">

          <h2>
            <BarChart3 size={25} />
            Learning Progress
          </h2>

          <div className="progress-info">

            <p>
              Questions Asked:
              <strong>
                {questionsAnswered}
              </strong>
            </p>

            <p>
              Correct Answers:
              <strong>
                {correctAnswers}
              </strong>
            </p>

            <p>
              Incorrect Answers:
              <strong>
                {wrongAnswers}
              </strong>
            </p>

          </div>

          <div className="progress-container">

            <div
              id="progressBar"
              className="progress-bar"
              style={{
                width: `${percentage}%`,
              }}
            >
              {percentage}%
            </div>

          </div>

        </section>


        {/* ==========================
            COGNITIVE RECOMMENDATION
        =========================== */}

        <section className="card recommendation-card">

          <h2>
            <Trophy size={25} />
            Cognitive Learning Recommendation
          </h2>

          <p id="recommendation">

            {totalQuiz === 0
              ? "Complete a quiz to receive personalized learning advice."
              : generateRecommendation()}

          </p>

        </section>

      </main>


      {/* ==========================
          FOOTER
      =========================== */}

      <footer>

        <p>
          <Brain size={20} />
          Cognitive AI Learning Assistant
        </p>

        <p>
          Built with Python + Flask + AI
        </p>

      </footer>

    </div>
  );
}

export default App;