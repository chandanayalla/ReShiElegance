import bcrypt from 'bcryptjs';
import { db } from '../firebase.js';

export const createDefaultAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@reshi.com';
    const password = process.env.ADMIN_PASSWORD || 'reshi123';

    const snapshot = await db.collection('admins').where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('admins').add({
      name: 'ReShi Admin',
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    console.log(`Default admin created: ${email}`);
  } catch (error) {
    console.error('Failed to create default admin:', error);
    throw error;
  }
};
