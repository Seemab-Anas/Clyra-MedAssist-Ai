# ICD-10 Code Integration - Setup Instructions

## ✅ What Has Been Implemented

### 1. **Template Configuration** (`src/config/prompts.js`)
- Added `supportsICD10: true/false` flag to all 20 templates
- **Templates with ICD-10 support (9 templates):**
  - SOAP Note
  - ADIME Note
  - SOAP Note Including Issues
  - Ward Round
  - Dietetics Note
  - Eating Disorder Intake & Assessment
  - Dietetic Consultation Note
  - Discharge Nutrition Summary
  
- **Templates without ICD-10 (11 templates):**
  - All letters, meetings, and administrative notes

### 2. **Database Model** (`src/models/ICD10Code.js`)
- MongoDB model for ICD-10 codes
- Search functionality by code or description
- Text indexing for fast searches

### 3. **API Endpoints**

#### `/api/icd-codes/search` (GET)
- Search ICD-10 codes by query
- Parameters: `?q=diabetes&limit=20`
- Returns matching codes from database

#### `/api/suggest-icd-codes` (POST)
- AI-powered code suggestions
- Analyzes note content and suggests relevant ICD-10 codes
- Validates suggestions against database

### 4. **UI Component** (`src/components/ICDCodeSelector.js`)
- AI-suggested codes with confidence levels
- Manual search and add functionality
- Selected codes management
- Only displays for templates with `supportsICD10: true`

### 5. **Integration** (`src/components/EnhancedProviderNote.js`)
- ICD-10 code selector integrated into note editor
- Saves codes with medical record
- Template-aware display

### 6. **Import Script** (`scripts/importICD10.js`)
- Imports ICD-10 codes from CSV to MongoDB
- Creates search indexes
- Batch processing for performance

---

## 🚀 Setup Steps

### Step 1: Install Required Package
```bash
npm install csv-parser
```

### Step 2: Import ICD-10 Data to MongoDB

**Run the import script:**
```bash
node scripts/importICD10.js
```

**What it does:**
- Reads `src/icd-dataset/ICD10codes.csv` (14.65 MB)
- Parses ~71,000 ICD-10 codes
- Imports to MongoDB collection `icd_codes`
- Creates search indexes

**Expected output:**
```
🚀 Starting ICD-10 code import...
✅ Connected to MongoDB
🗑️  Clearing existing ICD-10 codes...
📊 Processed 10000 codes...
📊 Processed 20000 codes...
...
✅ Parsed 71703 ICD-10 codes from CSV
💾 Inserted 71703/71703 codes...
🔍 Creating search indexes...
✅ ICD-10 import completed successfully!
```

**Time:** ~2-5 minutes depending on your system

### Step 3: Verify Import

**Check MongoDB:**
```javascript
// In MongoDB shell or Compass
use medical-scribe
db.icd_codes.countDocuments()  // Should return ~71,703
db.icd_codes.findOne()  // View a sample code
```

### Step 4: Test the System

1. **Generate a medical note** (e.g., SOAP Note)
2. **AI will automatically suggest ICD-10 codes** based on diagnoses
3. **Search manually** for additional codes
4. **Select/deselect codes** as needed
5. **Save note** with ICD-10 codes attached

---

## 📊 Data Structure

### ICD-10 Code in MongoDB:
```javascript
{
  _id: ObjectId("..."),
  parentCode: "E11",
  subIndex: "9",
  code: "E119",
  description: "Type 2 diabetes mellitus without complications",
  altDescription: "Type 2 diabetes mellitus without complications",
  shortDescription: "Type 2 diabetes",
  category: "Type 2 diabetes"
}
```

