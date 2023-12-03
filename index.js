const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});



const fs = require('fs');
const ssh2 = require('ssh2');

const privateKey = fs.readFileSync('./sshlol/key.txt'); // Replace with your private key path
const publicKey = fs.readFileSync('./sshlol/key.txt.pub'); // Replace with your public key path

const server = new ssh2.Server({
  hostKeys: [{ key: privateKey, passphrase: '' }] // Add passphrase if your key has one
}, (client) => {
  console.log('Client connected!');

  client.on('authentication', (ctx) => {
    if (ctx.method === 'publickey' &&
        ctx.key.algo === 'ssh-rsa' &&
        ctx.key.data.equals(publicKey)) {
      ctx.accept();
    } else {
      ctx.reject();
    }
  });

  client.on('ready', () => {
    console.log('Client authenticated!');

    client.on('session', (accept, reject) => {
      const session = accept();
      session.on('pty', (accept, reject, info) => {
        console.log('PTY requested');
        accept();
      });
      session.on('shell', (accept, reject) => {
        console.log('Shell requested');
        const stream = accept();
        stream.stderr.write('Oh no, this is not a real shell\n');
        stream.close();
      });
    });
  });
});

server.listen(2222, '0.0.0.0', () => {
  console.log('SSH server listening on port 2222');
});


const os = require('os');

const networkInterfaces = os.networkInterfaces();
const ipv4Interfaces = networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi'] || networkInterfaces['eth0']; // Adjust based on your system's network interface name

if (ipv4Interfaces && ipv4Interfaces.length > 0) {
  const ipv4 = ipv4Interfaces.find(interface => interface.family === 'IPv4');
  if (ipv4) {
    console.log('IP Address:', ipv4.address);
  }
}
