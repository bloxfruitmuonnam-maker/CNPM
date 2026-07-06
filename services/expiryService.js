`javascript
window.ExpiryEngine = {
    calculate: (item, warnDaysLimit = 3, pediatricWarnLimit = 2) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(item.expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const diffTime = expiry.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            return {
                label: 'ĐÃ HẾT HẠN 🔴',
                badgeStyle: { textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
                sideColor: 'bg-red-500',
                isPulse: true,
                daysRemaining
            };
        }

        if ((item.isPediatricCritical || item.compartment === 'Ngăn đồ ăn dặm') && daysRemaining <= pediatricWarnLimit) {
            return {
                label: `NGUY HIỂM: ĐỒ CỦA BÉ (${daysRemaining} ngày) 👶🚨`,
                badgeStyle: { textColor: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-400 font-black' },
                sideColor: 'bg-red-600 alert-pulse',
                isPulse: true,
                daysRemaining
            };
        }

        if (daysRemaining <= warnDaysLimit) {
            return {
                label: `SẮP HẾT HẠN (${daysRemaining} ngày) 🟡`,
                badgeStyle: { textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
                sideColor: 'bg-orange-400',
                isPulse: true,
                daysRemaining
            };
        }

        return {
            label: 'TƯƠI MỚI 🟢',
            badgeStyle: { textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
            sideColor: 'bg-emerald-400',
            isPulse: false,
            daysRemaining
        };
    },

    getFallbackDays: (name, category, compartment) => {
        const n = name.toLowerCase();
        const c = compartment ? compartment.toLowerCase() : 'ngăn mát';

        if (category === 'Thịt & Hải sản' || n.includes('thịt') || n.includes('cá') || n.includes('tôm') || n.includes('mực') || n.includes('gà') || n.includes('vịt')) {
            if (c.includes('đông')) {
                if (n.includes('heo') || n.includes('lợn') || n.includes('ba chỉ') || n.includes('sườn')) return 150;
                if (n.includes('bò xay')) return 105;
                if (n.includes('bò')) return 270;
                if (n.includes('gà') || n.includes('vịt') || n.includes('ức') || n.includes('đùi') || n.includes('cánh')) return 315;
                if (n.includes('hồi') || n.includes('thu')) return 75;
                if (n.includes('tôm') || n.includes('mực') || n.includes('nghêu') || n.includes('sò')) return 135;
                return 90;
            }
            return 3;
        }

        if (category === 'Rau củ & Trái cây' || n.includes('rau') || n.includes('quả') || n.includes('trái cây') || n.includes('táo') || n.includes('cam')) {
            if (n.includes('xà lách') || n.includes('muống') || n.includes('thìa') || n.includes('cải') || n.includes('bó xôi')) return 5;
            if (n.includes('cà rốt') || n.includes('cà chua') || n.includes('ớt chuông')) return 10;
            if (n.includes('hành lá') || n.includes('sả') || n.includes('ớt') || n.includes('tỏi') || n.includes('gừng')) return 10;
            if (n.includes('táo') || n.includes('cam') || n.includes('chanh')) return 10;
            return 7;
        }

        if (category === 'Sữa & Đồ hộp' || n.includes('sữa') || n.includes('bơ') || n.includes('phô mai') || n.includes('tương')) {
            if (n.includes('sữa tươi')) return 8;
            if (n.includes('sữa chua')) return 10;
            if (n.includes('phô mai')) return 10;
            if (n.includes('bơ')) return 60;
            if (n.includes('mayonnaise') || n.includes('tương cà') || n.includes('tương ớt') || n.includes('sốt')) return 180;
            return 10;
        }

        if (category === 'Đồ khô & Chế biến sẵn' || n.includes('xúc xích') || n.includes('thịt xông khói') || n.includes('mì') || n.includes('bún')) {
            if (n.includes('xúc xích')) {
                return c.includes('đông') ? 45 : 10; 
            }
            if (n.includes('xông khói')) {
                return c.includes('đông') ? 30 : 7;
            }
            if (n.includes('mì') || n.includes('bún') || n.includes('phở')) return 365;
            return 30;
        }

        if (category === 'Đồ uống' || n.includes('nước ép') || n.includes('nước ngọt') || n.includes('bia')) {
            if (n.includes('nước ép')) return 8;
            if (n.includes('nước ngọt')) return 180;
            if (n.includes('bia')) return 210;
            return 90;
        }

        return 5;
    },

    getHealthWarning: (name) => {
        if (!name) return null;
        const n = name.toLowerCase();
        if (n.includes('khoai tây') || n.includes('hành tây')) {
            return '⚠️ Cảnh báo sức khỏe: Khoai tây và Hành tây không nên bảo quản trong tủ lạnh vì dễ bị mọc mầm, ẩm mốc và biến đổi tinh bột thành các chất không có lợi cho sức khỏe.';
        }
        if (n.includes('chuối')) {
            return '⚠️ Lưu ý bảo quản: Chuối nên được treo bảo quản ở nhiệt độ phòng. Nhiệt độ tủ lạnh sẽ khiến chuối nhanh bị thâm đen và mất vị ngọt tự nhiên.';
        }
        return null;
    }
};
```

