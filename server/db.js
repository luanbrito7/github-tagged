import mongoose from 'mongoose';
 
const connectDB = () => {
    return mongoose.connect(
        process.env.DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
};

const db = mongoose.connection;
 
db.on('error', () => console.log('connection error'));

export { connectDB, db };