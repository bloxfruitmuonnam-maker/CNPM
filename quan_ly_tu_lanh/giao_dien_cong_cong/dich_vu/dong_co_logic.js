export const NotificationEngine = {
    isSupported: () => ('Notification' in window) && window.isSecureContext,
    getPermissionState: () => {
        if (!NotificationEngine.isSupported()) return 'unsupported';
        return Notification.permission;
    },
    requestPermission: () => {
        if (!NotificationEngine.isSupported()) return Promise.resolve(false);
        return Notification.requestPermission().then(permission => permission === 'granted');
    },
    sendPush: (title, body, fallbackCallback) => {
        if (NotificationEngine.isSupported() && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: 'https://cdn-icons-png.flaticon.com/512/1157/1157109.png'
                });
                return true;
            } catch (e) {
                console.warn(e);
            }
        }
        if (fallbackCallback) fallbackCallback(title, body);
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
        NotificationEngine.sendPush(title, body, fallbackCallback);
    }
};

export const ExpiryEngine = {
    calculate: (item, warnDaysLimit = 3, pediatricWarnLimit = 2) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const expiry = new Date(item.expiryDate); expiry.setHours(0,0,0,0);
        const diffTime = expiry.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            return {
                label: 'ĐÃ HẾT HẠN 🔴',
                badgeStyle: { textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
                sideColor: 'bg-red-500', isPulse: true, daysRemaining
            };
        }
        if ((item.isPediatricCritical || item.compartment === 'Ngăn đồ ăn dặm') && daysRemaining <= pediatricWarnLimit) {
            return {
                label: `NGUY HIỂM: ĐỒ CỦA BÉ (${daysRemaining} ngày) 👶🚨`,
                badgeStyle: { textColor: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-400 font-black' },
                sideColor: 'bg-red-600 alert-pulse', isPulse: true, daysRemaining
            };
        }
        if (daysRemaining <= warnDaysLimit) {
            return {
                label: `SẮP HẾT HẠN (${daysRemaining} ngày) 🟡`,
                badgeStyle: { textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
                sideColor: 'bg-orange-400', isPulse: true, daysRemaining
            };
        }
        return {
            label: 'TƯƠI MỚI 🟢',
            badgeStyle: { textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
            sideColor: 'bg-emerald-400', isPulse: false, daysRemaining
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
            if (n.includes('xúc xích')) return c.includes('đông') ? 45 : 10;
            if (n.includes('xông khói')) return c.includes('đông') ? 30 : 7;
            if (n.includes('mì') || n.includes('bún') || n.includes('phở')) return 365;
            return 30;
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

export const RecipeCatalog = [
    { id: 'r1', name: 'Gà xào sả ớt', requiredIngredients: ['gà', 'sả', 'ớt'], desc: 'Món ăn đậm đà đưa cơm từ thịt gà thơm phức xào cay nồng.', emoji: '🍗' },
    { id: 'r2', name: 'Gà xào ớt chuông và hành tây', requiredIngredients: ['gà', 'ớt chuông', 'hành tây'], desc: 'Hương vị giòn ngọt thanh mát, dồi dào vitamin.', emoji: '🥗' },
    { id: 'r3', name: 'Súp gà nấm', requiredIngredients: ['gà', 'nấm'], desc: 'Món súp bồi bổ ấm nóng, dễ tiêu hóa cho cả em bé và gia đình.', emoji: '🍲' },
    { id: 'r4', name: 'Bò lúc lắc', requiredIngredients: ['bò', 'hành tây', 'ớt chuông'], desc: 'Thịt bò xào mềm ngon thấm vị cùng hành tây giòn ngọt.', emoji: '🥩' },
    { id: 'r5', name: 'Bò bít tết kèm khoai tây', requiredIngredients: ['bò', 'khoai tây'], desc: 'Món Âu sang trọng bổ dưỡng ăn kèm khoai tây chiên giòn rụm.', emoji: '🍟' },
    { id: 'r6', name: 'Canh thịt bò hầm khoai tây cà rốt', requiredIngredients: ['bò', 'khoai tây', 'cà rốt'], desc: 'Món canh bổ dưỡng hầm nhừ ngọt nước thích hợp cho gia đình.', emoji: '🥣' }
];

export const BasicDishes = [
    { name: 'Canh sườn hầm củ quả', category: 'Các món canh', desc: 'Canh sườn hầm ngọt thanh cùng khoai tây, cà rốt.' },
    { name: 'Canh chua cá lóc', category: 'Các món canh', desc: 'Món canh chua đậm đà Nam Bộ giải nhiệt mùa hè.' },
    { name: 'Thịt kho tàu', category: 'Các món mặn', desc: 'Thịt kho nước dừa rục mềm cùng trứng vịt.' },
    { name: 'Cá kho tộ', category: 'Các món mặn', desc: 'Cá lóc kho tộ sền sệt, đậm đà vị tiêu ớt.' }
];

export const barcodeDatabase = {
    "8934563138129": { name: "Sữa tươi TH True Milk ít đường", category: "Sữa & Đồ hộp", quantity: "1 hộp 1L", compartment: "Cánh tủ" },
    "8934561230012": { name: "Mì ăn liền Hảo Hảo chua cay", category: "Đồ khô & Chế biến sẵn", quantity: "1 thùng (30 gói)", compartment: "Ngăn mát" },
    "8936011771123": { name: "Nước ngọt Coca-Cola Lon", category: "Đồ uống", quantity: "6 lon 320ml", compartment: "Cánh tủ" },
    "8930001012351": { name: "Sữa chua ăn Vinamilk có đường", category: "Sữa & Đồ hộp", quantity: "4 hộp", compartment: "Ngăn mát" },
    "8934673891045": { name: "Trứng gà tươi Ba Huân", category: "Sữa & Đồ hộp", quantity: "10 quả", compartment: "Ngăn mát" }
};

export const FridgyParser = {
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
        for (const [cat, keywords] of Object.entries(FridgyParser.categoryKeywords)) {
            if (keywords.some(keyword => n.includes(keyword))) return false;
        }
        return true;
    },
    parseInstruction: (input, itemsList) => {
        const rawText = input.trim();
        const normalized = rawText.toLowerCase();

        // 1. TRUY VẤN THỰC PHẨM SẮP HẾT HẠN
        if (normalized.includes('sắp hết hạn') || normalized.includes('sắp hỏng') || normalized.includes('gần hết hạn')) {
            const expiring = itemsList.filter(item => {
                const exp = ExpiryEngine.calculate(item);
                return exp.daysRemaining <= 3;
            });
            if (expiring.length === 0) {
                return { success: false, message: 'Fridgy AI 🤖: Tuyệt vời! Hiện tại toàn bộ thực phẩm đều ở trạng thái tươi mới.' };
            }
            const listStr = expiring.map(i => `• ${i.name} (${i.quantity}) - còn ${ExpiryEngine.calculate(i).daysRemaining} ngày`).join('\n');
            return { success: false, message: `Fridgy AI 🤖: Phát hiện thực phẩm sắp hết hạn trong 3 ngày tới:\n${listStr}` };
        }

        // 2. TRUY VẤN HẠN DÙNG CỤ THỂ CỦA MỘT THỨ
        if (normalized.includes('bao nhiêu ngày') || normalized.includes('khi nào hỏng') || normalized.includes('hạn sử dụng của') || normalized.includes('hạn dùng của')) {
            let cleanQuery = normalized
                .replace('hạn sử dụng của', '')
                .replace('hạn dùng của', '')
                .replace('còn bao nhiêu ngày', '')
                .replace('nữa', '')
                .replace('kiểm tra', '')
                .replace('?', '').trim();
                
            const found = itemsList.find(i => i.name.toLowerCase().includes(cleanQuery));
            if (found) {
                const info = ExpiryEngine.calculate(found);
                if (info.daysRemaining < 0) {
                    return { success: false, message: `Fridgy AI 🤖: Món "${found.name}" lưu ở ${found.compartment} ĐÃ HẾT HẠN từ ${Math.abs(info.daysRemaining)} ngày trước rồi!` };
                }
                return { success: false, message: `Fridgy AI 🤖: Thực phẩm "${found.name}" đang ở [${found.compartment}]. Hạn dùng còn lại: ${info.daysRemaining} ngày.` };
            }
            return { success: false, message: `Fridgy AI 🤖: Tôi không tìm thấy món nào có tên "${cleanQuery}" trong tủ.` };
        }

        // 3. TRUY VẤN SỰ TỒN TẠI
        if (normalized.includes('còn') && (normalized.includes('không') || normalized.includes('ko'))) {
            let searchedWord = normalized
                .replace('trong tủ', '')
                .replace('còn', '')
                .replace('không', '')
                .replace('ko', '')
                .replace('có', '')
                .replace('?', '').trim();

            const matched = itemsList.filter(i => i.name.toLowerCase().includes(searchedWord));
            if (matched.length > 0) {
                const listStr = matched.map(i => `• ${i.name} (SL: ${i.quantity}, vị trí: ${i.compartment})`).join('\n');
                return { success: false, message: `Fridgy AI 🤖: Có nhé! Tôi tìm thấy sản phẩm:\n${listStr}` };
            }
            return { success: false, message: `Fridgy AI 🤖: Rất tiếc, tôi không tìm thấy "${searchedWord}" trong tủ. Bạn có muốn ghi chú vào "Sổ đi chợ" để mua không?` };
        }

        // 4. XÓA MÓN ĂN
        if (normalized.startsWith('xóa')) {
            const targetName = normalized.replace('xóa món', '').replace('xóa', '').trim();
            const found = itemsList.find(i => i.name.toLowerCase().includes(targetName));
            if (found) {
                return {
                    success: true,
                    action: 'delete',
                    targetId: found.id,
                    message: `Fridgy AI 🤖: Đã dọn bỏ "${found.name}" ra khỏi tủ lạnh.`
                };
            }
        }

        // 5. THÊM THỰC PHẨM
        const structureRegex = /(?:thêm|bỏ|cất|mua|để)\s+(.+?)\s+vào\s+(ngăn mát|ngăn đông|cánh tủ|ngăn đồ ăn dặm|ngăn rau củ)/i;
        const match = rawText.match(structureRegex);

        if (match) {
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

            for (const [cat, keywords] of Object.entries(FridgyParser.categoryKeywords)) {
                if (keywords.some(keyword => nameLower.includes(keyword))) {
                    category = cat;
                    break;
                }
            }

            const isStrangeIngredient = category === 'Khác' || FridgyParser.isCustomIngredient(name);
            const fallbackDays = ExpiryEngine.getFallbackDays(name, category, compartment);
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + fallbackDays);
            const expiryDate = targetDate.toISOString().split('T')[0];

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
                    message: `Fridgy AI 🤖 phát hiện "${parsedItem.name}" là một Nguyên liệu lạ. Đang mở trình cấu hình bảo quản...`,
                    parsedItem
                };
            }

            return {
                success: true,
                action: 'add',
                message: `Fridgy AI 🤖: Đã xếp [${category}] -> "${parsedItem.name}" (${quantity}) vào ${compartment}. Thời hạn bảo quản khuyên dùng là ${fallbackDays} ngày.`,
                parsedItem
            };
        }

        return {
            success: false,
            message: 'Fridgy AI 🤖: Tôi chưa hiểu yêu cầu của bạn. Bạn hãy thử gõ: "Thêm 2 hộp sữa tươi vào ngăn mát" hoặc đặt câu hỏi "Trong tủ có thịt bò không?".'
        };
    }
};
```

#### Tệp `giao_dien_cong_cong/thanh_phan/thanh_dau.js`
```javascript
export default function ThanhDau({ currentTime, isOnline, userName, roommates, handleUserChange, setScannerCameraSimulation, handleGenerateQrSync }) {
    return (
        <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-orange-100 z-10 gap-3 sm:gap-0 font-sans">
            <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="text-4xl sm:text-5xl floating-food">🍊</span>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-orange-600 font-sans animate-fade-in">FRESHKEEP</h1>
                    <p className="text-[10px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider">
                        📅 {currentTime.toLocaleDateString('vi-VN')} | ⏰ {currentTime.toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-3 bg-white/70 backdrop-blur-md border border-amber-200/60 px-4 py-2 rounded-2xl shadow-sm z-10 font-sans">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setScannerCameraSimulation(true)}
                        className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                        📷 Quét Barcode
                    </button>
                    <button 
                        onClick={handleGenerateQrSync}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                        🔗 Đồng bộ QR
                    </button>
                </div>
                
                <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
                    <span className="text-xs font-bold text-stone-500">Tài khoản:</span>
                    <select 
                        value={userName} 
                        onChange={(e) => handleUserChange(e.target.value)}
                        className="bg-transparent text-xs font-bold text-amber-950 focus:outline-none cursor-pointer font-sans font-extrabold"
                    >
                        {roommates.map(r => (
                            <option key={r.id} value={r.name}>{r.name} ({r.role}){r.isAdmin ? ' ★ Admin' : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
                    <span className="text-xs font-bold text-stone-500">Kết nối:</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'}`}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>
        </header>
    );
}
