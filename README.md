# Pizza 4 Chaos

## How to build

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
6. Goto [http://localhost](http://localhost)

## Deployment

On the build machine:
1. Make sure you have Java JDK >= 17 installed
2. Make sure you have Node >= 19 installed
3. Run `gradle bootJar`.
4. Copy the resulting jar from `build/libs/pizza4c-<version>.jar` to the deployment server.

On the deployment server:
1. Place the jar in your favorite app folder. Here `/srv/pizza4c`
2. Configure systemd service:
```systemd
[Unit]
Description=Pizza 4 Chaos

[Service]
WorkingDirectory=/srv/pizza4c/data
# While we allocate 256MB here, the application only needs about 70MB to run.
ExecStart=java -Xmx256M -Xms256M -jar /srv/pizza4c/pizza4c-0.0.2-SNAPSHOT.jar
Restart=always
User=pizza4c
Group=pizza4c

[Install]
WantedBy=multi-user.target
```
3. Ensure the folder `/srv/pizza4c/data` exists and is accessible by user/group `pizza4c`
4. Place a file called `application.properties` inside this data directory overriding the following default properties
```properties
# change this line if another application is already running on port 8080
# server.port=8080

# pizza4c.fax.service=SEND_FAX
pizza4c.fax.service.sendfax.username=<username>
pizza4c.fax.service.sendfax.password=<password>
# Sendfax "Sinkhole" address. Make sure this line is commented for production usage
pizza4c.fax.toAddress.override=+61261111111
# pizza4c.fax.toAddress.replyEmail=pizza@noname-ev.de
# pizza4c.fax.fileurl.server=pizza.noname-ev.de

# pizza4c.defaultRestaurant=
# Set this to false for production use
# pizza4c.staticRestaurantData=true

# pizza4c.pdf.companyName=NoName e.V.
# pizza4c.pdf.recipient=
# pizza4c.pdf.addressLine1=
# pizza4c.pdf.addressLine2=
# pizza4c.pdf.phone=
# pizza4c.pdf.email=
# pizza4c.pdf.lat=
# pizza4c.pdf.lng=

pizza4c.admin.secret=MY_PASSWORD_FOR_ADMIN_AREA
```
5. Configure nginx config file:
```nginx
server {
        # SSL configuration
        listen 443 ssl;
        listen [::]:443 ssl;
        include snippets/ssl-pizza.nnev.de.conf;
        include snippets/ssl-params.conf;

        server_name pizza.nnev.de;
        server_name pizza.noname-ev.de

        location / {
                proxy_pass http://127.0.0.1:8080; # Set whatever port is assigned to our pizza application.
                proxy_set_header X-Forwarded-For $remote_addr;
        }
}
```
