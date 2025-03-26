import pandas as pd
from typing import List, Optional
from ..models.data_model import KPIData, Continent
from fastapi import HTTPException

class DataService:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._load_data()

    def _load_data(self) -> None:
        """Load and validate data from CSV file."""
        try:
            # Check if file exists
            if not pd.io.common.file_exists(self.csv_path):
                raise FileNotFoundError(f"Data file not found: {self.csv_path}")

            # Read CSV with specific error handling
            try:
                self.df = pd.read_csv(self.csv_path, delimiter=';')
            except pd.errors.EmptyDataError:
                raise ValueError("The CSV file is empty")
            except pd.errors.ParserError as e:
                raise ValueError(f"Error parsing CSV file: {str(e)}")
            
            # Validate required columns
            required_columns = {'iso_a3', 'country', 'battAlias', 'var', 'val'}
            missing_columns = required_columns - set(self.df.columns)
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Validate and clean data types with specific error handling
            try:
                self.df['iso_a3'] = self.df['iso_a3'].astype(str).str[:3]
                self.df['val'] = pd.to_numeric(self.df['val'], errors='coerce')
                self.df['cnt_vhcl'] = pd.to_numeric(self.df['cnt_vhcl'], errors='coerce')
                self.df['continent'] = self.df['continent'].fillna(None)
            except Exception as e:
                raise ValueError(f"Error during data type conversion: {str(e)}")
            
            # Validate data quality
            if self.df['val'].isna().all():
                raise ValueError("No valid numeric values found in the 'val' column")
            
        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error loading data: {str(e)}")

    def get_all_data(self) -> List[KPIData]:
        """Get all KPI data."""
        try:
            return self.df.to_dict(orient='records')
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error converting data to records: {str(e)}")

    def get_unique_metrics(self) -> List[str]:
        """Get list of unique metrics."""
        try:
            return self.df['var'].unique().tolist()
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'var' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique metrics: {str(e)}")

    def get_unique_batt_aliases(self) -> List[str]:
        """Get list of unique battery aliases."""
        try:
            return self.df['battAlias'].unique().tolist()
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'battAlias' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique battery aliases: {str(e)}")

    def get_unique_continents(self) -> List[Continent]:
        """Get list of unique continents."""
        try:
            continents = self.df['continent'].dropna().unique().tolist()
            return [Continent(c) for c in continents if c in Continent.__members__.values()]
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'continent' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique continents: {str(e)}")

    def get_data_by_filters(
        self, 
        metric: str, 
        batt_alias: str,
        continent: Optional[Continent] = None
    ) -> List[KPIData]:
        """Get filtered KPI data."""
        try:
            # Validate input parameters
            if metric not in self.df['var'].unique():
                raise ValueError(f"Invalid metric: {metric}")
            if batt_alias not in self.df['battAlias'].unique():
                raise ValueError(f"Invalid battery alias: {batt_alias}")
            if continent and continent.value not in self.df['continent'].unique():
                raise ValueError(f"Invalid continent: {continent.value}")

            # Apply filters
            filtered_df = self.df[
                (self.df['var'] == metric) &
                (self.df['battAlias'] == batt_alias)
            ]
            
            if continent:
                filtered_df = filtered_df[filtered_df['continent'] == continent.value]
            
            if filtered_df.empty:
                raise ValueError("No data found for the specified filters")
            
            return filtered_df.to_dict(orient='records')
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error filtering data: {str(e)}") 