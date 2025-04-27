# -*- coding: utf-8 -*-
# python: 3.9+
# ws2tcp/server.py
# Author: Mudasir Mirza
# pylint: disable=line-too-long,unused-import,broad-exception-caught,unused-variable,unused-argument

"""
WebSocket-TCP bridge server.

This module implements a WebSocket server that bridges WebSocket
connections to TCP devices. It allows clients to connect to WebSockets
and send commands to TCP devices. The WebSocket server listens on a
specific port and manages the TCP connections.

This module is used in the Bridge project to communicate with
the WebSocket and TCP devices.

The WebSocket server is created using the `WebSocketTCPBridge` class.
The server is started by calling the `run` method of the class.

The `WebSocketTCPBridge` class defines the following methods:

- `run`: Start the WebSocket server and manage TCP connections.
- `handler`: Handle incoming websocket connections and messages.
- `register`: Register a new websocket connection.
- `unregister`: Unregister a disconnected websocket.
- `tcp_connect`: Establish a TCP connection and map it to a prefix.
- `tcp_disconnect`: Disconnect a TCP connection identified by prefix.
- `listen_to_tcp`: Listen for data from TCP connection and send to the appropriate WebSocket client or broadcast.
- `route_message`: Route messages to the TCP device based on prefix and handle broadcasting.
- `broadcast`: Broadcast a message to all connected websockets.

The `run` method is called to start the server. The `handler` method is
called for each incoming websocket connection or message. The
`register` and `unregister` methods are called to add and remove
websocket connections from the set of connected clients. The
`tcp_connect` and `tcp_disconnect` methods are called to establish and
disconnect TCP connections. The `listen_to_tcp` method is called to
listen for data from a TCP connection and send it to the appropriate
WebSocket client or broadcast. The `route_message` method is called to
route messages to the TCP device based on prefix and handle
broadcasting. The `broadcast` method is called to broadcast a message
to all connected websockets.

The server is configured using environment variables:

- `STARTUP_TCP_CONN`: A string of the form "ip:port:prefix" to
  specify the IP address, port number, and prefix of the initial TCP
  connection to establish.

"""

import os
import json
import socket
import sqlite3
import asyncio

import websockets


