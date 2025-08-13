// Poem Management System for A Poet of Broken Dreams
// This file stores all poems and provides functions to manage them

class PoemManager {
    constructor() {
        this.poems = this.loadPoems();
        this.initializeDefaultPoems();
    }

    // Load poems from localStorage or return empty array
    loadPoems() {
        const stored = localStorage.getItem('poetryCollection');
        return stored ? JSON.parse(stored) : [];
    }

    // Save poems to localStorage
    savePoems() {
        localStorage.setItem('poetryCollection', JSON.stringify(this.poems));
    }

    // Initialize with default poems if none exist
    initializeDefaultPoems() {
        if (this.poems.length === 0) {
            this.poems = [
                {
                    id: 'whispers-of-yesterday',
                    title: 'Whispers of Yesterday',
                    subtitle: 'A reflection on memories that linger',
                    excerpt: 'In the silence of the night,\nWhere memories take flight,\nI hear the whispers of yesterday...',
                    content: `In the silence of the night,
Where memories take flight,
I hear the whispers of yesterday
Calling me to stay.

They speak of dreams once bright,
Of love that felt so right,
Of moments pure and true
That time has stolen through.

But in these whispered tales,
Where hope so often fails,
I find a gentle peace
That offers sweet release.

For though the dreams may break,
And hearts may sometimes ache,
The whispers of yesterday
Light tomorrow's way.

So I listen to their song,
Though the night may feel so long,
For in each whispered word
Is a truth that must be heard.`,
                    dateCreated: new Date('2025-08-13').toISOString(),
                    tags: ['memories', 'hope', 'reflection']
                },
                {
                    id: 'fragments-of-hope',
                    title: 'Fragments of Hope',
                    subtitle: 'Finding light in the pieces',
                    excerpt: 'Among the scattered pieces\nOf dreams that used to be,\nI search for fragments of hope...',
                    content: `Among the scattered pieces
Of dreams that used to be,
I search for fragments of hope
To set my spirit free.

Each shard reflects a memory,
Each fragment tells a tale
Of love that once was certain,
Of winds that filled my sail.

Though broken, they still shimmer
Like stars in darkest night,
These fragments of hope remind me
That dawn will bring new light.

I gather them with tender care,
These pieces of my heart,
For even in their broken state
They're still a work of art.

And when the wind of morning comes
To sweep away the pain,
These fragments of hope will teach me
How to dream again.`,
                    dateCreated: new Date('2025-08-13').toISOString(),
                    tags: ['hope', 'healing', 'resilience']
                },
                {
                    id: 'the-dreamers-lament',
                    title: "The Dreamer's Lament",
                    subtitle: 'A meditation on dreams deferred',
                    excerpt: 'What becomes of dreams deferred?\nDo they wither like autumn leaves,\nOr dance in the wind of possibility?',
                    content: `What becomes of dreams deferred?
Do they wither like autumn leaves,
Or dance in the wind of possibility
While the dreamer silently grieves?

I have carried them so long,
These visions of what could be,
Through seasons of doubt and sorrow,
Across the vast uncertainty.

Some have faded into whispers,
Some have crumbled into dust,
But others burn eternal bright
In hearts that dare to trust.

For a dreamer never truly dies,
Though the world may break their wings,
In the quiet of the morning
Still their hopeful spirit sings.

So I lament not for the lost dreams,
But for the courage that might fade,
For in the dreaming lies the magic
Of the worlds that we have made.`,
                    dateCreated: new Date('2025-08-13').toISOString(),
                    tags: ['dreams', 'perseverance', 'courage']
                }
            ];
            this.savePoems();
        }
    }

    // Add a new poem
    addPoem(poemData) {
        const poem = {
            id: this.generateId(poemData.title),
            title: poemData.title,
            subtitle: poemData.subtitle || '',
            excerpt: this.generateExcerpt(poemData.content),
            content: poemData.content,
            dateCreated: new Date().toISOString(),
            tags: poemData.tags || []
        };
        
        this.poems.push(poem);
        this.savePoems();
        return poem;
    }

