const KEYWORDS = {
  crisis: [/\bkill myself\b/, /\bi want to die\b/, /\bsuicide\b/, /\bhurt myself\b/],
  depression: [/\bdepressed/, /\bdepression/, /\bhopeless/, /\bworthless/, /\bcannot cope\b/, /\bsad\b/, /\bmiserable\b/, /\bmelancholy\b/, /\bdespair\b/],
  anxiety: [/\banxiety\b/, /\banxious\b/, /\bpanic attack\b/],
  stress: [/\bstress/, /\boverwhelm/, /\bburn out\b/],
  loneliness: [/\blonely\b/, /\bisolated\b/, /\balone\b/],
  Trauma: [/\blonely\b/, /\bisolated\b/, /\balone\b/],
  Greeting: [/\bhello\b/, /\bhi\b/, /\bgreetings\b/, /\bwhats up\b/],
};

const RESPONSES = {
  crisis: [
    "I’m really sorry you’re feeling this way. If you’re thinking about harming yourself, please call 988 (U.S.) or your local crisis hotline immediately.",
    "You’re not alone. Please reach out to emergency services if you’re in danger."
  ],
  depression: [
    "I hear how heavy things feel right now. Sometimes writing down small positive moments each day can help shift focus.",
    "When depression feels overwhelming, try breaking tasks into tiny steps — even something simple like drinking water or stepping outside counts.",
    "Reaching out to a trusted friend or professional can help lighten the weight you’re carrying."
  ],
  anxiety: [
    "Anxiety can feel overpowering. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
    "Slow breathing can reduce anxious feelings: inhale for 4, hold 4, exhale 6, pause 2 — repeat a few times.",
    "Gentle movement like stretching, yoga, or a walk can release tension."
  ],
  stress: [
    "Stress often piles up silently. Taking a 5-minute break to breathe deeply or walk can reset your mind.",
    "Try writing down your tasks and circling only the top 3 priorities — focus on those first.",
    "Listening to calming music or guided meditations can help relax your nervous system."
  ],
  loneliness: [
    "Feeling lonely is hard. Try calling or texting one supportive person — even a short conversation can help.",
    "Joining an online community or local group around an interest you enjoy can reduce isolation.",
    "Practicing self-kindness — like writing yourself an encouraging note — can remind you that you matter."
  ],
  Trauma: [
    "Feeling lonely is hard. Try calling or texting one supportive person — even a short conversation can help.",
    "Joining an online community or local group around an interest you enjoy can reduce isolation.",
    "Practicing self-kindness — like writing yourself an encouraging note — can remind you that you matter."
  ],
  Greeting:[
    "Hi! What can I do for you today?",
    "Reaching out is the first step to recovery, what's on your mind?",
    "Hi! Please describe any problems you might be dealing with.",

  ],
  default: [
    "Please type out a problem you might be dealing with.(EX: Anxiety, Depression, Stress)",
    "Thanks for sharing — would you like me to suggest some coping strategies?"
  ]
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const re of KEYWORDS.crisis) if (re.test(lower)) return 'crisis';
  for (const re of KEYWORDS.depression) if (re.test(lower)) return 'depression';
  for (const re of KEYWORDS.anxiety) if (re.test(lower)) return 'anxiety';
  for (const re of KEYWORDS.stress) if (re.test(lower)) return 'stress';
  for (const re of KEYWORDS.loneliness) if (re.test(lower)) return 'loneliness';
  for (const re of KEYWORDS.Greeting) if (re.test(lower)) return 'Greeting';
  return 'default';
}

function appendMessage(content, who='ai') {
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
  div.innerHTML = content;
  const body = document.getElementById('chatBody');
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function handleResponse(category) {
  const crisisBanner = document.getElementById('crisisBanner');
  if (category === 'crisis') {
    crisisBanner.style.display = 'block';
  } else {
    crisisBanner.style.display = 'none';
  }

  const pool = RESPONSES[category] || RESPONSES.default;
  const reply = pool[Math.floor(Math.random() * pool.length)];
  appendMessage(reply);
}

document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chatBtn');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');

  chatBtn.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    if (chatBox.style.display === 'flex') userInput.focus();
  });

  function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    const category = detectCategory(text);
    handleResponse(category);
    userInput.value = '';
  }

  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
});
