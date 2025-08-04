from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi.security import OAuth2PasswordBearer

# Token scheme used by FastAPI Depends()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# -------- Project Schemas --------
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    issues: int 
    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    issues: int

# -------- User Schemas --------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True


# -------- Token --------
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserOut]
