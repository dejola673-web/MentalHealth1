// Advanced Mental Health Chatbot - Fixed Version

const KEYWORDS = {
  crisis: [
    /\bkill myself\b/i, /\bi want to die\b/i, /\bsuicide\b/i, /\bhurt myself\b/i,
    /\bend my life\b/i, /\bno reason to live\b/i, /\bsuicidal\b/i, /\bself harm\b/i
  ],
  depression: [
    /\bdepressed/i, /\bdepression/i, /\bhopeless/i, /\bworthless/i, /\bcannot cope\b/i,
    /\bsad\b/i, /\bmiserable/i, /\bmelancholy/i, /\bdespair/i, /\bempty inside/i,
    /\bno motivation/i, /\bnumb\b/i, /\blost interest/i, /\bno energy/i
  ],
  anxiety: [
    /\banxiety\b/i, /\banxious\b/i, /\bpanic attack\b/i, /\bworried\b/i, /\boverthinking/i,
    /\bcan'?t breathe/i, /\bheart racing/i, /\bnervous\b/i, /\brestless/i, /\bfearful/i,
    /\bpanicking/i, /\bscared all the time/i, /\bon edge/i
  ],
  stress: [
    /\bstress/i, /\boverwhelm/i, /\bburn out\b/i, /\bburned out/i, /\bexhausted/i,
    /\btoo much/i, /\bcan'?t handle/i, /\bpressure/i
  ],
  loneliness: [
    /\blonely\b/i, /\bisolated\b/i, /\balone\b/i, /\bno friends/i, /\bno one cares/i
  ],
  trauma: [
    /\btrauma/i, /\bptsd/i, /\bflashback/i, /\babuse/i, /\btraumatic/i
  ],
  greeting: [
    /\bhello\b/i, /\bhi\b/i, /\bhey\b/i, /\bgreetings\b/i, /\bwhat'?s up\b/i
  ],
  help: [
    /\bhelp\b/i, /\btools/i, /\boptions/i, /\bfeatures/i, /\bmenu\b/i
  ],
  gratitude: [
    /\bthank you\b/i, /\bthanks\b/i, /\bappreciate/i
  ]
};

const RESPONSES = {
  crisis: [
    "⚠️ **This is urgent.** If you're thinking about harming yourself, please reach out for immediate help:\n\n🆘 Call 988 (U.S. Suicide & Crisis Lifeline)\n📞 **Text 'HELLO' to 741741** (Crisis Text Line)\n🌍 **Call 911** if you're in immediate danger\n\nYou're not alone."
  ],
  depression: [
    "I hear you. Depression can make everything feel impossibly heavy. 💙\n\nSmall steps can help:\n• Try one tiny task today\n• Write down one thing you're grateful for\n• Reach out to one supportive person\n\nWould you like to try our mental health screening or see our tools?"
  ],
  anxiety: [
    "Anxiety can feel overwhelming. Let's try to ground you. 🌿\n\n**Quick Relief:**\n• Take 5 deep breaths\n• Name 5 things you can see\n• Splash cold water on your face\n\nWould you like to see our calming tools?"
  ],
  stress: [
    "Stress overload is real. 🧘\n\n**Immediate relief:**\n• Take 10 deep breaths\n• Write down your top 3 priorities\n• Everything else can wait\n\nWant to try our calming game or see other tools?"
  ],
  loneliness: [
    "Feeling lonely is painful. 💛\n\n**Small steps:**\n• Text or call one person today\n• Join an online community\n• Consider therapy\n\nWould you like help finding resources?"
  ],
  trauma: [
    "Trauma needs specialized support. 🛡️\n\n**Resources:**\n• RAINN: 1-800-656-4673\n• Consider trauma-focused therapy\n\nWould you like to book an appointment with a specialist?"
  ],
  greeting: [
    "Hi there! 👋 I'm here to support your mental wellness.\n\nI can help with anxiety, depression, stress, and more. I also have tools like:\n• Mental health screening\n• Calming game\n• Meditation guides\n• Appointment booking\n\nType 'help' to see all options!"
  ],
  help: [
    "Here are my tools - just type the number or name:\n\n1️⃣ Mental Health Screening\n2️⃣ Calming Game\n3️⃣ Meditation Guide\n4️⃣ Grounding Exercise\n5️⃣ Book Appointment\n6️⃣ Crisis Resources\n\nOr just tell me what you're struggling with!"
  ],
  gratitude: [
    "You're very welcome! 💚 I'm here whenever you need support."
  ],
  default: [
    "I'm here to listen. Could you tell me more about what you're experiencing? 🌿\n\nI can help with anxiety, depression, stress, loneliness, trauma, and more. Type 'help' to see all my tools."
  ]
};

