import { connectToDatabase } from '/utils/db';
import { hashPassword } from '/utils/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return;
    }
    const data = req.body;
    const { email, password } = data;

    if (
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
            message:
                'invalid input - password should also be at least 7 characters long.',
        });
        return;
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
        client.close();
        res.status(422).json({ message: 'user exist already!' });
        return;
    }

    const hashedPassword = await hashPassword(password);

    try {
        const result = await db
            .collection('users')
            .insertOne({ email: email, password: hashedPassword });
    } catch (error) {
        client.close();
        res.status(500).json({ message: 'saving user failed' });
    }

    client.close();
    res.status(201).json({ message: 'created new user' });
}

export default handler;
