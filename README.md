# GeoSheep

This is a SvelteKit-based web application that allows users to upload shapefiles via drag-and-drop and view them on a map. The shapefiles must be in .zip format containing at least .shp and .prj files.

## Features
- **Quick Viewing**: Display shapefiles instantly on an interactive map.
- **Easy Upload**: Simply drag and drop shapefiles for seamless uploading.
- **Full Frontend Processing**: Efficiently processes shapefiles entirely on the client side.


### Tech Stack

- **SvelteKit**
- **Leaflet**
- **Shpjs**
- **Geojson-vt**


### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ahanprojects/geosheep.git
    cd geosheep
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

### Running the App

Start the development server:

```sh
npm run dev
