# 🎉 Disease Prediction API Integration Guide

## ✅ Your API is Working!

Your fine-tuned Gemma model successfully returned a diagnosis:

```
Symptoms: "fever and cough"

Diagnosis:
1. Viral bronchiolitis
2. Bacterial bronchiolitis
3. Bacterial pneumonia
4. Bacterial bronchiolitis
5. Pulmonary tuberculosis
```

---

## 🔧 Integration Steps

### **Step 1: Add API URL to `.env.local`**

Open or create `.env.local` and add:

```bash
# MongoDB
MONGODB_URI=your_mongodb_uri_here

# Groq API
GROQ_API_KEY=your_groq_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Colab Disease Prediction API
COLAB_API_URL=https://insipiently-gressorial-loralee.ngrok-free.dev
```

**⚠️ Important:** This URL changes each time you restart Colab. Update it when needed.

---

### **Step 2: Restart Your Next.js Dev Server**

After updating `.env.local`:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

---

### **Step 3: Use in Your Dashboard**

Add this function to your dashboard component:

```javascript
// In src/app/dashboard/page.js

const [diseasePrediction, setDiseasePrediction] = useState('');
const [predictingDisease, setPredictingDisease] = useState(false);

const predictDisease = async (symptoms) => {
  setPredictingDisease(true);
  try {
    const response = await fetch('/api/predict-disease', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setDiseasePrediction(data.diagnosis);
      return data.diagnosis;
    } else {
      console.error('Prediction error:', data.error);
      alert('Failed to predict disease: ' + data.error);
      return null;
    }
  } catch (error) {
    console.error('Prediction failed:', error);
    alert('Failed to connect to prediction API');
    return null;
  } finally {
    setPredictingDisease(false);
  }
};
```

---

### **Step 4: Add UI Button**

Add a button to trigger disease prediction:

```javascript
{/* Disease Prediction Button */}
{medicalNote && (
  <button
    onClick={() => predictDisease(medicalNote)}
    disabled={predictingDisease}
    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
  >
    {predictingDisease ? 'Predicting...' : '🔬 Predict Disease'}
  </button>
)}

{/* Display Prediction */}
{diseasePrediction && (
  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
    <h3 className="font-semibold text-purple-900 mb-2">
      Disease Prediction (AI Model)
    </h3>
    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
      {diseasePrediction}
    </pre>
  </div>
)}
```

---

## 🧪 Testing

### **Test from Terminal:**

```powershell
curl https://insipiently-gressorial-loralee.ngrok-free.dev/predict -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"symptoms":"Patient has chest pain and shortness of breath"}'
```

### **Test from Browser Console:**

```javascript
fetch('/api/predict-disease', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    symptoms: 'Patient has chest pain and shortness of breath' 
  })
})
.then(r => r.json())
.then(d => console.log(d.diagnosis));
```

---

## 📊 Example Use Cases

### **1. Predict from Medical Note**

```javascript
// After generating medical note
const diagnosis = await predictDisease(medicalNote);
```

### **2. Predict from Symptoms List**

```javascript
const symptoms = selectedPatient.symptoms.join(', ');
const diagnosis = await predictDisease(symptoms);
```

### **3. Predict from Transcription**

```javascript
const diagnosis = await predictDisease(transcription);
```

---

## ⚠️ Important Notes

### **Colab Session Management:**

- **Keep Colab tab open** - API stops if you close it
- **12 hour limit** - Free tier sessions expire after 12 hours
- **90 min idle timeout** - Keep making requests or session ends
- **URL changes** - Update `.env.local` when you restart Colab

### **Production Deployment:**

For permanent deployment, consider:
1. **HuggingFace Spaces** - Free, permanent hosting
2. **Google Cloud Run** - Serverless, pay-per-use
3. **AWS SageMaker** - Managed ML hosting
4. **ngrok Pro** - Static URL ($8/month)

---

## 🎯 Summary

✅ Your fine-tuned Gemma model is deployed  
✅ API endpoint is live and working  
✅ Returns disease predictions based on symptoms  
✅ Ready to integrate into your Next.js app  

**Next:** Add `COLAB_API_URL` to `.env.local` and integrate into your dashboard! 🚀
