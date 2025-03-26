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
    iso_a3: str = Field(..., min_length=3, max_length=3)
    country: str
    battAlias: str
    var: str
    val: float
    cnt_vhcl: Optional[int] = None
    continent: Optional[Continent] = None

    class Config:
        from_attributes = True

class MetricsResponse(BaseModel):
    metrics: List[str]

class BattAliasesResponse(BaseModel):
    batt_aliases: List[str]

class ContinentsResponse(BaseModel):
    continents: List[Continent]

class FilteredDataResponse(BaseModel):
    data: List[KPIData]
    total: int
    metric: str
    batt_alias: str
    continent: Optional[Continent] = None 