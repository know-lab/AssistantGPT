from fastapi import APIRouter, Depends
from pydantic import BaseModel

from exceptions.request_error import RequestError
from utils.jwt_wrapper import JWTBearer
from utils.supabase_wrapper import SupabaseWrapper

supabase = SupabaseWrapper().client

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


class Credentials(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register(credentials: Credentials):
    try:
        return supabase.auth.sign_up(
            {
                "email": credentials.email,
                "password": credentials.password,
            }
        )
    except RequestError:
        return {"error": "Registration failed"}


@router.post("/login")
async def login(credentials: Credentials):
    try:
        return supabase.auth.sign_in_with_password({"email": credentials.email, "password": credentials.password})
    except RequestError:
        return {"error": "Login failed"}


@router.post("/login/google")
async def login_google():
    try:
        return supabase.auth.sign_in_with_oauth({"provider": "google"})
    except RequestError:
        return {"error": "Login failed"}


@router.post("/login/microsoft")
async def login_microsoft():
    try:
        return supabase.auth.sign_in_with_oauth({"provider": "microsoft"})
    except RequestError:
        return {"error": "Login failed"}


@router.post("/login/github")
async def login_github():
    try:
        return supabase.auth.sign_in_with_oauth({"provider": "github"})
    except RequestError:
        return {"error": "Login failed"}


@router.post("/logout", dependencies=[Depends(JWTBearer())])
async def logout():
    try:
        supabase.auth.sign_out()
        return "Successfully logged out"
    except RequestError:
        return {"error": "Logout failed"}


@router.get("/user", dependencies=[Depends(JWTBearer())])
async def get_user():
    try:
        return supabase.auth.get_user()
    except RequestError:
        return {"error": "User not found"}


@router.get("/session")
async def get_session():
    try:
        return supabase.auth.get_session()
    except RequestError:
        return {"error": "Session not found"}


@router.get("/refresh")
async def refresh():
    try:
        return supabase.auth.refresh_session()
    except RequestError:
        return {"error": "Refresh failed"}


@router.get("/jwt")
async def get_jwt():
    try:
        res = supabase.auth.get_session()
        return res.access_token
    except RequestError:
        return {"error": "JWT not found"}