### Medical Record with ICD Codes:
```javascript
{
  _id: ObjectId("..."),
  patientId: ObjectId("..."),
  doctorId: ObjectId("..."),
  content: "SOAP note content...",
  icdCodes: [
    {
      code: "E119",
      description: "Type 2 diabetes mellitus without complications",
      shortDescription: "Type 2 diabetes",
      source: "AI",  // or "MANUAL"
      confidence: "high",
      validated: true
    }
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 🎯 How It Works

### Workflow:
1. **Doctor generates note** using any template
2. **If template supports ICD-10** (`supportsICD10: true`):
   - AI analyzes the note content
   - Extracts diagnoses/conditions
   - Suggests relevant ICD-10 codes
   - Validates codes against database
3. **Doctor reviews AI suggestions**:
   - Check/uncheck suggested codes
   - Search for additional codes manually
   - Add/remove codes as needed
4. **Save note** with selected ICD-10 codes
5. **Codes stored** in medical record for billing/documentation

### AI Suggestion Logic:
```
Note Content → Groq AI Analysis → Extract Diagnoses → 
Suggest ICD-10 Codes → Validate in Database → Display to Doctor
```

---

## 🔧 Troubleshooting

### Import Script Fails
**Error:** `Cannot find module 'csv-parser'`
**Fix:** Run `npm install csv-parser`

**Error:** `MONGODB_URI not found`
**Fix:** Ensure `.env.local` has `MONGODB_URI` set

### No AI Suggestions
**Check:**
1. `GROQ_API_KEY` is set in `.env.local`
2. Note content has diagnoses mentioned
3. Check browser console for errors

### Search Not Working
**Check:**
1. Import script completed successfully
2. MongoDB indexes created
3. Database connection working

### ICD Codes Not Showing
**Check:**
1. Template has `supportsICD10: true` in `prompts.js`
2. `templateId` is passed to `EnhancedProviderNote`
3. Component is receiving `recordData` correctly

---

## 📝 Usage Examples

### Example 1: SOAP Note with Diabetes
**Note Content:**
```
Assessment:
- Type 2 diabetes mellitus, uncontrolled
- Hypertension
```

**AI Suggestions:**
- E11.65 - Type 2 diabetes with hyperglycemia (high confidence)
- I10 - Essential hypertension (high confidence)

### Example 2: Manual Search
**Search:** "pneumonia"
**Results:**
- J18.9 - Pneumonia, unspecified organism
- J15.9 - Bacterial pneumonia, unspecified
- J12.9 - Viral pneumonia, unspecified

---

## 🎨 UI Features

### AI Suggestions Section
- Shows AI-suggested codes with confidence levels
- Color-coded badges (high/medium/low confidence)
- One-click to add/remove
- Validation indicator

### Manual Search
- Real-time search as you type
- Autocomplete dropdown
- Search by code or description
- Debounced for performance

### Selected Codes
- List of all selected codes
- Shows source (AI or MANUAL)
- Remove button for each code
- Saved with medical record

---

## 🚀 Next Steps (Optional Enhancements)

1. **Export functionality** - Generate billing reports with ICD codes
2. **Code history** - Track commonly used codes per doctor
3. **Favorites** - Save frequently used codes
4. **Bulk operations** - Add multiple codes at once
5. **Code validation** - Check for valid combinations
6. **Analytics** - Most common diagnoses, code usage stats

---

## 📚 Resources

- **ICD-10 Dataset:** Kaggle - ICD10 Codes and Descriptions
- **Official ICD-10:** https://www.cms.gov/medicare/coding-billing/icd-10-codes
- **Groq AI:** https://groq.com/

---

## ✅ Checklist

- [ ] Install `csv-parser` package
- [ ] Run import script
- [ ] Verify 71,703 codes in MongoDB
- [ ] Test note generation with SOAP template
- [ ] Verify AI suggestions appear
- [ ] Test manual search
- [ ] Test adding/removing codes
- [ ] Verify codes save with medical record

---

**Implementation Complete!** 🎉

The ICD-10 system is fully integrated and ready to use. Follow the setup steps above to import the data and start using it.
