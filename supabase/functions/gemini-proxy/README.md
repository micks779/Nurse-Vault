# Gemini Proxy Edge Function

This Supabase Edge Function securely proxies Google Gemini API calls, keeping the API key server-side and preventing exposure in the frontend.

## Security Features

- ✅ API key stored as Supabase secret (never exposed to client)
- ✅ Requires user authentication (only logged-in users can use AI features)
- ✅ CORS headers configured for secure cross-origin requests
- ✅ Error handling and logging

## Deployment Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in the Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`

### 4. Set the Gemini API Key as a Secret

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
```

**Important:** Never commit your API key to Git. This command stores it securely in Supabase.

### 5. Deploy the Edge Function

```bash
supabase functions deploy gemini-proxy
```

### 6. Verify Deployment

After deployment, you should see:
- Function URL: `https://your-project-ref.supabase.co/functions/v1/gemini-proxy`
- Status: Active

## Testing

You can test the Edge Function using curl:

```bash
curl -X POST \
  'https://your-project-ref.supabase.co/functions/v1/gemini-proxy' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "chat",
    "data": {
      "userMessage": "Hello",
      "currentPath": null,
      "competencies": []
    }
  }'
```

## Request Types

The Edge Function supports 4 request types:

1. **`transcribe`** - Transcribe audio and categorize (CPD/Reflection/Competency)
2. **`chat`** - Career guidance chat
3. **`analyze_jd`** - Analyze job description and create career path
4. **`recommendations`** - Generate CPD recommendations

## Environment Variables

The Edge Function automatically uses:
- `GEMINI_API_KEY` - Set via `supabase secrets set`
- `SUPABASE_URL` - Automatically available
- `SUPABASE_ANON_KEY` - Automatically available

## Troubleshooting

### Function not found (404)
- Ensure the function is deployed: `supabase functions deploy gemini-proxy`
- Check the function name matches exactly

### Unauthorized (401)
- Ensure the user is logged in
- Check the Authorization header includes a valid session token

### API key error (500)
- Verify the secret is set: `supabase secrets list`
- Ensure the key is valid and has proper permissions

### CORS errors
- The function includes CORS headers
- If issues persist, check browser console for specific errors

## Cost Considerations

- Edge Function invocations: Free tier includes 2M requests/month
- Gemini API: Free tier includes 15 requests/min, 1M tokens/month
- Monitor usage in Supabase dashboard

