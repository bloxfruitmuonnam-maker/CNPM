export default function TroLyAi({ items, chatHistory, chatInput, setChatInput, handleExecuteCommand }) {
    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 font-sans">
            <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-100 pb-4 lg:pb-0 lg:pr-6">
                <div className="flex items-center gap-2 mb-3 bg-stone-50 p-2 rounded-xl border border-stone-200/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[9px] text-stone-500 font-extrabold uppercase tracking-wider">
                        Fridgy AI đang liên kết trực tiếp với kho thực phẩm chung ({items.length} món)
                    </p>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[260px] flex-1 pr-2 mb-4">
                    {chatHistory.map((chat, idx) => (
                        <div key={idx} className={`max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-[11px] sm:text-xs font-semibold leading-relaxed shadow-xs transition-all whitespace-pre-line ${
                            chat.sender === 'user' 
                            ? 'bg-amber-300 text-stone-900 ml-auto rounded-tr-none' 
                            : 'bg-stone-100/90 text-stone-800 rounded-tl-none border border-stone-200/40'
                        }`}>
                            {chat.text}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-100 min-h-[46px]">
                    <input 
                        type="text" 
                        className="flex-1 bg-transparent px-2 text-xs focus:outline-none min-h-[38px] font-bold text-stone-700"
                        placeholder="Nhập câu hỏi hoặc câu lệnh điều khiển..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand(chatInput)}
                    />
                    <button 
                        onClick={() => handleExecuteCommand(chatInput)} 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-5 rounded-xl text-xs shadow-md transition transform active:scale-95"
                    >
                        Gửi
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-72 flex flex-col gap-4 overflow-y-auto max-h-[280px] lg:max-h-[340px] pr-1">
                <h4 className="font-extrabold text-stone-700 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <span>⚡</span> Lệnh Thực Thi Nhanh (Bấm để gửi)
                </h4>
                
                <div className="space-y-2">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">1. Phân Tích Thực Tế Tủ Lạnh</p>
                    {[
                        { cmd: 'Món nào trong tủ sắp hết hạn?', label: '🔍 Đồ nào sắp hết hạn?' },
                        { cmd: 'Trứng gà còn bao nhiêu ngày nữa thì hỏng?', label: '🥚 Hạn dùng Trứng gà?' },
                        { cmd: 'Trong tủ còn sữa tươi không Fridgy?', label: '🥛 Kiểm tra sữa tươi?' },
                        { cmd: 'Liệt kê các thực phẩm trong ngăn đông', label: '❄️ Xem đồ ngăn đông' }
                    ].map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleExecuteCommand(c.cmd)} 
                            className="w-full text-left bg-white hover:bg-emerald-50/50 border border-stone-200/80 p-2.5 rounded-xl text-[10px] font-bold text-stone-700 hover:text-emerald-900 transition-all block min-h-[34px] shadow-xs"
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
