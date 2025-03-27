import pandas as pd
from typing import List, Optional
from models.data_model import KPIData, Continent
from fastapi import HTTPException
import logging

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
            
            # Check if climate column exists and create it if not
            if 'climate' not in self.df.columns:
                self.df['climate'] = None
                
            # Validate and clean data types with specific error handling
            try:
                self.df['iso_a3'] = self.df['iso_a3'].astype(str).str[:3]
                self.df['val'] = pd.to_numeric(self.df['val'], errors='coerce')
                self.df['cnt_vhcl'] = pd.to_numeric(self.df['cnt_vhcl'], errors='coerce').fillna(0).astype(int)
                self.df['continent'] = self.df['continent'].fillna('').astype(str)
                self.df['climate'] = self.df['climate'].fillna('').astype(str)
                
                # Replace any NaN values to prevent serialization issues
                self.df = self.df.fillna('')
            except Exception as e:
                raise ValueError(f"Error during data type conversion: {str(e)}")
            
            # Validate data quality
            if self.df['val'].isna().all():
                raise ValueError("No valid numeric values found in the 'val' column")
                
            import logging
            logger = logging.getLogger(__name__)
            logger.info(f"Data loaded successfully: {len(self.df)} rows, columns: {list(self.df.columns)}")
            
        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            import traceback
            logging.error(f"Unexpected error loading data: {str(e)}")
            logging.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Unexpected error loading data: {str(e)}")

    def get_all_data(self) -> List[KPIData]:
        """Get all KPI data."""
        try:
            logger = logging.getLogger(__name__)
            logger.setLevel(logging.DEBUG)
            logger.debug("Converting dataframe to dict")
            logger.debug(f"Dataframe shape: {self.df.shape}")
            logger.debug(f"Dataframe columns: {self.df.columns.tolist()}")
            logger.debug(f"Sample data: {self.df.head(1).to_dict(orient='records')}")
            
            result = self.df.to_dict(orient='records')
            logger.debug(f"Conversion complete, returning {len(result)} records")
            return result
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Error converting data to records: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
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

    def get_unique_continents(self) -> List[str]:
        """Get list of unique continents."""
        try:
            return self.df['continent'].dropna().unique().tolist()
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'continent' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique continents: {str(e)}")

    def get_unique_climates(self) -> List[str]:
        """Get list of unique climates."""
        try:
            return self.df['climate'].dropna().unique().tolist()
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'climate' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique climates: {str(e)}")

    def get_data_by_filters(
        self, 
        metric: str, 
        batt_alias: str,
        continent: Optional[str] = None,
        climate: Optional[str] = None
    ) -> List[KPIData]:
        """Get filtered KPI data."""
        try:
            # Validate input parameters
            if metric not in self.df['var'].unique():
                raise ValueError(f"Invalid metric: {metric}")
            if batt_alias not in self.df['battAlias'].unique():
                raise ValueError(f"Invalid battery alias: {batt_alias}")
            if continent and continent not in self.df['continent'].unique():
                raise ValueError(f"Invalid continent: {continent}")
            if climate and climate not in self.df['climate'].unique() and climate != '':
                raise ValueError(f"Invalid climate: {climate}")

            # Apply filters
            filtered_df = self.df[
                (self.df['var'] == metric) &
                (self.df['battAlias'] == batt_alias)
            ]
            
            if continent:
                filtered_df = filtered_df[filtered_df['continent'] == continent]
                
            if climate:
                filtered_df = filtered_df[filtered_df['climate'] == climate]
            
            if filtered_df.empty:
                raise ValueError("No data found for the specified filters")
            
            return filtered_df.to_dict(orient='records')
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error filtering data: {str(e)}") 