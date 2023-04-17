import { connectToDatabase } from '/utils/db';
import { verifyPassword } from '../../../../utils/auth';
import { getSession } from 'next-auth/client';
import { hashPassword } from '/utils/auth';

async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }
    console.log(req.body);
    const session = await getSession({ req: req });

    if (!session) {
        res.status(401).json({ message: 'not authenticated!' });
        return;
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();
    const userCollection = client.db().collection('users');
    const user = await userCollection.findOne({ email: userEmail });

    if (!user) {
        res.status(404).json({ message: 'user not found' });
        client.close();
        return;
    }

    const currentPassword = user.password;
    const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordAreEqual) {
        res.status(403).json({ message: 'invalid password.' });
        client.close();
        return;
    }

    const hashedNewPassword = await hashPassword(newPassword);

    const result = await userCollection.updateOne(
        { email: userEmail },
        { $set: { password: hashedNewPassword } }
    );

    client.close();
    res.status(200).json({ message: 'password updated!' });
}

export default handler;
