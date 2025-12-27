import { createApp } from './app';
import { config } from './config';

/**
 * Start the server in DEMO MODE (No MySQL required)
 */
const startServer = async () => {
    try {
        console.log('');
        console.log('='.repeat(60));
        console.log('🚀 Starting Smart Fitness API Server (DEMO MODE)');
        console.log('='.repeat(60));
        console.log('📝 Using IN-MEMORY DATABASE (No MySQL required)');
        console.log('⚠️  Data will be lost when server restarts');
        console.log('');

        // Create Express app
        const app = createApp();

        // Start listening
        const server = app.listen(config.port, () => {
            console.log('');
            console.log('='.repeat(60));
            console.log('✅ Smart Fitness API Server Started Successfully!');
            console.log('='.repeat(60));
            console.log(`📍 Server running on: http://localhost:${config.port}`);
            console.log(`🌍 Environment: ${config.nodeEnv}`);
            console.log(`💾 Database: IN-MEMORY (Demo Mode)`);
            console.log('');
            console.log('📚 API Endpoints:');
            console.log(`   - Health Check: http://localhost:${config.port}/api/health`);
            console.log(`   - Users: http://localhost:${config.port}/api/users`);
            console.log(`   - Plans: http://localhost:${config.port}/api/plans`);
            console.log(`   - Meals: http://localhost:${config.port}/api/meals`);
            console.log(`   - Progress: http://localhost:${config.port}/api/progress`);
            console.log('');
            console.log('🧪 Test the API:');
            console.log(`   curl http://localhost:${config.port}/api/health`);
            console.log('');
            console.log('📖 Documentation: See README.md and API_EXAMPLES.md');
            console.log('='.repeat(60));
            console.log('');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('⚠️  SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('⚠️  SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
