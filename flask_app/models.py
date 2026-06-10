from datetime import datetime, timezone
from flask_app import db, login_manager
from flask_login import UserMixin
import json

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    theme = db.Column(db.String(20), nullable=False, default='dark-mode')

    # author = user
    # using backref to be able to pull up which user wrote specific reviews with review.author
    # might help when listing all reviews on user page or might be irrelevant
    reviews = db.relationship('Review', backref='author', lazy=True)

    # owner = user
    # This is only relevant for custom categories. One user might have the category "Musicals"
    # but it will NOT be added to other users
    categories = db.relationship('Category', backref='owner', lazy=True)

    def __repr__(self):
        return f"User('{self.username})"

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)

    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(200))

    # The API ID
    external_id = db.Column(db.String(50), nullable=True)

    # Store custom fields
    custom_data = db.Column(db.Text, nullable=True)

    date_finished = db.Column(db.Text, nullable=True)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Review('{self.title}', '{self.category}')"

class Category(db.Model):
    # Movie, TV Show, Book etc
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    # for custom categories
    fields = db.Column(db.Text, nullable=True)
    # the custom categories will have an option to have date finished
    has_date_finished = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Category('{self.name}')"