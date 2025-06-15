const Poll = require('../models/Poll');
const Student = require('../models/Student');

let currentPoll = null;
let pollTimeout = null;
let participants = {};

module.exports = (io, socket) => {
  socket.on('teacher:join', () => {
    console.log('Teacher joined:', socket.id);
    socket.emit('participants:update', Object.entries(participants).map(([id, name]) => ({ id, name })));
  });

  socket.on('student:join', ({ name }) => {
    socket.data.name = name;
    participants[socket.id] = name;
    io.emit('participants:update', Object.entries(participants).map(([id, name]) => ({ id, name })));
  });

  socket.on('poll:create', async ({ question, options, timeLimit, createdBy, correctIndex }) => {
    if (currentPoll && currentPoll.isActive) {
      socket.emit('error', { message: 'A poll is already active' });
      return;
    }

    const newPoll = new Poll({
      question,
      options: options.map(text => ({ text })),
      createdBy,
      timeLimit,
      correctIndex
    });

    currentPoll = await newPoll.save();
    io.emit('poll:started', { ...currentPoll.toObject(), correctIndex });

    pollTimeout = setTimeout(() => {
      currentPoll.isActive = false;
      currentPoll.save();
      io.emit('poll:ended', { ...currentPoll.toObject(), correctIndex });
    }, timeLimit * 1000);
  });

  socket.on('poll:vote', async ({ optionIndex }) => {
    if (!currentPoll || !currentPoll.isActive) return;

    const userId = socket.id;
    if (currentPoll.voters.includes(userId)) return;

    currentPoll.options[optionIndex].votes += 1;
    currentPoll.voters.push(userId);
    await currentPoll.save();

    io.emit('poll:update', currentPoll);

    if (currentPoll.voters.length >= io.engine.clientsCount - 1) {
      clearTimeout(pollTimeout);
      currentPoll.isActive = false;
      await currentPoll.save();
      io.emit('poll:ended', currentPoll);
    }
  });

  socket.on('teacher:kick', (studentId) => {
    io.to(studentId).emit('kicked');
    io.sockets.sockets.get(studentId)?.disconnect();
  });

  socket.on('poll:update', (pollData) => {
    io.emit('poll:update', { ...pollData, correctIndex: pollData.correctIndex });
  });

  socket.on('disconnect', () => {
    if (participants[socket.id]) {
      delete participants[socket.id];
      io.emit('participants:update', Object.entries(participants).map(([id, name]) => ({ id, name })));
    }
    console.log('User disconnected:', socket.id);
  });
};