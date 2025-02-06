const WEBHOOKS = {
    generate: 'https://n8n-e2tg.onrender.com/webhook/input-newsletter',
    select: 'https://n8n-e2tg.onrender.com/webhook/select-idea-newsletter'
};

let storedData = {};

document.getElementById('generateBtn').addEventListener('click', async function() {
    this.disabled = true;
    this.innerText = '🔄 Génération...';

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

        const data = await response.json();
        showIdeas(data[0]?.output || []);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la génération.');
    } finally {
        this.disabled = false;
        this.innerText = '✨ Générer des idées';
    }
});

function showIdeas(ideas) {
    const container = document.getElementById('ideas-container');
    container.innerHTML = ideas.length ? '' : '<p>Aucune idée générée.</p>';

    ideas.forEach(idea => {
        const btn = document.createElement('button');
        btn.className = "idea-button";
        btn.innerText = idea.title;
        btn.onclick = () => selectIdea(idea);
        container.appendChild(btn);
    });
}

async function selectIdea(selectedIdea) {
    const emailContainer = document.getElementById('email-container');
    const emailContent = document.getElementById('email-content');

    emailContent.innerHTML = '🔄 Chargement...';
    emailContainer.classList.remove('hidden');

    try {
        const response = await fetch(WEBHOOKS.select, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedIdea)
        });

        const data = await response.json();
        emailContent.innerHTML = data.html;
    } catch (error) {
        emailContent.innerHTML = 'Erreur lors du chargement.';
    }
}
