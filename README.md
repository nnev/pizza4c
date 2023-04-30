# How to build

1. Make sure you have Java JDK >= 17 installed
2. Make sure you have Node >= 19 installed
3. Run `gradle bootRun`
4. Configure nginx
```
server {
    listen       80;
    server_name  localhost;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```
5. Start nginx
6Goto [http://localhost](http://localhost)