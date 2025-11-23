# BiblioSearch - Enhanced Academic Search Platform

A modern, AI-powered library search platform with semantic discovery capabilities, designed for students, researchers, and academic institutions.

![BiblioSearch](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)

## ✨ Features

### 🔍 Intelligent Search
- **AI-Powered Synthesis**: Get comprehensive summaries from multiple sources
- **Semantic Discovery**: Find resources based on meaning, not just keywords
- **Multi-Source Integration**: Library catalog + verified web sources
- **Smart Suggestions**: Real-time search recommendations

### 📚 Resource Management
- **Personal Shelf**: Save and organize resources
- **Citation Generator**: APA, MLA, and Chicago formats
- **Resource Details**: Full abstracts, metadata, and availability
- **Physical Copy Requests**: Request retrieval from circulation desk

### 🎓 Academic Features
- **Campus Collections**: Personalized recommendations based on your institution
- **Lecturer Directory**: Find experts in your field
- **Research Topics**: Discover related areas of study
- **Activity Tracking**: Monitor your research journey

### 🎨 Premium Design
- **Glassmorphic UI**: Modern, beautiful interface
- **Dark Mode Ready**: Easy on the eyes
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Delightful micro-interactions

### 🔐 Admin Panel
- **Student Management**: Track user activity
- **Analytics Dashboard**: Usage statistics and insights
- **Content Management**: Add lecturers, universities, and resources
- **AI Configuration**: Manage API keys and model selection

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0 or higher (or 22.12.0+)
- npm 10.x or higher
- A Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bibliosearch.git
   cd bibliosearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   
   > **Get your free API key:** https://aistudio.google.com/apikey
   > 
   > See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) for detailed setup instructions

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📖 Documentation

- **[API Keys Guide](./API_KEYS_GUIDE.md)** - Complete guide to setting up API keys
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Vercel, Netlify, and more
- **[User Guide](#user-guide)** - How to use BiblioSearch

## 🎯 Usage

### For Students

1. **Complete Onboarding**
   - Enter your details (name, institution, department)
   - Upload a profile picture (optional)
   - Get your unique student ID

2. **Search for Resources**
   - Enter your research topic
   - Get AI-generated synthesis
   - Browse library catalog and web sources
   - Filter by type and year

3. **Save and Cite**
   - Save resources to your shelf
   - Generate citations in multiple formats
   - Request physical copies

### For Librarians/Admins

1. **Access Admin Panel**
   - Click "Librarian Access" on home page
   - Default password: `admin123` (⚠️ Change this!)

2. **Manage Content**
   - Add universities and lecturers
   - Monitor student activity
   - View analytics

3. **Configure AI**
   - Add API keys for different providers
   - Select preferred AI model
   - Monitor usage

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Vanilla CSS (Tailwind-inspired utilities)
- **AI Integration**: 
  - Google Gemini 2.0 Flash
  - Groq (Llama models)
  - SambaNova
  - Mistral AI
  - OpenRouter
  - Nebius
- **Search Enhancement**: Tavily API

## 📦 Project Structure

```
bibliosearch/
├── components/          # Reusable UI components
│   ├── Icons.tsx       # SVG icon library
│   ├── Visuals.tsx     # Visual components (book covers, etc.)
│   ├── Loading.tsx     # Loading animations
│   ├── Toast.tsx       # Notification system
│   └── ...
├── views/              # Main application views
│   ├── ResultsView.tsx # Search results page
│   ├── AdminView.tsx   # Admin dashboard
│   ├── OnboardingView.tsx
│   └── ...
├── services/           # Business logic and API calls
│   ├── llmService.ts   # AI model integration
│   └── databaseService.ts # Local storage management
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary (Library)**: `#2C1810` (Deep brown)
- **Accent (Amber)**: `#F59E0B` (Warm amber)
- **Success**: `#10B981` (Green)
- **Info**: `#3B82F6` (Blue)
- **Error**: `#EF4444` (Red)

### Typography
- **Headings**: Serif font family
- **Body**: Sans-serif font family
- **Code**: Monospace font family

### Components
- **Rounded corners**: 1rem - 2.5rem
- **Shadows**: Soft, layered shadows
- **Animations**: Smooth 300ms transitions
- **Glassmorphism**: Backdrop blur effects

## 🔧 Configuration

### Available AI Models

| Provider | Models | Free Tier | Setup Guide |
|----------|--------|-----------|-------------|
| Google Gemini | 2.0 Flash, 1.5 Pro | ✅ Yes | [Guide](./API_KEYS_GUIDE.md#1-google-gemini-api) |
| Groq | Llama 3.3, Mixtral | ✅ Yes | [Guide](./API_KEYS_GUIDE.md#groq) |
| SambaNova | Llama 3.1, 3.2 | ✅ Yes | [Guide](./API_KEYS_GUIDE.md#sambanova) |
| Mistral | Large, Medium | ❌ No | [Guide](./API_KEYS_GUIDE.md#mistral-ai) |
| OpenRouter | GPT-4, Claude, etc. | ❌ No | [Guide](./API_KEYS_GUIDE.md#openrouter) |

### Environment Variables

All environment variables must be prefixed with `VITE_`:

```env
# Required (choose at least one)
VITE_GOOGLE_API_KEY=your_key

# Optional
VITE_TAVILY_API_KEY=your_key
VITE_GROQ_API_KEY=your_key
VITE_SAMBANOVA_API_KEY=your_key
VITE_MISTRAL_API_KEY=your_key
VITE_OPENROUTER_API_KEY=your_key
VITE_NEBIUS_API_KEY=your_key
```

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add VITE_GOOGLE_API_KEY

# Deploy to production
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for all platforms.

## 🧪 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Tavily** for enhanced web search
- **Lucide Icons** for beautiful icon inspiration
- **React** and **Vite** teams for excellent tools

## 📧 Support

- **Documentation**: See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Open an issue on GitHub
- **Email**: support@bibliosearch.example.com

## 🗺️ Roadmap

- [ ] Backend API with PostgreSQL
- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] PDF full-text search
- [ ] Integration with institutional repositories

---

**Made with ❤️ for the academic community**

**Powered by AI • Built with React • Designed for Scholars**
