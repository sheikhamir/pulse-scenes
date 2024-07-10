## PULSE Scenes

A control server application for audio, visual and lighting devices

----------------------------------

### How it works:


#### Backend:

Built on Slim Framework, used to fetch content for the frontend. The `db.json`
file contains the full database.

#### Frontend:

Built on Angular, renders the data fetched from backend. To configure the
application, navigate to `frontend/src/environments` which contains env 
variables, such as IP address of the backend server and bridge server.

#### Bridge:

A modified version of [websockify/novnc](https://github.com/novnc/websockify/), 
used to create a Web-socket to/from TCP connection, acts a bridge between the 
web-application and the TCP devices.

#### Wrapper:

A simple HTML wrapper that loads the entire application inside an iframe.
Please check `wrapper/index.html` file and replace the IP address of the 
iframe to the IP address of the server.

---------------------------------

Using Docker to deploy the application. Update `docker-compose.yml` file
to make changes to the TCP device's IP address. The application will only 
work with Docker, as there were 4 different services that needed to be
linked.

How to deploy:

Please make sure docker and docker-compose is installed.

Run the following command in the terminal or command prompt:
```
docker-compose up -d --build
```

This will build the application and deploy it. You can access it using 
the IP address of the server, which can also be found in 
`frontend/src/environment/environment.prod.ts`.

Please use the port numbers defined below.

The application can be accessed at `localhost:8201`.

If you would like to access the actual Angular app, it can be accessed at
`localhost:8200`