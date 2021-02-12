class Config(object):
    DEBUG = False
    SECRET_KEY = "secret"

    SQLALCHEMY_DATABASE_URI = "sqlite:///users.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "secret2"
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_REFRESH_COOKIE_PATH = "/api/auth/refresh"
    JWT_ACCESS_TOKEN_EXPIRES = 600
    JWT_SESSION_COOKIE = False
    JWT_COOKIE_DOMAIN = None


class ProductionConfig(Config):
    DEBUG = False
    JWT_COOKIE_SAMESITE = "Strict"
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = True


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = None
