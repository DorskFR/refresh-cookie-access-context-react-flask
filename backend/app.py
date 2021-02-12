# Flask related imports
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    jwt_refresh_token_required,
    create_refresh_token,
    get_jwt_identity,
    verify_jwt_in_request,
    get_jwt_claims,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)

# Other imports
from datetime import datetime, timedelta
import os
import time


# Config
app = Flask(__name__)
if app.config["ENV"] == "development":
    app.config.from_object("config.DevelopmentConfig")
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    app.config.from_object("config.ProductionConfig")
    CORS(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)


################################# dbModel ######################################


class User(db.Model):
    id = db.Column(db.Integer, unique=True, index=True, primary_key=True)
    username = db.Column(db.String(254), nullable=False,
                         index=True, unique=True)
    email = db.Column(db.String(254), nullable=False, index=True, unique=True)
    password = db.Column(db.String(254), nullable=False)
    role = db.Column(db.String(12), nullable=False)
    created = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(254), nullable=False, default="active")


################################### UTILS ######################################


# Check role admin
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        try:
            if claims["role"] != "admin":
                return jsonify(msg="Admins only!"), 403
            else:
                return fn(*args, **kwargs)
        except:
            return fn(*args, **kwargs)

    return wrapper


################################### AUTH #######################################


# Register a new user in database
@app.route("/api/auth/register", methods=["POST"])
def register():
    username = request.get_json()["username"]
    email = request.get_json()["email"].lower()
    role = request.get_json()["role"]
    password = generate_password_hash(request.get_json()["password"])
    created = datetime.utcnow()

    db_user = db.session.query(User).filter_by(email=email).first()
    if db_user:
        return {"error": "This E-mail is already in use."}, 400
    db_user = db.session.query(User).filter_by(username=username).first()
    if db_user:
        return {"error": "This Username is already in use."}, 400

    try:
        user = User(
            username=username,
            email=email,
            role=role,
            password=password,
            created=created,
        )
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        {"error": f"Could not register user."}, 400

    return {"message": "User created successfully"}, 201


# Login user
@app.route("/api/auth/login", methods=["POST"])
def login():
    email = request.get_json()["email"].lower()
    password = request.get_json()["password"]
    user = db.session.query(User).filter_by(email=email).first()

    if user == None:
        return jsonify({"error": "User not found."}), 400
    if user.status != "active":
        return {"error": "User not allowed."}, 403
    if not check_password_hash(user.password, password):
        return {"error": "Wrong password."}, 400

    try:
        if check_password_hash(user.password, password):
            access_token = create_access_token(
                identity={
                    "username": user.username,
                    "email": user.email.lower(),
                    "role": user.role,
                },
                expires_delta=timedelta(seconds=600),
                fresh=True,
                user_claims=user.role,
            )
            refresh_token = create_refresh_token(
                identity={
                    "username": user.username,
                    "email": user.email.lower(),
                    "role": user.role,
                }
            )
            resp = jsonify({"access_token": access_token})
            set_refresh_cookies(resp, refresh_token)
            return resp, 200
        else:
            return {"error": f"Could not login."}, 400
    except:
        return {"error": f"Could not login."}, 400


# Refresh access token
@app.route("/api/auth/refresh", methods=["GET"])
@jwt_refresh_token_required
def refresh():
    user = get_jwt_identity()
    db_user = db.session.query(User).filter_by(
        username=user["username"]).first()
    if db_user.status != "active":
        return {"error": "User not allowed."}, 403
    resp = {
        "access_token": create_access_token(
            identity={
                "username": user["username"],
                "email": user["email"].lower(),
                "role": user["role"],
            },
            expires_delta=timedelta(seconds=600),
            fresh=False,
            user_claims=user["role"],
        )
    }
    return jsonify(resp), 200


# Endpoint for revoking the current users refresh token
# Blacklist not implemented
@app.route("/api/auth/logout", methods=["DELETE"])
@jwt_required
def logout():
    resp = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(resp)
    return resp, 200


# Delete a user
# Need to be admin (role is in access token)
@app.route("/api/admin/deluser/<id>", methods=["DELETE"])
@admin_required
def del_user(id):
    user = db.session.query(User).get(id)
    if user == None:
        return {"error": "User not found."}, 404
    user.status = "deleted"
    db.session.commit()
    return {"message": "User deleted successfully."}, 200


###############################################################################


# Starting the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
