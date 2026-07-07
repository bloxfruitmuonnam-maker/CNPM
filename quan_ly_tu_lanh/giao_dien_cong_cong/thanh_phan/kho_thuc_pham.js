import { ExpiryEngine } from '../dich_vu/dong_co_logic.js';

export default function KhoThucPham({ 
    searchQuery, setSearchQuery, activeCompartment, setActiveCompartment, 
    setShowAddModal, offlineQueue, filteredItemsList, 
    handleQuickMoveCompartment, handleDeleteFoodWithAuth, 
    warnDaysLimit, pediatricWarnLimit, ThucPhamPlateIcon 
}) {
    return (
        <div className="flex-1 flex flex-col font-sans">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center mb-6">
                <input 
                    type="text"
                    className="w-full md:w-64 border-2 border-stone-100 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans min-h-[42px]"
                    placeholder="Tìm nhanh thực phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-1 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
                    {['Tất cả', 'Ngăn mát', 'Ngăn đông', 'Ngăn rau củ', 'Ngăn đồ ăn dặm', 'Cánh tủ'].map((comp) => (
                        <button
                            key={comp}
                            onClick={() => setActiveCompartment(comp)}
                            className={`text-[10px] sm:text-xs px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                                activeCompartment === comp ? 'bg-amber-200 text-amber-950 shadow-sm' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                            }`}
                        >
                            {comp}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition transform active:scale-95 whitespace-nowrap min-h-[42px] flex items-center justify-center font-sans"
                >
                    ➕ Thêm món mới
                </button>
            </div>

            {offlineQueue.length > 0 && (
                <div className="mb-4 bg-orange-100 text-orange-950 border border-orange-200 text-[10px] font-bold p-2.5 rounded-xl animate-pulse font-sans">
                    ⚠️ Bạn đang ngoại tuyến. Có {offlineQueue.length} thực phẩm đang chờ đồng bộ cục bộ.
                </div>
            )}

            <div className="space-y-3 overflow-y-auto max-h-[340px] flex-1 pr-1">
                {filteredItemsList.map(item => {
                    const expiry = ExpiryEngine.calculate(item, warnDaysLimit, pediatricWarnLimit);
                    return (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3.5 bg-stone-50 hover:bg-white hover:shadow-md rounded-2xl border border-stone-100/50 transition-all relative overflow-hidden group gap-3">
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${expiry.sideColor}`} />
                            
                            <div className="flex items-center gap-3 pl-2">
                                <ThucPhamPlateIcon type={item.category} />
                                <div>
                                    <h4 className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5 font-sans">
                                        {item.name}
                                        {item.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded-full font-bold">Nguyên liệu lạ</span>}
                                    </h4>
                                    <p className="text-[10px] font-bold text-stone-400 mt-0.5">SL: {item.quantity} | {item.compartment}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pl-2 sm:pl-0">
                                <div className="text-[9px] font-semibold text-stone-400 font-sans">Chuyển ngăn:</div>
                                <select
                                    value={item.compartment}
                                    onChange={(e) => handleQuickMoveCompartment(item.id, e.target.value)}
                                    className="border border-stone-200 rounded-lg text-[9px] font-black px-1.5 py-1 bg-white focus:outline-none font-sans"
                                >
                                    <option value="Ngăn mát">Ngăn mát</option>
                                    <option value="Ngăn đông">Ngăn đông</option>
                                    <option value="Ngăn rau củ">Ngăn rau củ</option>
                                    <option value="Ngăn đồ ăn dặm">Đồ bé 🍼</option>
                                    <option value="Cánh tủ">Cánh tủ</option>
                                </select>

                                <span className={`text-[9px] font-extrabold border px-2.5 py-1 rounded-full ${expiry.badgeStyle.textColor} ${expiry.badgeStyle.bgColor} ${expiry.badgeStyle.borderColor} ${expiry.isPulse ? 'alert-pulse animate-pulse' : ''}`}>
                                    {expiry.label}
                                </span>
                                <button onClick={() => handleDeleteFoodWithAuth(item.id)} className="text-stone-300 hover:text-red-500 transition-colors text-xs p-1">🗑️</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
```

#### Tệp `giao_dien_cong_cong/thanh_phan/bep_thong_minh.js`
```javascript
import { RecipeEngine } from '../dich_vu/dong_co_logic.js';

export default function BepThongMinh({ smartRecipes, handleCookRecipe, handleAddMissingIngredientToShopping, items, BasicDishes }) {
    return (
        <div className="flex-1 flex flex-col gap-4 animate-fade-in font-sans">
            <div className="bg-orange-50 border border-orange-200/60 p-4 rounded-2xl">
                <h4 className="text-xs font-black text-orange-950 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-sans">
                    <span>🚨</span> CHẾ ĐỘ GIẢI CỨU THỰC PHẨM SẮP HẾT HẠN
                </h4>
                <p className="text-[10px] text-orange-900 leading-relaxed font-semibold font-sans">
                    Hệ thống đề xuất thực đơn thông minh để ưu tiên giải quyết các nguyên liệu có nguy cơ quá hạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[300px] pr-1">
                {smartRecipes.map((item) => (
                    <div key={item.recipe.id || item.recipe.name} className="p-4 bg-white border border-stone-200/80 hover:border-amber-300 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-extrabold text-xs text-stone-800 flex items-center gap-1.5 font-sans">
                                    <span>{item.recipe.emoji || '🍳'}</span> {item.recipe.name}
                                </h4>
                                <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full font-sans">
                                    Khớp: {Math.round(item.matchScore * 100)}%
                                </span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-2 leading-relaxed font-sans">
                                {item.recipe.desc}
                            </p>

                            <div className="mt-3 space-y-1.5">
                                <div className="flex flex-wrap gap-1 items-center">
                                    <span className="text-[9px] font-black text-emerald-700 font-sans">Có sẵn:</span>
                                    {item.matchedIngredients.map(ing => (
                                        <span key={ing} className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded border border-emerald-100 font-bold font-sans">
                                            ✔ {ing}
                                        </span>
                                    ))}
                                </div>

                                {item.missingIngredients.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center font-sans">
                                        <span className="text-[9px] font-black text-rose-600">Còn thiếu:</span>
                                        {item.missingIngredients.map(ing => (
                                            <div key={ing} className="flex items-center gap-1">
                                                <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded border border-rose-100 font-bold">
                                                    ✘ {ing}
                                                </span>
                                                <button 
                                                    onClick={() => handleAddMissingIngredientToShopping(ing)}
                                                    className="text-[9px] text-blue-600 hover:underline font-extrabold"
                                                    title="Thêm vào danh sách đi chợ"
                                                >
                                                    [+ Mua]
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                            <button 
                                onClick={() => handleCookRecipe(item.recipe)}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-2 rounded-xl text-[10px] transition-all font-sans"
                            >
                                🔥 Xác nhận nấu (Tự động trừ kho)
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {items.some(i => i.isCustom) && (
                <div className="mt-2 bg-teal-50/60 border border-teal-200 p-4 rounded-2xl">
                    <h3 className="font-extrabold text-teal-900 text-xs flex items-center gap-1.5 uppercase tracking-wider mb-2">
                        <span>✨</span> Sáng tạo với nguyên liệu đặc biệt trong tủ
                    </h3>
                    <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                        {items.filter(i => i.isCustom).map((item, itemIdx) => (
                            <div key={itemIdx} className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-xs">
                                <span className="bg-teal-100 text-teal-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                    Nguyên liệu: {item.name}
                                </span>
                                <div className="mt-2 space-y-2">
                                    {RecipeEngine.generateForCustomIngredient(item.name).map((recipe, rIdx) => (
                                        <div key={rIdx} className="border-l-2 border-teal-400 pl-2 text-left">
                                            <h5 className="font-black text-stone-800 text-[11px]">{recipe.name}</h5>
                                            <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">{recipe.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h3 className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5 uppercase tracking-wider pt-2 border-t border-stone-100">
                <span>🍲</span> Danh mục các món ăn cơ bản hàng ngày
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                {BasicDishes.map((dish, idx) => (
                    <div key={idx} className="p-2 bg-stone-50 border border-stone-100 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-stone-800 text-xs">{dish.name}</h4>
                            <p className="text-[9px] text-stone-400 mt-0.5">{dish.desc}</p>
                        </div>
                        <span className="bg-stone-200/50 text-stone-600 font-bold text-[8px] px-2 py-0.5 rounded-full font-sans">
                            {dish.category}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