class WebSocketTCPBridge:
    """
    A class that implements a WebSocket server that bridges WebSocket connections to TCP devices.

    This class manages the WebSocket server and TCP connections. It allows clients to connect to WebSockets and send commands to TCP devices.

    Attributes:
        connections (set): A set of connected WebSocket connections.
        tcp_connections (dict): A dictionary mapping prefixes to TCP connections.
        client_map (dict): A dictionary mapping WebSocket connections to prefixes.
        broadcast_list (list): A list of WebSocket connections to broadcast messages to.

    Methods:
        run(host="0.0.0.0", port=8300): Start the WebSocket server and manage TCP connections.
        handler(websocket, path): Handle incoming websocket connections and messages.
        register(websocket, prefix): Register a new websocket connection.
        unregister(websocket): Unregister a disconnected websocket.
        tcp_connect(ip, port, prefix): Establish a TCP connection and map it to a prefix.
        tcp_disconnect(prefix): Disconnect a TCP connection identified by prefix.
        listen_to_tcp(reader, prefix): Listen for data from a TCP connection and send it to the appropriate WebSocket client or broadcast.
        route_message(message, prefix): Route messages to the TCP device based on prefix and handle broadcasting.
        broadcast(message): Broadcast a message to all connected websockets.
    """
    def __init__(self, db_path='./data/tcp_connections.db'):
        """
        Initializes a new instance of the class.

        This constructor initializes the instance variables `db_path`, `connections`, `tcp_connections`, `client_map`, and `broadcast_list`. It sets the `db_path` to the provided `db_path` parameter, initializes the `connections` set, initializes the `tcp_connections` dictionary, initializes the `client_map` dictionary, initializes the `broadcast_list` set, and calls the `init_db` method.

        Parameters:
            db_path (str, optional): The path to the database file. Defaults to 'tcp_connections.db'.

        Returns:
            None
        """

        self.db_path = db_path
        self.connections = set()
        self.tcp_connections = {}
        self.client_map = {}
        self.broadcast_list = set()
        self.init_db()

    def init_db(self):
        """
        Initializes the database and loads existing TCP connections.
        This function creates a new SQLite database connection using the `db_path` attribute of the object. It then creates a cursor object to execute SQL queries.
        The function creates a table named `tcp_connections` if it doesn't already exist. The table has three columns: `prefix` (primary key), `ip` (not null), and `port` (not null).
        After creating the table, the function commits the changes to the database. It then executes a query to select the `ip`, `port`, and `prefix` columns from the `tcp_connections` table.
        For each row returned by the query, it creates a new task using `asyncio.get_event_loop().create_task` to establish a TCP connection using the `tcp_connect` method of the object. The `tcp_connect` method is called with the `ip`, `port`, and `prefix` values from the current row.
        Finally, the function closes the database connection.

        Parameters:
            self (object): The instance of the class.

        Returns:
            None
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tcp_connections (
                prefix TEXT PRIMARY KEY,
                ip TEXT NOT NULL,
                port INTEGER NOT NULL
            )
        ''')
        conn.commit()
        cursor.execute('SELECT ip, port, prefix FROM tcp_connections')
        for ip, port, prefix in cursor.fetchall():
            asyncio.get_event_loop().create_task(self.tcp_connect(ip, port, prefix, reconnect=True))
        conn.close()

    async def register(self, websocket):
        """
        Register a new websocket connection.
        
        Parameters:
            websocket: The websocket object to be registered.
        
        Returns:
            None
        """
        self.connections.add(websocket)
        print(f"Registered new websocket. Total websockets: {len(self.connections)}")

    async def unregister(self, websocket):
        """
        Unregister a disconnected websocket.

        Removes the given websocket from the set of connected websockets.
        Also removes any client mappings and broadcast lists associated with the websocket.

        Parameters:
            websocket (WebSocket): The websocket object to be unregistered.

        Returns:
            None
        """
        self.connections.remove(websocket)
        # Remove any client mappings and broadcast lists
        self.client_map = {k: v for k, v in self.client_map.items() if v != websocket}
        self.broadcast_list.discard(websocket)
        print(f"Unregistered websocket. Total websockets: {len(self.connections)}")

    async def tcp_connect(self, ip, port, prefix, reconnect=False):
        """
        Establishes a TCP connection with the given IP address and port number, using the specified prefix.

        Args:
            ip (str): The IP address of the TCP device.
            port (int): The port number of the TCP device.
            prefix (str): The prefix to associate with the TCP connection.

        Returns:
            bool: True if the TCP connection was successfully established, False otherwise.
        """
        if prefix in self.tcp_connections and not reconnect:
            print(f"Prefix '{prefix}' already in use.")
            return False
        try:
            reader, writer = await asyncio.open_connection(ip, port)
            self.tcp_connections[prefix] = (reader, writer)
            asyncio.create_task(self.listen_to_tcp(reader, prefix))
            # Add connection details to the database only if not already present
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT count(*) FROM tcp_connections WHERE prefix = ?', (prefix,))
            if cursor.fetchone()[0] == 0:
                cursor.execute('INSERT INTO tcp_connections (prefix, ip, port) VALUES (?, ?, ?)', (prefix, ip, port))
                conn.commit()
            conn.close()
            print(f"Connected to TCP device at {ip}:{port} with prefix '{prefix}'.")
            return True
        except Exception as e:
            print(f"Failed to connect to TCP device at {ip}:{port}: {str(e)}")
            return False

    async def tcp_disconnect(self, prefix):
        """
        Disconnect a TCP connection identified by prefix.

        Args:
            prefix (str): The prefix associated with the TCP connection.

        Returns:
            None

        This function disconnects a TCP connection identified by the given prefix. If a connection with the specified prefix exists, it is removed from the `tcp_connections` dictionary and the corresponding reader and writer objects are closed. If no connection with the specified prefix is found, a message is printed indicating that no such connection was found.
        """

        if prefix in self.tcp_connections:
            reader, writer = self.tcp_connections.pop(prefix)
            writer.close()
            await writer.wait_closed()
            print(f"Disconnected TCP device with prefix '{prefix}'.")
            # Remove the connection from the database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM tcp_connections WHERE prefix = ?', (prefix,))
            conn.commit()
            conn.close()
            print(f"Removed TCP connection with prefix '{prefix}' from the database.")
        else:
            print(f"No TCP connection with prefix '{prefix}' found.")

    async def listen_to_tcp(self, reader, prefix):
        """
        Listen for data from a TCP connection and send it to the appropriate WebSocket client or broadcast.

        Args:
            reader (asyncio.StreamReader): The reader object for the TCP connection.
            prefix (str): The prefix associated with the TCP connection.

        Returns:
            None

        This function continuously reads data from the TCP connection using the provided reader object. If the received data is part of a broadcast, it is sent to all connected WebSocket clients using the `broadcast` method. If the received data is intended for a specific WebSocket client, it is sent to that client using the `send` method.

        If an error occurs while reading from the TCP connection, an exception is caught and an error message is printed. Finally, a message is printed indicating that the TCP connection has been closed.

        Note: This function assumes that the `broadcast` and `client_map` attributes are properly initialized and maintained by the class.
        """
        try:
            while True:
                data = await reader.read(1024)
                if not data:
                    break
                if prefix in self.broadcast_list:
                    await self.broadcast(data.decode())
                elif prefix in self.client_map:
                    websocket = self.client_map[prefix]
                    await websocket.send(data.decode())
        except Exception as e:
            print(f"Error reading from TCP device {prefix}: {str(e)}")
        finally:
            print(f"TCP connection {prefix} closed")

    async def handler(self, websocket, path):
        """
        Handle incoming websocket connections and messages.

        This function is called for each incoming websocket connection or message. It registers the websocket,
        and then enters a loop to handle incoming messages. It parses the incoming message as JSON and checks
        if it contains a 'command' key. If it does, it checks the value of the 'command' key. If the value is
        'add_tcp' and the prefix is not already in use, it establishes a TCP connection using the provided
        IP address, port number, and prefix. If the connection is successful, it sends a success message
        back to the client. If the value is 'remove_tcp', it disconnects the TCP connection associated with
        the provided prefix. If the 'command' key is not present, it routes the message to the appropriate
        TCP device based on the prefix and broadcast flag.

        Parameters:
            websocket (WebSocket): The websocket object representing the incoming connection or message.
            path (str): The path of the incoming connection.

        Returns:
            None

        Raises:
            json.JSONDecodeError: If there is an error decoding the incoming message as JSON.

        Finally:
            Unregisters the websocket regardless of the outcome.
        """
        await self.register(websocket)
        try:
            async for message in websocket:
                data = json.loads(message)
                if 'command' in data:
                    if data['command'] == 'add_tcp' and not await self.tcp_connect(data['ip'], data['port'], data['prefix'], reconnect=False):
                        await websocket.send("Prefix already in the system.")
                    elif data['command'] == 'remove_tcp':
                        self.tcp_disconnect(data['prefix'])
                else:
                    await self.route_message(data['prefix'], data['message'], data.get('broadcast', False), websocket)
        except json.JSONDecodeError:
            print("Error decoding JSON.")
        finally:
            await self.unregister(websocket)

    async def route_message(self, prefix, message, broadcast, websocket):
        """
        Route messages to the TCP device based on prefix and handle broadcasting.

        Args:
            prefix (str): The prefix associated with the TCP connection.
            message (str): The message to be routed.
            broadcast (bool): Flag indicating whether the message should be broadcasted.
            websocket (WebSocket): The websocket object representing the client.

        Returns:
            None

        This function routes the given message to the TCP device identified by the prefix. If a connection with the specified prefix exists, it writes the message to the corresponding writer object and waits for the data to be drained. If the message should be broadcasted, the prefix is added to the broadcast list. Otherwise, it is removed from the broadcast list. Finally, a message is printed indicating the successful routing of the message.
        """
        if prefix in self.tcp_connections:
            _, writer = self.tcp_connections[prefix]
            if not writer.is_closing():
                self.client_map[prefix] = websocket
                if broadcast:
                    self.broadcast_list.add(prefix)
                else:
                    self.broadcast_list.discard(prefix)
                writer.write(message.encode())
                await writer.drain()
                print(f"Routed message to {prefix}: {message}")
            else:
                print(f"Connection to {prefix} is closed. Attempting to reconnect...")
                connected = await self.reconnect_tcp(prefix)
                if connected:
                    self.route_message(prefix, message, broadcast, websocket)
                else:
                    await websocket.send(f"Failed to reconnect to TCP device with prefix {prefix}.")
        else:
            print(f"No TCP connection found with prefix {prefix}. Checking database...")
            # Attempt to reconnect using database details
            if await self.restore_connection_from_db(prefix):
                await self.route_message(prefix, message, broadcast, websocket)
            else:
                await websocket.send(f"No TCP connection details found for prefix {prefix} in the database.")

    async def restore_connection_from_db(self, prefix):
        """
        Restore a TCP connection from database details if available.

        This function connects to a SQLite database and retrieves the IP address and port number associated with the given prefix. If a matching row is found, it establishes a TCP connection using the retrieved IP address and port number, and associates the prefix with the connection.

        Parameters:
            prefix (str): The prefix to search for in the database.

        Returns:
            bool: True if a TCP connection was successfully restored, False otherwise.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT ip, port FROM tcp_connections WHERE prefix = ?', (prefix,))
        result = cursor.fetchone()
        conn.close()
        if result:
            ip, port = result
            return await self.tcp_connect(ip, port, prefix, reconnect=True)
        return False

    async def reconnect_tcp(self, prefix):
        """
        Attempt to reconnect a TCP device based on the existing prefix.
        """
        if prefix in self.tcp_connections:
            ip, port = self.tcp_connections[prefix][1].get_extra_info('peername')
            return await self.tcp_connect(ip, port, prefix, reconnect=True)
        return False

    async def broadcast(self, message):
        """
        Broadcast a message to all connected websockets.

        Args:
            message (str): The message to be broadcasted.

        Returns:
            None

        This function sends the given message to all connected websockets. It iterates over the `connections` set and sends the message to each websocket using the `send` method. After sending the message, it prints a log message indicating the broadcasted message.
        """
        for websocket in self.connections:
            await websocket.send(message)
            print(f"Broadcast message: {message}")

    def run(self, host="0.0.0.0", port=8300):
        """
        Start the WebSocket server and manage TCP connections.

        This function initializes the WebSocket server and establishes TCP connections if specified. It takes two optional parameters: `host` (default: "0.0.0.0") and `port` (default: 8300).

        If the environment variable `STARTUP_TCP_CONN` is set, it splits the value into `ip`, `port_str`, and `prefix`. It then creates a task to establish a TCP connection using the `tcp_connect` method.

        The function creates a WebSocket server using the `websockets.serve` method, passing the `handler` method as the callback. It specifies the `host` and `port` parameters.

        It prints a message indicating that the WebSocket server has started on the specified host and port.

        The function runs the WebSocket server until it is complete using `asyncio.get_event_loop().run_until_complete`. It then enters an infinite loop to keep the server running using `asyncio.get_event_loop().run_forever`.

        Parameters:
            host (str): The host address to bind the WebSocket server to. Defaults to "0.0.0.0".
            port (int): The port number to bind the WebSocket server to. Defaults to 8300.

        Returns:
            None
        """
        startup_conn = os.getenv('STARTUP_TCP_CONN')
        if startup_conn:
            ip, port_str, prefix = startup_conn.split(':')
            asyncio.get_event_loop().create_task(self.tcp_connect(ip, int(port_str), prefix, reconnect=True))

        conn_host = str(os.environ.get("CONN_HOST", host))
        conn_port = int(os.environ.get("CONN_PORT", port))
        start_server = websockets.serve(self.handler, conn_host, conn_port)
        print(f"WebSocket server started on {conn_host}:{conn_port}")
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    bridge = WebSocketTCPBridge()
    bridge.run()
