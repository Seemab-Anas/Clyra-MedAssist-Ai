# Environment Variables Setup

## Required API Keys

Your `.env.local` file needs these environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.oqwpusv.mongodb.net/medical_transcription?retryWrites=true&w=majority

# Groq API Key (Required for transcription and AI features)
GROQ_API_KEY=your_groq_api_key_here

# JWT Secret (for authentication)
JWT_SECRET=your_random_secret_key_here
```

---

## How to Get GROQ_API_KEY

1. **Go to Groq Console:** https://console.groq.com/
2. **Sign up or Login** with your account
3. **Navigate to API Keys** section
4. **Create New API Key**
5. **Copy the key** and paste it in your `.env.local` file

---

## How to Fix Your Current Issue

**The transcription is failing because `GROQ_API_KEY` is missing.**

### Steps:

1. **Create/Edit `.env.local` file** in your project root:
   ```
   d:\Clyra\clyra-main - Copy\.env.local
   ```

2. **Add this content:**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.oqwpusv.mongodb.net/medical_transcription?retryWrites=true&w=majority
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   JWT_SECRET=some_random_secret_string_12345
   ```

3. **Get your Groq API key** from https://console.groq.com/keys

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## What Each Key Does

### MONGODB_URI
- Connects to MongoDB Atlas database
- Stores patients, medical records, appointments
- **Fix:** Whitelist IP in MongoDB Atlas Network Access

### GROQ_API_KEY
- Powers AI transcription (Whisper model)
- Powers dialogue separation
- Powers medical note generation
- **Required for:** Dictate feature, Upload audio, Generate notes

### JWT_SECRET
- Secures user authentication
- Encrypts session tokens
- Can be any random string

---

## Current Error

```
Error: API key not configured
Details: Please create a .env.local file with GROQ_API_KEY
```

**This means:** Your `.env.local` file either doesn't exist or doesn't have `GROQ_API_KEY`.

---

## Quick Fix

1. Open/Create: `d:\Clyra\clyra-main - Copy\.env.local`
2. Add:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Save file
4. Restart server
5. Try dictate again

---

## Verify Setup

After adding the key, check the terminal when you run `npm run dev`:
- ✅ No "API key not configured" errors
- ✅ Transcription works
- ✅ Note generation works

---

## Free Groq API

Groq offers a **free tier** with generous limits:
- Fast inference
- Whisper-large-v3 for transcription
- Llama models for text generation

Perfect for development and testing!
