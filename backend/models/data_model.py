from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class Continent(str, Enum):
    EUROPE = "Europe"
    ASIA = "Asia"
    NORTH_AMERICA = "North America"
    SOUTH_AMERICA = "South America"
    AFRICA = "Africa"
    OCEANIA = "Oceania"

class KPIData(BaseModel):
    iso_a3: str = Field(..., min_length=1, max_length=3)
    country: str
    battAlias: str
    var: str
    val: float
    cnt_vhcl: Optional[int] = 0
    continent: Optional[str] = ''
    climate: Optional[str] = ''

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True  # Allow more flexible type handling
        json_schema_extra = {
            "example": {
                "iso_a3": "DEU",
                "country": "Germany",
                "battAlias": "Batt_11",
                "var": "variable_1",
                "val": 123.45,
                "cnt_vhcl": 100,
                "continent": "Europe",
                "climate": "normal"
            }
        }

class MetricsResponse(BaseModel):
    metrics: List[str]

class BattAliasesResponse(BaseModel):
    batt_aliases: List[str]

class ContinentsResponse(BaseModel):
    continents: List[str]

class FilteredDataResponse(BaseModel):
    data: List[KPIData]
    total: int
    metric: str
    batt_alias: str
    continent: Optional[str] = ''
    climate: Optional[str] = ''

class ModelSeriesResponse(BaseModel):
    model_series: List[str]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "model_series": ["295", "247", "all"]
            }
        } 