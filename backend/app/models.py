from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # Optional: define relationship to projects
    projects = relationship("Project", back_populates="owner")

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    issues = Column(Integer, default=0)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Optional: link back to User
    owner = relationship("User", back_populates="projects")

    def __repr__(self):
        return f"<Project(title={self.title}, owner_id={self.owner_id})>"
