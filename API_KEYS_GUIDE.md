# BiblioSearch - API Keys Configuration Guide

## 🔑 Required API Keys

BiblioSearch uses AI models to provide intelligent search capabilities. You'll need at least **one** of the following API keys to use the application.

---

## 1. Google Gemini API (Recommended - Free Tier Available)

**Why Gemini?** 
- ✅ Free tier with generous quota
- ✅ Built-in Google Search grounding
- ✅ Best performance for BiblioSearch
- ✅ No credit card required for free tier

### How to Get Your Gemini API Key:

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/apikey

2. **Sign in with Google Account**
   - Use any Google account (Gmail, Workspace, etc.)

3. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Click "Create API key in new project" (or select existing project)
   - Copy the generated API key

4. **Add to BiblioSearch**
   - Open the app and go to **Librarian Dashboard** (Admin Panel)
   - Navigate to **Settings** → **AI Configuration**
   - Paste your key in the "Google Gemini API Key" field
   - Click Save

**Free Tier Limits:**
- 15 requests per minute
- 1,500 requests per day
- 1 million requests per month

---

## 2. Tavily Search API (Optional - Enhances Non-Gemini Models)

**Why Tavily?**
- ✅ Provides web search grounding for non-Gemini models
- ✅ Free tier available
- ✅ Enhances search quality

### How to Get Your Tavily API Key:

1. **Visit Tavily**
   - Go to: https://tavily.com

2. **Sign Up**
   - Create a free account
   - Verify your email

3. **Get API Key**
   - Go to your dashboard
   - Copy your API key

4. **Add to BiblioSearch**
   - In Librarian Dashboard → Settings → AI Configuration
   - Paste in "Tavily API Key" field

**Free Tier:**
- 1,000 searches per month

---

## 3. Alternative AI Providers (Optional)

If you want to use other AI models, you can configure these providers:

### **Groq** (Fast inference, free tier)
- Website: https://console.groq.com
- Free tier: Very generous
- Models: Llama, Mixtral, Gemma

### **SambaNova** (Free tier available)
- Website: https://cloud.sambanova.ai
- Free tier: Available
- Models: Llama 3.1, Llama 3.2

### **Mistral AI**
- Website: https://console.mistral.ai
- Paid service
- Models: Mistral Large, Mistral Medium

### **OpenRouter** (Access to multiple models)
- Website: https://openrouter.ai
- Pay-per-use
- Access to GPT-4, Claude, and more

### **Nebius AI**
- Website: https://studio.nebius.ai
- Paid service

---

## 📝 Configuration Steps

### Method 1: Using the Admin Panel (Recommended)

1. **Access Admin Panel**
   - On the home page, scroll down
   - Click "Librarian Access"
   - Enter admin password (default: `admin123` - change this!)

2. **Navigate to Settings**
   - Click the "Settings" tab
   - Go to "AI Configuration"

3. **Add Your API Keys**
   - Paste your API key(s)
   - Select your preferred model
   - Click "Save Configuration"

### Method 2: Using .env.local File

1. **Create/Edit .env.local**
   ```bash
   # In the project root directory
   # Create or edit .env.local file
   ```

2. **Add Your Keys**
   ```env
   # Google Gemini (Recommended)
   VITE_GOOGLE_API_KEY=your_gemini_api_key_here
   
   # Tavily Search (Optional)
   VITE_TAVILY_API_KEY=your_tavily_api_key_here
   
   # Other providers (Optional)
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_SAMBANOVA_API_KEY=your_sambanova_api_key_here
   VITE_MISTRAL_API_KEY=your_mistral_api_key_here
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_NEBIUS_API_KEY=your_nebius_api_key_here
   ```

3. **Restart the Development Server**
   ```bash
   npm run dev
   ```

---

## 🎯 Quick Start (Fastest Setup)

**For the fastest setup, just get a Google Gemini API key:**

1. Go to https://aistudio.google.com/apikey
2. Create a free API key (no credit card needed)
3. Open BiblioSearch
4. Click "Librarian Access" → Settings → AI Configuration
5. Paste your Gemini key
6. Start searching!

---

## 🔒 Security Best Practices

### For Development:
- ✅ Use `.env.local` file (already in `.gitignore`)
- ✅ Never commit API keys to version control
- ✅ Use different keys for development and production

### For Production:
- ✅ Use environment variables on your hosting platform
- ✅ Rotate keys regularly
- ✅ Monitor API usage
- ✅ Set up usage alerts

---

## 🚨 Troubleshooting

### "API Key Invalid" Error
- ✅ Check for extra spaces in the key
- ✅ Ensure the key is active in the provider's dashboard
- ✅ Verify you're using the correct key for the selected model

### "Quota Exceeded" Error
- ✅ Check your usage in the provider's dashboard
- ✅ Wait for quota reset (usually daily)
- ✅ Upgrade to paid tier if needed
- ✅ Switch to a different provider temporarily

### Search Not Working
- ✅ Ensure at least one API key is configured
- ✅ Check browser console for errors (F12)
- ✅ Verify internet connection
- ✅ Try a different AI model

---

## 💡 Recommendations

### For Students/Personal Use:
- **Best Choice:** Google Gemini (free tier)
- **Backup:** Groq (free tier)

### For Institutions/Heavy Use:
- **Primary:** Google Gemini (paid tier)
- **Secondary:** Groq or SambaNova
- **Search Enhancement:** Tavily API

### For Maximum Features:
- **Google Gemini** for main searches (includes Google Search)
- **Tavily** for enhanced web grounding on other models
- **Groq** as fast backup option

---

## 📊 Cost Comparison

| Provider | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Google Gemini** | 1.5M requests/month | $0.075/1K tokens | General use, best value |
| **Tavily** | 1K searches/month | $0.005/search | Web search enhancement |
| **Groq** | Very generous | Free (for now) | Fast inference |
| **SambaNova** | Available | TBD | Alternative option |
| **Mistral** | No free tier | €0.002/1K tokens | European data residency |
| **OpenRouter** | No free tier | Varies by model | Access to premium models |

---

## 🎓 Need Help?

- Check the main README.md for general setup
- See DEPLOYMENT.md for hosting instructions
- Open an issue on GitHub for support

---

**Remember:** You only need ONE API key to get started. We recommend starting with Google Gemini's free tier!
