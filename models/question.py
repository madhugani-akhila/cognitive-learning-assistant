from database.db import db
from datetime import datetime


class Question(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    level = db.Column(
        db.String(50),
        nullable=False
    )

    explanation = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )