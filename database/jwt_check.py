import os
import jwt
from fastapi import Depends
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer



load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)



def create_todo_optional(token: str | None = Depends(oauth2_scheme_optional)) -> str | None:
    if token is None:
        return None

    try: 
        payload: dict = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        acc_id: str = payload.get("sub")
    except jwt.InvalidTokenError:
        return None

    return acc_id