### `services/notificationService.js`
Phát thông báo hệ thống (Native) và giao diện hộp thoại khẩn cấp.

```javascript
window.NotificationEngine = {
    isSupported: () => {
        return ('Notification' in window) && window.isSecureContext;
    },

    getPermissionState: () => {
        if (!window.NotificationEngine.isSupported()) return 'unsupported';
        return Notification.permission;
    },

    requestPermission: () => {
        if (!window.NotificationEngine.isSupported()) return Promise.resolve(false);
        
        try {
            return Notification.requestPermission().then(permission => {
                return permission === 'granted';
            });
        } catch (e) {
            return new Promise((resolve) => {
                try {
                    Notification.requestPermission(permission => {
                        resolve(permission === 'granted');
                    });
                } catch (err) {
                    console.error("Lỗi khi cấp quyền thông báo đẩy:", err);
                    resolve(false);
                }
            });
        }
    },

    sendPush: (title, body, fallbackCallback) => {
        if (window.NotificationEngine.isSupported() && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: body,
                    icon: 'https://cdn-icons-png.flaticon.com/512/1157/1157109.png'
                });
                return true;
            } catch (e) {
                console.warn("Gửi thông báo Native thất bại, chuyển sang phương thức nội bộ:", e);
            }
        }
        if (fallbackCallback) {
            fallbackCallback(title, body);
        }
        return false;
    },

    triggerPersonaPush: (itemName, daysRemaining, category, fallbackCallback) => {
        let title = "🚨 FRESHKEEP - CẢNH BÁO HẠN DÙNG";
        let body = "";

        if (category === "Sữa & Đồ hộp" && itemName.toLowerCase().includes("em bé")) {
            title = "⚠️ Cảnh báo nghiêm ngặt";
            body = `Đồ ăn dặm của bé Mai chỉ còn ${daysRemaining} ngày hạn dùng. Hãy ưu tiên chế biến cho bé ngay! 👶`;
        } else if (itemName.toLowerCase().includes("cá hồi") || itemName.toLowerCase().includes("bò")) {
            title = "🆘 Nấu ngay kẻo phí!";
            body = `Món ngon "${itemName}" trong tủ sẽ hết hạn sau ${daysRemaining} ngày. Đừng để lãng phí nhé Thảo! 💸`;
        } else {
            body = `Thực phẩm "${itemName}" sắp hết hạn sau ${daysRemaining} ngày. Vui lòng kiểm tra và chế biến kịp thời!`;
        }

        window.NotificationEngine.sendPush(title, body, fallbackCallback);
    }
};
```

