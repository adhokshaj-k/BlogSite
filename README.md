# 🌙 Dark Thoughts - Modern Blog

A beautiful, minimalist blog built with pure HTML, CSS, and JavaScript. Features a stunning dark theme with glassmorphism effects, smooth animations, and markdown-based content management.

![Blog Preview](https://img.shields.io/badge/Status-Live-success)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green)

## ✨ Features

- 🎨 **Stunning Dark Theme** - Modern, aesthetic design with gradient accents
- 📝 **Markdown-Based** - Write posts in simple `.md` files
- 🚀 **Zero Build Process** - Pure HTML/CSS/JS, no compilation needed
- 💎 **Glassmorphism UI** - Beautiful frosted glass effects
- ✨ **Smooth Animations** - Micro-interactions and transitions
- 📱 **Fully Responsive** - Looks great on all devices
- ⚡ **Lightning Fast** - No frameworks, just vanilla JavaScript
- 🎯 **SEO Optimized** - Proper meta tags and semantic HTML

## 🚀 Quick Start

> **⚠️ Important**: Due to browser CORS restrictions, you need to run a local server to view the blog posts locally. Simply opening `index.html` directly will show the layout but won't load the markdown content. This is NOT an issue when hosted on GitHub Pages.

### Option 1: View Locally with Python

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 2: View Locally with Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Then open http://localhost:8080 in your browser
```

### Option 3: Deploy to GitHub Pages (Recommended)

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/blogsite`

Create a new markdown file in the `posts/` directory:

```bash
# Create a new post
touch posts/my-new-post.md
```

Then edit `script.js` and add your post to the `BLOG_POSTS` array at the top of the file:

```javascript
const BLOG_POSTS = [
    {
        title: "My New Post",
        file: "my-new-post.md",
        date: "2025-12-02",
        tags: ["example", "tutorial"],
        excerpt: "A brief description of your post..."
    },
    // ... existing posts
];
```

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/blogsite`

## 📁 Project Structure

```
blogsite/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # Blog functionality
├── posts/              # Blog posts directory
│   ├── index.json      # Posts metadata
│   ├── welcome.md      # Sample post 1
│   ├── modern-web-design.md    # Sample post 2
│   └── building-with-markdown.md   # Sample post 3
└── README.md           # This file
```

## ✍️ Writing Posts

### Markdown Format

Posts are written in standard Markdown. Here's an example:

```markdown
# My Post Title

This is a paragraph with **bold** and *italic* text.

## Subheading

- List item 1
- List item 2

\`\`\`javascript
// Code blocks are supported
const hello = "world";
\`\`\`

> Blockquotes look great too!
```

### Post Metadata

Each post needs an entry in the `BLOG_POSTS` array in `script.js`:

```javascript
{
  title: "Post Title",
  file: "filename.md",
  date: "YYYY-MM-DD",
  tags: ["tag1", "tag2"],
  excerpt: "Short description..."
}
```

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --accent-purple: #a855f7;
  --accent-blue: #3b82f6;
  --accent-pink: #ec4899;
  /* Add your own colors */
}
```

### Fonts

Change fonts in the `<head>` of `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

### Content

- **Site Title**: Edit in `index.html` (`.logo h1`)
- **Hero Text**: Edit in `index.html` (`.hero-content`)
- **About Section**: Edit in `index.html` (`#about`)

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📝 License

MIT License - feel free to use this for your own blog!

## 🤝 Contributing

Feel free to fork, modify, and make it your own!

## 💡 Tips

1. **Images**: Add images to an `images/` folder and reference them in markdown: `![Alt text](../images/image.png)`
2. **New Posts**: Always update the `BLOG_POSTS` array in `script.js` when adding new posts
3. **Custom Pages**: Create additional HTML pages for about, contact, etc.
4. **Analytics**: Add Google Analytics or similar in the `<head>` tag
5. **Comments**: Integrate services like Disqus or utterances for comments

## 🎯 Roadmap

- [ ] Dark/Light theme toggle
- [ ] Search functionality
- [ ] Tags filtering
- [ ] RSS feed
- [ ] Reading time estimate

---

**Built with ❤️ and pure vanilla JavaScript**

*No frameworks were harmed in the making of this blog.*
