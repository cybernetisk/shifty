# Shifty
[![Build Status](https://travis-ci.org/cybrairai/shifty.svg)](https://travis-ci.org/cybrairai/shifty)

## Install instructions

### System preparation
For Ubuntu:
* apt-get install python ipython python-pip node-legacy npm python-yaml

For Ubuntu 14.04 installing all these from package manager works fine. Installing PyYAML with APT will avoid some error messages when using pip.

### Shifty-specific
1. Grab files from GitHub: `$ git clone git@github.com:cybrairai/shifty.git`
2. Go to the folder with the source files
3. Install Python-dependencies: `$ sudo pip install -e .`
4. Install Node-dependencies (global cli's): `$ sudo npm install -g bower grunt-cli`
5. Install Node-dependencies (normal packages): `$ npm install` (Bower is for JS-dependencies)
6. Continue on the updating-section

## Updating
1. Run migrations (creates database, ++): `$ ./migrate.sh`
2. Generate some events and shifts `$ ./manage.py makeevents`
3. Install/update dependencies: `$ bower install`
4. Generate new static-files (js/css): `$ grunt` (this will also run the watcher)

## Running server
1. Start development web server with: `$ python manage.py runserver`
2. Open your browser at http://localhost:8000
3. The server will restart when it notices changes to Python-code


##WIndows install guide
 Required:
 1. python 2.7.9
 2. ipython
 3. python-pip
 4. node
 5. ruby
 6. python-yaml
 7. git

 
Following should be in your path: 
1. C:\Python27\;
2. C:\Python27\Scripts;
3. C:\Ruby21-x64\bin;
4. c:\Program Files (x86)\nodejs;
5. C:\Users\%username%\AppData\Roaming\npm

###Shifty-specific
1. Clone shifty repo
2. Go to the folder with the source files
3. Install Python-dependencies: `pip install -e .`
4. Install Node-dependencies (global cli's): `npm install -g bower grunt-cli`
5. Install Node-dependencies (normal packages): `npm install` (Bower is for JS-dependencies)
6. Continue on the updating-section

### Updating
1. Run migrations 
    1.1. python manage.py makemigrations shifty
    1.2. python manage.py migrate
    1.3. python manage.py loaddata sifty\initial_data.json

2. Generate some events and shifts `$ .\manage.py makeevents`
3. Install/update dependencies: `$ bower install`
4. Generate new static-files (js/css): `$ grunt` (this will also run the watcher)
