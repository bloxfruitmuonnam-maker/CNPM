export default function ThanhVienChung({ 
    roommates, editForm, setEditForm, editingMemberId, setEditingMemberId, 
    currentUserIsAdmin, handleStartEditMember, handleSaveEditMember, 
    handleDeleteMember, handleToggleAdminPermission, handleAddMember, 
    inviteName, setInviteName, inviteRole, setInviteRole, 
    inviteAvatar, setInviteAvatar, inviteIsAdmin, setInviteIsAdmin, 
    userName, triggerMockMarketSync, syncLogs 
}) {
    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 animate-fade-in font-sans">
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <h4 className="text-xs font-black text-stone-700 uppercase tracking-widest">
                        👥 THÀNH VIÊN TRONG CĂN HỘ (CO-LIVING)
                    </h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${currentUserIsAdmin ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-stone-100 text-stone-400'}`}>
                        {currentUserIsAdmin ? "Quyền hạn: ADMIN 👑" : "Quyền hạn: Xem & Ghi nhận 👥"}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roommates.map((r) => (
                        <div key={r.id} className="bg-white border border-stone-200 text-xs font-bold p-3.5 rounded-2xl flex flex-col justify-between text-stone-700 shadow-xs relative transition-all hover:shadow-md">
                            {editingMemberId === r.id ? (
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                        className="w-full border border-stone-200 rounded-lg p-1.5 font-bold focus:outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        value={editForm.role} 
                                        onChange={(e) => setEditForm({...editForm, role: e.target.value})} 
                                        className="w-full border border-stone-200 rounded-lg p-1.5 font-bold focus:outline-none"
                                    />
                                    <div className="flex gap-1.5 pt-2">
                                        <button onClick={() => handleSaveEditMember(r.id)} className="bg-emerald-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg flex-1 font-sans">Lưu</button>
                                        <button onClick={() => setEditingMemberId(null)} className="bg-stone-100 text-stone-600 text-[10px] px-2.5 py-1.5 rounded-lg flex-1 font-sans">Hủy</button>
                                    </div>
                                </div>
                            ) : (
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
                                        {r.isAdmin && <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">ADMIN</span>}
                                    </div>
                                    {currentUserIsAdmin && (
                                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleStartEditMember(r)} className="text-stone-500 hover:text-amber-600 text-[10px] font-extrabold flex items-center gap-0.5">⚙️ Sửa</button>
                                                <button onClick={() => handleDeleteMember(r.id)} disabled={r.name === userName} className={`text-[10px] font-extrabold ${r.name === userName ? 'text-stone-300' : 'text-stone-500 hover:text-red-600'}`}>🗑️ Xóa</button>
                                            </div>
                                            <button onClick={() => handleToggleAdminPermission(r.id)} disabled={r.name === userName} className="text-[8px] uppercase font-extrabold px-2 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                                                {r.isAdmin ? 'Hạ quyền Admin' : 'Cấp Admin'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {currentUserIsAdmin ? (
                    <form onSubmit={handleAddMember} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50 mt-4 space-y-3">
                        <h5 className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">👑 Thêm thành viên mới vào hệ thống</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" placeholder="Họ và tên..." value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="border border-amber-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-stone-700 font-bold bg-white" required />
                            <input type="text" placeholder="Vai trò (Chồng, Chị gái...)" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="border border-amber-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-stone-700 font-bold bg-white" />
                            <div className="flex gap-2">
                                <select value={inviteAvatar} onChange={(e) => setInviteAvatar(e.target.value)} className="border border-amber-200/50 rounded-xl px-2 py-2 text-xs text-stone-700 bg-white font-bold flex-1">
                                    <option value="👤">👤 Avatar mặc định</option>
                                    <option value="👩‍🍼">👩‍🍼 Mẹ bỉm sữa</option>
                                    <option value="🙋‍♂️">🙋‍♂️ Nam thanh niên</option>
                                    <option value="👩‍🎓">👩‍🎓 Nữ sinh viên</option>
                                </select>
                                <div className="flex items-center gap-1 px-2 border border-amber-200/50 rounded-xl bg-white">
                                    <input type="checkbox" id="inviteAdminChk" checked={inviteIsAdmin} onChange={(e) => setInviteIsAdmin(e.target.checked)} className="w-3.5 h-3.5 accent-amber-500 cursor-pointer" />
                                    <label htmlFor="inviteAdminChk" className="text-[10px] text-stone-500 font-extrabold whitespace-nowrap cursor-pointer">Admin</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2 rounded-xl text-xs transition-all shadow-sm">Thêm thành viên</button>
                    </form>
                ) : (
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
                        <p className="text-[10px] font-bold text-stone-500 leading-relaxed">🔒 Quyền hạn bị hạn chế. Hãy chuyển sang tài khoản Admin để có quyền Quản trị.</p>
                    </div>
                )}

                <div className="mt-5 p-4 bg-teal-50/50 border border-teal-200 rounded-2xl">
                    <h5 className="text-[11px] font-black text-teal-900 uppercase mb-2">🔄 MÔ PHỎNG ĐỒNG BỘ DỮ LIỆU THỜI GIAN THỰC</h5>
                    <button onClick={triggerMockMarketSync} className="bg-teal-600 hover:bg-teal-700 text-white font-black px-4 py-2 rounded-xl text-xs transition">⚡ Giả lập cập nhật từ thành viên khác</button>
                </div>
            </div>

            <div className="w-full lg:w-80 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                <h5 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-3 font-sans">📋 NHẬT KÝ HOẠT ĐỘNG</h5>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {syncLogs.map(log => (
                        <div key={log.id} className="text-[10px] text-stone-600 border-l-2 border-amber-400 pl-2 py-0.5 leading-relaxed font-semibold">
                            <span className="text-stone-400 font-normal mr-1">[{log.time}]</span> {log.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
