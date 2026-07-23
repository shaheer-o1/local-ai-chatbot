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

    const p = document.createElement('p');
    p.className = `mb-0`;
    p.textContent = text;

    bubble.appendChild(p);
    wrapper.appendChild(bubble);
    chatbox.appendChild(wrapper);

    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendmsg(){
    const text = user_text.value.trim();
    if (!text) return;

    appendmsg(text, 'user');
    user_text.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
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
        appendMessage('Error: Could not connect to local server.', 'assistant');
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