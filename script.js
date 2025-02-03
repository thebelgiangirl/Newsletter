document.getElementById("generate-btn").addEventListener("click", async function () {
    const topic = document.getElementById("topic").value;
    const audience = document.getElementById("audience").value;
    const tone = document.getElementById("tone").value;
    
    if (!topic || !audience) {
        alert("Please fill in all fields");
        return;
    }
    
    const response = await fetch("https://n8n-e2tg.onrender.com/webhook-test/input-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, tone })
    });
    
    const data = await response.json();
    const ideas = data[0]?.output || [];
    displayIdeas(ideas);
});

function displayIdeas(ideas) {
    const container = document.getElementById("ideas-container");
    container.innerHTML = "<h2>Select an idea:</h2>";
    
    if (!ideas.length) {
        container.innerHTML += "<p>No ideas generated. Try again!</p>";
        return;
    }
    
    ideas.forEach((idea, index) => {
        const button = document.createElement("button");
        button.innerText = `Option ${index + 1}: ${idea.title}`;
        button.classList.add("idea-button");
        button.onclick = () => selectIdea(idea);
        container.appendChild(button);
    });
}

async function selectIdea(idea) {
    const response = await fetch("https://n8n-e2tg.onrender.com/webhook-test/select-idea-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: idea })
    });
    
    const data = await response.json();
    const emailContent = data.html || "No content available";
    
    document.getElementById("email-content").innerHTML = emailContent;
    document.getElementById("email-container").classList.remove("hidden");
}

document.getElementById("copy-btn").addEventListener("click", function () {
    const text = document.getElementById("email-content").innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
});
