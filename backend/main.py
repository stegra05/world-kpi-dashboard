from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import uvicorn

from .models.data_model import KPIData
from .services.data_service import DataService
from .config.settings import DATA_FILE, CORS_ORIGINS

app = FastAPI(
    title="World KPI Dashboard API",
    description="API for the World KPI Dashboard",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data service
data_service = DataService(DATA_FILE)

@app.get("/", response_model=Dict[str, str])
async def root() -> Dict[str, str]:
    """
    Root endpoint returning a status message.
    
    Returns:
        Dict[str, str]: Status message
    """
    return {"message": "World KPI Backend läuft"}

@app.get("/api/data", response_model=List[KPIData])
async def get_data():
    """Get all KPI data."""
    try:
        return data_service.get_all_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics")
async def get_metrics():
    """Get list of unique metrics."""
    try:
        return data_service.get_unique_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/batt-aliases")
async def get_batt_aliases():
    """Get list of unique battery aliases."""
    try:
        return data_service.get_unique_batt_aliases()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/filtered", response_model=List[KPIData])
async def get_filtered_data(metric: str, batt_alias: str):
    """Get filtered KPI data by metric and battery alias."""
    try:
        return data_service.get_data_by_filters(metric, batt_alias)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 