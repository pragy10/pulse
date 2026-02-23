import multer from 'multer';

// Use Memory instead of Disk to get the buffer for MongoDB
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// This helper now creates a string that MongoDB can store directly
export const getImageUrl = (file) => {
  if (!file) return '';
  const b64 = Buffer.from(file.buffer).toString('base64');
  return `data:${file.mimetype};base64,${b64}`;
};