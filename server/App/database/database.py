from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# user_login --> 'ibad'@'localhost';
DATABASE_URL = "mysql+mysqlconnector://ibad:Ibadibad_123@localhost:3306/user_login"
engine = create_engine(DATABASE_URL) 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Provide the session
    finally:
        db.close()  # Close session after use
