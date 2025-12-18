import { Client } from "ssh2";
import net from "net";

class SSHTunnel {
  constructor() {
    this.sshClient = null;
    this.server = null;
    this.localPort = 3307; // Local port for the tunnel
  }

  async createTunnel() {
    return new Promise((resolve, reject) => {
      this.sshClient = new Client();

      this.sshClient.on("ready", () => {
        console.log("✅ SSH Connection established");

        // Create a local server that forwards to remote MySQL
        this.server = net.createServer((clientSocket) => {
          this.sshClient.forwardOut(
            "127.0.0.1",
            0,
            "127.0.0.1", // MySQL is on localhost from SSH server's perspective
            3306, // Remote MySQL port
            (err, stream) => {
              if (err) {
                console.error("❌ SSH forwarding error:", err);
                clientSocket.end();
                return;
              }
              clientSocket.pipe(stream).pipe(clientSocket);
            }
          );
        });

        this.server.listen(this.localPort, "127.0.0.1", () => {
          console.log(`✅ SSH Tunnel ready on localhost:${this.localPort}`);
          resolve(this.localPort);
        });

        this.server.on("error", reject);
      });

      this.sshClient.on("error", (err) => {
        console.error("❌ SSH Client error:", err);
        reject(err);
      });

      // Connect to SSH server
      this.sshClient.connect({
        host: process.env.SSH_HOST,
        port: Number(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
        // OR use key-based authentication:
        // privateKey: require('fs').readFileSync('/path/to/private/key'),
      });
    });
  }

  async close() {
    if (this.server) {
      this.server.close();
    }
    if (this.sshClient) {
      this.sshClient.end();
    }
    console.log("✅ SSH Tunnel closed");
  }
}

const sshTunnel = new SSHTunnel();
export default sshTunnel;
