import pandas as pd
from typing import List, Optional
from models.data_model import KPIData, Continent
from fastapi import HTTPException
import logging

class DataService:
    # Class-level cache for the DataFrame
    _df_cache = {}
    _logger = logging.getLogger(__name__)

    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._load_data()

    def _load_data(self) -> None:
        """Load and validate data from CSV file with caching."""
        try:
            # Check if data is already in cache
            if self.csv_path in self._df_cache:
                self._logger.info(f"Using cached DataFrame for {self.csv_path}")
                self.df = self._df_cache[self.csv_path]
                return

            # Check if file exists
            if not pd.io.common.file_exists(self.csv_path):
                raise FileNotFoundError(f"Data file not found: {self.csv_path}")

            # Read CSV with specific error handling
            try:
                self.df = pd.read_csv(self.csv_path, delimiter=';')
                self._logger.info(f"First-time data load from {self.csv_path}: {len(self.df)} rows")
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
                # Handle empty iso_a3 values by generating a placeholder code
                self.df['iso_a3'] = self.df['iso_a3'].fillna('').astype(str)
                # Generate placeholder codes for empty iso_a3 values
                self.df.loc[self.df['iso_a3'] == '', 'iso_a3'] = self.df.loc[self.df['iso_a3'] == '', 'country'].str[:3].str.upper()
                # Ensure all iso_a3 values are exactly 3 characters
                self.df['iso_a3'] = self.df['iso_a3'].str[:3].str.upper()
                
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
                
            self._logger.info(f"Data loaded successfully: {len(self.df)} rows, columns: {list(self.df.columns)}")
            
            # Cache the processed DataFrame
            self._df_cache[self.csv_path] = self.df
            self._logger.info(f"Cached DataFrame for {self.csv_path}")
            
        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            import traceback
            self._logger.error(f"Unexpected error loading data: {str(e)}")
            self._logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Unexpected error loading data: {str(e)}")

    def get_all_data(self) -> List[KPIData]:
        """Get all KPI data."""
        try:
            self._logger.setLevel(logging.DEBUG)
            self._logger.debug("Converting dataframe to dict")
            self._logger.debug(f"Dataframe shape: {self.df.shape}")
            self._logger.debug(f"Dataframe columns: {self.df.columns.tolist()}")
            self._logger.debug(f"Sample data: {self.df.head(1).to_dict(orient='records')}")
            
            # Convert to records and validate each record
            records = self.df.to_dict(orient='records')
            validated_records = []
            
            for idx, record in enumerate(records):
                try:
                    # Log the raw record for debugging
                    if idx == 0:  # Log only first record to avoid spam
                        self._logger.debug(f"Raw record: {record}")
                        self._logger.debug(f"Record types: {dict((k, type(v)) for k, v in record.items())}")
                    
                    # Create KPIData instance to validate the record
                    kpi_data = KPIData(
                        iso_a3=str(record['iso_a3']),  # Ensure string
                        country=str(record['country']),  # Ensure string
                        battAlias=str(record['battAlias']),  # Ensure string
                        var=str(record['var']),  # Ensure string
                        val=float(record['val']),  # Ensure float
                        cnt_vhcl=int(record.get('cnt_vhcl', 0)),  # Ensure int
                        continent=str(record.get('continent', '')),  # Ensure string
                        climate=str(record.get('climate', ''))  # Ensure string
                    )
                    validated_record = kpi_data.model_dump()
                    
                    # Log the validated record for debugging
                    if idx == 0:  # Log only first record to avoid spam
                        self._logger.debug(f"Validated record: {validated_record}")
                        self._logger.debug(f"Validated record types: {dict((k, type(v)) for k, v in validated_record.items())}")
                    
                    validated_records.append(validated_record)
                except Exception as e:
                    self._logger.warning(f"Skipping invalid record at index {idx}: {record}. Error: {str(e)}")
                    continue
            
            if not validated_records:
                raise ValueError("No valid records found after validation")
            
            self._logger.debug(f"Conversion complete, returning {len(validated_records)} records")
            self._logger.debug(f"First validated record: {validated_records[0]}")
            return validated_records
        except Exception as e:
            self._logger.error(f"Error converting data to records: {str(e)}")
            import traceback
            self._logger.error(traceback.format_exc())
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

    def get_unique_model_series(self) -> List[str]:
        """Get list of unique model series."""
        try:
            # Drop NaN values and empty strings, then get unique values
            return self.df['model_series'].dropna().replace('', pd.NA).dropna().unique().tolist()
        except KeyError:
            raise HTTPException(status_code=500, detail="Column 'model_series' not found in dataset")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving unique model series: {str(e)}")

    def get_data_by_filters(
        self, 
        metric: str, 
        batt_alias: str,
        continent: Optional[str] = None,
        climate: Optional[str] = None
    ) -> List[KPIData]:
        """Get filtered KPI data."""
        self._logger.info(f"Filtering data with: metric='{metric}', batt_alias='{batt_alias}', continent='{continent}', climate='{climate}'")
        
        try:
            available_metrics = self.df['var'].unique().tolist()
            if metric not in available_metrics:
                self._logger.warning(f"Invalid metric: '{metric}' not in {available_metrics}")
                raise ValueError(f"Invalid metric: {metric}")
                
            available_batt_aliases = self.df['battAlias'].unique().tolist() 
            if batt_alias not in available_batt_aliases:
                self._logger.warning(f"Invalid battery alias: '{batt_alias}' not in {available_batt_aliases}")
                raise ValueError(f"Invalid battery alias: {batt_alias}")
                
            if continent and continent not in self.df['continent'].unique() and continent != '':
                available_continents = self.df['continent'].unique().tolist()
                self._logger.warning(f"Invalid continent: '{continent}' not in {available_continents}")
                raise ValueError(f"Invalid continent: {continent}")
                
            if climate and climate not in self.df['climate'].unique() and climate != '':
                available_climates = self.df['climate'].unique().tolist()
                self._logger.warning(f"Invalid climate: '{climate}' not in {available_climates}")
                raise ValueError(f"Invalid climate: {climate}")

            # Apply filters
            self._logger.info(f"Applying 'var'='{metric}' and 'battAlias'='{batt_alias}' filters")
            filtered_df = self.df[
                (self.df['var'] == metric) &
                (self.df['battAlias'] == batt_alias)
            ]
            
            self._logger.info(f"After initial filter: {len(filtered_df)} records")
            
            if continent:
                self._logger.info(f"Applying continent filter: {continent}")
                filtered_df = filtered_df[filtered_df['continent'] == continent]
                self._logger.info(f"After continent filter: {len(filtered_df)} records")
                
            if climate:
                self._logger.info(f"Applying climate filter: {climate}")
                filtered_df = filtered_df[filtered_df['climate'] == climate]
                self._logger.info(f"After climate filter: {len(filtered_df)} records")
            
            if filtered_df.empty:
                self._logger.warning(f"No data found for the specified filters - metric: {metric}, batt_alias: {batt_alias}, continent: {continent}, climate: {climate}")
                # Don't raise an exception, just return empty list
                return []
            
            result = filtered_df.to_dict(orient='records')
            self._logger.info(f"Returning {len(result)} filtered records")
            return result
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error filtering data: {str(e)}") 