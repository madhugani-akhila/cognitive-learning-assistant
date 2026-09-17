from database.db import db
from datetime import datetime


class QuizResult(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    question_id = db.Column(
        db.Integer,
        nullable=True
    )

    quiz_question = db.Column(
        db.Text,
        nullable=False
    )

    selected_answer = db.Column(
        db.String(255),
        nullable=False
    )

    correct_answer = db.Column(
        db.String(255),
        nullable=False
    )

    is_correct = db.Column(
        db.Boolean,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )