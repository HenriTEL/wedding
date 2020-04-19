# Wedding
A wedding website.

## Dev Quickstart
**Installation**
```bash
# From the root dir of this repo, run
sudo apt install nodejs npm wget
sudo npm install -g pug-cli sass
cp vars.example.pug vars.pug
wget --no-clobber -P static/ \
  https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css \
  https://code.jquery.com/jquery-3.4.1.slim.min.js \
  https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
```

**Start developping**
```bash
# Run the following 3 processes (web server, pug and sass compilers) in different shells
docker-compose up
pug --pretty --watch templates --out static
sass --watch --no-source-map templates:static 
```
Go to http://localhost:8080/


## Customize
**Text**  
Most content can be customized by setting values in `vars.pug`.

**Wedding list**  
Make your wedding list in a .csv spreadsheet, separator must be comma, first line is ignored.  
Save it to `backend/db/wedding-list/csv`.