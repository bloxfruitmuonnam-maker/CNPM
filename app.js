javascript
const { useState, useMemo, useEffect } = React;

function FreshKeepApp() {
    const [accounts, setAccounts] = useState([
        { email: 'mai.nguyen@gmail.com', password: '123456', name: 'Nguyễn Thị Mai', role: 'Mẹ bỉm sữa', avatar: '👩‍🍼', isAdmin: true },
        { email: 'thao.tran@gmail.com', password: '123456', name: 'Trần Thu Thảo', role: 'Sinh viên', avatar: '👩‍🎓', isAdmin: false },
        { email: 'bo.tre@gmail.com', password: '123456', name: 'Bố trẻ nhỏ', role: 'Chồng', avatar: '🙋‍♂️', isAdmin: false }
    ]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authError, setAuthError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerRole, setRegisterRole] = useState('Thành viên');
    const [registerAvatar, setRegisterAvatar] = useState('👤');

    const [userName, setUserName] = useState('Nguyễn Thị Mai');
    const [userRole, setUserRole] = useState('Mẹ bỉm sữa');

    const [items, setItems] = useState(window.initialFoodItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('storage'); 
    const [activeCompartment, setActiveCompartment] = useState('Tất cả');

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineQueue, setOfflineQueue] = useState([]);

    const [notificationPermission, setNotificationPermission] = useState(window.NotificationEngine.getPermissionState());
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

    const [shoppingList, setShoppingList] = useState([
        { id: 's1', name: 'Trứng gà tươi', quantity: '10 quả', category: 'Sữa & Đồ hộp', checked: false },
        { id: 's2', name: 'Rau chân vịt', quantity: '2 bó', category: 'Rau củ & Trái cây', checked: false }
    ]);
    const [shoppingInput, setShoppingInput] = useState('');
    const [shoppingCategory, setShoppingCategory] = useState('Rau củ & Trái cây');
    const [isScanning, setIsScanning] = useState(false);
    const [scannerCameraSimulation, setScannerCameraSimulation] = useState(false);

    const [roommates, setRoommates] = useState([
        { id: 'u1', name: 'Nguyễn Thị Mai', avatar: '👩‍🍼', role: 'Mẹ bỉm sữa', isAdmin: true },
        { id: 'u2', name: 'Trần Thu Thảo', avatar: '👩‍🎓', role: 'Sinh viên', isAdmin: false },
        { id: 'u3', name: 'Bố trẻ nhỏ', avatar: '🙋‍♂️', role: 'Chồng', isAdmin: false }
    ]);
    const [inviteName, setInviteName] = useState('');
    const [inviteRole, setInviteRole] = useState('Thành viên');
    const [inviteAvatar, setInviteAvatar] = useState('👤');
    const [inviteIsAdmin, setInviteIsAdmin] = useState(false);

    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', role: '', avatar: '', isAdmin: false });

    const [showQRModal, setShowQRModal] = useState(false);
    const [qrSyncData, setQrSyncData] = useState('');
    const [syncLogs, setSyncLogs] = useState([
        { id: 1, text: 'Hệ thống đã sẵn sàng và kết nối cơ sở dữ liệu chung.', time: '10:00 AM' }
    ]);

    const [testResults, setTestResults] = useState(null);

    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'fridgy', text: 'Chào bạn! Tôi là trợ lý ảo Fridgy 🤖. Tôi có khả năng kiểm tra hạn dùng, phân tích món ăn thực tế và gợi ý thực đơn thích hợp nhất dựa trên thực phẩm đang có trong tủ lạnh của bạn.' }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newFood, setNewFood] = useState({ name: '', quantity: '', category: 'Thịt & Hải sản', compartment: 'Ngăn mát', expiryDate: '', isPediatricCritical: false, isCustom: false });
    const [healthNotice, setHealthNotice] = useState(null);

    const tabs = [
        { id: 'storage', label: '📦 Kho thực phẩm' },
        { id: 'fridge', label: '🧊 Tủ vật lý' },
        { id: 'smart-kitchen', label: '🍳 Bếp thông minh' },
        { id: 'shopping-planner', label: '📝 Sổ đi chợ' },
        { id: 'ai', label: '🤖 Trợ lý AI' },
        { id: 'sharing-hub', label: '👥 Thành viên & Đồng bộ' },
        { id: 'settings', label: '⚙️ Cài đặt & Hệ thống' }
    ];

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

    const playScanBeep = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = 1000;
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.08);
        } catch (err) {
            console.log("Web Audio API chưa được cấp quyền từ tương tác người dùng:", err);
        }
    };

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setLiveActivityToast("Đã kết nối Internet. Chuyển sang trực tuyến.");
        };
        const handleOffline = () => {
            setIsOnline(false);
            setLiveActivityToast("Đã ngắt kết nối Internet. Chuyển sang chế độ ngoại tuyến.");
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(navigator.onLine);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (liveActivityToast) {
            const timer = setTimeout(() => {
                setLiveActivityToast(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [liveActivityToast]);

    useEffect(() => {
        if (isOnline && offlineQueue.length > 0) {
            setItems(prev => [...offlineQueue, ...prev]);
            window.NotificationEngine.sendPush(
                "Đã đồng bộ hóa! 🟢",
                `Đồng bộ thành công ${offlineQueue.length} thực phẩm mới từ hàng đợi ngoại tuyến.`,
                triggerNotification
            );
            setOfflineQueue([]);
        }
    }, [isOnline, offlineQueue]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const sensorTimer = setInterval(() => {
            setCoolerSensorTemp((tempCooler + (Math.random() * 0.4 - 0.2)).toFixed(1));
            setFreezerSensorTemp((tempFreezer + (Math.random() * 0.6 - 0.3)).toFixed(1));
        }, 3000);
        return () => clearInterval(sensorTimer);
    }, [tempCooler, tempFreezer]);

    const handleUserChange = (selectedName) => {
        const found = roommates.find(r => r.name === selectedName);
        if (found) {
            setUserName(found.name);
            setUserRole(found.role);
            setLiveActivityToast(`Đã chuyển sang tài khoản: ${found.name} (${found.role})`);
        }
    };

    const addProcessedFoodItem = (foodItem) => {
        const finalItem = {
            id: Date.now().toString(),
            storage_location: foodItem.compartment,
            ...foodItem
        };

        const healthWarn = window.ExpiryEngine.getHealthWarning(foodItem.name);
        if (healthWarn) {
            setHealthNotice(healthWarn);
            setTimeout(() => setHealthNotice(null), 5000);
        }

        if (!isOnline) {
            setOfflineQueue(prev => [finalItem, ...prev]);
            window.NotificationEngine.sendPush(
                "FreshKeep Ngoại tuyến 🔴",
                `Đã lưu tạm thời "${finalItem.name}" vào bộ nhớ đệm thiết bị.`,
                triggerNotification
            );
            setLiveActivityToast(`Đã lưu tạm thời ngoại tuyến: Thêm "${finalItem.name}"`);
        } else {
            setItems(prev => [finalItem, ...prev]);
            window.NotificationEngine.sendPush(
                "Thực phẩm mới! 🎉",
                `${userName} vừa xếp "${finalItem.name}" (${finalItem.quantity}) vào tủ.`,
                triggerNotification
            );
            setLiveActivityToast(`${userName} đã thêm "${finalItem.name}" vào tủ.`);

            setSyncLogs(prev => [
                { id: Date.now(), text: `${userName} đã thêm "${finalItem.name}" (${finalItem.quantity}) vào ${finalItem.compartment}.`, time: new Date().toLocaleTimeString().substring(0, 5) },
                ...prev
            ]);

            const info = window.ExpiryEngine.calculate(finalItem, warnDaysLimit, pediatricWarnLimit);
            if (info.daysRemaining <= warnDaysLimit) {
                window.NotificationEngine.triggerPersonaPush(finalItem.name, info.daysRemaining, finalItem.category, triggerNotification);
            }
        }
    };

    const handleDeleteFoodWithAuth = (id) => {
        const target = items.find(item => item.id === id);
        if (!target) return;

        if (userRole === 'Sinh viên') {
            triggerNotification("🔒 Hạn chế quyền hạn", "Tài khoản sinh viên không có quyền xóa thực phẩm chung của gia đình.");
            return;
        }

        setItems(prev => prev.filter(item => item.id !== id));
        setLiveActivityToast(`Đã lấy "${target.name}" ra khỏi tủ.`);
        
        setSyncLogs(prev => [
            { id: Date.now(), text: `${userName} đã lấy "${target.name}" ra khỏi tủ.`, time: new Date().toLocaleTimeString().substring(0, 5) },
            ...prev
        ]);
    };

    const handleQuickMoveCompartment = (itemId, targetCompartment) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return { 
                    ...item, 
                    compartment: targetCompartment, 
                    storage_location: targetCompartment,
                    isPediatricCritical: targetCompartment === 'Ngăn đồ ăn dặm' 
                };
            }
            return item;
        }));
        const updatedItem = items.find(i => i.id === itemId);
        if (updatedItem) {
            setLiveActivityToast(`Đã chuyển "${updatedItem.name}" sang ${targetCompartment}`);
            setSyncLogs(prev => [
                { id: Date.now(), text: `${userName} đã chuyển vị trí của "${updatedItem.name}" sang ${targetCompartment}.`, time: new Date().toLocaleTimeString().substring(0, 5) },
                ...prev
            ]);
        }
    };

    const handleCookRecipe = (recipe) => {
        let updatedItems = [...items];
        recipe.requiredIngredients.forEach(ing => {
            const foundIdx = updatedItems.findIndex(i => i.name.toLowerCase().includes(ing));
            if (foundIdx !== -1) {
                updatedItems.splice(foundIdx, 1);
            }
        });

        setItems(updatedItems);
        setLiveActivityToast(`Đã chế biến món "${recipe.name}". Nguyên liệu liên quan đã được trừ trong kho.`);
        setSyncLogs(prev => [
            { id: Date.now(), text: `${userName} đã chế biến món "${recipe.name}" (Tự động cập nhật giảm trừ kho).`, time: new Date().toLocaleTimeString().substring(0, 5) },
            ...prev
        ]);
    };

    const handleAddMissingIngredientToShopping = (ingredientName) => {
        const id = Date.now().toString() + Math.random().toString().substring(2, 5);
        const isMeat = ['thịt', 'bò', 'heo', 'gà', 'cá'].some(k => ingredientName.toLowerCase().includes(k));
        
        const newItem = {
            id,
            name: ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1),
            quantity: '1 phần',
            category: isMeat ? 'Thịt & Hải sản' : 'Rau củ & Trái cây',
            checked: false
        };

        setShoppingList(prev => [...prev, newItem]);
        setLiveActivityToast(`Đã thêm nguyên liệu thiếu "${ingredientName}" vào Sổ đi chợ.`);
    };

    const handleAddShoppingItem = (name, category, qty = '1 phần') => {
        const targetName = name || shoppingInput;
        if (!targetName.trim()) return;

        const newItem = {
            id: Date.now().toString(),
            name: targetName.charAt(0).toUpperCase() + targetName.slice(1),
            quantity: qty,
            category: category || shoppingCategory,
            checked: false
        };

        setShoppingList(prev => [...prev, newItem]);
        setShoppingInput('');
        setLiveActivityToast(`Đã thêm "${newItem.name}" vào Sổ đi chợ.`);
    };

    const startBarcodeScanSimulation = (code) => {
        setIsScanning(true);
        setLiveActivityToast("Đang phân tích thông tin mã vạch...");
        
        setTimeout(() => {
            playScanBeep();
            const product = window.barcodeDatabase[code];
            if (product) {
                const fallbackDays = window.ExpiryEngine.getFallbackDays(product.name, product.category, product.compartment);
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + fallbackDays);
                const expiryDate = targetDate.toISOString().split('T')[0];

                const scannedItem = {
                    name: product.name,
                    quantity: product.quantity,
                    category: product.category,
                    compartment: product.compartment,
                    expiryDate: expiryDate,
                    isPediatricCritical: product.compartment === 'Ngăn đồ ăn dặm',
                    isCustom: false
                };
                addProcessedFoodItem(scannedItem);
                setLiveActivityToast(`Mã vạch khớp: ${product.name}!`);
            } else {
                setLiveActivityToast("Không tìm thấy thông tin sản phẩm trong cơ sở dữ liệu mã vạch.");
            }
            setIsScanning(false);
            setScannerCameraSimulation(false);
        }, 1500);
    };

    const handleGenerateQrSync = () => {
        const stateString = JSON.stringify({
            owner: userName,
            itemsCount: items.length,
            timestamp: Date.now()
        });
        const base64Data = btoa(unescape(encodeURIComponent(stateString)));
        setQrSyncData(`https://freshkeep-sync-hub.io/sync?data=${base64Data}`);
        setShowQRModal(true);
    };

    const simulateScanningOtherMemberQR = () => {
        setLiveActivityToast("Đang kết nối qua mã QR...");
        setTimeout(() => {
            playScanBeep();
            const simulatedSharedFood = {
                id: Date.now().toString(),
                name: "Dưa hấu Long An",
                quantity: "1 quả",
                category: "Rau củ & Trái cây",
                compartment: "Ngăn mát",
                expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPediatricCritical: false,
                isCustom: false
            };
            setItems(prev => [simulatedSharedFood, ...prev]);
            setLiveActivityToast("Đồng bộ hoàn tất! Nhận thêm thực phẩm: Dưa hấu Long An.");
            setShowQRModal(false);
        }, 1500);
    };

    const triggerMockMarketSync = () => {
        setLiveActivityToast("Đang lắng nghe tín hiệu từ máy chủ gia đình...");
        setTimeout(() => {
            const simulatedFood = {
                id: Date.now().toString(),
                name: "Cam sành Hàm Yên",
                quantity: "2 kg",
                category: "Rau củ & Trái cây",
                compartment: "Ngăn rau củ",
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPediatricCritical: false,
                isCustom: false
            };
            setItems(prev => [simulatedFood, ...prev]);
            setLiveActivityToast(`Đã đồng bộ cam sành Hàm Yên do Bố trẻ nhỏ xếp vào từ xa.`);
            setSyncLogs(prev => [
                { id: Date.now(), text: `Bố trẻ nhỏ đã xếp "Cam sành Hàm Yên" vào Ngăn rau củ từ xa.`, time: new Date().toLocaleTimeString().substring(0, 5) },
                ...prev
            ]);
        }, 1000);
    };

    const handleMarkAsBought = (id) => {
        const shoppingItem = shoppingList.find(s => s.id === id);
        if (!shoppingItem) return;

        const fallbackDays = window.ExpiryEngine.getFallbackDays(shoppingItem.name, shoppingItem.category, 'Ngăn mát');
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + fallbackDays);

        const finalFoodItem = {
            name: shoppingItem.name,
            quantity: shoppingItem.quantity,
            category: shoppingItem.category,
            compartment: 'Ngăn mát',
            storage_location: 'Ngăn mát',
            expiryDate: targetDate.toISOString().split('T')[0],
            isPediatricCritical: false,
            isCustom: false
        };

        addProcessedFoodItem(finalFoodItem);
        setShoppingList(prev => prev.filter(s => s.id !== id));
    };

    const handleToggleEco = () => {
        if (!ecoMode) {
            setEcoMode(true);
            setSuperCool(false);
            setTempCooler(6);
            setTempFreezer(-15);
            setLiveActivityToast("Đã kích hoạt Chế độ Tiết kiệm điện Eco Mode.");
        } else {
            setEcoMode(false);
            setTempCooler(4);
            setTempFreezer(-18);
            setLiveActivityToast("Đã tắt Chế độ Tiết kiệm điện.");
        }
    };

    const handleToggleSuperCool = () => {
        if (!superCool) {
            setSuperCool(true);
            setEcoMode(false);
            setTempCooler(2);
            setTempFreezer(-24);
            setLiveActivityToast("Đã kích hoạt Chế độ Làm lạnh nhanh.");
        } else {
            setSuperCool(false);
            setTempCooler(4);
            setTempFreezer(-18);
            setLiveActivityToast("Đã tắt Chế độ Làm lạnh nhanh.");
        }
    };

    const handleRequestPermissionClick = () => {
        window.NotificationEngine.requestPermission().then(granted => {
            setNotificationPermission(window.NotificationEngine.getPermissionState());
            if (granted) {
                setLiveActivityToast("Đã kích hoạt thành công quyền thông báo đẩy.");
            } else {
                setLiveActivityToast("Không thể mở thông báo, hãy kiểm tra quyền cài đặt trình duyệt.");
            }
        });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setAuthError('');

        const trimmedEmail = loginEmail.trim().toLowerCase();
        const foundUser = accounts.find(acc => acc.email.toLowerCase() === trimmedEmail);

        if (!foundUser) {
            setAuthError('Email đăng nhập không tồn tại trên hệ thống.');
            return;
        }

        if (foundUser.password !== loginPassword) {
            setAuthError('Mật khẩu nhập vào không chính xác.');
            return;
        }

        setUserName(foundUser.name);
        setUserRole(foundUser.role);
        setIsLoggedIn(true);

        setRoommates(prev => {
            const exists = prev.some(r => r.name.toLowerCase() === foundUser.name.toLowerCase());
            if (!exists) {
                return [...prev, { 
                    id: 'u_' + Date.now(), 
                    name: foundUser.name, 
                    avatar: foundUser.avatar || '👤', 
                    role: foundUser.role, 
                    isAdmin: foundUser.isAdmin 
                }];
            }
            return prev;
        });

        setLiveActivityToast(`Chào mừng ${foundUser.name} đã đăng nhập!`);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setAuthError('');

        const nameTrimmed = registerName.trim();
        const emailTrimmed = registerEmail.trim().toLowerCase();

        if (!nameTrimmed) {
            setAuthError('Vui lòng cung cấp Họ và tên.');
            return;
        }

        const exists = accounts.some(acc => acc.email.toLowerCase() === emailTrimmed);
        if (exists) {
            setAuthError('Địa chỉ Email này đã có người đăng ký.');
            return;
        }

        if (registerPassword.length < 6) {
            setAuthError('Mật khẩu của bạn phải có tối thiểu 6 ký tự.');
            return;
        }

        const newAccount = {
            email: emailTrimmed,
            password: registerPassword,
            name: nameTrimmed,
            role: registerRole,
            avatar: registerAvatar,
            isAdmin: false 
        };

        setAccounts(prev => [...prev, newAccount]);

        setUserName(newAccount.name);
        setUserRole(newAccount.role);
        setIsLoggedIn(true);

        setRoommates(prev => [...prev, {
            id: 'u_' + Date.now(),
            name: newAccount.name,
            avatar: newAccount.avatar,
            role: newAccount.role,
            isAdmin: newAccount.isAdmin
        }]);

        setLiveActivityToast(`Đăng ký thành công! Chào mừng ${newAccount.name}.`);

        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterName('');
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!currentUserIsAdmin) {
            triggerNotification("🔒 Truy cập bị từ chối", "Bạn cần tài khoản Admin để có thể thêm thành viên mới.");
            return;
        }
        if (!inviteName.trim()) return;

        const newMember = {
            id: 'u_' + Date.now(),
            name: inviteName.trim(),
            role: inviteRole,
            avatar: inviteAvatar,
            isAdmin: inviteIsAdmin
        };

        setRoommates(prev => [...prev, newMember]);
        setLiveActivityToast(`Đã thêm thành viên "${newMember.name}" với vai trò [${newMember.role}].`);
        
        setSyncLogs(prev => [
            { id: Date.now(), text: `Quản trị viên ${userName} đã thêm thành viên mới: "${newMember.name}".`, time: new Date().toLocaleTimeString().substring(0, 5) },
            ...prev
        ]);

        setInviteName('');
        setInviteRole('Thành viên');
        setInviteAvatar('👤');
        setInviteIsAdmin(false);
    };

    const handleStartEditMember = (member) => {
        if (!currentUserIsAdmin) {
            triggerNotification("🔒 Hành động bị chặn", "Chỉ Quản trị viên mới có thể chỉnh sửa thông tin thành viên.");
            return;
        }
        setEditingMemberId(member.id);
        setEditForm({
            name: member.name,
            role: member.role,
            avatar: member.avatar,
            isAdmin: !!member.isAdmin
        });
    };

    const handleSaveEditMember = (id) => {
        if (!currentUserIsAdmin) return;
        if (!editForm.name.trim()) return;

        setRoommates(prev => prev.map(m => {
            if (m.id === id) {
                if (m.name === userName) {
                    setUserName(editForm.name);
                    setUserRole(editForm.role);
                }
                return { id, ...editForm };
            }
            return m;
        }));

        setEditingMemberId(null);
        setLiveActivityToast("Thông tin thành viên đã được cập nhật thành công.");
        
        setSyncLogs(prev => [
            { id: Date.now(), text: `Quản trị viên ${userName} đã thay đổi thông tin của "${editForm.name}".`, time: new Date().toLocaleTimeString().substring(0, 5) },
            ...prev
        ]);
    };

    const handleDeleteMember = (id) => {
        if (!currentUserIsAdmin) {
            triggerNotification("🔒 Hành động bị chặn", "Yêu cầu quyền Quản trị viên để thực hiện xóa thành viên.");
            return;
        }
        const target = roommates.find(r => r.id === id);
        if (!target) return;

        if (target.name === userName) {
            triggerNotification("🚨 Lỗi hệ thống", "Bạn không thể tự xóa tài khoản của chính mình khi đang đăng nhập.");
            return;
        }

        const otherAdmins = roommates.filter(r => r.id !== id && r.isAdmin);
        if (target.isAdmin && otherAdmins.length === 0) {
            triggerNotification("🚨 Lỗi hệ thống", "Hệ thống cần có ít nhất một Quản trị viên. Bạn không thể xóa Admin cuối cùng.");
            return;
        }

        setRoommates(prev => prev.filter(r => r.id !== id));
        setLiveActivityToast(`Đã xóa thành viên "${target.name}" ra khỏi hệ thống.`);
        
        setSyncLogs(prev => [
            { id: Date.now(), text: `Quản trị viên ${userName} đã xóa thành viên "${target.name}".`, time: new Date().toLocaleTimeString().substring(0, 5) },
            ...prev
        ]);
    };

    const handleToggleAdminPermission = (id) => {
        if (!currentUserIsAdmin) {
            triggerNotification("🔒 Hành động bị chặn", "Bạn cần quyền Quản trị viên để thay đổi cấu hình phân quyền.");
            return;
        }

        const target = roommates.find(r => r.id === id);
        if (!target) return;

        if (target.name === userName) {
            triggerNotification("🚨 Hành động không hợp lệ", "Bạn không thể tự hạ quyền Admin của chính mình.");
            return;
        }

        setRoommates(prev => prev.map(m => {
            if (m.id === id) {
                const newPermission = !m.isAdmin;
                setLiveActivityToast(newPermission ? `Đã cấp quyền Quản trị viên cho "${m.name}"` : `Đã thu hồi quyền Quản trị viên của "${m.name}"`);
                
                setSyncLogs(prev => [
                    { id: Date.now(), text: `Quản trị viên ${userName} đã ${newPermission ? 'CẤP QUYỀN' : 'THU HỒI QUYỀN'} Admin đối với "${m.name}".`, time: new Date().toLocaleTimeString().substring(0, 5) },
                    ...prev
                ]);

                return { ...m, isAdmin: newPermission };
            }
            return m;
        }));
    };

    const handleAddManualItem = (e) => {
        e.preventDefault();
        if (!newFood.name.trim()) return;

        let calculatedExpiry = newFood.expiryDate;
        if (!calculatedExpiry) {
            const days = window.ExpiryEngine.getFallbackDays(newFood.name, newFood.category, newFood.compartment);
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days);
            calculatedExpiry = targetDate.toISOString().split('T')[0];
        }

        const manualItem = {
            name: newFood.name.charAt(0).toUpperCase() + newFood.name.slice(1),
            quantity: newFood.quantity || '1 phần',
            category: newFood.category,
            compartment: newFood.compartment,
            expiryDate: calculatedExpiry,
            isPediatricCritical: newFood.isPediatricCritical || newFood.compartment === 'Ngăn đồ ăn dặm',
            isCustom: window.FridgyParser.isCustomIngredient(newFood.name)
        };

        addProcessedFoodItem(manualItem);
        setShowAddModal(false);
        
        setNewFood({ 
            name: '', 
            quantity: '', 
            category: 'Thịt & Hải sản', 
            compartment: 'Ngăn mát', 
            expiryDate: '', 
            isPediatricCritical: false, 
            isCustom: false 
        });
    };

    const handleConfirmStrangeIngredient = (compartment, days, isPediatric) => {
        if (!strangeItemToConfirm) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const expiryDate = targetDate.toISOString().split('T')[0];

        const finalItem = {
            ...strangeItemToConfirm,
            compartment: compartment,
            expiryDate: expiryDate,
            isPediatricCritical: isPediatric || compartment === 'Ngăn đồ ăn dặm'
        };

        addProcessedFoodItem(finalItem);
        setStrangeItemToConfirm(null);
    };

    const handleExecuteCommand = (cmdText) => {
        if (!cmdText.trim()) return;
        const userMsg = { sender: 'user', text: cmdText };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        
        setTimeout(() => {
            const res = window.FridgyParser.parseInstruction(cmdText, items);
            if (res.success) {
                if (res.action === 'strange_confirmation') {
                    setStrangeItemToConfirm(res.parsedItem);
                    setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
                } else if (res.action === 'add' && res.parsedItem) {
                    addProcessedFoodItem(res.parsedItem);
                    setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
                } else if (res.action === 'delete' && res.targetId) {
                    handleDeleteFoodWithAuth(res.targetId);
                    setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
                } else if (res.action === 'update' && res.targetId) {
                    setItems(prev => prev.map(i => i.id === res.targetId ? { ...i, quantity: res.newQuantity } : i));
                    setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
                }
            } else {
                setChatHistory(prev => [...prev, { sender: 'fridgy', text: res.message }]);
            }
        }, 300);
    };

    const filteredItemsList = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesComp = activeCompartment === 'Tất cả' || item.compartment === activeCompartment;
            return matchesSearch && matchesComp;
        });
    }, [items, searchQuery, activeCompartment]);

    const stats = useMemo(() => {
        const total = items.length;
        const counts = { 'Thịt & Hải sản': 0, 'Rau củ & Trái cây': 0, 'Sữa & Đồ hộp': 0, 'Đồ khô & Chế biến sẵn': 0, 'Đồ uống': 0, 'Khác': 0 };
        items.forEach(i => { if (counts[i.category] !== undefined) counts[i.category]++; else counts['Khác']++; });
        
        const distribution = Object.keys(counts).map(key => ({
            category: key,
            percentage: total > 0 ? Math.round((counts[key] / total) * 100) : 0,
            count: counts[key]
        })).filter(d => d.count > 0);

        return { total, distribution };
    }, [items]);

    const smartRecipes = useMemo(() => {
        const availableNames = items.map(item => item.name.toLowerCase());
        const criticalIngredients = items
            .filter(item => window.ExpiryEngine.calculate(item, warnDaysLimit, pediatricWarnLimit).daysRemaining <= warnDaysLimit)
            .map(item => item.name.toLowerCase());

        const matched = window.RecipeCatalog.map(recipe => {
            let matchedIngredients = [];
            let missingIngredients = [];
            let criticalMatchCount = 0;

            recipe.requiredIngredients.forEach(reqIng => {
                const isAvailable = availableNames.some(name => name.includes(reqIng));
                if (isAvailable) {
                    matchedIngredients.push(reqIng);
                    const isCritical = criticalIngredients.some(name => name.includes(reqIng));
                    if (isCritical) criticalMatchCount++;
                } else {
                    missingIngredients.push(reqIng);
                }
            });

            const matchScore = recipe.requiredIngredients.length > 0 
                ? (matchedIngredients.length / recipe.requiredIngredients.length) 
                : 0;

            return {
                recipe,
                matchScore,
                matchedIngredients,
                missingIngredients,
                criticalMatchCount
            };
        });

        return matched
            .filter(m => m.matchScore > 0)
            .sort((a, b) => {
                if (b.criticalMatchCount !== a.criticalMatchCount) {
                    return b.criticalMatchCount - a.criticalMatchCount;
                }
                return b.matchScore - a.matchScore;
            });
    }, [items, warnDaysLimit, pediatricWarnLimit]);

    const runUnitTests = () => {
        const results = [];
        
        const mockBabyMilk = {
            id: 't1', name: 'Sữa non pha sẵn cho bé', quantity: '1 bình',
            category: 'Sữa & Đồ hộp', compartment: 'Ngăn đồ ăn dặm',
            expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isPediatricCritical: true
        };
        const r1 = window.ExpiryEngine.calculate(mockBabyMilk, 3, 2);
        results.push({ name: 'Bảo vệ nhi đồng: Kích hoạt báo động khẩn cấp trước 2 ngày', status: r1.label.includes('NGUY HIỂM') ? 'PASS' : 'FAIL' });

        const mockFresh = {
            id: 't2', name: 'Táo tươi', quantity: '1 quả',
            category: 'Rau củ & Trái cây', compartment: 'Ngăn rau củ',
            expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        const r2 = window.ExpiryEngine.calculate(mockFresh, 3, 2);
        results.push({ name: 'Chẩn đoán ExpiryEngine: Đánh giá độ tươi mới thực phẩm', status: r2.label.includes('TƯƠI MỚI') ? 'PASS' : 'FAIL' });

        const parseTest = window.FridgyParser.parseInstruction('Thêm 3 vỉ trứng gà vào ngăn đồ ăn dặm', items);
        results.push({ 
            name: 'Phân tích FridgyParser: Trích xuất danh mục và phân vùng ngăn tủ', 
            status: (parseTest.success && parseTest.parsedItem.category === 'Sữa & Đồ hộp' && parseTest.parsedItem.compartment === 'Ngăn đồ ăn dặm') ? 'PASS' : 'FAIL' 
        });

        const fallbackTest = window.ExpiryEngine.getFallbackDays('Thịt heo ba chỉ', 'Thịt & Hải sản', 'Ngăn đông');
        results.push({
            name: 'Fallback Expiry: Đề xuất thời hạn bảo quan đông thịt heo',
            status: fallbackTest === 150 ? 'PASS' : 'FAIL'
        });

        setTestResults(results);
    };

    const handlePersonaNotificationTest = (type) => {
        if (type === 'baby') {
            window.NotificationEngine.triggerPersonaPush("Sữa non ăn dặm em bé", 1, "Sữa & Đồ hộp", triggerNotification);
        } else {
            window.NotificationEngine.triggerPersonaPush("Thịt ba chỉ cá hồi Nauy", 2, "Thịt & Hải sản", triggerNotification);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                <span className="absolute top-10 left-10 text-7xl floating-food opacity-30">🥩</span>
                <span className="absolute bottom-12 left-20 text-7xl floating-food opacity-30" style={{animationDelay: '1.2s'}}>🥛</span>
                <span className="absolute top-20 right-20 text-7xl floating-food opacity-30" style={{animationDelay: '2.5s'}}>👶</span>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 max-w-md w-full border border-white/50 shadow-[0_24px_64px_rgba(253,186,116,0.35)] z-10 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="inline-block p-4 bg-amber-100 rounded-full shadow-inner mb-3">
                            <span className="text-5xl block floating-food">🥑</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 tracking-tight font-sans">FRESHKEEP</h1>
                        <p className="text-xs font-semibold text-amber-700/80 mt-2 uppercase tracking-widest font-sans">Hệ thống Giám sát & Quản lý Tủ lạnh</p>
                    </div>

                    {authMode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            {authError && (
                                <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-3 py-2.5 rounded-xl text-center font-sans">
                                    ⚠️ {authError}
                                </div>
                            )}
                            <div>
                                <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">EMAIL ĐĂNG NHẬP</label>
                                <input 
                                    type="email" required
                                    className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans"
                                    placeholder="mai.nguyen@gmail.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">MẬT KHẨU</label>
                                <input 
                                    type="password" required
                                    className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-2xl transition-all shadow-lg text-sm font-sans">
                                Đăng nhập hệ thống
                            </button>
                            <p className="text-xs text-center text-stone-500 mt-4 font-sans">
                                Chưa có tài khoản chung? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-amber-700 font-extrabold underline hover:text-orange-600 transition font-sans">Đăng ký ngay</button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            {authError && (
                                <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-3 py-2.5 rounded-xl text-center font-sans">
                                    ⚠️ {authError}
                                </div>
                            )}
                            <div>
                                <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">HỌ VÀ TÊN</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans"
                                    placeholder="Nguyễn Thị Mai"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">VAI TRÒ</label>
                                    <select 
                                        className="w-full border-2 border-stone-100 bg-white/60 rounded-2xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300 font-bold text-stone-600 font-sans"
                                        value={registerRole}
                                        onChange={(e) => setRegisterRole(e.target.value)}
                                    >
                                        <option value="Mẹ bỉm sữa">Mẹ bỉm sữa</option>
                                        <option value="Chồng">Chồng</option>
                                        <option value="Sinh viên">Sinh viên</option>
                                        <option value="Thành viên">Thành viên</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">AVATAR</label>
                                    <select 
                                        className="w-full border-2 border-stone-100 bg-white/60 rounded-2xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300 font-bold text-stone-600 font-sans"
                                        value={registerAvatar}
                                        onChange={(e) => setRegisterAvatar(e.target.value)}
                                    >
                                        <option value="👩‍🍼">👩‍🍼 Mẹ bỉm</option>
                                        <option value="🙋‍♂️">🙋‍♂️ Chồng</option>
                                        <option value="👩‍🎓">👩‍🎓 Sinh viên</option>
                                        <option value="👤">👤 Thành viên</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">EMAIL ĐĂNG NHẬP</label>
                                <input 
                                    type="email" required
                                    className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans"
                                    placeholder="mai.nguyen@gmail.com"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-extrabold text-stone-500 mb-1 tracking-wider font-sans">MẬT KHẨU</label>
                                <input 
                                    type="password" required
                                    className="w-full border-2 border-stone-100 bg-white/60 focus:bg-white rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all font-sans"
                                    placeholder="••••••••"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-2xl transition-all shadow-lg text-sm font-sans">
                                Đăng ký tài khoản
                            </button>
                            <p className="text-xs text-center text-stone-500 mt-4 font-sans">
                                Đã có tài khoản chung? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-amber-700 font-extrabold underline hover:text-orange-600 transition font-sans">Đăng nhập</button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-8 flex flex-col items-center relative">
            
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
                {inAppNotifications.map(n => (
                    <div key={n.id} className="bg-stone-900/95 text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-stone-800 animate-slide-in relative flex gap-3 items-start">
                        <span className="text-2xl mt-0.5">🔔</span>
                        <div className="flex-1 font-sans">
                            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">{n.title}</h4>
                            <p className="text-[11px] text-stone-200 mt-1 font-semibold leading-relaxed whitespace-pre-line">{n.body}</p>
                        </div>
                        <button 
                            onClick={() => setInAppNotifications(prev => prev.filter(item => item.id !== n.id))}
                            className="text-stone-400 hover:text-white text-xs font-bold font-sans self-start ml-2"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {healthNotice && (
                <div className="fixed top-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl shadow-xl z-50 animate-bounce">
                    <p className="text-xs font-bold text-amber-900 leading-relaxed">{healthNotice}</p>
                    <button onClick={() => setHealthNotice(null)} className="absolute top-2 right-2 text-amber-500 hover:text-amber-700 text-xs">✕</button>
                </div>
            )}

            {liveActivityToast && (
                <div className="fixed bottom-6 right-6 bg-stone-900/90 text-white text-xs px-5 py-3 rounded-2xl shadow-2xl border border-stone-800 z-50 animate-slide-in flex items-center gap-2">
                    <span className="animate-ping w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>
                    <span className="font-bold">{liveActivityToast}</span>
                </div>
            )}

            {/* TOP HEADER */}
            <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-orange-100 z-10 gap-3 sm:gap-0">
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="text-4xl sm:text-5xl floating-food">🍊</span>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-orange-600 font-sans">FRESHKEEP</h1>
                        <p className="text-[10px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider">
                            📅 {currentTime.toLocaleDateString('vi-VN')} | ⏰ {currentTime.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* Status Bar */}
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
                        <span className="text-xs font-bold text-stone-500">Tài khoản hiện tại:</span>
                        <select 
                            value={userName} 
                            onChange={(e) => handleUserChange(e.target.value)}
                            className="bg-transparent text-xs font-bold text-amber-950 focus:outline-none cursor-pointer font-sans"
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

            {/* MAIN SPLIT-VIEW */}
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 z-10 font-sans">
                
                {/* COLUMN 1: TỦ LẠNH VẬT LÝ */}
                <div className="hidden lg:block lg:col-span-4">
                    <window.FridgeVisual items={items} freezerTemp={freezerSensorTemp} coolerTemp={coolerSensorTemp} />
                </div>

                {/* COLUMN 2: TOÀN BỘ PHẦN BẢNG ĐIỀU KHIỂN & TABS CHỨC NĂNG */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-4 sm:gap-6 w-full">
                    
                    {/* MENU TABS ĐIỀU HƯỚNG */}
                    <div className="flex gap-1.5 border-b border-amber-200/30 pb-3 overflow-x-auto w-full no-scrollbar">
                        {tabs.map(tab => {
                            const isFridgeTab = tab.id === 'fridge';
                            const tabClass = `px-4 py-2.5 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap flex items-center min-h-[40px] ${
                                activeTab === tab.id ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 shadow-md scale-105' : 'hover:bg-amber-100/50 text-stone-500 bg-white/40'
                            } ${isFridgeTab ? 'lg:hidden' : ''}`;

                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass}>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* TAB CONTAINER CONTENT */}
                    <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] border border-amber-200/30 shadow-2xl min-h-[460px] flex flex-col justify-between animate-fade-in">
                        
                        {activeTab === 'fridge' && (
                            <div className="lg:hidden flex-1">
                                <window.FridgeVisual items={items} freezerTemp={freezerSensorTemp} coolerTemp={coolerSensorTemp} />
                            </div>
                        )}

                        {/* TAB 1: KHO THỰC PHẨM */}
                        {activeTab === 'storage' && (
                            <div className="flex-1 flex flex-col">
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
                                        ⚠️ Bạn đang ngoại tuyến. Có {offlineQueue.length} thực phẩm đang lưu cục bộ, hệ thống sẽ tự động đồng bộ khi có kết nối trở lại.
                                    </div>
                                )}

                                <div className="space-y-3 overflow-y-auto max-h-[340px] flex-1 pr-1">
                                    {filteredItemsList.map(item => {
                                        const expiry = window.ExpiryEngine.calculate(item, warnDaysLimit, pediatricWarnLimit);
                                        return (
                                            <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3.5 bg-stone-50 hover:bg-white hover:shadow-md rounded-2xl border border-stone-100/50 transition-all relative overflow-hidden group gap-3">
                                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${expiry.sideColor}`} />
                                                
                                                <div className="flex items-center gap-3 pl-2">
                                                    <window.FoodPlateIcon type={item.category} />
                                                    <div>
                                                        <h4 className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5 font-sans">
                                                            {item.name}
                                                            {item.isCustom && <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded-full font-bold">Nguyên liệu lạ</span>}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-stone-400 mt-0.5">SL: {item.quantity} | {item.compartment}</p>
                                                    </div>
                                                </div>

                                                {/* Bộ chuyển đổi nhanh vị trí lưu trữ */}
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
                        )}

                        {/* TAB 2: SMART KITCHEN */}
                        {activeTab === 'smart-kitchen' && (
                            <div className="flex-1 flex flex-col gap-4 animate-fade-in">
                                <div className="bg-orange-50 border border-orange-200/60 p-4 rounded-2xl">
                                    <h4 className="text-xs font-black text-orange-950 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-sans">
                                        <span>🚨</span> CHẾ ĐỘ GIẢI CỨU THỰC PHẨM SẮP HẾT HẠN
                                    </h4>
                                    <p className="text-[10px] text-orange-900 leading-relaxed font-semibold font-sans">
                                        Hệ thống lọc các thực phẩm có nhãn <strong className="text-red-600 animate-pulse font-sans">SẮP HẾT HẠN</strong> và đề xuất thực đơn để tối ưu hóa nguồn nguyên liệu.
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

                                {/* Phân khúc Gợi ý cho Nguyên Liệu Lạ có sẵn */}
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
                                                        {window.RecipeEngine.generateForCustomIngredient(item.name).map((recipe, rIdx) => (
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
                                    {window.BasicDishes.map((dish, idx) => (
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
                        )}

                        {/* TAB 3: SMART SHOPPING PLANNER */}
                        {activeTab === 'shopping-planner' && (
                            <div className="flex-1 flex flex-col md:flex-row gap-5 animate-fade-in">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-3 font-sans">
                                            🛒 DANH SÁCH SỔ ĐI CHỢ GIA ĐÌNH
                                        </h4>

                                        {/* Thêm thủ công */}
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

                                        {/* Checkbox mua sắm */}
                                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                            {shoppingList.map(item => (
                                                <div key={item.id} className="flex justify-between items-center p-2.5 bg-amber-50/20 border border-amber-100 rounded-xl font-sans">
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={item.checked}
                                                            onChange={() => setShoppingList(prev => prev.map(s => s.id === item.id ? { ...s, checked: !s.checked } : s))}
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

                                {/* Gợi ý mua sắm thông minh */}
                                <div className="w-full md:w-64 bg-stone-50 p-4 rounded-2xl border border-stone-200/50 flex flex-col justify-between">
                                    <div>
                                        <h5 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-3 font-sans">
                                            💡 GỢI Ý TỰ ĐỘNG
                                        </h5>
                                        <p className="text-[9px] text-stone-500 leading-relaxed font-semibold mb-3 font-sans">
                                            Đề xuất mua dựa trên nhu cầu sử dụng thực phẩm thường ngày:
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
                        )}

                        {/* TAB 4: TRỢ LÝ AI CHATBOT */}
                        {activeTab === 'ai' && (
                            <div className="flex-1 flex flex-col lg:flex-row gap-6 font-sans">
                                
                                {/* KHU VỰC KHUNG CHAT CHÍNH */}
                                <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-100 pb-4 lg:pb-0 lg:pr-6">
                                    
                                    {/* Header Trạng Thái Trực Tuyến */}
                                    <div className="flex items-center gap-2 mb-3 bg-stone-50 p-2 rounded-xl border border-stone-200/40">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[9px] text-stone-500 font-extrabold uppercase tracking-wider">
                                            Fridgy AI đang liên kết trực tiếp với kho thực phẩm chung ({items.length} món)
                                        </p>
                                    </div>

                                    {/* Lịch Sử Cuộc Trò Chuyện */}
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

                                    {/* Thanh Nhập Liệu */}
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

                                {/* KHU VỰC GỢI Ý CHIP LỆNH AI NHANH */}
                                <div className="w-full lg:w-72 flex flex-col gap-4 overflow-y-auto max-h-[280px] lg:max-h-[340px] pr-1">
                                    <h4 className="font-extrabold text-stone-700 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                        <span>⚡</span> Lệnh Thực Thi Nhanh (Bấm để gửi)
                                    </h4>
                                    
                                    {/* Nhóm 1: Dynamic Queries */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">1. Phân Tích Thực Tế Tủ Lạnh</p>
                                        {[
                                            { cmd: 'Món nào trong tủ sắp hết hạn?', label: '🔍 Đồ nào sắp hết hạn?' },
                                            { cmd: 'Trứng gà còn bao nhiêu ngày nữa thì hỏng?', label: '🥚 Hạn dùng Trứng gà?' },
                                            { cmd: 'Trong tủ còn sữa tươi không Fridgy?', label: '🥛 Kiểm tra sữa tươi?' },
                                            { cmd: 'Liệt kê các thực phẩm trong ngăn đông', label: '❄️ Xem đồ ngăn đông' },
                                            { cmd: 'Trạng thái của bông cải xanh như thế nào?', label: '🥦 Độ tươi bông cải' }
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

                                    {/* Nhóm 2: Recipes & Menus */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-purple-600 uppercase tracking-wider font-sans">2. Thực Đơn Thông Minh Live</p>
                                        {[
                                            { cmd: 'Gợi ý cho tôi một món ăn tối nay từ các món có sẵn trong tủ', label: '🥘 Đề xuất món ăn tối nay' },
                                            { cmd: 'Cho tôi lời khuyên để cắt giảm lãng phí tiền bạc khi đi chợ', label: '💡 Mẹo bảo quản tiết kiệm' }
                                        ].map((c, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleExecuteCommand(c.cmd)} 
                                                className="w-full text-left bg-white hover:bg-purple-50/50 border border-stone-200/80 p-2.5 rounded-xl text-[10px] font-bold text-stone-700 hover:text-purple-900 transition-all block min-h-[34px] shadow-xs"
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Nhóm 3: CRUD Controls */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-wider">3. Thêm / Sửa / Xóa Bằng Lời Nói</p>
                                        {[
                                            { cmd: 'Thêm 500g thịt bò vào ngăn đông', label: '➕ Thêm 500g thịt bò' },
                                            { cmd: 'Thêm 1 vỉ trứng gà vào ngăn mát', label: '➕ Thêm 1 vỉ trứng gà' },
                                            { cmd: 'Thêm 2 túi đông trùng hạ thảo vào ngăn đông', label: '🍄 Thử nguyên liệu lạ' },
                                            { cmd: 'Xóa món hành tây khỏi danh sách', label: '🗑️ Xóa hành tây khỏi tủ' },
                                            { cmd: 'Sửa số lượng sữa tươi thành 5 hộp', label: '✏️ Chỉnh lượng sữa tươi' }
                                        ].map((c, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleExecuteCommand(c.cmd)} 
                                                className="w-full text-left bg-white hover:bg-amber-50/50 border border-stone-200/80 p-2.5 rounded-xl text-[10px] font-bold text-stone-700 hover:text-amber-900 transition-all block min-h-[34px] shadow-xs"
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: CONNECTIVITY & CO-LIVING FAMILY HUB */}
                        {activeTab === 'sharing-hub' && (
                            <div className="flex-1 flex flex-col lg:flex-row gap-6 animate-fade-in font-sans">
                                
                                {/* DANH SÁCH THÀNH VIÊN VÀ QUẢN TRỊ VIÊN */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                                        <h4 className="text-xs font-black text-stone-700 uppercase tracking-widest">
                                            👥 THÀNH VIÊN TRONG CĂN HỘ (CO-LIVING)
                                        </h4>
                                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${currentUserIsAdmin ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-stone-100 text-stone-400'}`}>
                                            {currentUserIsAdmin ? "Quyền hạn: ADMIN 👑" : "Quyền hạn: Xem & Ghi nhận 👥"}
                                        </span>
                                    </div>

                                    {/* Grid Danh sách thành viên */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {roommates.map((r) => (
                                            <div key={r.id} className="bg-white border border-stone-200 text-xs font-bold p-3.5 rounded-2xl flex flex-col justify-between text-stone-700 shadow-xs relative transition-all hover:shadow-md">
                                                
                                                {editingMemberId === r.id ? (
                                                    /* MÀN HÌNH CHỈNH SỬA CHO ADMIN */
                                                    <div className="space-y-2">
                                                        <div>
                                                            <label className="text-[9px] text-stone-400 uppercase font-black">Emoji đại diện</label>
                                                            <input 
                                                                type="text" 
                                                                value={editForm.avatar} 
                                                                onChange={(e) => setEditForm({...editForm, avatar: e.target.value})} 
                                                                className="w-full border border-stone-200 rounded-lg p-1 text-center font-bold"
                                                                maxLength={2}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] text-stone-400 uppercase font-black">Tên thành viên</label>
                                                            <input 
                                                                type="text" 
                                                                value={editForm.name} 
                                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                                                className="w-full border border-stone-200 rounded-lg p-1.5 font-bold focus:outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] text-stone-400 uppercase font-black">Vai trò (Chức danh)</label>
                                                            <input 
                                                                type="text" 
                                                                value={editForm.role} 
                                                                onChange={(e) => setEditForm({...editForm, role: e.target.value})} 
                                                                className="w-full border border-stone-200 rounded-lg p-1.5 font-bold focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 py-1">
                                                            <input 
                                                                type="checkbox" 
                                                                id={`edit_admin_${r.id}`}
                                                                checked={editForm.isAdmin} 
                                                                disabled={r.name === userName} 
                                                                onChange={(e) => setEditForm({...editForm, isAdmin: e.target.checked})}
                                                                className="w-4 h-4 accent-amber-500"
                                                            />
                                                            <label htmlFor={`edit_admin_${r.id}`} className="text-[10px] text-stone-600 font-extrabold cursor-pointer">Cấp quyền Quản trị (Admin)</label>
                                                        </div>
                                                        <div className="flex gap-1.5 pt-2">
                                                            <button 
                                                                onClick={() => handleSaveEditMember(r.id)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg flex-1 font-sans"
                                                            >
                                                                Lưu
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingMemberId(null)}
                                                                className="bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] px-2.5 py-1.5 rounded-lg flex-1 font-sans"
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* CHẾ ĐỘ HIỂN THỊ CHUẨN */
                                                    <>
                                                        <div className="flex items-start gap-3 justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-3xl bg-stone-50 p-1.5 rounded-xl border border-stone-100">{r.avatar}</span>
                                                                <div>
                                                                    <p className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                                                                        {r.name}
                                                                        {r.name === userName && <span className="bg-stone-100 text-stone-500 text-[8px] px-1.5 rounded font-normal">Tôi</span>}
                                                                    </p>
                                                                    <p className="text-[9px] text-stone-400 font-extrabold">{r.role}</p>
                                                                </div>
                                                            </div>
                                                            {r.isAdmin && (
                                                                <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                                                    ADMIN
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Các nút bấm điều khiển cho Quản trị viên */}
                                                        {currentUserIsAdmin && (
                                                            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() => handleStartEditMember(r)}
                                                                        className="text-stone-500 hover:text-amber-600 text-[10px] font-extrabold flex items-center gap-0.5 font-sans"
                                                                    >
                                                                        ⚙️ Sửa
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteMember(r.id)}
                                                                        className={`text-[10px] font-extrabold flex items-center gap-0.5 font-sans ${r.name === userName ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-red-600'}`}
                                                                        disabled={r.name === userName}
                                                                    >
                                                                        🗑️ Xóa
                                                                    </button>
                                                                </div>
                                                                
                                                                {/* Trao nhanh quyền Admin */}
                                                                <button
                                                                    onClick={() => handleToggleAdminPermission(r.id)}
                                                                    disabled={r.name === userName}
                                                                    className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md transition-all font-sans ${
                                                                        r.isAdmin 
                                                                        ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200' 
                                                                        : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                                                                    } ${r.name === userName ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                                >
                                                                    {r.isAdmin ? 'Hạ quyền Admin' : 'Trao quyền Admin'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* TRÌNH THÊM THÀNH VIÊN MỚI (CHỈ ADMIN THẤY) */}
                                    {currentUserIsAdmin ? (
                                        <form onSubmit={handleAddMember} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50 mt-4 space-y-3">
                                            <h5 className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                                                <span>👑</span> Thêm thành viên mới vào hệ thống
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Họ và tên..." 
                                                    value={inviteName}
                                                    onChange={(e) => setInviteName(e.target.value)}
                                                    className="border border-amber-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-stone-700 font-bold bg-white"
                                                    required
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Vai trò (Ví dụ: Chồng, Chị gái...)" 
                                                    value={inviteRole}
                                                    onChange={(e) => setInviteRole(e.target.value)}
                                                    className="border border-amber-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-stone-700 font-bold bg-white"
                                                />
                                                <div className="flex gap-2">
                                                    <select
                                                        value={inviteAvatar}
                                                        onChange={(e) => setInviteAvatar(e.target.value)}
                                                        className="border border-amber-200/50 rounded-xl px-2 py-2 text-xs text-stone-700 bg-white font-bold flex-1"
                                                    >
                                                        <option value="👤">👤 Avatar mặc định</option>
                                                        <option value="👩‍🍼">👩‍🍼 Mẹ bỉm sữa</option>
                                                        <option value="🙋‍♂️">🙋‍♂️ Nam thanh niên</option>
                                                        <option value="👩‍🎓">👩‍🎓 Nữ sinh viên</option>
                                                        <option value="🧓">🧓 Người lớn tuổi</option>
                                                        <option value="👧">👧 Bé gái</option>
                                                        <option value="🧒">🧒 Bé trai</option>
                                                    </select>
                                                    
                                                    <div className="flex items-center gap-1 px-2 border border-amber-200/50 rounded-xl bg-white">
                                                        <input 
                                                            type="checkbox" 
                                                            id="inviteAdminChk"
                                                            checked={inviteIsAdmin}
                                                            onChange={(e) => setInviteIsAdmin(e.target.checked)}
                                                            className="w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                                                        />
                                                        <label htmlFor="inviteAdminChk" className="text-[10px] text-stone-500 font-extrabold whitespace-nowrap cursor-pointer font-sans">Admin</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                type="submit"
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2 rounded-xl text-xs transition-all shadow-sm font-sans"
                                            >
                                                Thêm thành viên & Gửi thông báo
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center font-sans">
                                            <p className="text-[10px] font-bold text-stone-500 leading-relaxed">
                                                🔒 Tính năng Thêm / Sửa / Xóa và cấu hình phân quyền thành viên đã được khóa. Vui lòng chuyển sang tài khoản có quyền **Admin (Nguyễn Thị Mai)** ở góc trên để quản trị hệ thống.
                                            </p>
                                        </div>
                                    )}

                                    {/* Sự kiện đồng bộ giả lập */}
                                    <div className="mt-5 p-4 bg-teal-50/50 border border-teal-200 rounded-2xl">
                                        <h5 className="text-[11px] font-black text-teal-900 uppercase mb-2 flex items-center gap-1.5 font-sans">
                                            <span>🔄</span> MÔ PHỎNG ĐỒNG BỘ DỮ LIỆU THỜI GIAN THỰC
                                        </h5>
                                        <p className="text-[10px] text-teal-800 leading-relaxed font-semibold mb-3 font-sans">
                                            Giả lập hoạt động của một thành viên khác xếp đồ mới vào tủ chung từ xa để kiểm tra cơ chế cập nhật:
                                        </p>
                                        <button 
                                            onClick={triggerMockMarketSync}
                                            className="bg-teal-600 hover:bg-teal-700 text-white font-black px-4 py-2 rounded-xl text-xs transition font-sans"
                                        >
                                            ⚡ Giả lập đồng bộ từ xa
                                        </button>
                                    </div>
                                </div>

                                {/* Nhật ký hệ thống */}
                                <div className="w-full lg:w-80 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                                    <h5 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-3 font-sans">
                                        📋 NHẬT KÝ HOẠT ĐỘNG
                                    </h5>
                                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                        {syncLogs.map(log => (
                                            <div key={log.id} className="text-[10px] text-stone-600 border-l-2 border-amber-400 pl-2 py-0.5 leading-relaxed font-semibold font-sans">
                                                <span className="text-stone-400 font-normal mr-1">[{log.time}]</span> {log.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 6: CÀI ĐẶT & HỆ THỐNG */}
                        {activeTab === 'settings' && (
                            <div className="flex-1 space-y-6 animate-fade-in font-sans">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* CỘT TRÁI: THỐNG KÊ & HIỆU QUẢ */}
                                    <div className="space-y-6">
                                        <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                                            <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">
                                                <span>📊</span> Thống kê tiêu thụ & hao hụt
                                            </h4>
                                            
                                            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-inner">
                                                <p className="text-[10px] text-stone-400 font-black mb-4 uppercase tracking-wider">Tỉ lệ tiêu hao theo tháng (%)</p>
                                                <div className="flex justify-between items-end h-28 px-2">
                                                    {window.monthlyHistoryData.map((data, idx) => (
                                                        <div key={idx} className="flex flex-col items-center flex-1">
                                                            <div className="flex items-end gap-1.5 h-20 w-full justify-center">
                                                                <div className="w-3 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-full" style={{ height: `${data.consumed}%` }} />
                                                                <div className="w-3 bg-gradient-to-t from-orange-500 to-rose-400 rounded-t-full" style={{ height: `${data.wasted}%` }} />
                                                            </div>
                                                            <span className="text-[9px] font-black text-stone-400 mt-1.5">{data.month}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-center gap-4 mt-3 text-[9px] font-bold">
                                                    <span className="flex items-center gap-1 text-emerald-600">● Sử dụng ({window.monthlyHistoryData[window.monthlyHistoryData.length - 1].consumed}%)</span>
                                                    <span className="flex items-center gap-1 text-orange-500">● Hao hụt ({window.monthlyHistoryData[window.monthlyHistoryData.length - 1].wasted}%)</span>
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
                                                                <div 
                                                                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full" 
                                                                    style={{ width: `${dist.percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CỘT PHẢI: CẤU HÌNH VẬN HÀNH & CẢNH BÁO */}
                                    <div className="space-y-6">
                                        <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                                            <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">
                                                <span>⚙️</span> Điều khiển thiết bị & Nhiệt độ
                                            </h4>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={handleToggleEco}
                                                    className={`py-2 px-3 rounded-xl text-[10px] font-extrabold transition-all border ${
                                                        ecoMode 
                                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm' 
                                                        : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                                                    }`}
                                                >
                                                    🍃 Chế độ Eco {ecoMode && '• ON'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={handleToggleSuperCool}
                                                    className={`py-2 px-3 rounded-xl text-[10px] font-extrabold transition-all border ${
                                                        superCool 
                                                        ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-sm' 
                                                        : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                                                    }`}
                                                >
                                                    ⚡ Làm lạnh nhanh {superCool && '• ON'}
                                                </button>
                                            </div>

                                            <div className="space-y-4 bg-white p-4 rounded-2xl border border-stone-100">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-[10px] font-bold text-stone-500">Nhiệt độ ngăn mát</label>
                                                        <span className="text-xs font-black text-emerald-700">{tempCooler}°C</span>
                                                    </div>
                                                    <input 
                                                        type="range" min="1" max="10" 
                                                        disabled={ecoMode || superCool}
                                                        value={tempCooler} onChange={(e) => {
                                                            setTempCooler(Number(e.target.value));
                                                            setLiveActivityToast(`Thiết lập ngăn mát: ${e.target.value}°C.`);
                                                        }}
                                                        className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-[10px] font-bold text-stone-500">Nhiệt độ ngăn đông</label>
                                                        <span className="text-xs font-black text-blue-700">{tempFreezer}°C</span>
                                                    </div>
                                                    <input 
                                                        type="range" min="-25" max="-10" 
                                                        disabled={ecoMode || superCool}
                                                        value={tempFreezer} onChange={(e) => {
                                                            setTempFreezer(Number(e.target.value));
                                                            setLiveActivityToast(`Thiết lập ngăn đông: ${e.target.value}°C.`);
                                                        }}
                                                        className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                                                    />
                                                </div>
                                                {(ecoMode || superCool) && (
                                                    <p className="text-[9px] text-stone-400 font-bold italic">
                                                        * Nhiệt độ tự động tối ưu hóa trong chế độ đặc biệt. Tắt chế độ để chỉnh thủ công.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                                            <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-widest flex items-center gap-2">
                                                <span>🔔</span> Tiêu chuẩn cảnh báo & An toàn
                                            </h4>

                                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-100">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-stone-500 font-sans">Cảnh báo nghiêm ngặt đồ của bé:</span>
                                                    <div className="flex items-center gap-1">
                                                        <input 
                                                            type="number" min="1" max="5" 
                                                            value={pediatricWarnLimit} onChange={(e) => {
                                                                setPediatricWarnLimit(Number(e.target.value));
                                                                setLiveActivityToast(`Đã lưu mốc cảnh báo đồ bé trước ${e.target.value} ngày.`);
                                                            }}
                                                            className="w-12 border border-stone-200 rounded-lg py-1 text-center font-bold text-stone-700 focus:outline-none"
                                                        />
                                                        <span className="text-[10px] text-stone-400 font-semibold font-sans">ngày</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-stone-500 font-sans">Thời gian cảnh báo tiêu chuẩn:</span>
                                                    <select 
                                                        className="border border-stone-200 rounded-lg px-2 py-1 bg-white font-bold text-stone-600 focus:outline-none font-sans"
                                                        value={warnDaysLimit}
                                                        onChange={(e) => {
                                                            setWarnDaysLimit(Number(e.target.value));
                                                            setLiveActivityToast(`Cảnh báo hạn dùng trước ${e.target.value} ngày.`);
                                                        }}
                                                    >
                                                        <option value={3}>3 ngày</option>
                                                        <option value={5}>5 ngày</option>
                                                        <option value={7}>7 ngày</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-100">
                                                <p className="text-[10px] font-black text-amber-950 uppercase">Kiểm tra thông báo (Persona Test)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handlePersonaNotificationTest('baby')}
                                                        className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-2 rounded-xl text-[9px] transition-all font-sans"
                                                    >
                                                        🍼 Cảnh báo đồ bé (Mai)
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handlePersonaNotificationTest('salmon')}
                                                        className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-2 rounded-xl text-[9px] transition-all font-sans"
                                                    >
                                                        🐟 Cá hồi hết hạn (Thảo)
                                                    </button>
                                                </div>

                                                <div className="pt-2 border-t border-stone-100">
                                                    {notificationPermission === 'granted' ? (
                                                        <p className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1 justify-center bg-emerald-50 py-1.5 rounded-lg">
                                                            ✔ Quyền thông báo hệ thống: ĐÃ CẤP PHÉP
                                                        </p>
                                                    ) : (
                                                        <button 
                                                            type="button"
                                                            onClick={handleRequestPermissionClick}
                                                            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold py-2 rounded-xl text-[10px] transition-all font-sans"
                                                        >
                                                            📱 Đăng ký nhận thông báo hệ thống
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-2xl border border-stone-100 space-y-2">
                                                <button 
                                                    type="button"
                                                    onClick={runUnitTests} 
                                                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 rounded-xl text-[10px] flex items-center justify-center transition-all font-sans"
                                                >
                                                    🧪 Khởi chạy chẩn đoán logic hệ thống
                                                </button>
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
                        )}

                    </div>
                </div>
            </div>

            {/* MODAL THÊM ĐỒ THỦ CÔNG */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-3 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-amber-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-base sm:text-lg text-amber-950 font-sans">Thêm Thực Phẩm Mới</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                        </div>
                        <form onSubmit={handleAddManualItem} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-stone-400 mb-1">TÊN THỰC PHẨM</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none font-bold text-stone-700 min-h-[40px] font-sans"
                                    placeholder="Thịt bò phi lê, sâm ngọc linh..."
                                    value={newFood.name}
                                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-400 mb-1">SỐ LƯỢNG</label>
                                    <input 
                                        type="text" required
                                        className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none font-bold text-stone-700 min-h-[40px] font-sans"
                                        placeholder="Ví dụ: 3 quả, 500g"
                                        value={newFood.quantity}
                                        onChange={(e) => setNewFood({...newFood, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-400 mb-1">DANH MỤC</label>
                                    <select 
                                        className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-xs focus:outline-none bg-white font-bold text-stone-600 min-h-[40px] font-sans"
                                        value={newFood.category}
                                        onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                                    >
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
                                    <select 
                                        className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-bold text-stone-600 min-h-[40px] font-sans"
                                        value={newFood.compartment}
                                        onChange={(e) => setNewFood({...newFood, compartment: e.target.value})}
                                    >
                                        <option value="Ngăn mát">Ngăn mát</option>
                                        <option value="Ngăn đông">Ngăn đông</option>
                                        <option value="Ngăn rau củ">Ngăn rau củ</option>
                                        <option value="Cánh tủ">Cánh tủ</option>
                                        <option value="Ngăn đồ ăn dặm">Ngăn đồ ăn dặm 🍼</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-400 mb-1">HẠN SỬ DỤNG *(Để trống tự tính)*</label>
                                    <input 
                                        type="date"
                                        className="w-full border-2 border-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none text-stone-600 font-bold min-h-[40px] font-sans"
                                        value={newFood.expiryDate}
                                        onChange={(e) => setNewFood({...newFood, expiryDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 py-1">
                                <input 
                                    type="checkbox" 
                                    id="pediatric_chkbx"
                                    checked={newFood.isPediatricCritical} 
                                    onChange={(e) => setNewFood({...newFood, isPediatricCritical: e.target.checked})}
                                    className="w-4 h-4 accent-red-500"
                                />
                                <label htmlFor="pediatric_chkbx" className="text-[10px] text-red-500 font-extrabold cursor-pointer select-none font-sans">🚨 Bảo vệ nghiêm ngặt (Đồ dùng nhi đồng)</label>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/15 transition-all duration-300 min-h-[42px] font-sans">
                                Xác nhận bỏ vào tủ
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* INTERACTIVE REALISTIC BARCODE SCANNER MODAL */}
            {scannerCameraSimulation && (
                <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-stone-900 rounded-[2.5rem] max-w-lg w-full p-6 border border-stone-800 shadow-2xl relative overflow-hidden">
                        <button 
                            onClick={() => setScannerCameraSimulation(false)}
                            className="absolute top-6 right-6 text-stone-400 hover:text-white font-extrabold text-sm z-10 font-sans"
                        >
                            ✕ Đóng camera
                        </button>
                        
                        <div className="text-center mb-4">
                            <h3 className="text-white font-extrabold text-lg flex items-center justify-center gap-2 font-sans">
                                <span className="animate-pulse">🔴</span> Trình Quét Mã Vạch Hàng Tiêu Dùng
                            </h3>
                            <p className="text-stone-400 text-[11px] mt-1 font-sans">Đưa mã vạch của sản phẩm vào hồng tâm khung quét để nhận diện tự động</p>
                        </div>

                        {/* Khung mô phỏng camera quét mã vạch */}
                        <div className="relative w-full h-64 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-950/70 to-stone-900/40 opacity-80"></div>
                            <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] laser-line z-10"></div>
                            
                            <div className="border-2 border-dashed border-emerald-400 w-64 h-32 rounded-lg relative flex flex-col justify-between p-2 z-10 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                                <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest text-center self-center uppercase animate-pulse font-sans">Đang rà soát Barcode...</span>
                                <div className="flex justify-between text-stone-500 font-mono text-[9px]">
                                    <span>[UPC-EAN]</span>
                                    <span>100% FOCUS</span>
                                </div>
                            </div>

                            {isScanning && (
                                <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center gap-3 z-20">
                                    <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-emerald-400 text-xs font-black animate-pulse font-sans">ĐANG PHÂN TÍCH THÔNG TIN SẢN PHẨM...</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 space-y-3">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider font-sans">Chọn sản phẩm mẫu thực tế để quét:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.entries(window.barcodeDatabase).map(([code, info]) => (
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
                                        <span className="font-mono text-[9px] text-stone-500 font-sans">Barcode: {code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MÃ QR ĐỒNG BỘ GIA ĐÌNH */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 border border-amber-100 shadow-2xl text-center relative animate-fade-in">
                        <button 
                            onClick={() => setShowQRModal(false)}
                            className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 font-bold"
                        >
                            ✕
                        </button>
                        
                        <span className="text-4xl block mb-2">🔗</span>
                        <h3 className="font-extrabold text-stone-900 text-lg font-sans">Đồng bộ Tủ lạnh phòng chung</h3>
                        <p className="text-stone-500 text-[11px] mt-1 leading-relaxed px-4 font-sans">
                            Quét mã QR bằng điện thoại của thành viên khác để tự động kết nối và đồng bộ hóa danh sách thực phẩm theo thời gian thực.
                        </p>

                        <div className="my-6 flex justify-center">
                            <div className="p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrSyncData)}`} 
                                    alt="Mã QR đồng bộ FreshKeep"
                                    className="w-44 h-44 object-contain shadow-inner rounded-xl bg-white p-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button 
                                onClick={simulateScanningOtherMemberQR}
                                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3 rounded-2xl text-xs transition shadow-md font-sans"
                            >
                                📲 Thử quét mã QR của thành viên khác
                            </button>
                            
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(qrSyncData);
                                    setLiveActivityToast("Đã sao chép liên kết đồng bộ.");
                                }}
                                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 rounded-xl text-xs transition font-sans"
                            >
                                Sao chép đường dẫn đồng bộ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TRÌNH HỘI THOẠI XÁC NHẬN "NGUYÊN LIỆU LẠ" (STRANGE INGREDIENT WIZARD) */}
            {strangeItemToConfirm && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-50 backdrop-blur-sm p-3 animate-fade-in">
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] max-w-md w-full p-6 shadow-2xl border-t sm:border border-amber-100 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-5">
                            <span className="text-4xl block mb-2">🧐</span>
                            <h3 className="font-black text-lg text-stone-900 font-sans">Phát Hiện Nguyên Liệu Lạ!</h3>
                            <p className="text-[11px] text-stone-500 leading-relaxed mt-1 font-sans">
                                Món <strong>"{strangeItemToConfirm.name}"</strong> không thuộc danh mục chuẩn. Vui lòng định hình phương án bảo quản:
                            </p>
                        </div>
                        <div className="space-y-4 font-sans">
                            {/* 1. Chọn ngăn tủ */}
                            <div>
                                <label className="block text-[10px] font-bold text-stone-400 mb-1">NGĂN LƯU TRỮ CHỈ ĐỊNH</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Ngăn mát', 'Ngăn đông', 'Cánh tủ', 'Ngăn đồ ăn dặm', 'Ngăn rau củ'].map(comp => (
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

                            {/* 2. Chọn hạn sử dụng khuyên dùng */}
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

                            {/* 3. Đề xuất công thức nấu ăn tự động */}
                            <div className="border-t border-stone-100 pt-3">
                                <label className="block text-[10px] font-extrabold text-teal-600 mb-1.5 uppercase tracking-wider">💡 Gợi ý món ăn phù hợp từ AI:</label>
                                <div className="space-y-2 bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                                    {window.RecipeEngine.generateForCustomIngredient(strangeItemToConfirm.name).map((recipe, rIdx) => (
                                        <div key={rIdx} className="text-left font-sans">
                                            <p className="text-[10px] font-black text-teal-950">✦ {recipe.name}</p>
                                            <p className="text-[9px] text-stone-600 leading-relaxed">{recipe.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Phân cấp an toàn cho bé */}
                            <div className="flex items-center gap-2 border-t border-stone-100 pt-3 font-sans">
                                <input 
                                    type="checkbox" 
                                    id="strange_pedi_cb"
                                    checked={strangeItemToConfirm.isPediatricCritical || false}
                                    onChange={(e) => setStrangeItemToConfirm({...strangeItemToConfirm, isPediatricCritical: e.target.checked})}
                                    className="w-4 h-4 accent-red-500"
                                />
                                <label htmlFor="strange_pedi_cb" className="text-[11px] text-red-500 font-extrabold cursor-pointer select-none font-sans">
                                    🍼 Thiết lập bảo vệ khẩn cấp cho bé (Mai Persona)
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 font-sans">
                                <button 
                                    type="button"
                                    onClick={() => setStrangeItemToConfirm(null)}
                                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl text-xs"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        today.setHours(0,0,0,0);
                                        const exp = new Date(strangeItemToConfirm.expiryDate);
                                        exp.setHours(0,0,0,0);
                                        const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                        handleConfirmStrangeIngredient(
                                            strangeItemToConfirm.compartment,
                                            diff > 0 ? diff : 5,
                                            strangeItemToConfirm.isPediatricCritical
                                        );
                                    }}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md"
                                >
                                    Xác nhận cất tủ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FreshKeepApp />);
