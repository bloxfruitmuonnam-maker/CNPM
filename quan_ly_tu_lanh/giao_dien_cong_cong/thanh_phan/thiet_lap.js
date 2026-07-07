export default function ThietLap({ 
    monthlyHistoryData, stats, tempCooler, setTempCooler, 
    tempFreezer, setTempFreezer, ecoMode, handleToggleEco, 
    superCool, handleToggleSuperCool, warnDaysLimit, setWarnDaysLimit, 
    pediatricWarnLimit, setPediatricWarnLimit, notificationPermission, 
    handleRequestPermissionClick, runUnitTests, testResults, 
    handlePersonaNotificationTest 
}) {
    return (
        <div className="flex-1 space-y-6 animate-fade-in font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* THỐNG KÊ TIÊU THỤ & HAO HỤT */}
                <div className="space-y-6">
                    <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                        <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">📊 Thống kê tiêu thụ & lãng phí</h4>
                        
                        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-inner">
                            <p className="text-[10px] text-stone-400 font-black mb-4 uppercase tracking-wider">Tỉ lệ tiêu hao theo tháng (%)</p>
                            <div className="flex justify-between items-end h-28 px-2">
                                {monthlyHistoryData.map((data, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1">
                                        <div className="flex items-end gap-1.5 h-20 w-full justify-center">
                                            <div className="w-3 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-full" style={{ height: `${data.consumed}%` }} />
                                            <div className="w-3 bg-gradient-to-t from-orange-500 to-rose-400 rounded-t-full" style={{ height: `${data.wasted}%` }} />
                                        </div>
                                        <span className="text-[9px] font-black text-stone-400 mt-1.5">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-inner space-y-3">
                            <p className="text-[9px] text-stone-400 font-black uppercase tracking-wider">Cơ cấu danh mục thực phẩm hiện tại</p>
                            <div className="space-y-2">
                                {stats.distribution.map((dist, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-[9px] text-stone-500 font-extrabold">
                                            <span>{dist.category}</span>
                                            <span>{dist.percentage}% ({dist.count} món)</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-1 shadow-inner">
                                            <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full" style={{ width: `${dist.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* THIẾT LẬP VẬN HÀNH & CHẨN ĐOÁN */}
                <div className="space-y-6">
                    <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                        <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">⚙️ Điều khiển nhiệt độ thiết bị</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleToggleEco} className={`py-2 px-3 rounded-xl text-[10px] font-extrabold border transition-all ${ecoMode ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-stone-200'}`}>🍃 Chế độ Eco</button>
                            <button onClick={handleToggleSuperCool} className={`py-2 px-3 rounded-xl text-[10px] font-extrabold border transition-all ${superCool ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-stone-200'}`}>⚡ Làm lạnh nhanh</button>
                        </div>

                        <div className="space-y-4 bg-white p-4 rounded-2xl border border-stone-100">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-stone-500">Nhiệt độ ngăn mát</label>
                                    <span className="text-xs font-black text-emerald-700">{tempCooler}°C</span>
                                </div>
                                <input type="range" min="1" max="10" disabled={ecoMode || superCool} value={tempCooler} onChange={(e) => setTempCooler(Number(e.target.value))} className="w-full h-1.5 bg-stone-100 rounded-lg cursor-pointer accent-amber-500" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-stone-500">Nhiệt độ ngăn đông</label>
                                    <span className="text-xs font-black text-blue-700">{tempFreezer}°C</span>
                                </div>
                                <input type="range" min="-25" max="-10" disabled={ecoMode || superCool} value={tempFreezer} onChange={(e) => setTempFreezer(Number(e.target.value))} className="w-full h-1.5 bg-stone-100 rounded-lg cursor-pointer accent-amber-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                        <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">🔔 Cảnh báo thông minh & An toàn</h4>
                        
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-100">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-stone-500">Cảnh báo nghiêm ngặt đồ của bé:</span>
                                <input type="number" min="1" max="5" value={pediatricWarnLimit} onChange={(e) => setPediatricWarnLimit(Number(e.target.value))} className="w-12 border border-stone-200 rounded-lg py-1 text-center font-bold text-stone-700" />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-stone-500">Thời gian cảnh báo tiêu chuẩn:</span>
                                <select value={warnDaysLimit} onChange={(e) => setWarnDaysLimit(Number(e.target.value))} className="border border-stone-200 rounded-lg px-2 py-1 bg-white font-bold">
                                    <option value={2}>2 ngày</option>
                                    <option value={3}>3 ngày</option>
                                    <option value={5}>5 ngày</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-stone-100 space-y-2">
                            <button onClick={runUnitTests} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 rounded-xl text-[10px] flex items-center justify-center transition-all">🧪 Khởi chạy kiểm thử logic hệ thống</button>
                            {testResults && (
                                <div className="space-y-1 mt-2 text-[9px] animate-fade-in">
                                    {testResults.map((r, i) => (
                                        <div key={i} className="flex justify-between font-bold bg-stone-50 p-1.5 rounded border border-stone-200/40">
                                            <span>{r.name}</span>
                                            <span className={r.status === 'PASS' ? 'text-emerald-600' : 'text-red-500'}>● {r.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
```

#### Tệp `giao_dien_cong_cong/thanh_phan/hop_thoai_them.js`
```javascript
export default function HopThoaiThem({ showAddModal, setShowAddModal, newFood, setNewFood, handleAddManualItem }) {
    if (!showAddModal) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-3 animate-fade-in font-sans">
            <div className="bg-white rounded-[2.5rem] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-amber-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-base sm:text-lg text-amber-950">Thêm Thực Phẩm Mới</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                </div>
                <form onSubmit={handleAddManualItem} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-stone-400 mb-1">TÊN THỰC PHẨM</label>
                        <input type="text" required className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none font-bold text-stone-700 min-h-[40px]" placeholder="Thịt bò phi lê, sâm ngọc linh..." value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 mb-1">SỐ LƯỢNG</label>
                            <input type="text" required className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none font-bold text-stone-700 min-h-[40px]" placeholder="Ví dụ: 3 quả, 500g" value={newFood.quantity} onChange={(e) => setNewFood({...newFood, quantity: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 mb-1">DANH MỤC</label>
                            <select className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-xs focus:outline-none bg-white font-bold text-stone-600 min-h-[40px]" value={newFood.category} onChange={(e) => setNewFood({...newFood, category: e.target.value})}>
                                <option value="Thịt & Hải sản">Thịt & Hải sản 🥩</option>
                                <option value="Sữa & Đồ hộp">Sữa & Đồ hộp 🥛</option>
                                <option value="Rau củ & Trái cây">Rau củ & Trái cây 🍎</option>
                                <option value="Đồ khô & Chế biến sẵn">Đồ khô & Chế biến sẵn 🥫</option>
                                <option value="Đồ uống">Đồ uống 🍹</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 mb-1">VỊ TRÍ LƯU TRỮ</label>
                            <select className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-bold text-stone-600 min-h-[40px]" value={newFood.compartment} onChange={(e) => setNewFood({...newFood, compartment: e.target.value})}>
                                <option value="Ngăn mát">Ngăn mát</option>
                                <option value="Ngăn đông">Ngăn đông</option>
                                <option value="Ngăn rau củ">Ngăn rau củ</option>
                                <option value="Cánh tủ">Cánh tủ</option>
                                <option value="Ngăn đồ ăn dặm">Ngăn đồ ăn dặm 🍼</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-400 mb-1">HẠN SỬ DỤNG *(Để trống tự tính)*</label>
                            <input type="date" className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none text-stone-600 font-bold min-h-[40px]" value={newFood.expiryDate} onChange={(e) => setNewFood({...newFood, expiryDate: e.target.value})} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/15">Xác nhận bỏ vào tủ</button>
                </form>
            </div>
        </div>
    );
}
