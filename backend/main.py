from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import uvicorn
import pandas as pd
from pathlib import Path

from .models.data_model import (
    KPIData, 
    MetricsResponse, 
    BattAliasesResponse, 
    ContinentsResponse,
    FilteredDataResponse,
    Continent
)
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

@app.get("/api/v1/data", response_model=List[KPIData])
async def get_data() -> List[KPIData]:
    """
    Get all KPI data from the CSV file.
    
    Returns:
        List[KPIData]: List of KPI records
        
    Raises:
        HTTPException: If data loading fails
    """
    try:
        return data_service.get_all_data()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load KPI data: {str(e)}"
        )

@app.get("/api/v1/metrics", response_model=MetricsResponse)
async def get_metrics() -> MetricsResponse:
    """
    Get list of unique metrics available in the dataset.
    
    Returns:
        MetricsResponse: List of unique metric names
        
    Raises:
        HTTPException: If metrics cannot be retrieved
    """
    try:
        metrics = data_service.get_unique_metrics()
        return MetricsResponse(metrics=metrics)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve metrics: {str(e)}"
        )

@app.get("/api/v1/batt-aliases", response_model=BattAliasesResponse)
async def get_batt_aliases() -> BattAliasesResponse:
    """
    Get list of unique battery aliases available in the dataset.
    
    Returns:
        BattAliasesResponse: List of unique battery aliases
        
    Raises:
        HTTPException: If battery aliases cannot be retrieved
    """
    try:
        aliases = data_service.get_unique_batt_aliases()
        return BattAliasesResponse(batt_aliases=aliases)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve battery aliases: {str(e)}"
        )

@app.get("/api/v1/data/filtered", response_model=FilteredDataResponse)
async def get_filtered_data(
    metric: str = Query(..., description="The metric to filter by"),
    batt_alias: str = Query(..., description="The battery alias to filter by")
) -> FilteredDataResponse:
    """
    Get filtered KPI data by metric and battery alias.
    
    Args:
        metric (str): The metric to filter by
        batt_alias (str): The battery alias to filter by
        
    Returns:
        FilteredDataResponse: Filtered KPI records with metadata
        
    Raises:
        HTTPException: If filtered data cannot be retrieved or invalid parameters
    """
    try:
        # Validate input parameters
        available_metrics = data_service.get_unique_metrics()
        available_aliases = data_service.get_unique_batt_aliases()
        
        if metric not in available_metrics:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid metric. Available metrics: {available_metrics}"
            )
            
        if batt_alias not in available_aliases:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid battery alias. Available aliases: {available_aliases}"
            )
        
        # Get filtered data
        filtered_data = data_service.get_data_by_filters(metric, batt_alias)
        
        return FilteredDataResponse(
            data=filtered_data,
            total=len(filtered_data),
            metric=metric,
            batt_alias=batt_alias
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve filtered data: {str(e)}"
        )

@app.get("/api/v1/continents", response_model=ContinentsResponse)
async def get_continents() -> ContinentsResponse:
    """
    Get list of unique continents available in the dataset.
    
    Returns:
        ContinentsResponse: List of unique continents
        
    Raises:
        HTTPException: If continents cannot be retrieved
    """
    try:
        continents = data_service.get_unique_continents()
        return ContinentsResponse(continents=continents)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve continents: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 