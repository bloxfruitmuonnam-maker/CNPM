export default function SoDiCho({ 
    shoppingList, setShoppingList, shoppingInput, setShoppingInput, 
    shoppingCategory, setShoppingCategory, handleAddShoppingItem, handleMarkAsBought 
}) {
    return (
        <div className="flex-1 flex flex-col md:flex-row gap-5 animate-fade-in font-sans">
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-3 font-sans">
                        🛒 DANH SÁCH SỔ ĐI CHỢ GIA ĐÌNH
                    </h4>

                    <div className="flex gap-2 mb-4 bg-amber-50/50 p-2.5 rounded-2xl border border-amber-200/50">
                        <input 
                            type="text"
                            className="flex-1 border border-amber-200/50 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none font-bold text-stone-700 font-sans"
                            placeholder="Tên đồ cần mua..."
                            value={shoppingInput}
                            onChange={(e) => setShoppingInput(e.target.value)}
                        />
                        <select 
                            value={shoppingCategory}
                            onChange={(e) => setShoppingCategory(e.target.value)}
                            className="border border-amber-200/50 rounded-xl px-2 py-2 text-[10px] bg-white font-bold text-stone-600 font-sans"
                        >
                            <option value="Thịt & Hải sản">Thịt & Hải sản 🥩</option>
                            <option value="Rau củ & Trái cây">Rau củ & Trái cây 🥦</option>
                            <option value="Sữa & Đồ hộp">Sữa & Đồ hộp 🥛</option>
                            <option value="Đồ khô & Chế biến sẵn">Đồ khô 🥫</option>
                            <option value="Đồ uống">Đồ uống 🍹</option>
                        </select>
                        <button 
                            onClick={() => handleAddShoppingItem()}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 rounded-xl text-xs transition font-sans"
                        >
                            Thêm
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {shoppingList.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2.5 bg-amber-50/20 border border-amber-100 rounded-xl font-sans">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={item.checked}
                                        onChange={async () => {
                                            const checkedState = !item.checked;
                                            await fetch(`/api/shopping/${item.id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ checked: checkedState })
                                            });
                                            setShoppingList(prev => prev.map(s => s.id === item.id ? { ...s, checked: checkedState } : s));
                                        }}
                                        className="w-4 h-4 accent-amber-500"
                                    />
                                    <span className={`text-xs font-bold text-stone-800 ${item.checked ? 'line-through text-stone-400' : ''}`}>
                                        {item.name} ({item.quantity})
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handleMarkAsBought(item.id)}
                                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black text-[9px] px-2.5 py-1 rounded-lg"
                                >
                                    ✔ Xác nhận mua (Cất tủ)
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-64 bg-stone-50 p-4 rounded-2xl border border-stone-200/50 flex flex-col justify-between">
                <div>
                    <h5 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-3 font-sans">
                        💡 GỢI Ý TỰ ĐỘNG
                    </h5>
                    <p className="text-[9px] text-stone-500 leading-relaxed font-semibold mb-3 font-sans">
                        Gợi ý các thực phẩm cơ bản cần mua bổ sung định kỳ cho bếp:
                    </p>
                    <div className="space-y-2">
                        {[
                            { name: 'Rau cải ngồng', category: 'Rau củ & Trái cây' },
                            { name: 'Sườn heo non', category: 'Thịt & Hải sản' },
                            { name: 'Sữa tươi ít đường', category: 'Sữa & Đồ hộp' }
                        ].map((rec, i) => (
                            <button 
                                key={i}
                                onClick={() => handleAddShoppingItem(rec.name, rec.category, '1 phần')}
                                className="w-full text-left bg-white hover:bg-amber-50 border border-stone-100 p-2.5 rounded-xl text-[10px] font-bold text-stone-700 transition flex justify-between items-center font-sans"
                            >
                                <span>➕ {rec.name}</span>
                                <span className="text-[8px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">{rec.category}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
