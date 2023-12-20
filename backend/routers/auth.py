from fastapi import APIRouter, Depends
from pydantic import BaseModel
from exceptions.RequestError import RequestError
from utils.SupabaseWrapper import SupabaseWrapper
from utils.JWTBearer import JWTBearer

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
        res = supabase.auth.sign_up(
            {
                "email": credentials.email,
                "password": credentials.password,
            }
        )
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.post("/login")
async def login(credentials: Credentials):
    try:
        res = supabase.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.post("/login/google")
async def login_google():
    try:
        res = supabase.auth.sign_in_with_oauth({"provider": "google"})
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.post("/login/microsoft")
async def login_microsoft():
    try:
        res = supabase.auth.sign_in_with_oauth({"provider": "microsoft"})
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.post("/login/github")
async def login_github():
    try:
        res = supabase.auth.sign_in_with_oauth({"provider": "github"})
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.post("/logout", dependencies=[Depends(JWTBearer())])
async def logout():
    try:
        supabase.auth.sign_out()
        return "Successfully logged out"
    except RequestError as e:
        return {"error": str(e)}


@router.get("/user", dependencies=[Depends(JWTBearer())])
async def get_user():
    try:
        res = supabase.auth.get_user()
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.get("/session")
async def get_session():
    try:
        res = supabase.auth.get_session()
        return res
    except RequestError as e:
        return {"error": str(e)}


@router.get("/jwt")
async def get_jwt():
    try:
        res = supabase.auth.get_session()
        return res.access_token
    except RequestError as e:
        return {"error": str(e)}
