
# WebSocket-TCP Bridge Server

This project implements a WebSocket server that acts as a bridge to TCP devices, allowing for real-time communication between WebSocket clients and various TCP endpoints. It includes robust features such as automatic reconnection and dynamic TCP connection management.

## Features

- **Dynamic TCP Connection Management**: Add, remove, and manage TCP connections through WebSocket commands.
- **Automatic Reconnection**: Automatically attempts to reconnect to TCP devices if the connection is lost.
- **Database Integration**: Uses SQLite to store and retrieve TCP connection details, ensuring persistence across restarts.

## Getting Started

### Prerequisites

- Python 3.9 or later
- Dependencies listed in `requirements.txt`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mudasirmirza/ws2tcp.git
   ```

2. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

### Usage

1. Start the server:

   ```bash
   python server.py
   ```

2. Connect with a WebSocket client to send commands to TCP devices and manage connections.

## Configuration

- The server configuration can be adjusted using environment variables or directly in the server script.
- TCP device connections are managed dynamically through WebSocket messages or restored from the SQLite database at startup.

## Docker Deployment

Refer to the `docker-compose.yml` file for deploying the server and the SQLite database using Docker.

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: https://github.com/mudasirmirza/ws2tcp
