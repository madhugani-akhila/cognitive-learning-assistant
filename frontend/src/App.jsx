import { useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Brain,
  Home,
  CircleHelp,
  BookOpen,
  Trophy,
  Settings,
  Bot,
  Send,
  Lightbulb,
  Target,
  Volume2,
  Image as ImageIcon,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  BarChart3,
  Sparkles,
  ChevronRight,
  Moon,
  User,
  GraduationCap,
  Rocket,
  MessageCircle,
} from "lucide-react";

import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("beginner");

  const [answer, setAnswer] = useState(
    "Your personalized explanation will appear here."
  );

  const [visual, setVisual] = useState(
    "Your visual explanation will appear here."
  );

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [loading, setLoading] = useState(false);

  // --------------------------------
  // ASK AI TUTOR
  // --------------------------------

  async function askTutor() {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    setQuiz(null);
    setSelectedAnswer("");
    setQuizResult("");

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          level: level,
        }),
      });

      const data = await response.json();

      console.log("AI RESPONSE:", data);
      console.log("QUIZ:", data.quiz);

      if (!response.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.explanation || "No explanation received.");
      setVisual(data.visual || "No visual explanation available.");
      setQuiz(data.quiz || null);

      setQuestionsAnswered((previous) => previous + 1);
    } catch (error) {
      console.error("ASK ERROR:", error);

      setAnswer(
        "Something went wrong. Please check your backend connection."
      );

      setVisual(
        "The visual explanation could not be loaded."
      );

      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // QUIZ
  // --------------------------------

  async function checkAnswer(option) {
    if (!quiz || selectedAnswer !== "") {
      return;
    }

    setSelectedAnswer(option);

    const isCorrect = option === quiz.answer;

    if (isCorrect) {
      setCorrectAnswers((previous) => previous + 1);
      setQuizResult("Correct! Excellent work 🎉");
    } else {
      setWrongAnswers((previous) => previous + 1);
      setQuizResult(
        `Not quite. The correct answer is: ${quiz.answer}`
      );
    }

    try {
      await fetch("/quiz-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: quiz.question,
          selected_answer: option,
          correct_answer: quiz.answer,
          is_correct: isCorrect,
        }),
      });
    } catch (error) {
      console.error("QUIZ RESULT ERROR:", error);
    }
  }

  // --------------------------------
  // SPEECH
  // --------------------------------

  function speakExplanation() {
    if (!answer) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(answer);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  // --------------------------------
  // PROGRESS
  // --------------------------------

  const accuracy =
    questionsAnswered > 0
      ? Math.round((correctAnswers / questionsAnswered) * 100)
      : 0;

  return (
    <div className="app">

      {/* ================================= */}
      {/* TOP HEADER */}
      {/* ================================= */}

      <header className="top-header">

        <div className="logo-area">

          <div className="logo-icon">
            <Brain size={30} />
          </div>

          <div>
            <h1>Cognitive Learning Assistant</h1>

            <p>
              Understand • Visualize • Listen • Practice • Improve
            </p>
          </div>

        </div>

        <div className="header-actions">

          <div className="ai-status">
            <span></span>
            AI Tutor
          </div>

          <button className="icon-button">
            <Moon size={19} />
          </button>

          <div className="profile-circle">
            <User size={19} />
          </div>

        </div>

      </header>


      <div className="dashboard-layout">

        {/* ================================= */}
        {/* SIDEBAR */}
        {/* ================================= */}

        <aside className="sidebar">

          <nav>

            <button className="nav-item active">
              <Home size={20} />
              <span>Home</span>
            </button>

            <button className="nav-item">
              <CircleHelp size={20} />
              <span>Ask Tutor</span>
            </button>

            <button className="nav-item">
              <BookOpen size={20} />
              <span>Learning Progress</span>
            </button>

            <button className="nav-item">
              <Trophy size={20} />
              <span>Achievements</span>
            </button>

            <button className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </button>

          </nav>


          {/* SIDEBAR AI CARD */}

          <div className="sidebar-ai-card">

            <div className="mini-bot">
              <Bot size={32} />
            </div>

            <div>
              <strong>Your AI Tutor</strong>

              <p>
                Always here to help you learn and grow.
              </p>
            </div>

          </div>

        </aside>


        {/* ================================= */}
        {/* MAIN CONTENT */}
        {/* ================================= */}

        <main className="main-content">


          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}

          <section className="hero-dashboard">

            <div className="hero-left">

              <div className="hello">
                👋 Hello, Aki!
              </div>

              <h2>
                Learn smarter with your
                <span> AI Tutor.</span>
              </h2>

              <p>
                Ask questions, explore concepts and build
                your skills through personalized AI-powered
                learning.
              </p>


              <div className="hero-feature-row">

                <div className="hero-feature">
                  <div className="feature-icon purple">
                    <Lightbulb size={20} />
                  </div>

                  <span>
                    Personalized
                    <small>Learning</small>
                  </span>
                </div>


                <div className="hero-feature">
                  <div className="feature-icon cyan">
                    <Target size={20} />
                  </div>

                  <span>
                    Interactive
                    <small>Explanations</small>
                  </span>
                </div>


                <div className="hero-feature">
                  <div className="feature-icon blue">
                    <Brain size={20} />
                  </div>

                  <span>
                    Visual
                    <small>Learning</small>
                  </span>
                </div>


                <div className="hero-feature">
                  <div className="feature-icon pink">
                    <Sparkles size={20} />
                  </div>

                  <span>
                    AI
                    <small>Powered</small>
                  </span>
                </div>

              </div>

            </div>


            <div className="hero-bot">

              <div className="bot-glow">
                <Bot size={95} />
              </div>

              <div className="speech-bubble">
                Let's Learn! 🚀
              </div>

            </div>

          </section>


          {/* ================================= */}
          {/* TOP GRID */}
          {/* ================================= */}

          <div className="top-grid">


            {/* ================================= */}
            {/* ASK TUTOR */}
            {/* ================================= */}

            <section className="dashboard-card ask-card">

              <div className="card-heading">

                <div className="heading-icon">
                  <MessageCircle size={22} />
                </div>

                <div>
                  <h3>Ask Your AI Tutor</h3>

                  <p>
                    Get instant answers with clear explanations,
                    visuals and a quick quiz.
                  </p>
                </div>

              </div>


              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                placeholder="Type your question here..."
                maxLength={500}
              />

              <div className="input-footer">
                <span>{question.length}/500</span>
              </div>


              <div className="ask-controls">

                <div className="level-select">

                  <GraduationCap size={19} />

                  <select
                    value={level}
                    onChange={(event) =>
                      setLevel(event.target.value)
                    }
                  >

                    <option value="beginner">
                      Beginner
                    </option>

                    <option value="intermediate">
                      Intermediate
                    </option>

                    <option value="advanced">
                      Advanced
                    </option>

                  </select>

                </div>


                <button
                  className="primary-button"
                  onClick={askTutor}
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <Brain size={19} />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send size={19} />
                      Ask Tutor
                    </>
                  )}

                </button>

              </div>

            </section>


            {/* ================================= */}
            {/* LEARNING FEATURES */}
            {/* ================================= */}

            <section className="dashboard-card features-card">

              <div className="simple-heading">

                <Sparkles size={21} />

                <h3>Learning Features</h3>

              </div>


              <div className="feature-list">

                <div className="feature-row">

                  <div className="row-icon purple-bg">
                    <BookOpen size={20} />
                  </div>

                  <div>
                    <strong>Concept Explanation</strong>
                    <span>Simple and clear explanations</span>
                  </div>

                  <ChevronRight size={18} />

                </div>


                <div className="feature-row">

                  <div className="row-icon green-bg">
                    <ImageIcon size={20} />
                  </div>

                  <div>
                    <strong>Visual Learning</strong>
                    <span>Diagrams and visual representations</span>
                  </div>

                  <ChevronRight size={18} />

                </div>


                <div className="feature-row">

                  <div className="row-icon pink-bg">
                    <Volume2 size={20} />
                  </div>

                  <div>
                    <strong>Audio Tutor</strong>
                    <span>Listen to explanations</span>
                  </div>

                  <ChevronRight size={18} />

                </div>


                <div className="feature-row">

                  <div className="row-icon orange-bg">
                    <ClipboardCheck size={20} />
                  </div>

                  <div>
                    <strong>Quick Quiz</strong>
                    <span>Test your understanding</span>
                  </div>

                  <ChevronRight size={18} />

                </div>

              </div>

            </section>


            {/* ================================= */}
            {/* PROGRESS */}
            {/* ================================= */}

            <section className="dashboard-card progress-card">

              <div className="simple-heading">

                <BarChart3 size={21} />

                <h3>Your Progress</h3>

              </div>


              <div className="progress-circle">

                <div>
                  <strong>{accuracy}%</strong>
                  <span>Accuracy</span>
                </div>

              </div>


              <div className="stats-grid">

                <div className="stat-box">
                  <MessageCircle size={18} />
                  <strong>{questionsAnswered}</strong>
                  <span>Questions Asked</span>
                </div>

                <div className="stat-box">
                  <CheckCircle size={18} />
                  <strong>{correctAnswers}</strong>
                  <span>Correct</span>
                </div>

                <div className="stat-box">
                  <XCircle size={18} />
                  <strong>{wrongAnswers}</strong>
                  <span>Incorrect</span>
                </div>

                <div className="stat-box">
                  <Trophy size={18} />
                  <strong>{accuracy}%</strong>
                  <span>Accuracy</span>
                </div>

              </div>

            </section>

          </div>


          {/* ================================= */}
          {/* EXPLANATION */}
          {/* ================================= */}

          <section className="dashboard-card explanation-card">

            <div className="simple-heading">

              <div className="heading-icon">
                <Lightbulb size={21} />
              </div>

              <div>
                <h3>Personalized Explanation</h3>

                <p>
                  Learn the concept according to your selected level.
                </p>
              </div>

            </div>


            <div className="content-box">

              <ReactMarkdown>
                {answer}
              </ReactMarkdown>

            </div>


            <button
              className="secondary-button"
              onClick={speakExplanation}
            >

              <Volume2 size={18} />

              Listen to Explanation

            </button>

          </section>


          {/* ================================= */}
          {/* VISUAL + AUDIO */}
          {/* ================================= */}

          <div className="two-column">


            {/* VISUAL */}

            <section className="dashboard-card">

              <div className="simple-heading">

                <div className="heading-icon blue-icon">
                  <ImageIcon size={21} />
                </div>

                <div>
                  <h3>Visual Learning</h3>

                  <p>
                    Understand concepts visually.
                  </p>
                </div>

              </div>


              <div className="visual-content">

                <ReactMarkdown>
                  {visual}
                </ReactMarkdown>

              </div>

            </section>


            {/* AUDIO */}

            <section className="dashboard-card">

              <div className="simple-heading">

                <div className="heading-icon pink-icon">
                  <Volume2 size={21} />
                </div>

                <div>
                  <h3>AI Tutor Introduction</h3>

                  <p>
                    Listen to your tutor introduction.
                  </p>
                </div>

              </div>


              <div className="audio-wrapper">

                <div className="audio-icon">
                  <Bot size={30} />
                </div>

                <div className="audio-text">

                  <strong>
                    Your AI Tutor
                  </strong>

                  <span>
                    Welcome to your personalized learning journey.
                  </span>

                </div>

              </div>


              {/* FILE IS INSIDE frontend/public */}

              <audio
                controls
                preload="metadata"
                className="audio-player"
              >

                <source
                  src="/guido_audio.mp3"
                  type="audio/mpeg"
                />

                Your browser does not support audio.

              </audio>

            </section>

          </div>


          {/* ================================= */}
          {/* QUIZ */}
          {/* ================================= */}

          {quiz && (

            <section className="dashboard-card quiz-card">

              <div className="simple-heading">

                <div className="heading-icon orange-icon">
                  <ClipboardCheck size={21} />
                </div>

                <div>
                  <h3>Quick Quiz</h3>

                  <p>
                    Check your understanding.
                  </p>
                </div>

              </div>


              <div className="quiz-question">

                <span>QUESTION</span>

                <h4>
                  {quiz.question}
                </h4>

              </div>


              <div className="quiz-options">

                {quiz.options?.map((option, index) => {

                  const correct =
                    selectedAnswer !== "" &&
                    option === quiz.answer;

                  const wrong =
                    selectedAnswer === option &&
                    option !== quiz.answer;

                  return (

                    <button
                      key={index}
                      className={`quiz-option ${
                        correct ? "correct" : ""
                      } ${
                        wrong ? "wrong" : ""
                      }`}
                      onClick={() => checkAnswer(option)}
                      disabled={selectedAnswer !== ""}
                    >

                      <span className="option-number">
                        {index + 1}
                      </span>

                      <span className="option-text">
                        {option}
                      </span>

                      {correct && (
                        <CheckCircle size={20} />
                      )}

                      {wrong && (
                        <XCircle size={20} />
                      )}

                    </button>

                  );
                })}

              </div>


              {quizResult && (

                <div className="quiz-result">

                  {selectedAnswer === quiz.answer ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}

                  <span>
                    {quizResult}
                  </span>

                </div>

              )}

            </section>

          )}


          {/* ================================= */}
          {/* BOTTOM GRID */}
          {/* ================================= */}

          <div className="bottom-grid">


            {/* RECENT TOPICS */}

            <section className="dashboard-card">

              <div className="card-top-line">

                <div className="simple-heading">

                  <BookOpen size={21} />

                  <h3>Recent Topics</h3>

                </div>

                <span className="view-all">
                  View All
                </span>

              </div>


              <div className="topic-tags">

                <span>Python Basics</span>
                <span>Loops & Conditions</span>
                <span>Functions</span>
                <span>Data Structures</span>
                <span>AI & Machine Learning</span>

              </div>

            </section>


            {/* LEARNING JOURNEY */}

            <section className="dashboard-card">

              <div className="simple-heading">

                <Target size={21} />

                <h3>Your Learning Journey</h3>

              </div>

              <p className="journey-text">
                Small steps every day lead to big results.
              </p>


              <div className="journey">

                {[1, 2, 3, 4, 5].map((step) => (

                  <div
                    key={step}
                    className={`journey-step ${
                      step === 1 ? "active" : ""
                    }`}
                  >
                    {step}
                  </div>

                ))}

              </div>


              <div className="journey-message">

                <Rocket size={17} />

                Keep going! You're doing great!

              </div>

            </section>


            {/* RECOMMENDATION */}

            <section className="dashboard-card recommendation-card">

              <div className="simple-heading">

                <Lightbulb size={21} />

                <h3>Learning Recommendation</h3>

              </div>


              <div className="recommendation-box">

                <div>
                  <Rocket size={23} />
                </div>

                <p>

                  {questionsAnswered === 0
                    ? "Start with your first question and begin your personalized learning journey."
                    : accuracy >= 80
                    ? "Great progress! Try an intermediate or advanced question."
                    : "Keep practicing. Ask the tutor for another explanation of the concept."
                  }

                </p>

                <ChevronRight size={19} />

              </div>

            </section>

          </div>


          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}

          <footer>

            <strong>
              Cognitive Learning Assistant
            </strong>

            <span>
              Understand • Visualize • Listen • Practice • Improve
            </span>

            <small>
              Powered by AI ❤️
            </small>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default App;