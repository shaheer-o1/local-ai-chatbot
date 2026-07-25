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

function fullyformat(text, bubble) {
    bubble.innerHTML = renderMarkdown(text);
    bubble.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

function format_text_on_dom_load(targetclass) {
    document.addEventListener('DOMContentLoaded', () => {
        const historybubbles = document.querySelectorAll('.' + targetclass);

        historybubbles.forEach((bubble) => {
            const text = bubble.textContent.trim();
            fullyformat(text, bubble);
        });
    });
}


const chatbox = document.getElementById('chatbox');
const user_text = document.getElementById('user_text');
const send_btn = document.getElementById('send_btn');
const clear_btn = document.getElementById('clear_btn');
const container = document.getElementById('maincontainer');

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
        fullyformat(text, bubble);
    } else {
        fullyformat(text, bubble);
    }

    wrapper.appendChild(bubble);
    chatbox.appendChild(wrapper);

    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendmsg(){
    container.classList.remove('emptystate');
    container.classList.add('notemptystate');
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

    const historybubbles = chatbox.querySelectorAll('#chatbox > div');
    historybubbles.forEach((bubble) => {
        bubble.classList.add('bubbleExit');
    });

    try {
        const response = await fetch('/clear');
        const data = await response.json();

        if (data.status === 'cleared') {
            setTimeout(() => {
                chatbox.innerHTML = '';
            }, 600);
        }
    } catch (error) {
        console.error('clear error', error);
    }

    container.classList.remove('notemptystate');
    container.classList.add('emptystate');
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

format_text_on_dom_load('assistantmsg');
format_text_on_dom_load('usermsg');