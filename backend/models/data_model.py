from pydantic import BaseModel
from typing import Optional

class KPIData(BaseModel):
    iso_a3: str
    country: str
    battAlias: str
    var: str
    val: float
    cnt_vhcl: Optional[int] = None

    class Config:
        from_attributes = True 