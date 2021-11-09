from flask_mongoengine import MongoEngine

# Configuración del servidor de MongoDB
mongo_settings = {
    "db": "usm-studyrooms",
    "host": "localhost",
    "port": 27017
}

db = MongoEngine()