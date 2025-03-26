import pandas as pd
from typing import List
from ..models.data_model import KPIData

class DataService:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._load_data()

    def _load_data(self) -> None:
        """Load data from CSV file."""
        try:
            self.df = pd.read_csv(self.csv_path, delimiter=';')
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

    def get_data_by_filters(self, metric: str, batt_alias: str) -> List[KPIData]:
        """Get filtered KPI data."""
        filtered_df = self.df[
            (self.df['var'] == metric) &
            (self.df['battAlias'] == batt_alias)
        ]
        return filtered_df.to_dict(orient='records') 