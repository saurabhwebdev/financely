# Financly - Personal Finance Dashboard

A modern personal finance dashboard application built with Next.js and Supabase.

## Features

- Track income and expenses
- View spending trends and insights
- Categorize transactions
- Modern and interactive UI
- Responsive design for desktop and mobile

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Heroicons

## Deployment on Vercel

This application is optimized for deployment on Vercel. Follow these steps to deploy:

1. Fork or clone this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Link your GitHub repository
4. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
5. Deploy!

## Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/financly.git
cd financly
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## License

MIT