    // Generate URL-friendly ID from title
    generateId(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Generate excerpt from full content (first 3 lines)
    generateExcerpt(content) {
        const lines = content.split('\n').filter(line => line.trim());
        return lines.slice(0, 3).join('\n') + (lines.length > 3 ? '...' : '');
    }

    // Get all poems
    getAllPoems() {
        return [...this.poems].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    // Get poem by ID
    getPoemById(id) {
        return this.poems.find(poem => poem.id === id);
    }

    // Delete poem
    deletePoem(id) {
        this.poems = this.poems.filter(poem => poem.id !== id);
        this.savePoems();
    }

    // Update poem
    updatePoem(id, updatedData) {
        const index = this.poems.findIndex(poem => poem.id === id);
        if (index !== -1) {
            this.poems[index] = { ...this.poems[index], ...updatedData };
            this.savePoems();
            return this.poems[index];
        }
        return null;
    }

    // Generate HTML for poem card
    generatePoemCard(poem) {
        return `
            <article class="poem-card" data-poem-id="${poem.id}">
                <h3 class="poem-title">${poem.title}</h3>
                <div class="poem-excerpt">
                    <p><em>${poem.excerpt.replace(/\n/g, '<br>')}</em></p>
                </div>
                <div class="poem-actions">
                    <a href="#" class="read-more" onclick="viewPoem('${poem.id}')">Read Full Poem</a>
                    <div class="poem-management">
                        <button class="edit-btn" onclick="editPoem('${poem.id}')">Edit</button>
                        <button class="delete-btn" onclick="deletePoem('${poem.id}')">Delete</button>
                    </div>
                </div>
            </article>
        `;
    }

    // Generate full HTML page for a poem
    generatePoemPage(poem) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${poem.title} - A Poet of Broken Dreams</title>
    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <style>
        .poem-container {
            max-width: 800px;
            margin: 120px auto 60px;
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .poem-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #f8f9fa;
            padding-bottom: 30px;
        }
        .poem-content {
            font-size: 1.2rem;
            line-height: 2;
            color: #495057;
            text-align: center;
            white-space: pre-line;
        }
        .poem-content p {
            margin-bottom: 1.5rem;
        }
        .back-link {
            display: inline-block;
            margin-top: 30px;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        .back-link:hover {
            color: #764ba2;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <h1><a href="../index.html" style="text-decoration: none; color: inherit;">A Poet of Broken Dreams</a></h1>
            </div>
        </nav>
    </header>

    <main>
        <div class="poem-container">
            <header class="poem-header">
                <h1 class="poem-title" style="font-size: 2.5rem; margin-bottom: 10px;">${poem.title}</h1>
                ${poem.subtitle ? `<p style="color: #6c757d; font-style: italic;">${poem.subtitle}</p>` : ''}
            </header>
            
            <div class="poem-content">
                <em>${poem.content}</em>
            </div>
            
            <a href="../index.html#poems" class="back-link">← Back to Poetry Collection</a>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 A Poet of Broken Dreams. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
    }
}

// Global poem manager instance
const poemManager = new PoemManager();

// Functions for poem management (called from HTML)
function viewPoem(poemId) {
    const poem = poemManager.getPoemById(poemId);
    if (poem) {
        // Create a new window/tab with the poem content
        const poemWindow = window.open('', '_blank');
        poemWindow.document.write(poemManager.generatePoemPage(poem));
        poemWindow.document.close();
    }
}

function editPoem(poemId) {
    const poem = poemManager.getPoemById(poemId);
    if (poem) {
        // Fill the form with existing poem data
        document.getElementById('poem-title').value = poem.title;
        document.getElementById('poem-subtitle').value = poem.subtitle;
        document.getElementById('poem-content').value = poem.content;
        document.getElementById('poem-tags').value = poem.tags.join(', ');
        document.getElementById('editing-poem-id').value = poemId;
        
        // Show the form
        document.getElementById('add-poem-form').style.display = 'block';
        document.getElementById('form-title').textContent = 'Edit Poem';
        document.getElementById('submit-btn').textContent = 'Update Poem';
        
        // Scroll to form
        document.getElementById('add-poem-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePoem(poemId) {
    if (confirm('Are you sure you want to delete this poem? This action cannot be undone.')) {
        poemManager.deletePoem(poemId);
        loadPoemsToPage();
    }
}

function addNewPoem() {
    document.getElementById('add-poem-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Add New Poem';
    document.getElementById('submit-btn').textContent = 'Add Poem';
    document.getElementById('editing-poem-id').value = '';
    document.getElementById('poem-form').reset();
    document.getElementById('add-poem-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelForm() {
    document.getElementById('add-poem-form').style.display = 'none';
    document.getElementById('poem-form').reset();
    document.getElementById('editing-poem-id').value = '';
}

function submitPoem(event) {
    event.preventDefault();
    
    const title = document.getElementById('poem-title').value.trim();
    const subtitle = document.getElementById('poem-subtitle').value.trim();
    const content = document.getElementById('poem-content').value.trim();
    const tags = document.getElementById('poem-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const editingId = document.getElementById('editing-poem-id').value;
    
    if (!title || !content) {
        alert('Please fill in at least the title and content fields.');
        return;
    }
    
    if (editingId) {
        // Update existing poem
        poemManager.updatePoem(editingId, { title, subtitle, content, tags });
    } else {
        // Add new poem
        poemManager.addPoem({ title, subtitle, content, tags });
    }
    
    // Refresh the poems display
    loadPoemsToPage();
    
    // Hide and reset form
    cancelForm();
    
    alert(editingId ? 'Poem updated successfully!' : 'Poem added successfully!');
}

function loadPoemsToPage() {
    const poemsGrid = document.querySelector('.poems-grid');
    if (poemsGrid) {
        const poems = poemManager.getAllPoems();
        poemsGrid.innerHTML = poems.map(poem => poemManager.generatePoemCard(poem)).join('');
        
        // Reapply fade-in animations
        const poemCards = document.querySelectorAll('.poem-card');
        poemCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }, index * 100);
        });
    }
}

// Initialize poems on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPoemsToPage();
});
