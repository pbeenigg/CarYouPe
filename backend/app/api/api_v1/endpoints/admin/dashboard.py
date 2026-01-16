from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_admin_dashboard():
    return {"message": "Admin Dashboard"}
