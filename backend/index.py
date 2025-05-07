from fastapi import FastAPI
from api.auth import router as auth_router
from api.analytics import router as analytics_router
from api.history import router as history_router
from api.llm_settings import router as settings_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",  # Allow your Next.js frontend
    "http://localhost:8000",  # Allow your FastAPI backend (if needed)
    "https://your-production-domain.com",  # Add your production domain
    "*", # Be VERY CAREFUL with this - only use for testing in trusted environments!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True, # Allow cookies and authorization headers
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(history_router, prefix="/chats", tags=["history"])
app.include_router(settings_router, prefix="/llm-settings", tags=["LLM Settings"])