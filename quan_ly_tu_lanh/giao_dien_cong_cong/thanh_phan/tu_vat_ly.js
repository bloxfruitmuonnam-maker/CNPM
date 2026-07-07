import { ExpiryEngine } from '../dich_vu/dong_co_logic.js';

export default function TuVatLy({ items, freezerSensorTemp, coolerSensorTemp, warnDaysLimit, pediatricWarnLimit }) {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 border-2 border-amber-200/40 shadow-xl flex flex-col gap-5 w-full font-sans">
            <h3 className="text-center font-extrabold text-amber-950 text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                <span>🧊</span> Tủ lạnh vật lý 400L tiêu chuẩn
            </h3>

            {/* Ngăn đông */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/5 border border-blue-200/50 rounded-2xl p-4 min-h-[130px] hover:shadow-md transition-all">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                    ❄️ Ngăn đông • <strong className="text-blue-800 animate-pulse">{freezerSensorTemp}°C</strong>
                </span>
                <div className="flex flex-wrap gap-2 mt-3">
                    {items.filter(i => i.compartment === 'Ngăn đông').map(i => (
                        <span key={i.id} className="bg-white/95 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 shadow-sm border border-blue-100 flex items-center hover:scale-105 transition-all">
                            📦 {i.name} {i.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded ml-1 font-black">Lạ</span>}
                        </span>
                    ))}
                </div>
            </div>

            {/* Ngăn đồ ăn dặm */}
            <div className="bg-gradient-to-br from-rose-500/10 to-pink-400/5 border border-rose-200/50 rounded-2xl p-4 min-h-[110px] hover:shadow-md transition-all">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                    🍼 Ngăn đồ ăn dặm cho bé 🚨
                </span>
                <div className="flex flex-wrap gap-2 mt-3">
                    {items.filter(i => i.compartment === 'Ngăn đồ ăn dặm').map(i => {
                        const expiry = ExpiryEngine.calculate(i, warnDaysLimit, pediatricWarnLimit);
                        return (
                            <span key={i.id} className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center hover:scale-105 transition-all ${expiry.daysRemaining <= pediatricWarnLimit ? 'bg-red-500 text-white alert-pulse' : 'bg-white text-stone-700'}`}>
                                👶 {i.name} {i.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded ml-1 font-black">Lạ</span>}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Ngăn mát */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-400/5 border border-emerald-200/50 rounded-2xl p-4 min-h-[160px] flex-1 flex flex-col hover:shadow-md transition-all">
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    🥗 Ngăn mát • <strong className="text-emerald-800 animate-pulse">{coolerSensorTemp}°C</strong>
                </span>
                <div className="flex flex-wrap gap-2 mt-3 flex-1 align-content-start">
                    {items.filter(i => i.compartment === 'Ngăn mát').map(i => (
                        <span key={i.id} className="bg-white/95 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 shadow-sm border border-emerald-100 flex items-center hover:scale-105 transition-all">
                            🥦 {i.name} {i.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded ml-1 font-black">Lạ</span>}
                        </span>
                    ))}
                </div>
            </div>

            {/* Ngăn rau củ */}
            <div className="bg-gradient-to-br from-green-500/10 to-lime-400/5 border border-green-200/50 rounded-2xl p-4 min-h-[110px] hover:shadow-md transition-all">
                <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                    🥬 Ngăn rau củ (Độ ẩm cao)
                </span>
                <div className="flex flex-wrap gap-2 mt-3">
                    {items.filter(i => i.compartment === 'Ngăn rau củ').map(i => (
                        <span key={i.id} className="bg-white/95 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 shadow-sm border border-green-100 flex items-center hover:scale-105 transition-all">
                            🥦 {i.name} {i.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded ml-1 font-black">Lạ</span>}
                        </span>
                    ))}
                </div>
            </div>

            {/* Cánh tủ */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-400/5 border border-orange-200/50 rounded-2xl p-4 min-h-[130px] hover:shadow-md transition-all">
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                    🥛 Cánh tủ
                </span>
                <div className="flex flex-wrap gap-2 mt-3">
                    {items.filter(i => i.compartment === 'Cánh tủ').map(i => (
                        <span key={i.id} className="bg-white/95 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 shadow-sm border border-orange-100 flex items-center hover:scale-105 transition-all">
                            🧴 {i.name} {i.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 rounded ml-1 font-black">Lạ</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
