
const app = require('./src/app');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch'); 
global.fetch = fetch; 

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
