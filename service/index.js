'use strict';

var net = require('net');

var LISTEN_PORT = 26102;
var TARGET_HOST = '127.0.0.1';
var TARGET_PORT = 26101;

var server = net.createServer({ allowHalfOpen: true }, function(client) {
  var bridge = net.createConnection({
    host: TARGET_HOST,
    port: TARGET_PORT,
    allowHalfOpen: true
  });

  function closeBoth() {
    client.destroy();
    bridge.destroy();
  }

  client.on('error', closeBoth);
  bridge.on('error', closeBoth);
  client.once('close', closeBoth);
  bridge.once('close', closeBoth);

  client.pipe(bridge);
  bridge.pipe(client);
});

server.listen(LISTEN_PORT, '0.0.0.0', function() {
  console.log('[SDB Relay] Listening on 0.0.0.0:' + LISTEN_PORT + ' -> ' + TARGET_HOST + ':' + TARGET_PORT);
});

server.on('error', function(err) {
  console.error('[SDB Relay] Server error:', err.message);
});
