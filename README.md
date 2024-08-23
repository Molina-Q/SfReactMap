# Symfony & React Map

This is a Symfony-based web application using Symfony alongside React and Vite to integrate React for the front-end

This application allows users to explore the military equipment of various countries through an interactive map interface. Users can change the state of the world by clicking on a timeline spanning from the 15th to the 19th centuries (1400 to 1900). The 
timeline provides a historical overview, allowing users to observe changes in military equipment and borders over time.

### Features:
- Interactive Map: Explore the military equipment of countries around Europe using an interactive map interface.
- Timeline: Navigate through centuries from the 15th to the 19th, altering the global state and observing changes in military equipment availability.
- Discussion Forum: Engage in discussions related to topics depicted on the map. Share insights, ask questions, and connect with other users.
- Equipment Inventory: Access a comprehensive inventory of military equipment, presented in a format reminiscent of a video game inventory system. Browse through available military gear across different countries and time periods.

## Installation

### Prerequisites

- PHP >=8.1
- MongoDB driver for PHP (https://github.com/mongodb/mongo-php-driver/releases/tag/1.19.0)
- OpenSSL (https://slproweb.com/products/Win32OpenSSL.html)
- Composer (https://getcomposer.org/)
- Scoop (https://scoop.sh/)
- Symfony CLI (https://symfony.com/download)
- Node (https://nodejs.org/en)
- MySQL Database
- Make for windows - (Optionnal) - Complete package (https://gnuwin32.sourceforge.net/packages/make.htm)

### Setup

1. Install dependencies:

    ```bash
    make first-install
    ```
    This one install everything, the database and the dependency.
   
   ```bash
   make install-full
    ```
   This one execute composer install, npm install then npm run watch.

    If you are not using make.
    ```bash
    composer install
    ```
   
   ```bash
   npm install --force
   ```
   
