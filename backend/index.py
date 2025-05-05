from fastapi import FastAPI
from api.auth import router as auth_router
from api.analytics import router as analytics_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])