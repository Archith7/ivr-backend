module.exports = (io) => {
  let connectedPeers = [];
  let callInProgress = false;

  io.on('connection', (socket) => {
      console.log('A user connected with ID:', socket.id);

      connectedPeers.push(socket);
      console.log(`Current number of connected peers: ${connectedPeers.length}`);

      // Handle 'offer' event
      socket.on('offer', (offer) => {
          console.log(`Received offer from ${socket.id}:`, offer);
          connectedPeers.forEach(peer => {
              if (peer !== socket) {
                  console.log(`Sending offer to peer ${peer.id}`);
                  peer.emit('offer', offer);
              }
          });
          callInProgress = true;
      });

      // Handle 'answer' event
      socket.on('answer', (answer) => {
          console.log(`Received answer from ${socket.id}:`, answer);
          connectedPeers.forEach(peer => {
              if (peer !== socket) {
                  console.log(`Sending answer to peer ${peer.id}`);
                  peer.emit('answer', answer);
              }
          });
      });

      // Handle 'candidate' event
      socket.on('candidate', (candidate) => {
          console.log(`Received ICE candidate from ${socket.id}:`, candidate);
          connectedPeers.forEach(peer => {
              if (peer !== socket) {
                  console.log(`Sending ICE candidate to peer ${peer.id}`);
                  peer.emit('candidate', candidate);
              }
          });
      });

      // Handle 'endCall' event
      socket.on('endCall', () => {
          if (callInProgress) {
              console.log(`Call ended by ${socket.id}`);
              connectedPeers.forEach(peer => {
                  if (peer !== socket) {
                      console.log(`Sending endCall to peer ${peer.id}`);
                      peer.emit('endCall');
                  }
              });
              callInProgress = false;
          }
      });

      // Handle 'disconnect' event
      socket.on('disconnect', () => {
          console.log('User disconnected with ID:', socket.id);
          connectedPeers = connectedPeers.filter(peer => peer !== socket);
          console.log(`Current number of connected peers: ${connectedPeers.length}`);
      });
  });
};
