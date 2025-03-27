from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
import uvicorn
import pandas as pd
from pathlib import Path
import logging

from models.data_model import (
    KPIData, 
    MetricsResponse, 
    BattAliasesResponse, 
    ContinentsResponse,
    FilteredDataResponse,
    Continent,
    ModelSeriesResponse
)
from services.data_service import DataService
from config.settings import DATA_FILE, CORS_ORIGINS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
try:
    data_service = DataService(DATA_FILE)
except Exception as e:
    logger.error(f"Failed to initialize DataService: {str(e)}")
    raise

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )

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
        logger.info("GET /api/v1/data endpoint called")
        data = data_service.get_all_data()
        logger.info(f"Successfully retrieved {len(data)} records")
        return data
    except HTTPException as he:
        logger.error(f"HTTPException in get_data endpoint: {str(he)}", exc_info=True)
        raise
    except Exception as e:
        import traceback
        logger.error(f"Error in get_data endpoint: {str(e)}", exc_info=True)
        logger.error(f"Traceback: {traceback.format_exc()}")
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
        if not metrics:
            raise HTTPException(
                status_code=404,
                detail="No metrics found in the dataset"
            )
        return MetricsResponse(metrics=metrics)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_metrics endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve metrics. Please try again later."
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
        if not aliases:
            raise HTTPException(
                status_code=404,
                detail="No battery aliases found in the dataset"
            )
        return BattAliasesResponse(batt_aliases=aliases)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_batt_aliases endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve battery aliases. Please try again later."
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
        if not continents:
            raise HTTPException(
                status_code=404,
                detail="No continents found in the dataset"
            )
        return ContinentsResponse(continents=continents)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_continents endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve continents. Please try again later."
        )

@app.get("/api/v1/model-series", response_model=ModelSeriesResponse)
async def get_model_series() -> ModelSeriesResponse:
    """
    Get list of unique model series available in the dataset.
    
    Returns:
        ModelSeriesResponse: List of unique model series
        
    Raises:
        HTTPException: If model series cannot be retrieved
    """
    try:
        model_series = data_service.get_unique_model_series()
        if not model_series:
            raise HTTPException(
                status_code=404,
                detail="No model series found in the dataset"
            )
        return ModelSeriesResponse(model_series=model_series)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_model_series endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve model series. Please try again later."
        )

@app.get("/api/v1/climates", response_model=List[str])
async def get_climates() -> List[str]:
    """
    Get list of unique climates available in the dataset.
    
    Returns:
        List[str]: List of unique climates
        
    Raises:
        HTTPException: If climates cannot be retrieved
    """
    try:
        climates = data_service.get_unique_climates()
        if not climates:
            raise HTTPException(
                status_code=404,
                detail="No climates found in the dataset"
            )
        return climates
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_climates endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve climates. Please try again later."
        )

@app.get("/api/v1/data/filtered", response_model=FilteredDataResponse)
async def get_filtered_data(
    metric: str = Query(..., description="The metric to filter by"),
    batt_alias: str = Query(..., description="The battery alias to filter by"),
    continent: Optional[str] = Query(None, description="The continent to filter by"),
    climate: Optional[str] = Query(None, description="The climate to filter by")
) -> FilteredDataResponse:
    """
    Get filtered KPI data by metric and battery alias.
    
    Args:
        metric (str): The metric to filter by
        batt_alias (str): The battery alias to filter by
        continent (Optional[str]): The continent to filter by
        climate (Optional[str]): The climate to filter by
        
    Returns:
        FilteredDataResponse: Filtered KPI records with metadata
        
    Raises:
        HTTPException: If filtered data cannot be retrieved or invalid parameters
    """
    try:
        # Validate input parameters
        if not metric or not batt_alias:
            raise HTTPException(
                status_code=400,
                detail="Both metric and batt_alias parameters are required"
            )
        
        # Get filtered data - continent will be passed as string directly
        filtered_data = data_service.get_data_by_filters(metric, batt_alias, continent, climate)
        
        return FilteredDataResponse(
            data=filtered_data,
            total=len(filtered_data),
            metric=metric,
            batt_alias=batt_alias,
            continent=continent,
            climate=climate
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_filtered_data endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve filtered data. Please try again later."
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 