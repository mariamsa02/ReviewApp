from flask import render_template, url_for, flash, redirect, request
from flask_app import app, db
from flask_login import login_user, current_user, logout_user, login_required

@app.route("/")
@app.route("/home")
@login_required
def home():
    pass


@app.route("/register", methods=['GET', 'POST'])
def register():
    pass


@app.route("/login", methods=['GET', 'POST'])
def login():
    pass

@app.route("/logout")
def logout():
    pass
