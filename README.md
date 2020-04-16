# mariage
A wedding website.

## Dev Quickstart
**Installation**
```bash
# From the root dir of this repo, run
sudo apt install nodejs npm
sudo npm install -g pug-cli sass
cp vars.example.pug vars.pug
wget -P static/ https://code.jquery.com/jquery-3.1.1.min.js
wget -P static/ https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
# Dowload bootstrap into static/
```

**Start developping**
```bash
# Run the following 3 processes (web server, pug and sass compilers) in different shells
docker-compose up
pug --pretty --watch templates --out static
sass --watch --no-source-map templates:static 
```
Go to http://localhost:8080/
