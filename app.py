from models.question import Question
from models.quiz_result import QuizResult
from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
from database.db import db
from models.question import Question
import os


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY was not found. "
        "Please add your Gemini API key to the .env file."
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(api_key=api_key)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cognitive_learning.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# ============================================================
# COGNITIVE AI TUTOR PROMPT
# ============================================================

TUTOR_PROMPT = """
You are Cognitive Learning Assistant, an intelligent and
personalized AI tutor for college students.

Your goal is not only to answer questions but also to help
students understand concepts clearly.

Follow these rules:

1. Explain concepts in simple and clear language.

2. Adjust the explanation according to the student's level:
   - Beginner
   - Intermediate
   - Advanced

3. Start with a simple definition.

4. Explain the concept step-by-step.

5. Give a simple real-world or programming example whenever
   appropriate.

6. Highlight important points.

7. Avoid unnecessarily complicated terminology.

8. If a technical term is necessary, explain that term simply.

9. Encourage the student to learn rather than simply giving
   the final answer.

10. For programming questions, provide simple examples and
    explain what the code does.

11. For Artificial Intelligence and Machine Learning topics,
    use intuitive explanations and examples.

12. End the response with a short learning tip.

The response should be educational, friendly, concise,
and easy for a college student to understand.
"""


# ============================================================
# GENERATE AI TUTOR RESPONSE
# ============================================================

def generate_tutor_response(question, level):

    prompt = f"""
{TUTOR_PROMPT}

Student Learning Level:
{level}

Student Question:
{question}

Now provide the best possible educational explanation.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():

    return render_template("index.html")


# ============================================================
# ASK TUTOR API
# ============================================================

@app.route("/ask", methods=["POST"])
def ask():

    try:

        # ----------------------------------------------------
        # GET DATA FROM FRONTEND
        # ----------------------------------------------------

        data = request.get_json()

        question = data.get("question", "").strip()

        level = data.get("level", "beginner")


        # ----------------------------------------------------
        # VALIDATE QUESTION
        # ----------------------------------------------------

        if not question:

            return jsonify({
                "error": "Please enter a question."
            }), 400


        # Prevent extremely large questions
        if len(question) > 2000:

            return jsonify({
                "error": "Question is too long. Please keep it under 2000 characters."
            }), 400


        # ----------------------------------------------------
        # GENERATE AI ANSWER
        # ----------------------------------------------------

        answer = generate_tutor_response(
            question,
            level
        )


        # ----------------------------------------------------
        # SAVE QUESTION + ANSWER TO SQLITE DATABASE
        # ----------------------------------------------------

        new_question = Question(
            question=question,
            level=level,
            explanation=answer
        )

        db.session.add(new_question)

        db.session.commit()


        # ----------------------------------------------------
        # VISUAL LEARNING REPRESENTATION
        # ----------------------------------------------------

        visual = """
Student Question
       |
       v
Cognitive AI Tutor
       |
       v
Understand Question
       |
       v
Generate Explanation
       |
       v
Example / Key Points
       |
       v
Student Learning
       |
       v
Quiz & Progress
"""


        # ----------------------------------------------------
        # BASIC QUIZ
        # ----------------------------------------------------

        quiz = {

            "question":
                "Did you understand the explanation?",

            "options": [
                "Yes",
                "A little",
                "Not yet"
            ],

            "answer":
                "Yes"
        }


        # ----------------------------------------------------
        # SEND RESPONSE TO FRONTEND
        # ----------------------------------------------------

        return jsonify({

            "explanation": answer,

            "visual": visual,

            "quiz": quiz

        })


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print("\n========== GEMINI ERROR ==========")

        print(type(e).__name__)

        print(str(e))

        print("==================================\n")


        # Roll back database transaction if necessary

        try:

            db.session.rollback()

        except Exception:

            pass


        return jsonify({

            "error":
                "Gemini API error. Check the VS Code terminal."

        }), 500
# ============================================================
# SAVE QUIZ RESULT
# ============================================================

@app.route("/quiz-result", methods=["POST"])
def save_quiz_result():

    try:

        data = request.get_json()

        question_id = data.get("question_id")

        quiz_question = data.get(
            "quiz_question",
            ""
        ).strip()

        selected_answer = data.get(
            "selected_answer",
            ""
        ).strip()

        correct_answer = data.get(
            "correct_answer",
            ""
        ).strip()

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not quiz_question:
            return jsonify({
                "error": "Quiz question is missing."
            }), 400

        if not selected_answer:
            return jsonify({
                "error": "Selected answer is missing."
            }), 400

        if not correct_answer:
            return jsonify({
                "error": "Correct answer is missing."
            }), 400

        # ----------------------------------------------------
        # CHECK ANSWER
        # ----------------------------------------------------

        is_correct = (
            selected_answer == correct_answer
        )

        # ----------------------------------------------------
        # CREATE DATABASE RECORD
        # ----------------------------------------------------

        result = QuizResult(

            question_id=question_id,

            quiz_question=quiz_question,

            selected_answer=selected_answer,

            correct_answer=correct_answer,

            is_correct=is_correct
        )

        db.session.add(result)

        db.session.commit()

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "message": "Quiz result saved successfully.",

            "is_correct": is_correct,

            "result": (
                "Correct! Excellent work."
                if is_correct
                else "Not quite. Keep practicing."
            )
        })

    except Exception as e:

        print("\n========== QUIZ ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("================================\n")

        db.session.rollback()

        return jsonify({
            "error": "Could not save quiz result."
        }), 500

# ============================================================
# CREATE DATABASE TABLES
# ============================================================

with app.app_context():

    db.create_all()


# ============================================================
# RUN FLASK SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )