// Blog posts data - Same as main script
const BLOG_POSTS = [
    {
        title: "HackTheBox - Lame Walkthrough",
        file: "htb-lame.md",
        date: "2025-12-02",
        tags: ["HTB", "Linux", "Easy"],
        excerpt: "Complete walkthrough of the Lame machine from HackTheBox. Exploiting Samba 3.0.20 for initial access and privilege escalation."
    },
    {
        title: "PicoCTF 2024 - Buffer Overflow Challenge",
        file: "picoctf-buffer-overflow.md",
        date: "2025-12-02",
        tags: ["PicoCTF", "PWN", "Binary Exploitation"],
        excerpt: "Exploiting a classic buffer overflow vulnerability to gain shell access. Detailed analysis of stack layout and exploit development."
    },
    {
        title: "TryHackMe - Basic Pentesting Room",
        file: "thm-basic-pentesting.md",
        date: "2025-11-30",
        tags: ["TryHackMe", "Web", "Enumeration"],
        excerpt: "Step-by-step walkthrough of the Basic Pentesting room covering enumeration, exploitation, and privilege escalation techniques."
    }
];

// Blog configuration
const BLOG_CONFIG = {
    postsDirectory: 'posts/'
};

// State management
let allPosts = [];
let filteredPosts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadAllBlogs();
    initModal();
    initFilters();
});

// ==================== LOAD ALL BLOGS ====================
async function loadAllBlogs() {
    const blogGrid = document.getElementById('all-blogs-grid');

    try {
        allPosts = BLOG_POSTS;
        filteredPosts = [...allPosts];

        if (allPosts.length === 0) {
            showNoPosts();
        } else {
            renderAllBlogs();
        }

    } catch (error) {
        console.error('Error loading blog posts:', error);
        showNoPosts();
    }
}

function renderAllBlogs() {
    const blogGrid = document.getElementById('all-blogs-grid');
    blogGrid.innerHTML = '';

    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = `
            <div class="loading-spinner">
                <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">No writeups found</h3>
                <p style="color: var(--text-muted);">Try adjusting your search or filter.</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach((post, index) => {
        const card = createBlogCard(post, index);
        blogGrid.appendChild(card);
    });

    // Animate cards
    setTimeout(observeBlogCards, 100);
}

function createBlogCard(post, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const tags = post.tags ? post.tags.map(tag =>
        `<span class="blog-tag">${tag}</span>`
    ).join('') : '';

    card.innerHTML = `
        <div class="blog-card-meta">
            ${tags}
            <span class="blog-date">${formatDate(post.date)}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt || 'Click to read more...'}</p>
        <span class="read-more">
            Read More →
        </span>
    `;

    card.addEventListener('click', () => openPost(post));

    return card;
}

function showNoPosts() {
    const blogGrid = document.getElementById('all-blogs-grid');
    blogGrid.innerHTML = `
        <div class="loading-spinner">
            <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">No writeups yet</h3>
            <p style="color: var(--text-muted);">
                Create your first CTF writeup by adding a markdown file to the <code>posts/</code> directory
                and updating the <code>BLOG_POSTS</code> array in script.js.
            </p>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return 'Recently';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==================== FILTERS ====================
function initFilters() {
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');

    searchInput.addEventListener('input', (e) => {
        applyFilters();
    });

    tagFilter.addEventListener('change', (e) => {
        applyFilters();
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedTag = document.getElementById('tag-filter').value;

    filteredPosts = allPosts.filter(post => {
        // Search filter
        const matchesSearch = !searchTerm ||
            post.title.toLowerCase().includes(searchTerm) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

        // Tag filter
        const matchesTag = selectedTag === 'all' ||
            (post.tags && post.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    renderAllBlogs();
}

// ==================== MODAL ====================
function initModal() {
    const modal = document.getElementById('post-modal');
    const closeBtn = document.getElementById('close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

async function openPost(post) {
    const modal = document.getElementById('post-modal');
    const postContent = document.getElementById('post-content');

    // Show modal with loading state
    modal.classList.add('active');
    postContent.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading writeup...</p>
        </div>
    `;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    try {
        // Load markdown file
        const response = await fetch(`${BLOG_CONFIG.postsDirectory}${post.file}`);

        if (!response.ok) {
            throw new Error('Post not found');
        }

        const markdown = await response.text();

        // Parse markdown to HTML using marked.js
        const html = marked.parse(markdown);

        // Render post
        const tags = post.tags ? post.tags.map(tag =>
            `<span class="blog-tag">${tag}</span>`
        ).join('') : '';

        postContent.innerHTML = `
            <div class="blog-card-meta" style="margin-bottom: 1.5rem;">
                ${tags}
                <span class="blog-date">${formatDate(post.date)}</span>
            </div>
            ${html}
        `;

    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: var(--text-secondary);">Oops! Writeup not found</h2>
                <p style="color: var(--text-muted);">The writeup you're looking for couldn't be loaded.</p>
            </div>
        `;
    }
}

function closeModal() {
    const modal = document.getElementById('post-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== SMOOTH ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const observeBlogCards = () => {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
};
