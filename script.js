const WEBHOOKS = {
    generate: 'https://n8n-e2tg.onrender.com/webhook/input-newsletter',
    select: 'https://n8n-e2tg.onrender.com/webhook/select-idea-newsletter'
};

let storedData = {};

// Add copy functionality
document.getElementById('copy-btn').addEventListener('click', async function() {
    const content = document.getElementById('email-content').innerText;
    try {
        await navigator.clipboard.writeText(content);
        const originalText = this.innerText;
        this.innerText = '✅ Copié!';
        setTimeout(() => {
            this.innerText = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Erreur lors de la copie du contenu.');
    }
});

document.getElementById('generateBtn').addEventListener('click', async function() {
    // Validate inputs
    const inputs = ['topic', 'audience', 'cta', 'tone'];
    const isEmpty = inputs.some(id => !document.getElementById(id).value.trim());
    
    if (isEmpty) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Disable button and show loading state
    this.disabled = true;
    this.innerText = '🔄 Génération...';
    
    // Clear previous results
    document.getElementById('ideas-container').innerHTML = '';
    document.getElementById('email-container').classList.add('hidden');

    storedData = {
        topic: document.getElementById('topic').value,
        audience: document.getElementById('audience').value,
        tone: document.getElementById('tone').value,
        cta: document.getElementById('cta').value
    };

    try {
        const response = await fetch(WEBHOOKS.generate, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storedData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showIdeas(data[0]?.output || []);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('ideas-container').innerHTML = `
            <div class="error-message">
                Une erreur est survenue lors de la génération. Veuillez réessayer.
            </div>
        `;
    } finally {
        this.disabled = false;
        this.innerText = '✨ Générer des idées';
    }
});

function showIdeas(ideas) {
    const container = document.getElementById('ideas-container');
    
    if (!ideas.length) {
        container.innerHTML = '<div class="no-ideas">Aucune idée générée.</div>';
        return;
    }

    container.innerHTML = '';
    ideas.forEach(idea => {
        const btn = document.createElement('button');
        btn.className = 'idea-button';
        btn.innerText = idea.title;
        btn.onclick = () => selectIdea(idea);
        container.appendChild(btn);
    });
}

async function selectIdea(selectedIdea) {
    const emailContainer = document.getElementById('email-container');
    const emailContent = document.getElementById('email-content');
    
    emailContainer.classList.remove('hidden');
    emailContent.innerHTML = '🔄 Chargement...';

    try {
        const response = await fetch(WEBHOOKS.select, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...selectedIdea,
                ...storedData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        emailContent.innerHTML = data.html;
    } catch (error) {
        console.error('Erreur:', error);
        emailContent.innerHTML = `
            <div class="error-message">
                Une erreur est survenue lors du chargement. Veuillez réessayer.
            </div>
        `;
    }
}
