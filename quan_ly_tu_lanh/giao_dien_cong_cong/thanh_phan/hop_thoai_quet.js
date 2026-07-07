export default function HopThoaiQuet({ scannerCameraSimulation, setScannerCameraSimulation, barcodeDatabase, isScanning, startBarcodeScanSimulation }) {
    if (!scannerCameraSimulation) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50 p-4 backdrop-blur-md font-sans">
            <div className="bg-stone-900 rounded-[2.5rem] max-w-lg w-full p-6 border border-stone-800 shadow-2xl relative overflow-hidden">
                <button onClick={() => setScannerCameraSimulation(false)} className="absolute top-6 right-6 text-stone-400 hover:text-white font-extrabold text-sm z-10">✕ Đóng camera</button>
                
                <div className="text-center mb-4">
                    <h3 className="text-white font-extrabold text-lg flex items-center justify-center gap-2">🔴 Trình Quét Mã Vạch Hàng Tiêu Dùng</h3>
                    <p className="text-stone-400 text-[11px] mt-1">Đưa mã vạch của sản phẩm vào khung quét để nhận diện tự động</p>
                </div>

                <div className="relative w-full h-64 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-950/70 to-stone-900/40 opacity-80"></div>
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] laser-line z-10"></div>
                    <div className="border-2 border-dashed border-emerald-400 w-64 h-32 rounded-lg relative flex flex-col justify-between p-2 z-10">
                        <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest text-center self-center uppercase animate-pulse">Đang rà soát Barcode...</span>
                        <div className="flex justify-between text-stone-500 font-mono text-[9px]">
                            <span>[UPC-EAN]</span>
                            <span>100% FOCUS</span>
                        </div>
                    </div>

                    {isScanning && (
                        <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center gap-3 z-20">
                            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-emerald-400 text-xs font-black animate-pulse">ĐANG PHÂN TÍCH THÔNG TIN SẢN PHẨM...</p>
                        </div>
                    )}
                </div>

                <div className="mt-5 space-y-3">
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Chọn sản phẩm mẫu thực tế để quét:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(barcodeDatabase).map(([code, info]) => (
                            <button
                                key={code}
                                disabled={isScanning}
                                onClick={() => startBarcodeScanSimulation(code)}
                                className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white p-2.5 rounded-xl text-left border border-stone-700 transition flex flex-col justify-between gap-1 disabled:opacity-50 min-h-[58px]"
                            >
                                <div className="flex justify-between items-center w-full font-sans">
                                    <span className="font-extrabold text-[11px] truncate max-w-[140px]">{info.name}</span>
                                    <span className="text-[8px] bg-stone-900 text-amber-500 px-1 rounded font-bold">{info.compartment}</span>
                                </div>
                                <span className="font-mono text-[9px] text-stone-500">Barcode: {code}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
```

#### Tệp `giao_dien_cong_cong/thanh_phan/hop_thoai_qr.js`
```javascript
export default function HopThoaiQr({ showQRModal, setShowQRModal, qrSyncData, simulateScanningOtherMemberQR, setLiveActivityToast }) {
    if (!showQRModal) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50 p-4 backdrop-blur-md font-sans">
            <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 border border-amber-100 shadow-2xl text-center relative animate-fade-in">
                <button onClick={() => setShowQRModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 font-bold">✕</button>
                <span className="text-4xl block mb-2">🔗</span>
                <h3 className="font-extrabold text-stone-900 text-lg">Đồng bộ Tủ lạnh phòng chung</h3>
                <p className="text-stone-500 text-[11px] mt-1 leading-relaxed px-4">Quét mã QR bằng điện thoại của thành viên để tự động đồng bộ hóa danh sách thực phẩm thời gian thực.</p>

                <div className="my-6 flex justify-center">
                    <div className="p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrSyncData)}`} 
                            alt="Mã QR đồng bộ FreshKeep"
                            className="w-44 h-44 object-contain rounded-xl bg-white p-1"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <button onClick={simulateScanningOtherMemberQR} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3 rounded-2xl text-xs transition shadow-md">📲 Thử quét mã QR của thành viên khác</button>
                    <button onClick={() => {
                        navigator.clipboard.writeText(qrSyncData);
                        setLiveActivityToast("Đã sao chép liên kết đồng bộ.");
                    }} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 rounded-xl text-xs">Sao chép đường dẫn đồng bộ</button>
                </div>
            </div>
        </div>
    );
}
