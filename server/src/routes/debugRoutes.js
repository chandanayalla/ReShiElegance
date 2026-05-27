import express from 'express';
import { admin, bucket } from '../firebase.js';

const router = express.Router();

router.get('/firebase-status', async (req, res) => {
  try {
    const initialized = Array.isArray(admin.apps) && admin.apps.length > 0;
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || (bucket && bucket.name) || null;

    // Optional: try a lightweight admin call (list buckets requires permissions and may fail)
    res.json({ ok: true, firebase: { initialized, bucketName } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
