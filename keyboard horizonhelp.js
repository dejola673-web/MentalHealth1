// Pure JavaScript On-Screen Keyboard + AssistiveTouch Menu
// No HTML required - This script creates everything

(function() {
    'use strict';

    // State
    let menuOpen = false;
    let keyboardVisible = false;
    let capsLock = false;

    // Keyboard layout
    const keyboardLayout = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    // Inject CSS
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .assistive-touch {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10000;
            }

            .assistive-btn {
                width: 64px;
                height: 64px;
                background: rgba(0, 0, 0, 0.85);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
                font-size: 28px;
            }

            .assistive-btn:hover {
                transform: scale(1.1);
            }

            .assistive-btn:active {
                transform: scale(0.95);
            }

            .menu-items {
                position: absolute;
                bottom: 0;
                right: 0;
            }

            .menu-item {
                position: absolute;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: none;
            }

            .menu-item.show {
                opacity: 1;
                transform: scale(1);
                pointer-events: all;
            }

            .menu-item:hover {
                transform: scale(1.15);
            }

            .on-screen-keyboard {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #e5e7eb;
                border-top: 4px solid #9ca3af;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
                padding: 16px;
                z-index: 9999;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }

            .on-screen-keyboard.visible {
                transform: translateY(0);
            }

            .keyboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                max-width: 1000px;
                margin-left: auto;
                margin-right: auto;
            }

            .keyboard-title {
                font-size: 1.25rem;
                font-weight: bold;
                color: #333;
            }

            .keyboard-close {
                padding: 10px 20px;
                background: #555;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            }

            .keyboard-close:hover {
                background: #333;
            }

            .keyboard-keys {
                max-width: 1000px;
                margin: 0 auto;
            }

            .keyboard-row {
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-bottom: 6px;
            }

            .key {
                min-width: 50px;
                height: 50px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.1s;
            }

            .key:hover {
                background: #f5f5f5;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
            }

            .key:active {
                background: #e0e0e0;
                transform: translateY(2px);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .key.special {
                min-width: 80px;
                background: #f0f0f0;
                font-size: 0.9rem;
            }

            .key.caps {
                background: #ddd;
            }

            .key.caps.active {
                background: #4CAF50;
                color: white;
            }

            .key.backspace {
                background: #e74c3c;
                color: white;
            }

            .key.backspace:hover {
                background: #c0392b;
            }

            .key.space {
                flex: 1;
                max-width: 500px;
            }
        `;
        document.head.appendChild(style);
    }

    // Calculate menu position
    function getMenuPosition(index, total) {
        const angle = (index * (2 * Math.PI / total)) - (Math.PI / 2);
        const radius = 80;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    }

    // Create AssistiveTouch button
    function createAssistiveTouch() {
        const container = document.createElement('div');
        container.className = 'assistive-touch';

        const btn = document.createElement('button');
        btn.className = 'assistive-btn';
        btn.id = 'assistiveBtn';
        btn.textContent = '✋';

        const menuItemsContainer = document.createElement('div');
        menuItemsContainer.className = 'menu-items';

        const menuItems = [
            { id: 'menuKeyboard', emoji: '⌨️', color: '#3b82f6', action: toggleKeyboard },
            { id: 'menuVolume', emoji: '🔊', color: '#10b981', action: () => { alert('Volume'); toggleMenu(); } },
            { id: 'menuSettings', emoji: '⚙️', color: '#8b5cf6', action: () => { alert('Settings'); toggleMenu(); } },
            { id: 'menuHome', emoji: '🏠', color: '#f59e0b', action: () => { alert('Home'); toggleMenu(); } }
        ];

        menuItems.forEach(item => {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'menu-item';
            menuBtn.id = item.id;
            menuBtn.style.backgroundColor = item.color;
            menuBtn.textContent = item.emoji;
            menuBtn.onclick = item.action;
            menuItemsContainer.appendChild(menuBtn);
        });

        btn.onclick = toggleMenu;

        container.appendChild(btn);
        container.appendChild(menuItemsContainer);
        document.body.appendChild(container);

        return { btn, menuItems: menuItemsContainer.children };
    }

    // Toggle menu
    function toggleMenu() {
        menuOpen = !menuOpen;
        const btn = document.getElementById('assistiveBtn');
        const items = Array.from(document.querySelectorAll('.menu-item'));

        if (menuOpen) {
            btn.textContent = '✖';
            items.forEach((item, i) => {
                const pos = getMenuPosition(i, items.length);
                item.style.bottom = (32 - pos.y) + 'px';
                item.style.right = (32 - pos.x) + 'px';
                setTimeout(() => item.classList.add('show'), i * 50);
            });
        } else {
            btn.textContent = '✋';
            items.forEach(item => item.classList.remove('show'));
        }
    }

    // Create keyboard
    function createKeyboard() {
        const keyboard = document.createElement('div');
        keyboard.className = 'on-screen-keyboard';
        keyboard.id = 'onScreenKeyboard';

        const header = document.createElement('div');
        header.className = 'keyboard-header';

        const title = document.createElement('div');
        title.className = 'keyboard-title';
        title.textContent = 'On-Screen Keyboard';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'keyboard-close';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = toggleKeyboard;

        header.appendChild(title);
        header.appendChild(closeBtn);

        const keysContainer = document.createElement('div');
        keysContainer.className = 'keyboard-keys';
        keysContainer.id = 'keyboardKeys';

        keyboard.appendChild(header);
        keyboard.appendChild(keysContainer);
        document.body.appendChild(keyboard);

        buildKeyboard();
    }

    // Build keyboard keys
    function buildKeyboard() {
        const keysContainer = document.getElementById('keyboardKeys');
        keysContainer.innerHTML = '';

        // Number row
        let row = document.createElement('div');
        row.className = 'keyboard-row';
        keyboardLayout[0].forEach(key => {
            const btn = createKey(key, () => typeKey(key));
            row.appendChild(btn);
        });
        keysContainer.appendChild(row);

        // First letter row
        row = document.createElement('div');
        row.className = 'keyboard-row';
        keyboardLayout[1].forEach(key => {
            const btn = createKey(key.toUpperCase(), () => typeKey(key));
            row.appendChild(btn);
        });
        keysContainer.appendChild(row);

        // Second letter row with Caps
        row = document.createElement('div');
        row.className = 'keyboard-row';

        const capsBtn = document.createElement('button');
        capsBtn.className = 'key caps special';
        capsBtn.id = 'capsBtn';
        capsBtn.textContent = 'Caps';
        capsBtn.onclick = toggleCaps;
        row.appendChild(capsBtn);

        keyboardLayout[2].forEach(key => {
            const btn = createKey(key.toUpperCase(), () => typeKey(key));
            row.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.className = 'key backspace special';
        backBtn.textContent = '⌫';
        backBtn.onclick = handleBackspace;
        row.appendChild(backBtn);

        keysContainer.appendChild(row);

        // Third letter row
        row = document.createElement('div');
        row.className = 'keyboard-row';

        const spacer = document.createElement('div');
        spacer.style.width = '90px';
        row.appendChild(spacer);

        keyboardLayout[3].forEach(key => {
            const btn = createKey(key.toUpperCase(), () => typeKey(key));
            row.appendChild(btn);
        });

        keysContainer.appendChild(row);

        // Space bar
        row = document.createElement('div');
        row.className = 'keyboard-row';

        const spaceBtn = document.createElement('button');
        spaceBtn.className = 'key space';
        spaceBtn.textContent = 'Space';
        spaceBtn.onclick = handleSpace;
        row.appendChild(spaceBtn);

        keysContainer.appendChild(row);
    }

    // Create key button
    function createKey(label, onClick) {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.textContent = label;
        btn.onclick = onClick;
        return btn;
    }

    // Toggle keyboard
    function toggleKeyboard() {
        keyboardVisible = !keyboardVisible;
        const keyboard = document.getElementById('onScreenKeyboard');
        keyboard.classList.toggle('visible', keyboardVisible);

        // Close menu
        menuOpen = false;
        document.getElementById('assistiveBtn').textContent = '✋';
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('show');
        });
    }

    // Type key
    function typeKey(key) {
        const activeElement = document.activeElement;
        const char = capsLock ? key.toUpperCase() : key;

        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const text = activeElement.value;

            activeElement.value = text.substring(0, start) + char + text.substring(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + 1;
        } else {
            // Simulate keyboard event
            const event = new KeyboardEvent('keydown', { key: char });
            document.dispatchEvent(event);
        }
    }

    // Handle backspace
    function handleBackspace() {
        const activeElement = document.activeElement;

        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const text = activeElement.value;

            if (start > 0) {
                activeElement.value = text.substring(0, start - 1) + text.substring(end);
                activeElement.selectionStart = activeElement.selectionEnd = start - 1;
            }
        }
    }

    // Handle space
    function handleSpace() {
        typeKey(' ');
    }

    // Toggle caps lock
    function toggleCaps() {
        capsLock = !capsLock;
        const capsBtn = document.getElementById('capsBtn');
        capsBtn.classList.toggle('active', capsLock);
    }

    // Initialize
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                injectStyles();
                createAssistiveTouch();
                createKeyboard();
            });
        } else {
            injectStyles();
            createAssistiveTouch();
            createKeyboard();
        }
    }

    // Start
    init();

})();