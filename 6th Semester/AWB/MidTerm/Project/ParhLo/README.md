# SlideIQ - PPT Lecture Slide Analyzer

A full-stack web application that analyzes PowerPoint lecture slides and generates Roman Urdu explanations, multiple-choice questions (MCQs), and true/false statements for each slide using AI.

## Features

- 🎯 **Roman Urdu Explanations**: Clear, easy-to-understand explanations of slide content in Roman Urdu
- ❓ **MCQs**: AI-generated multiple choice questions with 4 options each
- ✓ **True/False Questions**: Quick-check true/false statements to reinforce key concepts
- 🔐 **Secure Authentication**: Email/password and Google OAuth via Supabase
- 📊 **Project Management**: Organize and track multiple PPT files
- 🚀 **Fast Processing**: Instant content generation using Google Gemini AI
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: MongoDB Atlas + Mongoose ODM
- **AI**: Google Gemini 1.5 Flash API
- **File Processing**: JSZip for PPTX parsing
- **Notifications**: Sonner toast library
- **Theme**: next-themes for dark mode support

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Accounts for:
  - MongoDB Atlas (free tier available)
  - Supabase (free tier available)
  - Google AI Studio (free API key)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slideiq
npm install
```

### 2. Set Up MongoDB

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account and sign in
3. Create a new M0 (free) cluster
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Choose Password authentication
   - Save the username and password
5. Set up network access:
   - Go to **Network Access** → **Add IP Address**
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
6. Get your connection string:
   - Click **Connect** → **Drivers**
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace database name if needed

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project and choose a region
3. Once created, go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
5. Set up Google OAuth:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable the provider
   - Add your OAuth credentials (get them from Google Cloud Console)

### 4. Get Google AI API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API Key in new project**
3. Copy the generated API key

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Generative AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/slideiq
```

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
slideiq/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── generate/             # Generate AI content
│   │   ├── project/[id]/         # Project endpoints
│   │   ├── projects/             # List projects
│   │   └── upload/               # Upload PPTX files
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page
│   ├── project/[id]/             # Project detail page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── Navbar.tsx                # Navigation bar
│   ├── ProjectCard.tsx           # Project card component
│   ├── UploadModal.tsx           # File upload dialog
│   ├── SlidesSidebar.tsx         # Slides list sidebar
│   ├── SlideDetail.tsx           # Slide detail view
│   ├── MCQCard.tsx               # MCQ display component
│   ├── TrueFalseCard.tsx         # True/False component
│   └── Providers.tsx             # Client providers
├── lib/                          # Utility functions
│   ├── models/                   # Mongoose models
│   │   ├── Project.ts            # Project schema
│   │   ├── Slide.ts              # Slide schema
│   │   └── Result.ts             # Result schema
│   ├── auth.ts                   # Auth utilities
│   ├── gemini.ts                 # Gemini AI setup
│   ├── mongoose.ts               # MongoDB connection
│   ├── pptx-parser.ts            # PPTX parsing logic
│   ├── supabase.ts               # Supabase client
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
├── middleware.ts                 # Auth middleware
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## API Routes

### Authentication
All API routes except `/api/upload` and `/api/generate` require valid Supabase session.

### POST `/api/upload`
Upload a new PPTX file and create a project.

**Request Body:**
```json
{
  "title": "Physics Lecture 1",
  "filename": "lecture.pptx",
  "slides": [
    { "slideNumber": 1, "rawText": "Slide content text..." }
  ]
}
```

**Response:**
```json
{ "projectId": "507f1f77bcf86cd799439011" }
```

### POST `/api/generate`
Generate AI content (explanation, MCQs, true/false) for a slide.

**Request Body:**
```json
{ "slideId": "507f1f77bcf86cd799439012" }
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "slideId": "507f1f77bcf86cd799439012",
  "explanation": "Roman Urdu explanation...",
  "mcqs": [...],
  "trueFalse": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET `/api/projects`
Get all projects for the current user.

### GET `/api/project/[id]`
Get a specific project with all its slides and results.

### DELETE `/api/project/[id]`
Delete a project and all its associated data.

## Usage Guide

### 1. Getting Started
- Visit the landing page and click "Get Started Free"
- Sign up using email/password or Google OAuth

### 2. Upload a Presentation
- Go to your dashboard
- Click "Upload New PPT"
- Enter a project title
- Select a .pptx file (max 20MB)
- Click "Upload"

### 3. Generate Content
- Open a project to view all slides
- Click on a slide to view its details
- Click "Generate Roman Urdu Content" to create explanations and questions
- Or use "Generate All" to create content for all slides at once

### 4. Study the Content
- Read the Roman Urdu explanation
- Answer the MCQs and check if your answers are correct
- Answer the True/False questions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. In environment variables, add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MONGODB_URI`
5. Click "Deploy"

**Important**: For production MongoDB, always use IP whitelist instead of 0.0.0.0/0.

## Error Handling

The application includes comprehensive error handling:
- **Invalid file format**: Shows error if file is not .pptx
- **File too large**: Shows error if file exceeds 20MB
- **No readable content**: Shows error if no text found in slides
- **API quota exceeded**: Suggests retry after 60 seconds
- **Network errors**: Shows generic error toast with retry option
- **Auth errors**: Redirects to login if session expires

## Performance Tips

1. **Limit file size**: Keep PPTX files under 10MB for faster uploads
2. **Content generation**: Generate content for 5-10 slides at a time to avoid API rate limits
3. **Caching**: Results are cached, so generating the same slide twice is instant
4. **Database**: MongoDB Atlas free tier is suitable for small projects (under 512MB)

## Troubleshooting

### PPTX Upload Fails
- Ensure file is in PowerPoint format (.pptx, not .ppt)
- Check file size is under 20MB
- Verify slides contain readable text (at least 10 characters)

### Content Generation Fails
- Check your Gemini API key is valid
- Verify you have API quota remaining
- Ensure slide has adequate text content

### Database Connection Error
- Verify MongoDB URI in `.env.local` is correct
- Check IP whitelist includes your current IP
- Ensure database user has correct password

### Login Not Working
- Verify Supabase credentials in `.env.local`
- Check internet connection
- Clear browser cache and try again

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

## Roadmap

Upcoming features:
- [ ] Slide image extraction and analysis
- [ ] Custom question templates
- [ ] Export to PDF/Word formats
- [ ] Collaborative editing for teams
- [ ] Progress tracking and analytics
- [ ] Mobile app (React Native)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Authentication and storage
- [MongoDB](https://mongodb.com/) - Database
- [Google Gemini AI](https://gemini.google.com/) - AI content generation
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

Made with ❤️ for Pakistani students
