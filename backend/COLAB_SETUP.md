# 🚀 Google Colab Deployment Guide

## Overview

Deploy your fine-tuned Gemma model to Google Colab with free GPU and access it via API from your Next.js app.

---

## 📋 Step-by-Step Setup

### **1. Upload Model Files to Google Drive**

1. Go to [Google Drive](https://drive.google.com)
2. Create folder: `medical_model`
3. Upload these files from your `backend/` folder:
   - `adapter_config.json`
   - `adapter_model.safetensors` (14.7 MB)
   - `tokenizer.json`
   - `tokenizer_config.json`
   - `chat_template.jinja`

---

### **2. Open Colab Notebook**

1. Go to [Google Colab](https://colab.research.google.com)
2. Upload `Medical_Disease_Prediction_Colab.ipynb`
3. **Important:** Change runtime to GPU
   - Click: `Runtime` → `Change runtime type`
   - Select: `T4 GPU`
   - Click: `Save`

---

### **3. Get ngrok Auth Token**

1. Go to [ngrok Dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Sign up (free)
3. Copy your auth token
4. In Colab, uncomment and add token:
   ```python
   ngrok.set_auth_token("YOUR_TOKEN_HERE")
   ```

---

### **5. Run All Cells**

1. Click: `Runtime` → `Run all`
2. Allow Google Drive access when prompted
3. Wait for model to load (~5 minutes)
4. Copy the ngrok URL that appears

**Example output:**
```
======================================================================
🎉 API IS LIVE!
======================================================================

📡 Public URL: https://abc123.ngrok.io

🔗 Use this in your Next.js app:
   https://abc123.ngrok.io/predict

🏥 Health check: https://abc123.ngrok.io/health

======================================================================
```

---

### **5. Update Your Next.js App**

Add ngrok URL to `.env.local`:

```bash
# Colab API URL (update with your ngrok URL)
COLAB_API_URL=https://abc123.ngrok.io
```

---

### **7. Test the API**

**From terminal:**
```bash
curl -X POST https://abc123.ngrok.io/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "Patient has fever and cough"}'
```

**From your Next.js app:**
```javascript
const response = await fetch('/api/predict-disease', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    symptoms: 'Patient has fever and cough' 
  })
});

const data = await response.json();
console.log(data.diagnosis);
```

---

## 📊 API Endpoints

### **Health Check**
```
GET https://your-ngrok-url.ngrok.io/health
```

**Response:**
```json
{
  "status": "healthy",
  "model": "loaded"
}
```

### **Predict Disease**
```
POST https://your-ngrok-url.ngrok.io/predict
```

**Request:**
```json
{
  "symptoms": "Patient has fever, cough, and difficulty breathing"
}
```

**Response:**
```json
{
  "success": true,
  "symptoms": "Patient has fever, cough, and difficulty breathing",
  "diagnosis": "Based on the symptoms...\n1. COVID-19\n2. Influenza\n3. Pneumonia..."
}
```

---

## ⚠️ Important Notes

### **Colab Session Limits:**
- **Free tier:** 12 hours max per session
- **Idle timeout:** 90 minutes
- **Solution:** Keep browser tab open, or upgrade to Colab Pro

### **ngrok URL Changes:**
- URL changes each time you restart Colab
- Update `.env.local` with new URL
- Or use ngrok paid plan for static URL

### **GPU Availability:**
- Free T4 GPU usually available
- If busy, try again later or upgrade to Colab Pro

---

## 🎯 Workflow

**Development:**
1. Start Colab notebook
2. Copy ngrok URL
3. Update `.env.local`
4. Develop your app

**Production:**
- Consider deploying to:
  - HuggingFace Spaces (free, permanent)
  - AWS SageMaker
  - Azure ML
  - Google Cloud Run

---

## 💡 Tips

### **Keep Colab Running:**
```javascript
// Run in browser console to prevent idle timeout
function keepAlive() {
  fetch('/health').then(() => console.log('Ping'));
}
setInterval(keepAlive, 60000); // Every minute
```

### **Test Before Integration:**
Use the test cell in Colab to verify model works before exposing API.

### **Monitor Usage:**
Check Colab usage: `Runtime` → `View resources`

---

## 🚀 Next Steps

1. ✅ Upload model files to Drive
2. ✅ Run Colab notebook
3. ✅ Get ngrok URL
4. ✅ Update `.env.local`
5. ✅ Test API endpoint
6. ✅ Integrate into your app

---

## 📞 Troubleshooting

**Model not loading?**
- Check Drive folder path matches
- Verify all files uploaded
- Check GPU is enabled

**ngrok not working?**
- Add auth token
- Check firewall settings
- Try different browser

**API timeout?**
- Model might be loading
- Wait 5 minutes after starting
- Check Colab logs

---

Your fine-tuned model is now accessible via API! 🎉
