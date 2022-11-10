# Run in dev mode

1. Make sure you have Java JDK >= 17 installed
2. Start backend with `gradle bootRun`
3. Make sure you have Node >= 19 installed
4. Go to node root folder `cd frontend/pizza4c-frontend`
5. Download npm dependencies with `npm install` 
6. Start frontend with `npm run start` 
7. Configure nginx
```
server {
    listen       80;
    server_name  localhost;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```
8. Start nginx
9. Goto [http://localhost](http://localhost)

# Run in prod mode
1. Make sure you have Java JDK >= 17 installed
2. Compile backend with `gradle bootJar`
3. Deploy backend from `build/libs/*.jar`
4. Start backend with `java -Xmx256M -Xms256M -jar pizza4c.jar`
5. Make sure you have Node >= 19 installed
6. Go to node root folder `cd frontend/pizza4c-frontend`
7. Download npm dependencies with `npm install`
8. Build frontend with `npm run build`
9. Deploy dependencies from `frontend/pizza4c-frontend/build`
10. Configure nginx
```
server {
    listen       443 ssl;
    listen       [::]443 ssl;
    
    include snippets/ssl-pizza.nnev.de.conf;
    include snippets/ssl-params.conf;

    server_name  pizza.nnev.de;
    root /var/www/pizza/;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```
11. Start nginx
12. Goto [https://pizza.nnev.de](https://pizza.nnev.de)