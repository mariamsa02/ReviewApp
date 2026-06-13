# to do: update the look of buttons etc on review forms, fix formatting
# to do: custom category/review routes

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

    categories = Category.query.filter_by(user_id=current_user.id).all()

    category = request.args.get('category')
    rating = request.args.get('rating')

    query = Review.query.filter_by(user_id=current_user.id)
    if category:
        query = query.filter_by(category=category)
    if rating:
        query = query.filter_by(rating=int(rating))
    reviews = query.all()

    return render_template('home.html', reviews=reviews, categories=categories)


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


@app.route("/search")
@login_required
def search():
    categories = Category.query.filter_by(user_id=current_user.id).all()

    return render_template('search.html', categories=categories)


@app.route("/custom", methods=['GET', 'POST'])
@login_required
def custom():
    if request.method == 'POST':
        # Get custom category data from the form
        name = request.form.get('category-name', '').strip()
        field1 = request.form.get('field1', '').strip()
        field2 = request.form.get('field2', '').strip()
        field3 = request.form.get('field3', '').strip()
        has_date = request.form.get('has-date-input') == 'true'

        saved_category = Category(
            name=name,
            field1=field1,
            field2=field2,
            field3=field3,
            has_date_finished=has_date,
            user_id =current_user.id

        )

        db.session.add(saved_category)
        db.session.commit()

        return redirect(url_for('search'))

    return render_template('custom_category.html')


@app.route("/custom-review/<int:category_id>", methods=['GET', 'POST'])
@login_required
def save_custom_review(category_id):
    category = Category.query.get_or_404(category_id)

    if request.method == 'POST':
        title = request.form.get('title')
        category_name = category.name
        content = request.form.get('review_text')
        rating = request.form.get('rating', 1)
        image_url = request.form.get('image_url')
        if request.form.get('date_finished'):
            date_finished = request.form.get('date_finished')
        else:
            date_finished = ""

        custom_fields = {}
        if category.field1:
            custom_fields[category.field1] = request.form.get(category.field1, "")
        if category.field2:
            custom_fields[category.field2] = request.form.get(category.field2, "")
        if category.field3:
            custom_fields[category.field3] = request.form.get(category.field3, "")

        saved_review = Review(
            title=title,
            category=category_name,
            content=content,
            rating=int(rating),
            image_url=image_url,
            date_finished = date_finished,
            # Save as a string
            custom_data=json.dumps(custom_fields),
            # Connects to the logged-in user
            author=current_user
        )

        # save and commit
        db.session.add(saved_review)
        db.session.commit()

        # flash('Review created!', 'success')
        return redirect(url_for('home'))

    return render_template('custom_review.html', category=category)



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
        date_finished = request.form.get('date_finished')


    # custom fields like author etc., store as json string
        extra_fields = {}
        for key in request.form:
            if key not in ['title', 'category', 'review_text', 'rating', 'image_url', 'date_finished']:
                extra_fields[key] = request.form.get(key)

        # create database object
        saved_review = Review(
            title=title,
            category=category,
            content=content,
            rating=int(rating),
            image_url=image_url,
            date_finished = date_finished,
            # Save as a string
            custom_data=json.dumps(extra_fields),
            # Connects to the logged-in user
            author=current_user
        )

        # save and commit
        db.session.add(saved_review)
        db.session.commit()

        # flash('Review created!', 'success')
        return redirect(url_for('home'))

    return render_template('new.html',
                           title=request.args.get('title'),
                           image_url=request.args.get('image_url'),
                           category=request.args.get('category')
                           )


@app.route("/delete/<int:review_id>", methods=['POST'])
@login_required
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return redirect(url_for('home'))


@app.route("/edit/<int:review_id>", methods=['GET', 'POST'])
@login_required
def edit_review(review_id):
    review = Review.query.get_or_404(review_id)

    if request.method == 'POST':
        review.title = request.form.get('title')
        review.content = request.form.get('review_text')
        review.rating = int(request.form.get('rating'))
        review.date_finished = request.form.get('date_finished')

        db.session.commit()
        return redirect(url_for('home'))

    return render_template('edit.html', review=review)


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


@app.route("/theme", methods=['POST'])
@login_required
def set_theme():
    theme = request.json.get('theme')
    current_user.theme = theme
    db.session.commit()
    return jsonify({'status': 'ok'})

@app.route("/logout", methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
