import express from 'express';

const server = express();
const port = 3000;


server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});