let conversationState = {
  screeningActive: false,
  screeningAnswers: [],
  screeningQuestionIndex: 0,
  gameActive: false
};

const SCREENING_QUESTIONS = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep?",
  "Feeling tired or having little energy?",
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop worrying?"
];

// Detect category from user input
function detectCategory(text) {
  const lower = text.toLowerCase().trim();
  
  for (const [category, patterns] of Object.entries(KEYWORDS)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return category;
      }
    }
  }
  
  // Check for tool requests by number
  if (/\b1\b/.test(text) || /screening/i.test(text)) return 'toolScreening';
  if (/\b2\b/.test(text) || /game/i.test(text)) return 'toolGame';
  if (/\b3\b/.test(text) || /meditation/i.test(text)) return 'toolMeditation';
  if (/\b4\b/.test(text) || /grounding/i.test(text)) return 'toolGrounding';
  if (/\b5\b/.test(text) || /appointment/i.test(text) || /book/i.test(text)) return 'toolAppointment';
  if (/\b6\b/.test(text) || /resources/i.test(text) || /hotline/i.test(text)) return 'toolResources';
  
  return 'default';
}

// Append message to chat
function appendMessage(content, who = 'ai', skipTyping = false) {
  if (!skipTyping && who === 'ai') {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      createMessage(content, who);
    }, 800);
  } else {
    createMessage(content, who);
  }
}

