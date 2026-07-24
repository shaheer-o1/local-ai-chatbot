marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, {language: lang}).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

function renderMarkdown(rawText) {
    return marked.parse(rawText);
}


const chatbox = document.getElementById('chatbox');
const user_text = document.getElementById('user_text');
const send_btn = document.getElementById('send_btn');
const clear_btn = document.getElementById('clear_btn');

function appendmsg(text, sender){
    const isuser = (sender === 'user');

    const wrapper = document.createElement('div');
    wrapper.className = `d-flex justify-content-${isuser ? 'end' : 'start'} mb-2`;

    const bubble = document.createElement('div');
    bubble.className = `${isuser ? 'bg-primary' : 'bg-secondary'} text-white p-2 rounded-3`;

    if (isuser) {
        const p = document.createElement('p');
        p.className = `mb-0`;
        p.textContent = text;
        bubble.appendChild(p);
    } else {
        bubble.innerHTML = marked.parse(text);
        bubble.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }

    wrapper.appendChild(bubble);
    chatbox.appendChild(wrapper);

    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendmsg(){
    const text = user_text.value.trim();
    if (!text) return;

    appendmsg(text, 'user');
    user_text.value = '';
    user_text.style.height = 'auto';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({input: text})
        });

        const data = await response.json();

        if (response.ok) {
            appendmsg(data.response, 'assistant');
        } else {
            appendmsg(`Error: ${data.message || 'Failed to process request.'}`, 'assistant');
        }
    } catch (error) {
        console.error('Network Error:', error);
        appendmsg('Error: Could not connect to local server.', 'assistant');
    }
}

async function clearchat() {
    try {
        const response = await fetch('/clear');
        const data = await response.json();

        if (data.status === 'cleared') {
            chatbox.innerHTML = '';
        }
    } catch (error) {
        console.error('clear error', error);
    }
}

send_btn.addEventListener('click', sendmsg);
clear_btn.addEventListener('click', clearchat);
user_text.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendmsg();
    }
});
user_text.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});