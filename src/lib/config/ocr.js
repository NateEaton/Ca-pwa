// OCR Configuration for Calcium Tracker PWA
export const OCR_CONFIG = {
  // API key from environment variable
  API_KEY: import.meta.env.VITE_OCR_API_KEY || 'YOUR_OCR_SPACE_KEY',
  API_ENDPOINT: 'https://api.ocr.space/parse/image',
  LANGUAGE: 'eng'
};