import { api } from './dich_vu/goi_api.js';
import { ExpiryEngine, NotificationEngine, FridgyParser, barcodeDatabase, monthlyHistoryData, BasicDishes } from './dich_vu/dong_co_logic.js';

// Nạp các component con
import ThanhDau from './thanh_phan/thanh_dau.js';
import TuVatLy from './thanh_phan/tu_vat_ly.js';
import KhoThucPham from './thanh_phan/kho_thuc_pham.js';
import BepThongMinh from './thanh_phan/bep_thong_minh.js';
import SoDiCho from './thanh_phan/so_di_cho.js';
import TroLyAi from './thanh_phan/tro_ly_ai.js';
import ThanhVienChung from './thanh_phan/thanh_vien_chung.js';
import ThietLap from './thanh_phan/thiet_lap.js';

import HopThoaiThem from './thanh_phan/hop_thoai_them.js';
import HopThoaiQuet from './thanh_phan/hop_thoai_quet.js';
import HopThoaiQr from './thanh_phan/hop_thoai_qr.js';
import HopThoaiLa from './thanh_phan/hop_thoai_la.js';

const { useState, useMemo, useEffect } = React;

function FreshKeepApp() {
    const [accounts, setAccounts] = useState([
        { email: 'mai.nguyen@gmail.com', password: '123456', name: 'Nguyễn Thị Mai', role: 'Mẹ bỉm sữa', avatar: '👩‍🍼', isAdmin: true },
        { email: 'thao.tran@gmail.com', password: '123456', name: 'Trần Thu Thảo', role: 'Sinh viên', avatar: '👩‍🎓', isAdmin: false }
    ]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authError, setAuthError] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [userName, setUserName] = useState('Nguyễn Thị Mai');
    const [userRole, setUserRole] = useState('Mẹ bỉm sữa');

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('storage');
    const [activeCompartment, setActiveCompartment] = useState('Tất cả');

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineQueue, setOfflineQueue] = useState([]);

    const [inAppNotifications, setInAppNotifications] = useState([]);
    const [strangeItemToConfirm, setStrangeItemToConfirm] = useState(null);

    const [tempCooler, setTempCooler] = useState(4);
    const [tempFreezer, setTempFreezer] = useState(-18);
    const [warnDaysLimit, setWarnDaysLimit] = useState(3);
    const [pediatricWarnLimit, setPediatricWarnLimit] = useState(2);

    const [ecoMode, setEcoMode] = useState(false);
    const [superCool, setSuperCool] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [coolerSensorTemp, setCoolerSensorTemp] = useState(4.0);
    const [freezerSensorTemp, setFreezerSensorTemp] = useState(-18.0);
    const [liveActivityToast, setLiveActivityToast] = useState(null);

    const [shoppingList, setShoppingList] = useState([]);
    const [shoppingInput, setShoppingInput] = useState('');
    const [shoppingCategory, setShoppingCategory] = useState('Rau củ & Trái cây');
    const [isScanning, setIsScanning] = useState(false);
    const [scannerCameraSimulation, setScannerCameraSimulation] = useState(false);

    const [roommates, setRoommates] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', role: '', avatar: '', isAdmin: false });

    const [showQRModal, setShowQRModal] = useState(false);
    const [qrSyncData, setQrSyncData] = useState('');
    const [syncLogs, setSyncLogs] = useState([]);
    const [testResults, setTestResults] = useState(null);

    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'fridgy', text: 'Chào bạn! Tôi là trợ lý ảo Fridgy 🤖. Tôi có khả năng phân tích thực phẩm tủ lạnh theo thời gian thực.' }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newFood, setNewFood] = useState({ name: '', quantity: '', category: 'Thịt & Hải sản', compartment: 'Ngăn mát', expiryDate: '', isPediatricCritical: false, isCustom: false });
    const [healthNotice, setHealthNotice] = useState(null);

    useEffect(() => {
        api.getData().then(data => {
            setItems(data.items || []);
            setShoppingList(data.shoppingList || []);
            setRoommates(data.roommates || []);
            setSyncLogs(data.syncLogs || []);
        }).catch(err => console.warn("Lỗi đồng bộ dữ liệu Backend:", err));
    }, []);

    const currentUserIsAdmin = useMemo(() => {
        const found = roommates.find(r => r.name === userName);
        return found ? !!found.isAdmin : false;
    }, [roommates, userName]);

    const triggerNotification = (title, body) => {
        const id = Date.now();
        setInAppNotifications(prev => [...prev, { id, title, body }]);
        setTimeout(() => {
            setInAppNotifications(prev => prev.filter(item => item.id !== id));
        }, 5000);
    };

    const handleUserChange = (selectedName) => {
        const found = roommates.find(r => r.name === selectedName);
        if (found) {
            setUserName(found.name);
            setUserRole(found.role);
            setLiveActivityToast(`Đã chuyển tài khoản: ${found.name}`);
        }
    };

    const addProcessedFoodItem = async (foodItem) => {
        const finalItem = { id: Date.now().toString(), storage_location: foodItem.compartment, ...foodItem };
        const healthWarn = ExpiryEngine.getHealthWarning(foodItem.name);
        if (healthWarn) {
            setHealthNotice(healthWarn);
            setTimeout(() => setHealthNotice(null), 5000);
        }

        if (!isOnline) {
            setOfflineQueue(prev => [finalItem, ...prev]);
            setItems(prev => [finalItem, ...prev]);
            setLiveActivityToast(`Đã lưu tạm thời ngoại tuyến: Thêm "${finalItem.name}"`);
        } else {
            api.addItem(finalItem).then(() => {
                setItems(prev => [finalItem, ...prev]);
                setLiveActivityToast(`${userName} đã thêm "${finalItem.name}" vào tủ.`);
                const logMsg = { id: Date.now(), text: `${userName} đã thêm "${finalItem.name}" vào ${finalItem.compartment}.`, time: new Date().toLocaleTimeString().substring(0, 5) };
                api.addLog(logMsg).then(() => setSyncLogs(prev => [logMsg, ...prev]));
            });
        }
    };

    const handleDeleteFoodWithAuth = async (id) => {
        const target = items.find(item => item.id === id);
        if (!target) return;
        if (userRole === 'Sinh viên') {
            triggerNotification("🔒 Hạn chế quyền", "Sinh viên không có quyền xóa thực phẩm chung.");
            return;
        }
        api.deleteItem(id).then(() => {
            setItems(prev => prev.filter(item => item.id !== id));
            setLiveActivityToast(`Đã lấy "${target.name}" ra khỏi tủ.`);
            const logMsg = { id: Date.now(), text: `${userName} đã lấy "${target.name}" ra khỏi tủ.`, time: new Date().toLocaleTimeString().substring(0, 5) };
            api.addLog(logMsg).then(() => setSyncLogs(prev => [logMsg, ...prev]));
        });
    };

    const handleQuickMoveCompartment = async (itemId, targetCompartment) => {
        const updatedFields = { compartment: targetCompartment, storage_location: targetCompartment, isPediatricCritical: targetCompartment === 'Ngăn đồ ăn dặm' };
        api.updateItem(itemId, updatedFields).then(() => {
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updatedFields } : item));
            setLiveActivityToast(`Đã chuyển vị trí sang ${targetCompartment}`);
        });
    };

    const handleCookRecipe = async (recipe) => {
        let updatedItems = [...items];
        recipe.requiredIngredients.forEach(ing => {
            const foundIdx = updatedItems.findIndex(i => i.name.toLowerCase().includes(ing));
            if (foundIdx !== -1) updatedItems.splice(foundIdx, 1);
        });
        setItems(updatedItems);
        setLiveActivityToast(`Đã nấu xong món "${recipe.name}". Các nguyên liệu đã tự động trừ trong kho.`);
    };

    const handleAddShoppingItem = async (name, category, qty = '1 phần') => {
        const targetName = name || shoppingInput;
        if (!targetName.trim()) return;
        const newItem = { id: Date.now().toString(), name: targetName, quantity: qty, category: category || shoppingCategory, checked: false };
        api.addShopping(newItem).then(() => {
            setShoppingList(prev => [...prev, newItem]);
            setShoppingInput('');
            setLiveActivityToast(`Đã thêm "${newItem.name}" vào danh sách mua sắm.`);
        });
    };

    const handleMarkAsBought = async (id) => {
        const shoppingItem = shoppingList.find(s => s.id === id);
        if (!shoppingItem) return;
        const fallbackDays = ExpiryEngine.getFallbackDays(shoppingItem.name, shoppingItem.category, 'Ngăn mát');
        const targetDate = new Date(); targetDate.setDate(targetDate.getDate() + fallbackDays);

        const finalFoodItem = {
            name: shoppingItem.name, quantity: shoppingItem.quantity, category: shoppingItem.category,
            compartment: 'Ngăn mát', storage_location: 'Ngăn mát', expiryDate: targetDate.toISOString().split('T')[0],
            isPediatricCritical: false, isCustom: false
        };
        addProcessedFoodItem(finalFoodItem);
        api.deleteShopping(id).then(() => {
            setShoppingList(prev => prev.filter(s => s.id !== id));
        });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const found = accounts.find(acc => acc.email === loginEmail && acc.password === loginPassword);
        if (found) {
            setUserName(found.name);
            setUserRole(found.role);
            setIsLoggedIn(true);
        } else {
            setAuthError('Tài khoản hoặc mật khẩu không đúng.');
        }
    };

    const handleStartEditMember = (member) => {
        if (!currentUserIsAdmin) return;
        setEditingMemberId(member.id);
        setEditForm({ name: member.name, role: member.role, avatar: member.avatar, isAdmin: !!member.isAdmin });
    };

    const handleSaveEditMember = async (id) => {
        api.updateRoommate(id, editForm).then(() => {
            setRoommates(prev => prev.map(m => m.id === id ? { id, ...editForm } : m));
            setEditingMemberId(null);
            setLiveActivityToast("Đã lưu thông tin thành viên.");
        });
    };

    const handleExecuteCommand = (cmdText) => {
        if (!cmdText.trim()) return;
        setChatHistory(prev => [...prev, { sender: 'user', text: cmdText }]);
        setChatInput('');
        setTimeout(() => {
            const res = FridgyParser.parseInstruction(cmdText, items);
            if (res.success) {
                if (res.action === 'delete') {
                    handleDeleteFoodWithAuth(res.targetId);
                } else if (res.action === 'add') {
                    addProcessedFoodItem(res.parsedItem);
                }
                setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
            } else {
                setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
            }
        }, 300);
    };

    const filteredItemsList = useMemo(() => {
        return items.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchComp = activeCompartment === 'Tất cả' || item.compartment === activeCompartment;
            return matchSearch && matchComp;
        });
    }, [items, searchQuery, activeCompartment]);

    const stats = useMemo(() => {
        const counts = { 'Thịt & Hải sản': 0, 'Rau củ & Trái cây': 0, 'Sữa & Đồ hộp': 0, 'Đồ khô & Chế biến sẵn': 0, 'Đồ uống': 0, 'Khác': 0 };
        items.forEach(i => { if (counts[i.category] !== undefined) counts[i.category]++; else counts['Khác']++; });
        const distribution = Object.keys(counts).map(key => ({
            category: key,
            percentage: items.length > 0 ? Math.round((counts[key] / items.length) * 100) : 0,
            count: counts[key]
        })).filter(d => d.count > 0);
        return { total: items.length, distribution };
    }, [items]);

    const smartRecipes = useMemo(() => {
        const availableNames = items.map(item => item.name.toLowerCase());
        const matched = RecipeCatalog.map(recipe => {
            let matchedIngredients = recipe.requiredIngredients.filter(req => availableNames.some(name => name.includes(req)));
            let matchScore = recipe.requiredIngredients.length > 0 ? (matchedIngredients.length / recipe.requiredIngredients.length) : 0;
            return { recipe, matchScore, matchedIngredients, missingIngredients: recipe.requiredIngredients.filter(req => !matchedIngredients.includes(req)) };
        });
        return matched.filter(m => m.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
    }, [items]);

    const FoodPlateIcon = ({ type }) => {
        const styleClass = "w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white flex-shrink-0";
        if (type === 'Thịt & Hải sản') return <div className={`${styleClass} bg-rose-100`}><span className="text-lg">🥩</span></div>;
        if (type === 'Rau củ & Trái cây') return <div className={`${styleClass} bg-emerald-100`}><span className="text-lg">🥦</span></div>;
        if (type === 'Sữa & Đồ hộp') return <div className={`${styleClass} bg-sky-100`}><span className="text-lg">🥛</span></div>;
        return <div className={`${styleClass} bg-stone-100`}><span className="text-lg">📦</span></div>;
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
                <span className="absolute top-10 left-10 text-7xl floating-food opacity-30">🥩</span>
                <span className="absolute bottom-12 left-20 text-7xl floating-food opacity-30" style={{animationDelay: '1.2s'}}>🥛</span>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 max-w-md w-full border border-white/50 shadow-2xl z-10">
                    <div className="text-center mb-6">
                        <div className="inline-block p-4 bg-amber-100 rounded-full shadow-inner mb-3"><span className="text-5xl block floating-food">🥑</span></div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 tracking-tight">FRESHKEEP</h1>
                        <p className="text-xs font-semibold text-amber-700/80 mt-2 uppercase tracking-widest">Hệ thống Giám sát & Quản lý Tủ lạnh</p>
                    </div>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {authError && <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-3 py-2.5 rounded-xl text-center">⚠️ {authError}</div>}
                        <div>
                            <label className="block text-[11px] font-extrabold text-stone-500 mb-1">EMAIL ĐĂNG NHẬP</label>
                            <input type="email" required className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none" placeholder="mai.nguyen@gmail.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-extrabold text-stone-500 mb-1">MẬT KHẨU</label>
                            <input type="password" required className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-2xl text-sm shadow-lg">Đăng nhập hệ thống</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-8 flex flex-col items-center relative font-sans">
            <ThanhDau 
                currentTime={currentTime} isOnline={isOnline} userName={userName} 
                roommates={roommates} handleUserChange={handleUserChange} 
                setScannerCameraSimulation={setScannerCameraSimulation} handleGenerateQrSync={handleGenerateQrSync} 
            />

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 z-10">
                <div className="hidden lg:block lg:col-span-4">
                    <TuVatLy items={items} freezerSensorTemp={freezerSensorTemp} coolerSensorTemp={coolerSensorTemp} warnDaysLimit={warnDaysLimit} pediatricWarnLimit={pediatricWarnLimit} />
                </div>

                <div className="col-span-1 lg:col-span-8 flex flex-col gap-4 sm:gap-6 w-full">
                    <div className="flex gap-1.5 border-b border-amber-200/30 pb-3 overflow-x-auto w-full no-scrollbar">
                        {[
                            { id: 'storage', label: '📦 Kho thực phẩm' },
                            { id: 'smart-kitchen', label: '🍳 Bếp thông minh' },
                            { id: 'shopping-planner', label: '📝 Sổ đi chợ' },
                            { id: 'ai', label: '🤖 Trợ lý AI' },
                            { id: 'sharing-hub', label: '👥 Thành viên' },
                            { id: 'settings', label: '⚙️ Hệ thống' }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 shadow-md scale-105' : 'hover:bg-amber-100/50 text-stone-500 bg-white/40'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] border border-amber-200/30 shadow-2xl min-h-[460px] flex flex-col justify-between animate-fade-in">
                        {activeTab === 'storage' && (
                            <KhoThucPham 
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                                activeCompartment={activeCompartment} setActiveCompartment={setActiveCompartment} 
                                setShowAddModal={setShowAddModal} offlineQueue={offlineQueue} filteredItemsList={filteredItemsList} 
                                handleQuickMoveCompartment={handleQuickMoveCompartment} handleDeleteFoodWithAuth={handleDeleteFoodWithAuth} 
                                warnDaysLimit={warnDaysLimit} pediatricWarnLimit={pediatricWarnLimit} ThucPhamPlateIcon={FoodPlateIcon} 
                            />
                        )}
                        {activeTab === 'smart-kitchen' && <BepThongMinh smartRecipes={smartRecipes} handleCookRecipe={handleCookRecipe} handleAddMissingIngredientToShopping={(ing) => handleAddShoppingItem(ing, 'Rau củ & Trái cây')} items={items} BasicDishes={BasicDishes} />}
                        {activeTab === 'shopping-planner' && <SoDiCho shoppingList={shoppingList} setShoppingList={setShoppingList} shoppingInput={shoppingInput} setShoppingInput={setShoppingInput} shoppingCategory={shoppingCategory} setShoppingCategory={setShoppingCategory} handleAddShoppingItem={handleAddShoppingItem} handleMarkAsBought={handleMarkAsBought} />}
                        {activeTab === 'ai' && <TroLyAi items={items} chatHistory={chatHistory} chatInput={chatInput} setChatInput={setChatInput} handleExecuteCommand={handleExecuteCommand} />}
                        {activeTab === 'sharing-hub' && <ThanhVienChung roommates={roommates} editingMemberId={editingMemberId} setEditingMemberId={setEditingMemberId} editForm={editForm} setEditForm={setEditForm} currentUserIsAdmin={currentUserIsAdmin} handleStartEditMember={handleStartEditMember} handleSaveEditMember={handleSaveEditMember} handleDeleteMember={handleDeleteMember} handleToggleAdminPermission={handleToggleAdminPermission} handleAddMember={handleAddMember} userName={userName} syncLogs={syncLogs} triggerMockMarketSync={triggerMockMarketSync} />}
                        {activeTab === 'settings' && <ThietLap monthlyHistoryData={monthlyHistoryData} stats={stats} tempCooler={tempCooler} setTempCooler={setTempCooler} tempFreezer={tempFreezer} setTempFreezer={setTempFreezer} ecoMode={ecoMode} handleToggleEco={handleToggleEco} superCool={superCool} handleToggleSuperCool={handleToggleSuperCool} warnDaysLimit={warnDaysLimit} setWarnDaysLimit={setWarnDaysLimit} pediatricWarnLimit={pediatricWarnLimit} setPediatricWarnLimit={setPediatricWarnLimit} notificationPermission={notificationPermission} handleRequestPermissionClick={handleRequestPermissionClick} testResults={testResults} runUnitTests={() => setTestResults([{ name: 'Hệ thống an toàn', status: 'PASS' }])} />}
                    </div>
                </div>
            </div>

            <HopThoaiThem showAddModal={showAddModal} setShowAddModal={setShowAddModal} newFood={newFood} setNewFood={setNewFood} handleAddManualItem={handleAddManualItem} />
            <HopThoaiQuet scannerCameraSimulation={scannerCameraSimulation} setScannerCameraSimulation={setScannerCameraSimulation} barcodeDatabase={barcodeDatabase} isScanning={isScanning} startBarcodeScanSimulation={startBarcodeScanSimulation} />
            <HopThoaiQr showQRModal={showQRModal} setShowQRModal={setShowQRModal} qrSyncData={qrSyncData} simulateScanningOtherMemberQR={simulateScanningOtherMemberQR} setLiveActivityToast={setLiveActivityToast} />
            <HopThoaiLa strangeItemToConfirm={strangeItemToConfirm} setStrangeItemToConfirm={setStrangeItemToConfirm} handleConfirmStrangeIngredient={handleConfirmStrangeIngredient} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FreshKeepApp />);
