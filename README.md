# World KPI Dashboard

A web application that visualizes world KPI data with an interactive map. Countries are colored based on their KPI values, and detailed information is displayed when clicking on a country.

## Features

- Interactive world map with country data visualization
- Color-coded countries based on KPI values
- Detailed country information display
- Filter by different variables
- Responsive design

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 14.0 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Make sure the data file `world_kpi_anonym.txt` is in the `/public` directory.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Data Structure

The data is stored in a CSV-like format with `;` as the delimiter. The columns include:

- battAlias: Battery alias
- country: Country name
- continent: Continent name
- climate: Climate type
- iso_a3: Country ISO Alpha-3 code
- model_series: Model series
- var: Variable name
- val: Numeric value
- descr: Description
- cnt_vhcl: Count

## Technologies Used

- Next.js - React framework
- React - JavaScript library for building user interfaces
- React Simple Maps - React components for creating beautiful SVG maps
- D3 Scale - Scale functions for data visualization
- Tailwind CSS - Utility-first CSS framework

## License

This project is licensed under the MIT License.
