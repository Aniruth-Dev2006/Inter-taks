# Deploy Next.js client to Vercel
cd nextjs-client

# Deploy with automatic yes to all prompts
$env:CI = "1"
vercel --name nextjs-slot-booking --confirm --prod
