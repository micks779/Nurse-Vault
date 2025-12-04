# Running NurseVault Locally

## Quick Start

### Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

(Or check the terminal output for the exact URL - Vite usually uses port 5173)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Accessing the App

Once the server starts, open your browser and go to:

**http://localhost:3000** (or the port shown in terminal)

## Features You Can Test

✅ **Login Page** - Use any email (mock authentication)  
✅ **Dashboard** - View stats and overview  
✅ **Passport** - Upload documents (stored in localStorage)  
✅ **Training** - View training records  
✅ **Competencies** - Track skills  
✅ **Career Pathway** - View progression  
✅ **Learning** - CPD entries, voice notes, reflections  

## Hot Reload

The dev server has **hot module replacement** - any changes you make to the code will automatically refresh in the browser!

## Stopping the Server

Press `Ctrl + C` in the terminal to stop the server.

## Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port
- Check the terminal output for the actual URL

**App not loading?**
- Make sure all dependencies are installed: `npm install`
- Check for errors in the terminal
- Clear browser cache and reload

**Service Worker issues?**
- Service workers work best in production builds
- For development, you can ignore service worker warnings

---

**Happy coding!** 🚀

