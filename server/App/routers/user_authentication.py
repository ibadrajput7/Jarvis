from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from App.schemas import UserCreate, UserLogin  
from App.database.database import get_db
from App.database.models import User
from App.authentication.utils import hash_password, verify_password
from App.authentication.auth import create_access_token, verify_access_token

router = APIRouter()

@router.post("/register")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_username = db.query(User).filter(User.username == user.username).first()
    existing_email = db.query(User).filter(User.email == user.email).first()

    if existing_username or existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )


    hashed_password = hash_password(user.password)

    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()  
    db.refresh(new_user)

    return {"message": f"{user.username} registered successfully"}


@router.post("/login")
def user_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

 
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = create_access_token({"sub": db_user.username})

    return {"access_token": access_token, "token_type": "bearer"}