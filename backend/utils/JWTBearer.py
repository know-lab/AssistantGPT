import time
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
import os
import dotenv

dotenv.load_dotenv()


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await HTTPBearer()(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme."
                )
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token."
                )
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        isTokenValid: bool = False

        try:
            payload = self.decodeJWT(jwtoken)
        except Exception:
            payload = None
        if payload:
            isTokenValid = True
        return isTokenValid

    def decodeJWT(self, token: str):
        try:
            decoded_token = jwt.decode(
                token,
                os.environ.get("JWT_SECRET"),
                algorithms=[os.environ.get("JWT_ALGORITHM")],
                options={"verify_aud": False},
            )
            return decoded_token if decoded_token["exp"] >= time.time() else None
        except Exception as e:
            return {"error": str(e)}
