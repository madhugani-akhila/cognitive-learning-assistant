import { useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Brain,
  GraduationCap,
  Volume2,
  Target,
  Lightbulb,
  Bot,
  BarChart3,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Send,
  Trophy
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

  const [currentAnswer, setCurrentAnswer] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [loading, setLoading] = useState(false);


  // =========================
  // ASK AI TUTOR
  // =========================

  async function askTutor() {

    if (question.trim() === "") {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);

    setAnswer("🤔 Your tutor is thinking...");
    setQuiz(null);
    setSelectedAnswer("");

    try {

      const response = await fetch("/ask", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: question,
          level: level
        })

      });


      const data = await response.json();

    console.log("FULL DATA:", data);
console.log("QUIZ DATA:", data.quiz);
console.log("QUIZ OPTIONS:", data.quiz?.options);
      if (data.error) {

        alert(data.error);

        setAnswer(
          "Something went wrong. Please check the Flask terminal."
        );

        return;
      }


      // Explanation

      setCurrentAnswer(data.explanation);

      setAnswer(data.explanation);


      // Visual

      setVisual(data.visual);


      // Quiz

      setQuiz(data.quiz);


      // Progress

      setQuestionsAnswered(
        previous => previous + 1
      );

    }

    catch (error) {

      console.error(error);

      setAnswer(
        "Something went wrong. Make sure Flask is running."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // =========================
  // CHECK QUIZ ANSWER
  // =========================

  function checkAnswer(option) {

    if (selectedAnswer !== "") {
      return;
    }

    setSelectedAnswer(option);


    if (option === quiz.answer) {

      setCorrectAnswers(
        previous => previous + 1
      );

    }

    else {

      setWrongAnswers(
        previous => previous + 1
      );

    }

  }


  // =========================
  // PROGRESS
  // =========================

  const totalQuiz =
    correctAnswers + wrongAnswers;


  let percentage = 0;


  if (totalQuiz > 0) {

    percentage =
      Math.round(
        (correctAnswers / totalQuiz) * 100
      );

  }


  // =========================
  // RECOMMENDATION
  // =========================

  let recommendation =
    "Complete a quiz to receive personalized learning advice.";


  if (wrongAnswers > correctAnswers) {

    recommendation =
      "🧠 You may need more practice. Review the explanation, listen to it again, and try another example.";

  }

  else if (correctAnswers >= 3) {

    recommendation =
      "🌟 Great progress! You understand these concepts well. Try moving to the Intermediate or Advanced level.";

  }

  else if (totalQuiz > 0) {

    recommendation =
      "👍 Good start. Continue practicing and complete more quizzes to strengthen your understanding.";

  }


  // =========================
  // TEXT TO SPEECH
  // =========================

  function speakAnswer() {

    if (currentAnswer === "") {
      return;
    }


    window.speechSynthesis.cancel();


    const speech =
      new SpeechSynthesisUtterance(
        currentAnswer
      );


    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;


    window.speechSynthesis.speak(
      speech
    );

  }


  return (

    <div className="app">


      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="header-icon">

          <Brain size={38} />

        </div>


        <h1>
          Cognitive AI Learning Assistant
        </h1>


        <p>
          Understand • Visualize • Listen • Practice • Improve
        </p>

      </header>



      <main className="container">


        {/* =========================
            AI TUTOR
        ========================= */}

        <section className="card tutor-card">

          <div className="tutor-icon">

            <GraduationCap size={48} />

          </div>


          <div>

            <h2>
              Your AI Tutor
            </h2>


            <p>

              Hello everyone! 👋
              Welcome to your Cognitive AI Learning Assistant.

              <br /><br />

              I am your personal AI tutor, here to help you
              learn Python, Artificial Intelligence, and
              Machine Learning in a simple and understandable way.

              <br /><br />

              Ask me a question and I will explain the concept
              step by step, provide practical examples, show
              visual representations, and help you test your
              understanding with interactive quizzes.

              <br /><br />

              You can choose Beginner, Intermediate, or Advanced
              learning levels according to your knowledge.

              <br /><br />

              Let's learn, practice, and improve together! 🚀

            </p>

          </div>

        </section>



        {/* =========================
            AUDIO
        ========================= */}

        <section className="card">

          <div className="section-title">

            <Volume2 size={25} />

            <h2>
              Tutor Voice
            </h2>

          </div>


          <p>
            Listen to your AI tutor introduction.
          </p>


          <audio
            controls
            preload="metadata"
            className="audio-player"
          >

            <source
              src="http://127.0.0.1:5000/static/audio/guido_audio.mp3"
              type="audio/mpeg"
            />

            Your browser does not support
            the audio element.

          </audio>

        </section>



        {/* =========================
            LEARNING LEVEL
        ========================= */}

        <section className="card">

          <div className="section-title">

            <Target size={25} />

            <h2>
              Choose Your Learning Level
            </h2>

          </div>


          <p>
            Select the level that matches your
            current understanding.
          </p>


          <select
            value={level}
            onChange={(event) =>
              setLevel(event.target.value)
            }
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



        {/* =========================
            ASK TUTOR
        ========================= */}

        <section className="card question-card">

          <div className="section-title">

            <Lightbulb size={25} />

            <h2>
              Ask Your Tutor
            </h2>

          </div>


          <p>
            Ask a question about Python,
            Artificial Intelligence, or
            Machine Learning.
          </p>


          <textarea
            rows="6"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="Example: Explain Python for loop in simple terms..."
          />


          <button
            className="primary-button"
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



        {/* =========================
            EXPLANATION
        ========================= */}

        <section className="card">

          <div className="section-title">

            <Bot size={25} />

            <h2>
              Personalized Explanation
            </h2>

          </div>


          <div className="answer-box">

            <ReactMarkdown>{answer}</ReactMarkdown>

          </div>


          <button
            className="secondary-button"
            onClick={speakAnswer}
            disabled={currentAnswer === ""}
          >

            <Volume2 size={20} />

            Listen to Explanation

          </button>

        </section>



        {/* =========================
            VISUAL
        ========================= */}

        <section className="card">

          <div className="section-title">

            <BarChart3 size={25} />

            <h2>
              Visual Learning
            </h2>

          </div>


          <p>
            Understand the concept through
            a simple visual representation.
          </p>


          <div className="visual-box">
    <ReactMarkdown>{visual}</ReactMarkdown>
</div>

            

  

        </section>



        {/* =========================
            QUIZ
        ========================= */}

        {quiz && (

          <section className="card quiz-card">

            <div className="section-title">

              <ClipboardCheck size={25} />

              <h2>
                Test Your Understanding
              </h2>

            </div>


            <p>
              Answer this question to check
              your understanding.
            </p>


            <h3>
              {quiz.question}
            </h3>


            <div className="quiz-options">

              {quiz.options.map(
                (option, index) => (

                  <button
                    key={index}
                    className={
                      selectedAnswer === option
                        ? option === quiz.answer
                          ? "quiz-option correct"
                          : "quiz-option wrong"
                        : "quiz-option"
                    }
                    onClick={() =>
                      checkAnswer(option)
                    }
                    disabled={selectedAnswer !== ""}
                  >

                    {option}

                  </button>

                )
              )}

            </div>


            {selectedAnswer && (

              <div className="quiz-result">

                {selectedAnswer === quiz.answer ? (

                  <>
                    <CheckCircle size={22} />
                    Correct! Excellent work.
                  </>

                ) : (

                  <>
                    <XCircle size={22} />
                    Not quite. Correct answer: {quiz.answer}
                  </>

                )}

              </div>

            )}

          </section>

        )}



        {/* =========================
            PROGRESS
        ========================= */}

        <section className="card">

          <div className="section-title">

            <Trophy size={25} />

            <h2>
              Learning Progress
            </h2>

          </div>


          <div className="progress-info">

            <p>
              Questions Asked:
              <strong>{questionsAnswered}</strong>
            </p>


            <p>
              Correct Answers:
              <strong>{correctAnswers}</strong>
            </p>


            <p>
              Incorrect Answers:
              <strong>{wrongAnswers}</strong>
            </p>

          </div>


          <div className="progress-container">

            <div
              className="progress-bar"
              style={{
                width: `${percentage}%`
              }}
            >

              {percentage}%

            </div>

          </div>

        </section>



        {/* =========================
            RECOMMENDATION
        ========================= */}

        <section className="card recommendation-card">

          <div className="section-title">

            <Target size={25} />

            <h2>
              Cognitive Learning Recommendation
            </h2>

          </div>


          <p>
            {recommendation}
          </p>

        </section>


      </main>



      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <p>
          <Brain size={18} />
          Cognitive AI Learning Assistant
        </p>


        <p>
          Built with Python + Flask + React + AI
        </p>

      </footer>


    </div>

  );

}


export default App;
