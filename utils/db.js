import { MongoClient } from 'mongodb';

const mongoDBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.clt4sax.mongodb.net/auth-next?retryWrites=true&w=majority`;

export async function connectToDatabase() {
    const client = MongoClient.connect(mongoDBUrl);
    return client;
}


