from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Dict, Any, Optional
import uvicorn
import pandas as pd
from pathlib import Path
import logging
import os
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache

from models.data_model import (
    KPIData, 
    MetricsResponse, 
    BattAliasesResponse, 
    ContinentsResponse,
    FilteredDataResponse,
    Continent,
    ModelSeriesResponse
)
from services.data_service import DataService, DataLoadError, InvalidFilterError
from config.settings import DATA_FILE, CORS_ORIGINS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define static file paths
STATIC_DIR = "../frontend/dist"
STATIC_ASSETS_DIR = os.path.join(STATIC_DIR, "assets")
INDEX_HTML_FILE = os.path.join(STATIC_DIR, "index.html")

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

# Initialize cache
@app.on_event("startup")
async def startup():
    FastAPICache.init(InMemoryBackend())

# Mount static assets directory if it exists
if os.path.isdir(STATIC_ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=STATIC_ASSETS_DIR), name="assets")
else:
    logger.warning(f"Frontend assets directory not found at {STATIC_ASSETS_DIR}")

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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_data endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        import traceback
        logger.error(f"Error in get_data endpoint: {str(e)}", exc_info=True)
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load KPI data: {str(e)}"
        )

@app.get("/api/v1/metrics", response_model=MetricsResponse)
@cache(expire=3600)
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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_metrics endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        logger.error(f"Error in get_metrics endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve metrics. Please try again later."
        )

@app.get("/api/v1/batt-aliases", response_model=BattAliasesResponse)
@cache(expire=3600)
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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_batt_aliases endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        logger.error(f"Error in get_batt_aliases endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve battery aliases. Please try again later."
        )

@app.get("/api/v1/continents", response_model=ContinentsResponse)
@cache(expire=3600)
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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_continents endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        logger.error(f"Error in get_continents endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve continents. Please try again later."
        )

@app.get("/api/v1/model-series", response_model=ModelSeriesResponse)
@cache(expire=3600)
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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_model_series endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        logger.error(f"Error in get_model_series endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve model series. Please try again later."
        )

@app.get("/api/v1/climates", response_model=List[str])
@cache(expire=3600)
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
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_climates endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
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
    Get filtered KPI data based on specified criteria.
    
    Args:
        metric: The metric to filter by
        batt_alias: The battery alias to filter by
        continent: Optional continent filter
        climate: Optional climate filter
        
    Returns:
        FilteredDataResponse: Filtered KPI data with metadata
        
    Raises:
        HTTPException: If data loading fails or filters are invalid
    """
    try:
        logger.info(f"GET /api/v1/data/filtered endpoint called with filters: metric='{metric}', batt_alias='{batt_alias}', continent='{continent}', climate='{climate}'")
        data = data_service.get_data_by_filters(
            metric=metric,
            batt_alias=batt_alias,
            continent=continent,
            climate=climate
        )
        logger.info(f"Successfully retrieved {len(data)} filtered records")
        return FilteredDataResponse(
            data=data,
            total=len(data),
            metric=metric,
            batt_alias=batt_alias,
            continent=continent or '',
            climate=climate or ''
        )
    except InvalidFilterError as e:
        logger.error(f"InvalidFilterError in get_filtered_data endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))
    except DataLoadError as e:
        logger.error(f"DataLoadError in get_filtered_data endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load data")
    except Exception as e:
        import traceback
        logger.error(f"Error in get_filtered_data endpoint: {str(e)}", exc_info=True)
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to filter KPI data: {str(e)}"
        )

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(request: Request, full_path: str):
    """
    Catch-all route to serve the SPA for any path not matched by API routes.
    This must be the last route defined in the file.
    """
    if not os.path.exists(INDEX_HTML_FILE):
        raise HTTPException(
            status_code=404,
            detail="Frontend index.html not found. Run 'npm run build' in frontend."
        )
    return FileResponse(INDEX_HTML_FILE)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 