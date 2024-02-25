# Symfony & React Map

This is a Symfony-based web application using Symfony UX React to integrate React for front-end

## Installation

### Prerequisites

- PHP >=8.1
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
    This one install everything, the database, the depedency, everything.
   
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
   
