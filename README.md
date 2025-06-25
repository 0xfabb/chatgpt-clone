# ChatGPT Clone with Memory

A pixel-perfect ChatGPT clone built with Next.js, featuring a modern UI, multi-chat support, and AI memory integration using mem0.ai.

## Raw Talk about Project 





## ✨ Features

### 🎨 **Modern UI/UX**
- Pixel-perfect ChatGPT interface design
- Responsive design for desktop and mobile
- Dark theme with smooth animations
- Collapsible sidebar for mobile devices
- Real-time message streaming

### 💬 **Chat Functionality**
- Multi-chat system with localStorage persistence
- Real-time AI responses using OpenAI GPT-4
- Message editing capabilities
- Markdown rendering for rich text
- Context-aware conversations

### 🧠 **AI Memory Integration**
- Long-term memory storage using mem0.ai
- Context retrieval from previous conversations
- Automatic memory creation for each conversation turn
- Smart memory search for relevant context

### 📱 **Mobile Responsive**
- Adaptive layout for all screen sizes
- Touch-friendly interface
- Mobile-optimized text wrapping
- Collapsible navigation

### 🔧 **Developer Experience**
- TypeScript for type safety
- ESLint configuration
- Hot reloading with Turbopack
- Comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Mem0 API key (optional, for memory features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatgpt-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MEM0_API_KEY=your_mem0_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env.local` file

### Mem0 API Key (Optional)
1. Visit [mem0.ai](https://mem0.ai)
2. Sign up for an account
3. Navigate to API settings
4. Copy your API key
5. Add it to your `.env.local` file

> **Note**: Memory features will be disabled if `MEM0_API_KEY` is not provided.

## 📁 Project Structure

```
chatgpt-clone/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # OpenAI chat API
│   │   │   └── memory/
│   │   │       └── route.ts          # Mem0 memory API
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main chat interface
│   └── types/
│       └── mem0-sdk.d.ts             # TypeScript definitions
├── public/                           # Static assets
├── package.json
├── next.config.ts
└── README.md
```

## 🎯 Core Features Explained

### Multi-Chat System
- **Local Storage**: Chats are persisted in browser localStorage
- **Chat Management**: Create, rename, and switch between conversations
- **Auto-save**: Conversations are automatically saved as you type

### Memory Integration
- **Context Retrieval**: Before each response, relevant memories are fetched
- **Memory Storage**: Each conversation turn is automatically saved to mem0
- **Smart Search**: Memories are searched based on the current query

### Message Editing
- **Inline Editing**: Click the edit icon on any user message
- **Regeneration**: AI responses are regenerated when messages are edited
- **Context Preservation**: Previous conversation context is maintained

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 via Vercel AI SDK
- **Memory**: mem0.ai for long-term memory
- **Markdown**: react-markdown with GitHub Flavored Markdown

### Key Dependencies
- `@ai-sdk/openai`: OpenAI integration
- `ai`: Vercel AI SDK for streaming
- `mem0ai`: Memory management
- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support

## 🎨 UI Components

### Sidebar
- **Chat List**: Shows all conversations
- **New Chat**: Quick chat creation
- **Chat Renaming**: Inline editing for chat titles
- **Mobile Responsive**: Collapsible on mobile devices

### Chat Interface
- **Message Bubbles**: User messages in grey, AI responses in white
- **Streaming**: Real-time AI response streaming
- **Markdown**: Rich text rendering for AI responses
- **Loading States**: Smooth loading animations

### Input Area
- **Auto-resize**: Textarea grows with content
- **Send Button**: Submit with Enter or click
- **Mobile Optimized**: Touch-friendly interface

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for chat functionality | Yes |
| `MEM0_API_KEY` | Mem0 API key for memory features | No |

### Customization
- **Colors**: Modify CSS variables in `globals.css`
- **Styling**: Update Tailwind classes in components
- **API**: Modify API routes in `src/app/api/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- mem0.ai for memory management capabilities
- Vercel for the AI SDK and deployment platform
- The open-source community for various libraries and tools

## 🐛 Troubleshooting

### Common Issues

**Memory features not working**
- Ensure `MEM0_API_KEY` is set in `.env.local`
- Check browser console for API errors
- Verify mem0.ai account is active

**Chat responses not working**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has sufficient credits
- Ensure API key has proper permissions

**Mobile layout issues**
- Clear browser cache
- Check for CSS conflicts
- Verify responsive breakpoints

### Getting Help
- Check the browser console for error messages
- Review the server logs for API errors
- Ensure all environment variables are properly set

---

**Built with ❤️ using Next.js, OpenAI, and mem0.ai**
