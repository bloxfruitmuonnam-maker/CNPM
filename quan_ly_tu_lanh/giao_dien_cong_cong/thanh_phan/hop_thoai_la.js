import { RecipeEngine } from '../dich_vu/dong_co_logic.js';

export default function HopThoaiLa({ strangeItemToConfirm, setStrangeItemToConfirm, handleConfirmStrangeIngredient }) {
    if (!strangeItemToConfirm) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-50 backdrop-blur-sm p-3 animate-fade-in font-sans">
            <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] max-w-md w-full p-6 shadow-2xl border-t sm:border border-amber-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-5">
                    <span className="text-4xl block mb-2">🧐</span>
                    <h3 className="font-black text-lg text-stone-900">Phát Hiện Nguyên Liệu Lạ!</h3>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-1">Món <strong>"{strangeItemToConfirm.name}"</strong> không có trong danh mục chuẩn. Thiết lập cấu hình bảo quản:</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-stone-400 mb-1">NGĂN LƯU TRỮ CHỈ ĐỊNH</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Ngăn mát', 'Ngăn đông', 'Cánh tủ', 'Ngăn rau củ'].map(comp => (
                                <button
                                    key={comp}
                                    type="button"
                                    onClick={() => setStrangeItemToConfirm({...strangeItemToConfirm, compartment: comp})}
                                    className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all ${strangeItemToConfirm.compartment === comp ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm' : 'bg-stone-50 border-stone-100 text-stone-600'}`}
                                >
                                    {comp}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-stone-400 mb-1">THỜI HẠN BẢO QUẢN THIẾT LẬP</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { days: 3, label: '3 ngày (Ngắn)' },
                                { days: 7, label: '7 ngày (Chuẩn)' },
                                { days: 30, label: '30 ngày (Dài)' }
                            ].map(opt => {
                                const targetDate = new Date();
                                targetDate.setDate(targetDate.getDate() + opt.days);
                                const dateString = targetDate.toISOString().split('T')[0];

                                return (
                                    <button
                                        key={opt.days}
                                        type="button"
                                        onClick={() => setStrangeItemToConfirm({...strangeItemToConfirm, expiryDate: dateString})}
                                        className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all ${strangeItemToConfirm.expiryDate === dateString ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm' : 'bg-stone-50 border-stone-100 text-stone-600'}`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
                        <button type="button" onClick={() => setStrangeItemToConfirm(null)} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl text-xs">Hủy bỏ</button>
                        <button 
                            type="button" 
                            onClick={() => {
                                const today = new Date(); today.setHours(0,0,0,0);
                                const exp = new Date(strangeItemToConfirm.expiryDate); exp.setHours(0,0,0,0);
                                const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                handleConfirmStrangeIngredient(strangeItemToConfirm.compartment, diff > 0 ? diff : 5, strangeItemToConfirm.isPediatricCritical);
                            }} 
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md"
                        >Xác nhận cất tủ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
