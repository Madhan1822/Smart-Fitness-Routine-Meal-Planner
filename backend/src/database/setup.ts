import { initializeDatabase, testConnection } from './connection';

const setupDatabase = async () => {
    try {
        console.log('🔧 Setting up database...');
        await testConnection();
        await initializeDatabase();
        console.log('✅ Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
};

setupDatabase();
