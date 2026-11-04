// Local SMTP sink for integration tests. Never sends mail outside this process.
import { createServer } from 'node:net';
import { once } from 'node:events';

export async function localSmtp() {
  const messages = [], sockets = new Set();
  let rejectNext = false;
  const server = createServer(socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.setEncoding('utf8');
    socket.write('220 local.test SMTP ready\r\n');
    let buffer = '', data = false, lines = [], recipients = [];
    socket.on('data', chunk => {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf('\r\n')) !== -1) {
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 2);
        if (data) {
          if (line === '.') {
            data = false;
            if (rejectNext) { rejectNext = false; socket.write('451 Temporary test failure\r\n'); }
            else { messages.push({ recipients: [...recipients], body: lines.join('\r\n') }); socket.write('250 Message accepted\r\n'); }
            lines = [];
          } else lines.push(line.startsWith('..') ? line.slice(1) : line);
        } else if (/^(EHLO|HELO)/i.test(line)) socket.write('250-local.test\r\n250 PIPELINING\r\n');
        else if (/^MAIL FROM:/i.test(line)) { recipients = []; socket.write('250 OK\r\n'); }
        else if (/^RCPT TO:/i.test(line)) { recipients.push(line.slice(8).trim().replace(/[<>]/g, '')); socket.write('250 OK\r\n'); }
        else if (/^DATA$/i.test(line)) { data = true; lines = []; socket.write('354 End with dot\r\n'); }
        else if (/^QUIT$/i.test(line)) { socket.end('221 Bye\r\n'); }
        else socket.write('250 OK\r\n');
      }
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    messages,
    port: server.address().port,
    rejectNext() { rejectNext = true; },
    async close() { for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); },
  };
}
