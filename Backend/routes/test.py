from fastapi import APIRouter

router = APIRouter()

@router.post("/api/test-predict")
async def test_predict_route():
    return {
        "success": True,
        "result": {
            "class": "A",
            "confidence": 0.95,
            "index": 0
        }
    }

@router.post("/api/test-dynamic")
async def test_dynamic_route():
    return {
        "success": True,
        "result": {
            "class": "Halo",
            "confidence": 0.92,
            "index": 11,
            "modelUsed": "lstm"
        }
    }