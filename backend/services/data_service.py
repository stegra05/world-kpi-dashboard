import pandas as pd
from typing import List, Optional
from ..models.data_model import KPIData, Continent

class DataService:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._load_data()

    def _load_data(self) -> None:
        """Load and validate data from CSV file."""
        try:
            self.df = pd.read_csv(self.csv_path, delimiter=';')
            
            # Validate required columns
            required_columns = {'iso_a3', 'country', 'battAlias', 'var', 'val'}
            missing_columns = required_columns - set(self.df.columns)
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Validate data types
            self.df['iso_a3'] = self.df['iso_a3'].astype(str).str[:3]
            self.df['val'] = pd.to_numeric(self.df['val'], errors='coerce')
            
            # Handle missing values
            self.df['cnt_vhcl'] = pd.to_numeric(self.df['cnt_vhcl'], errors='coerce')
            self.df['continent'] = self.df['continent'].fillna(None)
            
        except Exception as e:
            raise Exception(f"Error loading data: {str(e)}")

    def get_all_data(self) -> List[KPIData]:
        """Get all KPI data."""
        return self.df.to_dict(orient='records')

    def get_unique_metrics(self) -> List[str]:
        """Get list of unique metrics."""
        return self.df['var'].unique().tolist()

    def get_unique_batt_aliases(self) -> List[str]:
        """Get list of unique battery aliases."""
        return self.df['battAlias'].unique().tolist()

    def get_unique_continents(self) -> List[Continent]:
        """Get list of unique continents."""
        continents = self.df['continent'].dropna().unique().tolist()
        return [Continent(c) for c in continents if c in Continent.__members__.values()]

    def get_data_by_filters(
        self, 
        metric: str, 
        batt_alias: str,
        continent: Optional[Continent] = None
    ) -> List[KPIData]:
        """Get filtered KPI data."""
        filtered_df = self.df[
            (self.df['var'] == metric) &
            (self.df['battAlias'] == batt_alias)
        ]
        
        if continent:
            filtered_df = filtered_df[filtered_df['continent'] == continent.value]
        
        return filtered_df.to_dict(orient='records') 