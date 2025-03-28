import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const useKpiStore = create((set, get) => ({
  // State
  metrics: [],
  battAliases: [],
  continents: [],
  climates: [],
  modelSeries: [],
  selectedFilters: {
    metric: '',
    battAlias: '',
    continent: '',
    climate: '',
  },
  filteredData: [],
  isLoading: false,
  error: null,

  // Actions
  fetchFilterOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const [metricsRes, battAliasesRes, continentsRes, climatesRes, modelSeriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/metrics`),
        axios.get(`${API_BASE_URL}/batt-aliases`),
        axios.get(`${API_BASE_URL}/continents`),
        axios.get(`${API_BASE_URL}/climates`),
        axios.get(`${API_BASE_URL}/model-series`),
      ]);

      set({
        metrics: metricsRes.data.metrics,
        battAliases: battAliasesRes.data.batt_aliases,
        continents: continentsRes.data.continents,
        climates: climatesRes.data,
        modelSeries: modelSeriesRes.data.model_series,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch filter options',
        isLoading: false,
      });
    }
  },

  setSelectedFilters: (filters) => {
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        ...filters,
      },
    }));
  },

  fetchFilteredKpiData: async () => {
    const { selectedFilters } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_BASE_URL}/data/filtered`, {
        params: {
          metric: selectedFilters.metric,
          batt_alias: selectedFilters.battAlias,
          continent: selectedFilters.continent || undefined,
          climate: selectedFilters.climate || undefined,
        },
      });

      set({
        filteredData: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch filtered data',
        isLoading: false,
      });
    }
  },

  // Reset store to initial state
  reset: () => {
    set({
      metrics: [],
      battAliases: [],
      continents: [],
      climates: [],
      modelSeries: [],
      selectedFilters: {
        metric: '',
        battAlias: '',
        continent: '',
        climate: '',
      },
      filteredData: [],
      isLoading: false,
      error: null,
    });
  },
}));

export default useKpiStore; 