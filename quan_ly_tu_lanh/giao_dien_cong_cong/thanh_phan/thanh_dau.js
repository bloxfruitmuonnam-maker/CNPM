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