### `services/recipeService.js`
Động cơ đề xuất công thức dựa trên sự hao hụt, hết hạn và hỗ trợ định nghĩa nguyên liệu lạ.

```javascript
window.RecipeEngine = {
    generateForCustomIngredient: (itemName) => {
        if (!itemName) return [];
        const name = itemName.trim();
        const lower = name.toLowerCase();
        
        if (lower.includes('đông trùng') || lower.includes('linh chi') || lower.includes('sâm') || lower.includes('thảo dược')) {
            return [
                { name: `Canh gà ta hầm sâm bổ lượng & ${name}`, desc: `Hầm gà cùng ${name}, hạt sen, táo đỏ và kỳ tử trong 1.5 giờ. Thích hợp bồi bổ sức khỏe cho gia đình.` },
                { name: `Trà thảo mộc dưỡng nhan từ ${name}`, desc: `Hãm lát ${name} với nước sôi 85°C kèm kỷ tử và một chút đường phèn thanh mát.` }
            ];
        }
        if (lower.includes('ốc') || lower.includes('nghêu') || lower.includes('hàu') || lower.includes('sò') || lower.includes('bào ngư')) {
            return [
                { name: `${name} hấp sả ớt cay nồng`, desc: `Hấp cách thủy ${name} cùng sả cây đập dập, gừng thái chỉ và ớt tươi. Chấm kèm nước mắm gừng ấm bụng.` },
                { name: `Cháo bổ dưỡng hầm ${name} đậu xanh`, desc: `Nấu cháo nhừ cùng đậu xanh vỏ, sau đó xào chín ${name} với hành tỏi rồi trút vào nồi cháo.` }
            ];
        }
        if (lower.includes('măng') || lower.includes('nấm') || lower.includes('sen') || lower.includes('mộc nhĩ')) {
            return [
                { name: `${name} xào tỏi dầu hào chay`, desc: `Xào nhanh tay ${name} trên lửa lớn với tỏi băm và dầu hào để giữ độ giòn ngọt tự nhiên.` },
                { name: `Canh sườn heo hầm ${name}`, desc: `Ninh sườn non lấy nước ngọt, cho thêm ${name} hầm chín tới, rắc hành lá và tiêu thơm.` }
            ];
        }
        if (lower.includes('phô mai') || lower.includes('bơ') || lower.includes('sốt')) {
            return [
                { name: `Bánh mì nướng sốt ${name}`, desc: `Phết một lớp ${name} mỏng lên bánh mì, thêm một chút trứng hoặc xúc xích rồi nướng giòn.` },
                { name: `Mì Ý sốt kem béo ngậy với ${name}`, desc: `Luộc mì Ý gia vừa chín, đảo đều cùng sốt kem, tỏi băm và lớp ${name} tan chảy mịn màng.` }
            ];
        }
        return [
            { 
                name: `${name} xào tỏi ớt thập cẩm`, 
                desc: `Tận dụng các loại rau củ sẵn có trong ngăn mát, xào nhanh tay ${name} trên lửa lớn với tỏi phi thơm để giữ vị giòn dai.` 
            },
            { 
                name: `Canh súp thanh nhiệt cùng ${name}`, 
                desc: `Kết hợp ${name} với một ít sườn non hoặc tôm khô để tạo nước dùng ngọt tự nhiên, dùng kèm hành lá thơm nhẹ.` 
            }
        ];
    }
};
```

### `services/nlpParser.js`
Mô hình diễn giải câu lệnh, bóc tách thực phẩm, số lượng và các truy vấn dữ liệu từ người dùng.

