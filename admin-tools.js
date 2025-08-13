// Admin Tools for Poetry Management
// Additional tools for importing/exporting poems and managing deployment

// Export poems to JSON
function exportPoems() {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    const poems = securePoemManager.getAllPoems();
    const dataStr = JSON.stringify(poems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'poetry-collection-' + new Date().toISOString().slice(0,10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Poems exported successfully!');
}

// Import poems from JSON
function importPoems() {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedPoems = JSON.parse(e.target.result);
                    
                    if (confirm(`Import ${importedPoems.length} poems? This will replace your current collection.`)) {
                        localStorage.setItem('poetryCollection', JSON.stringify(importedPoems));
                        securePoemManager.poems = importedPoems;
                        loadPoemsToPage();
                        alert('Poems imported successfully!');
                    }
                } catch (error) {
                    alert('Error importing poems: Invalid JSON file');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Deploy to public (update public files with current poem data)
function deployToPublic() {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    const poems = securePoemManager.getAllPoems();
    
    // Create updated public poem manager with current poems
    const publicPoemManagerCode = `// Auto-generated public poem manager
// This file contains the current poems for the public site
// Generated on: ${new Date().toISOString()}

class PublicPoemManager {
    constructor() {
        this.poems = ${JSON.stringify(poems, null, 8)};
    }

    getAllPoems() {
        return [...this.poems].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    getPoemById(id) {
        return this.poems.find(poem => poem.id === id);
    }

    generatePoemCard(poem) {
        return \`
            <article class="poem-card" data-poem-id="\${poem.id}">
                <h3 class="poem-title">\${poem.title}</h3>
                <div class="poem-excerpt">
                    <p><em>\${poem.excerpt.replace(/\\n/g, '<br>')}</em></p>
                </div>
                <div class="poem-actions">
                    <a href="#" class="read-more" onclick="viewPoem('\${poem.id}')">Read Full Poem</a>
                </div>
            </article>
        \`;
    }

    generatePoemPage(poem) {
        return \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${poem.title} - A Poet of Broken Dreams</title>
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
                <h1 class="poem-title" style="font-size: 2.5rem; margin-bottom: 10px;">\${poem.title}</h1>
                \${poem.subtitle ? \`<p style="color: #6c757d; font-style: italic;">\${poem.subtitle}</p>\` : ''}
            </header>
            
            <div class="poem-content">
                <em>\${poem.content}</em>
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
</html>\`;
    }
}

const publicPoemManager = new PublicPoemManager();

function viewPoem(poemId) {
    const poem = publicPoemManager.getPoemById(poemId);
    if (poem) {
        const poemWindow = window.open('', '_blank');
        poemWindow.document.write(publicPoemManager.generatePoemPage(poem));
        poemWindow.document.close();
    }
}

function loadPoemsToPage() {
    const poemsGrid = document.querySelector('.poems-grid');
    if (poemsGrid) {
        const poems = publicPoemManager.getAllPoems();
        poemsGrid.innerHTML = poems.map(poem => publicPoemManager.generatePoemCard(poem)).join('');
        
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

document.addEventListener('DOMContentLoaded', function() {
    loadPoemsToPage();
});`;

    // Download the generated public file
    const dataUri = 'data:application/javascript;charset=utf-8,'+ encodeURIComponent(publicPoemManagerCode);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'public-poem-manager-updated.js');
    linkElement.click();
    
    alert('Public poem manager generated! Upload this file to your main branch as "public-poem-manager.js"');
}

// Generate deployment instructions
function generateDeploymentInstructions() {
    const instructions = `
# Deployment Instructions

## Current Poems: ${securePoemManager.getAllPoems().length}
## Generated: ${new Date().toISOString()}

### Steps to update your public site:

1. **Switch to main branch:**
   \`\`\`bash
   git checkout main
   \`\`\`

2. **Replace index.html with public-index.html**
3. **Replace poem-manager.js with the newly generated public-poem-manager.js**
4. **Remove admin files** (secure-poem-manager.js, admin.html, admin-tools.js)
5. **Commit and push:**
   \`\`\`bash
   git add .
   git commit -m "Update public site with new poems"
   git push origin main
   \`\`\`

### Your public site will then be updated at:
https://kuahcurripoet.github.io

### To continue managing poems:
\`\`\`bash
git checkout admin
\`\`\`
Open admin.html in your browser for poem management.
`;

    const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(instructions);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'deployment-instructions.md');
    linkElement.click();
}
