`javascript
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
            
            let aiResponse = "Tôi đã ghi nhận yêu cầu: '" + text + "'. Trợ lý FreshKeep đang phân tích dữ liệu tủ lạnh...";
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('hết hạn') || lowerText.includes('expire')) {
                aiResponse = "🚨 <strong>Phân tích khẩn cấp:</strong><br>• <strong>Ớt chuông đỏ:</strong> Sắp hết hạn trong 1 ngày!<br>• <strong>Thịt bò Mỹ phi lê:</strong> Đã được chuyển vào ngăn đông để bảo quản tối ưu.<br>👉 Đề xuất: Hãy nấu món <em>Thịt bò xào ớt chuông</em> ngay hôm nay để giữ nguyên hương vị!";
            } else if (lowerText.includes('tối nay') || lowerText.includes('món ăn') || lowerText.includes('nấu')) {
                aiResponse = "🍳 <strong>Món ngon đề xuất tối nay cho gia đình:</strong><br>1. <strong>Thịt bò Mỹ xào ớt chuông đỏ</strong> (Tận dụng nguyên liệu sẵn có, giàu dinh dưỡng).<br>2. <strong>Ức gà áp chảo sốt bơ tỏi</strong> (Món ăn nhanh, ít béo).<br>💬 Bạn có muốn tôi hướng dẫn chi tiết cách làm món nào không?";
            } else if (lowerText.includes('calo') || lowerText.includes('giảm cân') || lowerText.includes('kcal')) {
                aiResponse = "🥗 <strong>Thực đơn ăn sạch bảo toàn 1500 kcal:</strong><br>• <strong>Sáng:</strong> Sữa tươi TH True Milk & Ngũ cốc nguyên cám (350 kcal)<br>• <strong>Trưa:</strong> Ức gà phi lê áp chảo hành tây, xà lách trộn (550 kcal)<br>• <strong>Tối:</strong> Thịt bò Mỹ áp chảo măng tây (500 kcal)<br>• <strong>Phụ:</strong> Trái cây tươi (100 kcal)<br><em>Chế độ giàu đạm giúp bạn giữ cơ và duy trì năng lượng rất tốt!</em>";
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
            msgDiv.className = 'message-user font-sans';
        } else {
            msgDiv.className = 'message-ai font-sans';
        }
        
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
        typingDiv.className = 'font-sans';
        typingDiv.innerHTML = 'FreshKeep AI đang nhập... <span class="animate-pulse">● ● ●</span>';
        messagesContainer.appendChild(typingDiv);
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
})();