function createMessage(content, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
  div.innerHTML = content.replace(/\n/g, '<br>');
  const body = document.getElementById('chatBody');
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function showTypingIndicator() {
  const body = document.getElementById('chatBody');
  const typing = document.createElement('div');
  typing.id = 'typingIndicator';
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

// Handle responses based on category
function handleResponse(category) {
  const crisisBanner = document.getElementById('crisisBanner');
  
  if (category === 'crisis') {
    crisisBanner.style.display = 'block';
  } else {
    crisisBanner.style.display = 'none';
  }

  // Handle tool requests
  if (category === 'toolScreening') {
    startMentalHealthScreening();
    return;
  }
  if (category === 'toolGame') {
    startCalmingGame();
    return;
  }
  if (category === 'toolMeditation') {
    showMeditation();
    return;
  }
  if (category === 'toolGrounding') {
    showGrounding();
    return;
  }
  if (category === 'toolAppointment') {
    navigateToAppointment();
    return;
  }
  if (category === 'toolResources') {
    showResources();
    return;
  }

  const pool = RESPONSES[category] || RESPONSES.default;
  const reply = pool[Math.floor(Math.random() * pool.length)];
  
  appendMessage(reply);
  
  // Show tools menu for certain categories
  if (['depression', 'anxiety', 'stress', 'help'].includes(category)) {
    setTimeout(() => {
      appendMessage("Type a number (1-6) or 'help' to see tools again! 🌟", 'ai');
    }, 1000);
  }
}

// Mental Health Screening
function startMentalHealthScreening() {
  conversationState.screeningActive = true;
  conversationState.screeningAnswers = [];
  conversationState.screeningQuestionIndex = 0;
  
  appendMessage("Let's do a brief mental health check. Over the past 2 weeks, how often have you been bothered by the following? 📋\n\nReply with 0, 1, 2, or 3:", 'ai', true);
  askNextScreeningQuestion();
}

function askNextScreeningQuestion() {
  const index = conversationState.screeningQuestionIndex;
  
  if (index >= SCREENING_QUESTIONS.length) {
    calculateScreeningResults();
    return;
  }
  
  const question = `**Question ${index + 1}/${SCREENING_QUESTIONS.length}:** ${SCREENING_QUESTIONS[index]}\n\n0 = Not at all\n1 = Several days\n2 = More than half the days\n3 = Nearly every day`;
  
  appendMessage(question, 'ai', true);
}

function answerScreening(score) {
  conversationState.screeningAnswers.push(score);
  conversationState.screeningQuestionIndex++;
  askNextScreeningQuestion();
}

function calculateScreeningResults() {
  conversationState.screeningActive = false;
  
  const totalScore = conversationState.screeningAnswers.reduce((a, b) => a + b, 0);
  const maxScore = SCREENING_QUESTIONS.length * 3;
  
  let interpretation = '';
  let recommendation = '';
  
  if (totalScore <= 6) {
    interpretation = "Your score suggests minimal symptoms. 🌟";
    recommendation = "Keep practicing self-care!";
  } else if (totalScore <= 12) {
    interpretation = "Your score suggests mild to moderate symptoms. 💛";
    recommendation = "Consider talking to a mental health professional. Type '5' to book an appointment.";
  } else {
    interpretation = "Your score suggests moderate to severe symptoms. ⚠️";
    recommendation = "I strongly encourage you to speak with a mental health professional. Type '5' to book an appointment.";
  }
  
  const result = `**Screening Results:**\nYour score: ${totalScore}/${maxScore}\n\n${interpretation}\n\n${recommendation}\n\n<em>Note: This is NOT a diagnosis. Only a professional can diagnose mental health conditions.</em>`;
  
  appendMessage(result);
}

// Calming Game
function startCalmingGame() {
  conversationState.gameActive = true;
  
  const colors = [
    { name: 'Sage Green', emoji: '🌿' },
    { name: 'Ocean Blue', emoji: '🌊' },
    { name: 'Sunset Orange', emoji: '🌅' },
    { name: 'Lavender Purple', emoji: '🪻' },
    { name: 'Sky Blue', emoji: '☁️' }
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const gameMessage = `🎮 **Calming Color Game**\n\nClose your eyes and take 3 deep breaths...\n\nNow, when you think of **${randomColor.name}**, what peaceful place comes to mind?\n\nDescribe it in a few words. This mindfulness exercise helps calm your nervous system. 🌿\n\nType your answer or type 'skip' to see other tools.`;
  
  appendMessage(gameMessage, 'ai', true);
}

// Meditation
function showMeditation() {
  const meditation = `🎵 **Guided Meditation**\n\nFind a comfortable position...\n\n1. Close your eyes or soften your gaze\n2. Notice your breathing (don't change it)\n3. Feel your body supported beneath you\n4. If thoughts come, gently return to your breath\n5. Stay here as long as you like\n\n**Apps for longer meditations:**\n• Insight Timer (free)\n• Headspace\n• Calm\n\nType 'help' for more tools!`;
  
  appendMessage(meditation);
}

// Grounding Exercise
function showGrounding() {
  const grounding = `🧭 **5-4-3-2-1 Grounding**\n\nThis helps bring you to the present:\n\n**5** things you can SEE\n**4** things you can TOUCH\n**3** things you can HEAR\n**2** things you can SMELL\n**1** thing you can TASTE\n\nTake your time with each one. You're here. You're present. 🌿`;
  
  appendMessage(grounding);
}

// Navigate to Appointment
function navigateToAppointment() {
  appendMessage("Great! I'll take you to our appointment booking page. 📅", 'ai');
  
  setTimeout(() => {
    appendMessage("🔄 Redirecting you now...", 'ai');
    setTimeout(() => {
      window.location.href = './appointment.html';
    }, 1500);
  }, 1000);
}

// Resources
function showResources() {
  const resources = `📚 **Mental Health Resources**\n\n🆘 **CRISIS (24/7):**\n• 988 - Suicide & Crisis Lifeline\n• 741741 - Crisis Text Line (text HELLO)\n• 911 - Emergency\n\n📞 **SPECIALIZED:**\n• 1-800-656-4673 - Sexual Assault (RAINN)\n• 1-800-799-7233 - Domestic Violence\n• 1-800-662-4357 - Substance Abuse (SAMHSA)\n• 1-800-931-2237 - Eating Disorders (NEDA)\n\n💻 **Online Therapy:**\n• BetterHelp.com\n• Talkspace.com\n• 7Cups.com (free peer support)\n\nType '5' to book an in-person appointment!`;
  
  appendMessage(resources);
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chatBtn');
  const chatBot = document.getElementById('chatBot');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');

  // Open chat
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      chatBot.style.display = 'flex';
      userInput.focus();
    });
  }

  // Close chat
  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatBot.style.display = 'none';
    });
  }

  function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    
    // Handle screening responses
    if (conversationState.screeningActive) {
      const score = parseInt(text);
      if (score >= 0 && score <= 3) {
        appendMessage(text, 'user', true);
        userInput.value = '';
        answerScreening(score);
        return;
      } else {
        appendMessage("Please enter a number between 0 and 3. 📋", 'ai');
        userInput.value = '';
        return;
      }
    }
    
    // Handle game response
    if (conversationState.gameActive && text.toLowerCase() !== 'skip') {
      appendMessage(text, 'user', true);
      userInput.value = '';
      conversationState.gameActive = false;
      appendMessage("Beautiful! 🌟 Taking a moment to visualize peaceful places helps calm your mind. Type 'help' to see more tools!", 'ai');
      return;
    }
    
    if (conversationState.gameActive && text.toLowerCase() === 'skip') {
      conversationState.gameActive = false;
    }
    
    appendMessage(text, 'user', true);
    userInput.value = '';
    
    const category = detectCategory(text);
    handleResponse(category);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }
  
  if (userInput) {
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }
});
