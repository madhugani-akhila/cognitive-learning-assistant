let currentAnswer = "";

let correctAnswer = "";

let questionsAnswered = 0;

let correctAnswers = 0;

let wrongAnswers = 0;



async function askTutor() {

    const question =
        document.getElementById("question").value.trim();

    const level =
        document.getElementById("level").value;


    if (question === "") {

        alert("Please enter a question.");

        return;
    }


    document.getElementById("answer").innerText =
        "🤔 Your tutor is thinking...";


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


        if (data.error) {

            alert(data.error);

            return;
        }


        /* Explanation */

        currentAnswer = data.explanation;

        document.getElementById("answer").innerText =
            data.explanation;


        document.getElementById("speakButton").disabled =
            false;



        /* Visual */

        document.getElementById("visual").innerText =
            data.visual;



        /* Quiz */

        showQuiz(data.quiz);



        /* Progress */

        questionsAnswered++;

        updateProgress();

    }

    catch (error) {

        console.error(error);

        document.getElementById("answer").innerText =
            "Something went wrong.";

    }

}



function showQuiz(quiz) {

    const quizSection =
        document.getElementById("quizSection");

    quizSection.style.display =
        "block";


    document.getElementById("quizQuestion").innerText =
        quiz.question;


    correctAnswer =
        quiz.answer;


    const optionsContainer =
        document.getElementById("quizOptions");


    optionsContainer.innerHTML =
        "";


    quiz.options.forEach(function(option) {

        const button =
            document.createElement("button");


        button.innerText =
            option;


        button.classList.add(
            "quiz-option"
        );


        button.onclick =
            function() {

                checkAnswer(option);

            };


        optionsContainer.appendChild(button);

    });


    document.getElementById("quizResult").innerText =
        "";

}



function checkAnswer(selectedAnswer) {

    const result =
        document.getElementById("quizResult");


    if (selectedAnswer === correctAnswer) {

        result.innerText =
            "✅ Correct! Excellent work.";

        correctAnswers++;

    }

    else {

        result.innerText =
            "❌ Not quite. Correct answer: "
            + correctAnswer;

        wrongAnswers++;

    }


    updateProgress();

    generateRecommendation();

}



function updateProgress() {

    document.getElementById("questionsCount").innerText =
        questionsAnswered;


    document.getElementById("correctCount").innerText =
        correctAnswers;


    document.getElementById("wrongCount").innerText =
        wrongAnswers;


    const totalQuiz =
        correctAnswers + wrongAnswers;


    let percentage = 0;


    if (totalQuiz > 0) {

        percentage =
            Math.round(
                (correctAnswers / totalQuiz) * 100
            );

    }


    const progressBar =
        document.getElementById("progressBar");


    progressBar.style.width =
        percentage + "%";


    progressBar.innerText =
        percentage + "%";

}



function generateRecommendation() {

    const recommendation =
        document.getElementById("recommendation");


    if (wrongAnswers > correctAnswers) {

        recommendation.innerText =
            "🧠 You may need more practice. "
            + "Review the explanation, listen to it again, "
            + "and try another example.";

    }

    else if (correctAnswers >= 3) {

        recommendation.innerText =
            "🌟 Great progress! You understand these concepts well. "
            + "Try moving to the Intermediate or Advanced level.";

    }

    else {

        recommendation.innerText =
            "👍 Good start. Continue practicing and complete "
            + "more quizzes to strengthen your understanding.";

    }

}



function speakAnswer() {

    if (currentAnswer === "") {

        return;

    }


    /*
       Browser Text-To-Speech.

       Later we will replace this section
       with ElevenLabs dynamic speech.
    */

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            currentAnswer
        );


    speech.rate =
        0.9;


    speech.pitch =
        1;


    speech.volume =
        1;


    window.speechSynthesis.speak(
        speech
    );

}