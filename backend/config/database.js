const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Test the connection
        await mongoose.connection.db.admin().ping();
        console.log('Database ping successful');

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        console.log('\nSolutions:');
        console.log('1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
        console.log('2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
        console.log('3. Update MONGO_URI in backend/config/config.env');
        console.log('\nFor MongoDB Atlas:');
        console.log('- Create free account at https://www.mongodb.com/atlas');
        console.log('- Create a new cluster');
        console.log('- Get connection string and update MONGO_URI');
        console.log('- Example: mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority');

        // Don't exit the process, let it continue but registration will fail
        console.log('\nServer will start but registration/login will not work until MongoDB is connected.');
    }
};

module.exports = connectDatabase;