```javascript
window.FridgyParser = {
    categoryKeywords: {
        'Thịt & Hải sản': ['thịt', 'bò', 'heo', 'gà', 'cá', 'tôm', 'mực', 'sườn', 'ba chỉ', 'bắp bò', 'gân bò', 'cá hồi'],
        'Rau củ & Trái cây': ['rau', 'cải', 'cà rốt', 'khoai', 'cà chua', 'hành', 'ớt', 'tỏi', 'gừng', 'sả', 'táo', 'chuối', 'cam', 'chanh', 'bông cải', 'súp lơ'],
        'Sữa & Đồ hộp': ['sữa', 'trứng', 'phô mai', 'bơ', 'mayonnaise', 'tương', 'đồ hộp', 'sữa chua'],
        'Đồ khô & Chế biến sẵn': ['xúc xích', 'thịt xông khói', 'mì', 'bún', 'phở', 'chà bông', 'ruốc'],
        'Đồ uống': ['nước ép', 'nước ngọt', 'bia', 'coca', 'pepsi', 'trà']
    },

    isCustomIngredient: (name) => {
        if (!name) return true;
        const n = name.toLowerCase();
        for (const [cat, keywords] of Object.entries(window.FridgyParser.categoryKeywords)) {
            if (keywords.some(keyword => n.includes(keyword))) {
                return false; 
            }
        }
        return true; 
    },

    parseInstruction: (input, itemsList) => {
        const rawText = input.trim();
        const normalized = rawText.toLowerCase();

        // 1. TRUY VẤN THỰC PHẨM SẮP HẾT HẠN
        if (normalized.includes('sắp hết hạn') || normalized.includes('sắp hỏng') || normalized.includes('gần hết hạn')) {
            const expiring = itemsList.filter(item => {
                const exp = window.ExpiryEngine.calculate(item);
                return exp.daysRemaining <= 3;
            });
            if (expiring.length === 0) {
                return { success: false, message: 'Fridgy AI 🤖: Tuyệt vời! Hiện tại tôi kiểm tra thấy toàn bộ thực phẩm trong tủ đều ở trạng thái tươi mới, không có món nào sắp hết hạn gấp.' };
            }
            const listStr = expiring.map(i => `• ${i.name} (${i.quantity}) - còn ${window.ExpiryEngine.calculate(i).daysRemaining} ngày`).join('\n');
            return { success: false, message: `Fridgy AI 🤖: Tôi phát hiện các thực phẩm sắp hết hạn trong 3 ngày tới:\n${listStr}\n\nBạn nên lên kế hoạch chế biến ngay nhé!` };
        }

        // 2. TRUY VẤN HẠN DÙNG CỦA MỘT MÓN
        if (normalized.includes('bao nhiêu ngày') || normalized.includes('khi nào hỏng') || normalized.includes('hạn sử dụng của') || normalized.includes('hạn dùng của')) {
            let cleanQuery = normalized
                .replace('hạn sử dụng của', '')
                .replace('hạn dùng của', '')
                .replace('còn bao nhiêu ngày', '')
                .replace('nữa', '')
                .replace('thì hỏng', '')
                .replace('thì hết hạn', '')
                .replace('kiểm tra', '')
                .replace('?', '').trim();
                
            const found = itemsList.find(i => i.name.toLowerCase().includes(cleanQuery));
            if (found) {
                const info = window.ExpiryEngine.calculate(found);
                if (info.daysRemaining < 0) {
                    return { success: false, message: `Fridgy AI 🤖: Món "${found.name}" lưu ở ${found.compartment} ĐÃ HẾT HẠN từ ${Math.abs(info.daysRemaining)} ngày trước rồi ạ! Bạn nên dọn bỏ.` };
                }
                return { success: false, message: `Fridgy AI 🤖: Thực phẩm "${found.name}" hiện đang lưu tại [${found.compartment}]. Hạn sử dụng còn lại: ${info.daysRemaining} ngày nữa.` };
            }
            return { success: false, message: `Fridgy AI 🤖: Tôi không tìm thấy món nào có tên khớp với "${cleanQuery}" trong tủ lạnh của bạn.` };
        }

        // 3. TRUY VẤN SỰ TỒN TẠI ("còn ... không", "có ... không")
        if (normalized.includes('còn') && (normalized.includes('không') || normalized.includes('ko'))) {
            let searchedWord = normalized
                .replace('trong tủ', '')
                .replace('lạnh', '')
                .replace('còn', '')
                .replace('không', '')
                .replace('ko', '')
                .replace('có', '')
                .replace('fridgy', '')
                .replace('?', '').trim();

            const matched = itemsList.filter(i => i.name.toLowerCase().includes(searchedWord));
            if (matched.length > 0) {
                const listStr = matched.map(i => `• ${i.name} (Số lượng: ${i.quantity}, vị trí: ${i.compartment})`).join('\n');
                return { success: false, message: `Fridgy AI 🤖: Có nhé! Tôi tìm thấy thực phẩm khớp với yêu cầu của bạn:\n${listStr}` };
            }
            return { success: false, message: `Fridgy AI 🤖: Rất tiếc, tôi không tìm thấy "${searchedWord}" trong tủ. Bạn có muốn ghi chú món này vào tab "Sổ đi chợ" để mua bổ sung không?` };
        }

        // 4. TRUY VẤN LIỆT KÊ THEO NGĂN LƯU TRỮ
        if (normalized.includes('liệt kê') || normalized.includes('có gì') || normalized.includes('xem ngăn')) {
            let compMatch = 'Ngăn mát';
            if (normalized.includes('đông')) compMatch = 'Ngăn đông';
            else if (normalized.includes('cánh')) compMatch = 'Cánh tủ';
            else if (normalized.includes('rau') || normalized.includes('củ')) compMatch = 'Ngăn rau củ';
            else if (normalized.includes('dặm') || normalized.includes('em bé') || normalized.includes('con')) compMatch = 'Ngăn đồ ăn dặm';

            const matchedItems = itemsList.filter(i => i.compartment === compMatch);
            if (matchedItems.length === 0) {
                return { success: false, message: `Fridgy AI 🤖: Hiện tại vùng lưu trữ [${compMatch}] đang trống, chưa có thực phẩm nào.` };
            }
            const listStr = matchedItems.map(i => `• ${i.name} (${i.quantity})`).join('\n');
            return { success: false, message: `Fridgy AI 🤖: Các thực phẩm đang có trong [${compMatch}] gồm:\n${listStr}` };
        }

        // 5. GỢI Ý MÓN ĂN THÔNG MINH DỰA TRÊN THỰC TẾ
        if (normalized.includes('nấu gì') || normalized.includes('gợi ý món') || normalized.includes('thực đơn') || normalized.includes('ăn gì')) {
            const availableNames = itemsList.map(item => item.name.toLowerCase());
            
            let matchedRecipes = window.RecipeCatalog.map(recipe => {
                let matchedIngredients = recipe.requiredIngredients.filter(req => 
                    availableNames.some(name => name.includes(req))
                );
                let score = matchedIngredients.length / recipe.requiredIngredients.length;
                return { recipe, score, matchedIngredients };
            }).filter(r => r.score > 0)
              .sort((a, b) => b.score - a.score);

            if (matchedRecipes.length > 0) {
                const best = matchedRecipes[0];
                const missing = best.recipe.requiredIngredients.filter(ing => !best.matchedIngredients.includes(ing));
                
                let resp = `Fridgy AI 🤖 gợi ý: Dựa trên những gì có trong tủ, món phù hợp nhất lúc này là "${best.recipe.name}" ${best.recipe.emoji}.\n`;
                resp += `• Nguyên liệu sẵn có: ${best.matchedIngredients.join(', ')}\n`;
                if (missing.length > 0) {
                    resp += `• Nguyên liệu còn thiếu: ${missing.join(', ')} (bạn có thể bấm thêm vào Sổ đi chợ nhé!)\n`;
                }
                resp += `• Hướng dẫn: ${best.recipe.desc}`;
                return { success: false, message: resp };
            }

            return { success: false, message: 'Fridgy AI 🤖: Hiện tại nguyên liệu trong tủ hơi ít để kết hợp thành các món phức tạp. Bạn có thể sử dụng tính năng thêm nguyên liệu lạ hoặc vào tab "Sổ đi chợ" để chuẩn bị mua sắm nhé!' };
        }

        // 6. THỐNG KÊ LÃNG PHÍ & HAO HỤT
        if (normalized.includes('thống kê') || normalized.includes('vứt bỏ') || normalized.includes('lãng phí')) {
            return { success: false, message: 'Fridgy AI 🤖: Thống kê hiệu năng tủ lạnh tháng này:\n- Tỷ lệ thực phẩm tiêu thụ thành công: 92%\n- Tỷ lệ hao hụt do quá hạn: 8% (chủ yếu là nhóm Rau củ bị quên ở góc ngăn mát).\n\nLời khuyên: Bạn nên bật tính năng "Cảnh báo nghiêm ngặt trước 2 ngày" trong tab Cài đặt để tối ưu hóa nhé!' };
        }

        if (normalized.includes('lời khuyên') || normalized.includes('tiết kiệm')) {
            return { success: false, message: 'Fridgy AI 🤖 khuyên bạn:\n1. Nên chia nhỏ khẩu phần thịt trước khi trữ đông.\n2. Bọc màng thực phẩm hoặc dùng hộp hút chân không cho rau xanh.\n3. Đặt các thực phẩm sắp hết hạn ra phía ngoài cánh tủ hoặc ngăn mát chính để dễ thấy.' };
        }

        if (normalized.includes('quyền') || normalized.includes('chồng') || normalized.includes('vợ') || normalized.includes('chia sẻ')) {
            return { success: false, message: 'Fridgy AI 🤖: Hệ thống tủ lạnh của bạn hiện được chia sẻ đồng bộ trực tiếp với Chồng (Bố trẻ nhỏ) và Trần Thu Thảo. Mọi hành động thêm/sửa/xóa của bạn hoặc Admin sẽ cập nhật ngay lập tức đến thiết bị của các thành viên.' };
        }

        // 7. XÓA MÓN ĂN (CRUD)
        if (normalized.startsWith('xóa món') || normalized.startsWith('xóa')) {
            const targetName = normalized.replace('xóa món', '').replace('xóa', '').replace('khỏi danh sách', '').trim();
            const found = itemsList.find(i => i.name.toLowerCase().includes(targetName));
            if (found) {
                return {
                    success: true,
                    action: 'delete',
                    targetId: found.id,
                    message: `Fridgy AI 🤖: Nhận lệnh xóa. Đã tiến hành gỡ bỏ "${found.name}" khỏi tủ lạnh.`
                };
            }
            return { success: false, message: `Fridgy AI 🤖: Không tìm thấy thực phẩm nào khớp với tên "${targetName}" để thực hiện xóa.` };
        }

        // 8. SỬA SỐ LƯỢNG (CRUD)
        if (normalized.startsWith('sửa số lượng') || normalized.startsWith('sửa')) {
            const updateRegex = /(?:sửa\s+số\s+lượng\s+|sửa\s+)(.+?)\s+thành\s+(.+)$/i;
            const updateMatch = rawText.match(updateRegex);
            if (updateMatch) {
                const targetName = updateMatch[1].trim().toLowerCase();
                const newQty = updateMatch[2].trim();
                const found = itemsList.find(i => i.name.toLowerCase().includes(targetName));
                if (found) {
                    return {
                        success: true,
                        action: 'update',
                        targetId: found.id,
                        newQuantity: newQty,
                        message: `Fridgy AI 🤖: Nhận lệnh cập nhật. Đã sửa số lượng món "${found.name}" thành [${newQty}] thành công.`
                    };
                }
            }
            return { success: false, message: 'Fridgy AI 🤖: Sai cú pháp chỉnh sửa. Cú pháp đúng: "Sửa số lượng sữa tươi thành 2 hộp".' };
        }

        // 9. THÊM THỰC PHẨM (CRUD)
        const triggerKeywords = ['thêm', 'bỏ', 'cất', 'mua', 'để'];
        const hasTrigger = triggerKeywords.some(keyword => normalized.startsWith(keyword));

        if (!hasTrigger) {
            return {
                success: false,
                message: 'Fridgy AI 🤖: Tôi chưa hiểu yêu cầu của bạn. Bạn hãy thử gõ: "Thêm 2 hộp sữa tươi vào ngăn mát" hoặc đặt câu hỏi như "Trong tủ có thịt bò không?".'
            };
        }

        const structureRegex = /(?:thêm|bỏ|cất|mua|để)\s+(.+?)\s+vào\s+(ngăn mát|ngăn đông|cánh tủ|ngăn đồ ăn dặm|ngăn rau củ)/i;
        const match = rawText.match(structureRegex);

        if (!match) {
            return {
                success: false,
                message: 'Fridgy AI 🤖: Tôi chưa xác định được vị trí cất giữ. Hãy viết rõ phân vùng: "... vào ngăn mát/ngăn đông/cánh tủ/ngăn đồ ăn dặm/ngăn rau củ".'
            };
        }

        const itemSegment = match[1].trim();
        const compartmentSegment = match[2].trim().toLowerCase();

        const qtyRegex = /^(\d+\s*[a-zA-Zà-ỹÀ-Ỹ\s]+|\d+)\s+(.+)$/i;
        const qtyMatch = itemSegment.match(qtyRegex);

        let quantity = '1 phần';
        let name = itemSegment;

        if (qtyMatch) {
            quantity = qtyMatch[1].trim();
            name = qtyMatch[2].trim();
        }

        let compartment = 'Ngăn mát';
        if (compartmentSegment.includes('đông')) compartment = 'Ngăn đông';
        if (compartmentSegment.includes('cánh')) compartment = 'Cánh tủ';
        if (compartmentSegment.includes('dặm')) compartment = 'Ngăn đồ ăn dặm';
        if (compartmentSegment.includes('rau') || compartmentSegment.includes('củ')) compartment = 'Ngăn rau củ';

        let category = 'Khác';
        const nameLower = name.toLowerCase();

        for (const [cat, keywords] of Object.entries(window.FridgyParser.categoryKeywords)) {
            if (keywords.some(keyword => nameLower.includes(keyword))) {
                category = cat;
                break;
            }
        }

        const isStrangeIngredient = category === 'Khác' || window.FridgyParser.isCustomIngredient(name);
        const fallbackDays = window.ExpiryEngine.getFallbackDays(name, category, compartment);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + fallbackDays);
        const expiryDate = targetDate.toISOString().split('T')[0];

        const healthWarn = window.ExpiryEngine.getHealthWarning(name);
        const warningSuffix = healthWarn ? `\n\n⚠️ Chú ý sức khỏe: ${healthWarn}` : '';

        const parsedItem = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            quantity,
            category: isStrangeIngredient ? 'Khác' : category,
            compartment,
            expiryDate,
            isPediatricCritical: compartment === 'Ngăn đồ ăn dặm',
            isCustom: isStrangeIngredient
        };

        if (isStrangeIngredient) {
            return {
                success: true,
                action: 'strange_confirmation',
                message: `Fridgy AI 🤖 phát hiện "${parsedItem.name}" là một Nguyên liệu lạ (không có trong danh mục chuẩn). Tôi đang mở trình cấu hình thuật toán bảo quản để bạn thiết lập...`,
                parsedItem
            };
        }

        return {
            success: true,
            action: 'add',
            message: `Fridgy AI 🤖: Đã xếp [${category}] -> "${parsedItem.name}" (${quantity}) vào ${compartment}. Thời hạn bảo quản lý tưởng là ${fallbackDays} ngày.${warningSuffix}`,
            parsedItem
        };
    }
};
