const WEBHOOKS = {
    generate: 'https://n8n-e2tg.onrender.com/webhook/input-newsletter',
    select: 'https://n8n-e2tg.onrender.com/webhook/select-idea-newsletter'
};

let storedData = {};

// Form submission and generation handling
document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const generateBtn = document.getElementById('generateBtn');
    const btnContent = generateBtn.querySelector('.btn-content');
    const originalContent = btnContent.innerHTML;
    
    // Show loading state
    generateBtn.disabled = true;
    btnContent.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // Reset containers
    const ideasContainer = document.getElementById('ideas-container');
    const emailContainer = document.getElementById('email-container');
    ideasContainer.classList.add('hidden');
    emailContainer.classList.add('hidden');
    
    // Gather form data
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
        
        // Show ideas container with animation
        ideasContainer.classList.remove('hidden');
        ideasContainer.classList.add('fade-in');
        
        // Scroll to ideas
        ideasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while generating ideas. Please try again.', 'error');
    } finally {
        generateBtn.disabled = false;
        btnContent.innerHTML = originalContent;
    }
});

// Copy functionality
document.getElementById('copy-btn').addEventListener('click', async function() {
    const content = document.getElementById('email-content').innerText;
    const originalText = this.innerHTML;
    
    try {
        await navigator.clipboard.writeText(content);
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        showNotification('Newsletter content copied to clipboard!
