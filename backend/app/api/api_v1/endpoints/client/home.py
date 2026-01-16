from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_client_home():
    return {"message": "Mini Program Home"}
