(function() {
    const btn = document.getElementById('orange-ai-btn');
    const chatbox = document.getElementById('orange-ai-chatbox');
    const closeBtn = document.getElementById('close-chat-btn');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const quickChips = document.querySelectorAll('.quick-chip');

    btn.addEventListener('click', function() {
        if (chatbox.style.display === 'none' || chatbox.style.display === '') {
            chatbox.style.display = 'flex';
            input.focus();
        } else {
            chatbox.style.display = 'none';
        }
    });

    closeBtn.addEventListener('click', function() {
        chatbox.style.display = 'none';
    });

    quickChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const msg = this.getAttribute('data-msg');
            sendMessage(msg);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const msg = input.value.trim();
        if (msg) {
            sendMessage(msg);
            input.value = '';
        }
    });

    function sendMessage(text) {
        appendMessage(text, 'user');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const typingId = showTypingIndicator();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(function() {
            removeTypingIndicator(typingId);
            
            let aiResponse = "Tôi đã ghi nhận yêu cầu: '" + text + "'. Trợ lý FreshKeep đang phân tích dữ liệu...";
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('hết hạn')) {
                aiResponse = "🚨 <strong>Phân tích khẩn cấp:</strong><br>• <strong>Ớt chuông đỏ:</strong> Sắp hết hạn trong 1 ngày!<br>• <strong>Thịt bò Mỹ phi lê:</strong> Đã được chuyển vào ngăn đông bảo quản tốt nhất.<br>👉 Đề xuất: Hãy nấu món <em>Thịt bò xào ớt chuông</em> ngay hôm nay!";
            } else if (lowerText.includes('tối nay') || lowerText.includes('món ăn')) {
                aiResponse = "🍳 <strong>Món ngon đề xuất tối nay:</strong><br>1. <strong>Thịt bò Mỹ xào ớt chuông đỏ</strong> (Nguyên liệu sẵn có, giàu dinh dưỡng).<br>2. <strong>Ức gà áp chảo sốt bơ tỏi</strong>.<br>💬 Bạn có muốn tôi hướng dẫn chi tiết cách chế biến không?";
            }
            
            appendMessage(aiResponse, 'ai');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 900);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.style.alignSelf = sender === 'user' ? 'flex-end' : 'flex-start';
        msgDiv.style.maxWidth = '85%';
        
        if (sender === 'user') {
            msgDiv.style.background = '#f97316';
            msgDiv.style.color = '#ffffff';
            msgDiv.style.borderTopRightRadius = '0';
        } else {
            msgDiv.style.background = 'rgba(255, 255, 255, 0.08)';
            msgDiv.style.border = '1px solid rgba(255, 255, 255, 0.05)';
            msgDiv.style.color = '#e2e8f0';
            msgDiv.style.borderTopLeftRadius = '0';
        }
        
        msgDiv.style.padding = '12px 16px';
        msgDiv.style.borderRadius = '16px';
        msgDiv.style.fontSize = '13px';
        msgDiv.style.lineHeight = '1.5';
        msgDiv.innerHTML = text;
        
        messagesContainer.appendChild(msgDiv);
    }

    function showTypingIndicator() {
        const id = 'typing_' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = id;
        typingDiv.style.alignSelf = 'flex-start';
        typingDiv.style.background = 'rgba(255, 255, 255, 0.05)';
        typingDiv.style.padding = '12px 16px';
        typingDiv.style.borderRadius = '16px';
        typingDiv.style.borderTopLeftRadius = '0';
        typingDiv.style.color = '#94a3b8';
        typingDiv.style.fontSize = '12px';
        typingDiv.innerHTML = 'FreshKeep AI đang nhập... <span class="animate-pulse">● ● ●</span>';
        messagesContainer.appendChild(typingDiv);
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
})();
