from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas import UserOut
from app import models, schemas, auth
from app.database import engine, get_db

app = FastAPI()

# -------- Create tables --------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Signup --------
@app.post("/signup", response_model=schemas.UserOut)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await auth.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

# -------- Login --------
@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = auth.create_access_token(data={"sub": user.username})
    user_data = UserOut.from_orm(user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data,
    }

# -------- Create Project --------
@app.post("/projects", response_model=schemas.ProjectOut)
async def create_project(
    project: schemas.ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    new_project = models.Project(**project.dict(), owner_id=current_user.id)
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

# -------- Read Projects --------
@app.get("/projects", response_model=list[schemas.ProjectOut])
async def read_projects(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    result = await db.execute(select(models.Project).where(models.Project.owner_id == current_user.id))
    return result.scalars().all()

# -------- Update Issues --------
@app.patch("/projects/{project_id}", response_model=schemas.ProjectOut)
async def update_project_issues(
    project_id: int,
    update_data: schemas.ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Project).where(
        models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.issues = update_data.issues
    await db.commit()
    await db.refresh(project)
    return project

# -------- Delete Project --------
@app.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    result = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.issues <= 50:
        raise HTTPException(status_code=400, detail="Cannot delete: issues must be > 50")

    await db.delete(project)
    await db.commit()
    return {"detail": "Project deleted"}
