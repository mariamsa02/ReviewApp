import json
from flask import render_template, url_for, redirect, flash, jsonify, request
from flask_app import app, db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required, LoginManager

from flask_app.api import query_api
from flask_app.forms import RegisterForm, LoginForm
from flask_app.models import User, Review, Category


@app.route("/")
@app.route("/home")
@login_required
def home():
    # Mock reviews for testing, will be replaced
    # these are the last two movies I watched IRL lol
    mock_reviews = [
        {
            'id': 2,
            'title': 'Kuroshitsuji: Book of the Atlantic',
            'content': 'Very low budget and kind of terrible but fun to watch',
            'rating': 4,
            'image_url': 'https://m.media-amazon.com/images/M/MV5BYzNjMjZhYTYtMGRiNS00MGJmLTlkYTUtMDI1Y2QxZjdiZDFhXkEyXkFqcGc@._V1_FMjpg_UX640_.jpg',
            'date_posted': '2026-02-13'
        },
        {'id': 3,
         'title': 'Kuroshitsuji: Book of Murder',
         'content': 'murder mystery story orchestrated by the queen to beef with a 13 year old, featuring anime arthur conan doyle, who ends up getting traumatized to ensure Sebastians son always has his books to read. Yay.',
         'rating': 3,
         'image_url': 'https://m.media-amazon.com/images/M/MV5BZTJjMGUyN2ItYjBiNy00OGMyLWJhYTItOGJiMmQ5NjU1NDIzXkEyXkFqcGc@._V1_FMjpg_UX522_.jpg',
         'date_posted': '2026-02-13'}
    ]

    return render_template('home.html', reviews=mock_reviews)


@app.route("/api/search")
def api_search():
    # looks at the query string in the url. q = query
    query = request.args.get('q')
    category = request.args.get('category')

    if not query or not category:
        return jsonify([])

    # send the category and query to query_api from the api module (TMDB/google books),
    results = query_api(category, query)

    if results is None:
        return jsonify([])

    return jsonify(results)


### NOT RELEVANT AT CURRENT STAGE ###
# This is the final stage of the new review process, it is called AFTER the entire form is filled out and saves the review to the database
@app.route("/new", methods=['GET', 'POST'])
@login_required
def save_review():
    if request.method == 'POST':
    # Get data from the form, must match HTML tags
        title = request.form.get('title')
        category = request.form.get('category')
        content = request.form.get('review_text')
        rating = request.form.get('rating', 1)
        image_url = request.form.get('image_url')

        # custom fields like author etc., store as json string
        extra_fields = {}
        for key in request.form:
            if key not in ['title', 'category', 'review_text', 'rating', 'image_url']:
                extra_fields[key] = request.form.get(key)

        # create database object
        saved_review = Review(
            title=title,
            category=category,
            content=content,
            rating=int(rating),
            image_url=image_url,
            # Save as a string
            extra_metadata=json.dumps(extra_fields),
            # Connects to the logged-in user
            author=current_user
        )

        # save and commit
        db.session.add(saved_review)
        db.session.commit()

        flash('Review created!', 'success')
        return redirect(url_for('home'))

    return render_template('new.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, password=hashed_password)
        # add new user to database
        db.session.add(new_user)
        db.session.commit()
        flash("Account was successfully created! Please log in.")
        return redirect(url_for('login'))

    # use CSS to actually flash the errors
    for field, errors in form.errors.items():
        for error in errors:
            flash(error, "error")

    return render_template('register.html', form=form)



@app.route("/login", methods=['GET', 'POST'])
def login():
    error = "Incorrect username or password. Please try again."

    form = LoginForm()
    # search for user if valid
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('home'))
            else:
                flash(error)
        else:
            flash(error)

    return render_template('login.html', form=form)


@app.route("/logout", methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
