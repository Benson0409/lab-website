import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';

// 引入上一層的元件與設定
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { DEFAULT_CONFIG } from '../data/constants';

// 引入上一層的 Firebase 設定
import { db, appId } from '../firebase'; 

const AdminPage = ({ userId, isAuthReady, labContent, eventsContent, config, setRefreshCount, onExit }) => {
    const [activeTab, setActiveTab] = useState('projects'); 
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    
    // 初始化狀態
    const [configState, setConfigState] = useState(config || DEFAULT_CONFIG);
    const [isDirty, setIsDirty] = useState(false);

    // 【關鍵修復】當 Firebase 下載完成新的 config 時，強制更新內部的表單狀態
    // 這樣你進入後台時，才不會看到舊的預設值，而是看到資料庫裡最新的標題
    useEffect(() => {
        if (config) {
            setConfigState(config);
        }
    }, [config]);

    const [formState, setFormState] = useState({
        title: '', abstract: '', description: '', type: 'project', category: 'VR',
        isMultiDay: false, startDate: '', endDate: '', 
        isTimeRange: false, startTime: '', endTime: '', 
        location: '', 
        coverImage: '', galleryImages: [], link: '', linkText: '', relatedLinks: [], videoUrl: ''
    });
    const [newLinkState, setNewLinkState] = useState({ text: '', url: '' });

    const handleSafeExit = () => {
        if (isDirty) {
            if (window.confirm("您有未儲存的變更，確定要退出嗎？變更將會遺失。")) onExit(); 
        } else {
            onExit(); 
        }
    };

    const handleChange = (field, value) => { setFormState(prev => ({ ...prev, [field]: value })); setIsDirty(true); };
    
    const handleConfigChange = (field, value) => { 
        setConfigState(prev => ({ ...prev, [field]: value })); 
        setIsDirty(true); 
    };
    
    const handleProfChange = (idx, field, value) => { const newProfs = [...configState.professors]; newProfs[idx][field] = value; setConfigState(prev => ({ ...prev, professors: newProfs })); setIsDirty(true); };
    const addProf = () => { setConfigState(prev => ({ ...prev, professors: [...prev.professors, { id: Date.now(), name: '', title: '', description: '' }] })); setIsDirty(true); };
    const removeProf = (idx) => { const newProfs = configState.professors.filter((_, i) => i !== idx); setConfigState(prev => ({ ...prev, professors: newProfs })); setIsDirty(true); };
    
    const handleImageUpload = async (e, field = 'images') => {
        const files = Array.from(e.target.files); setLoading(true);
        try { const promises = files.map(file => new Promise((resolve) => { const reader = new FileReader(); reader.onload = (evt) => resolve(evt.target.result); reader.readAsDataURL(file); }));
            const base64s = await Promise.all(promises);
            if(field === 'cover') setFormState(prev => ({...prev, coverImage: base64s[0]}));
            else setFormState(prev => ({...prev, galleryImages: [...prev.galleryImages, ...base64s]}));
            setIsDirty(true);
        } catch(e){} finally { setLoading(false); }
    };
    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader(); reader.onload = (evt) => { setConfigState(prev => ({...prev, logoUrl: evt.target.result})); setIsDirty(true); }; reader.readAsDataURL(file);
    };

    const removeLogo = () => { setConfigState(prev => ({...prev, logoUrl: ''})); setIsDirty(true); };
    const addRelatedLink = () => { if(newLinkState.text && newLinkState.url) { setFormState(prev => ({...prev, relatedLinks: [...prev.relatedLinks, newLinkState]})); setNewLinkState({text:'', url:''}); setIsDirty(true); }};
    const removeRelatedLink = (idx) => { setFormState(prev => ({...prev, relatedLinks: prev.relatedLinks.filter((_, i) => i !== idx)})); setIsDirty(true); };
    const removeGalleryImage = (idx) => { setFormState(prev => ({...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== idx)})); setIsDirty(true); };

    const handleDelete = async (col, id) => { if(window.confirm("確定刪除？")) { try { await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/${col}`, id)); setRefreshCount(p=>p+1); } catch(e){ setStatus(e.message); }}};
    
    const handleSaveGeneral = async () => { 
        setLoading(true); 
        try { 
            // 儲存設定到 Firestore
            await setDoc(doc(db, `artifacts/${appId}/users/${userId}/lab_config`, 'main'), configState); 
            setStatus('已儲存'); 
            setIsDirty(false); 
            // 強制觸發 App.jsx 重新抓取資料，讓前台也能立刻更新
            setRefreshCount(p=>p+1); 
        } catch(e){ 
            setStatus(e.message); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleSaveContent = async () => { 
        setLoading(true); 
        try {
            const collectionName = activeTab === 'projects' ? 'lab_data' : 'lab_events';
            let dateStr = formState.startDate; if (formState.isMultiDay && formState.endDate) dateStr += ` ~ ${formState.endDate}`;
            let timeStr = formState.startTime; if (formState.isTimeRange && formState.endTime) timeStr += ` - ${formState.endTime}`;
            const data = activeTab === 'projects' ? {
                title: formState.title, abstract: formState.abstract, fullDescription: formState.description, type: formState.type, category: formState.category,
                coverImage: formState.coverImage, images: formState.galleryImages, relatedLinks: formState.relatedLinks, videoUrl: formState.videoUrl,
                date: serverTimestamp(), dateStr, isFeatured: false, userId
            } : {
                title: formState.title, date: dateStr, time: timeStr, location: formState.location, description: formState.description,
                images: formState.galleryImages, link: formState.link, linkText: formState.linkText, userId
            };
            await addDoc(collection(db, `artifacts/${appId}/users/${userId}/${collectionName}`), data);
            setStatus('已發佈'); setIsDirty(false); setRefreshCount(p=>p+1);
            setFormState({ title: '', abstract: '', description: '', type: 'project', category: 'VR', startDate: '', endDate: '', startTime: '', endTime: '', isMultiDay: false, isTimeRange: false, location: '', coverImage: '', galleryImages: [], relatedLinks: [], videoUrl: '', link: '', linkText: '' });
        } catch(e){ setStatus(e.message); } finally { setLoading(false); }
    };
    
    const handleTabSwitch = (newTab) => { if(isDirty && !window.confirm("未儲存，確定切換？")) return; setIsDirty(false); setActiveTab(newTab); setStatus(''); };

    return (
        <div className="max-w-6xl mx-auto px-1">
            <div className="flex justify-between items-center mb-8">
                <SectionLabel>ADMIN PANEL</SectionLabel>
                <Button variant="outline" onClick={handleSafeExit}>退出後台</Button>
            </div>
            <h2 className="font-display text-4xl mb-12 text-foreground">內容管理與發佈</h2>

            <div className="flex space-x-2 md:space-x-4 mb-8 border-b border-border pb-2 overflow-x-auto">
                {['general', 'projects', 'events'].map(tab => (
                    <button key={tab} onClick={() => handleTabSwitch(tab)} className={`pb-2 px-4 font-bold whitespace-nowrap ${activeTab === tab ? 'text-[#0052FF] border-b-2 border-[#0052FF]' : 'text-muted-foreground'}`}>
                        {tab === 'general' ? '網站全域設定' : tab === 'projects' ? '專案與出版' : '近期活動'}
                    </button>
                ))}
            </div>

            {activeTab === 'general' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-foreground">基本資訊 & Logo</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">網站 Logo (選填)</label>
                                <div className="flex items-center gap-4">
                                    {configState.logoUrl ? (
                                        <div className="relative group">
                                            <img src={configState.logoUrl} alt="Preview" className="h-16 w-auto rounded-lg border border-border object-contain bg-muted" />
                                            <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">✕</button>
                                        </div>
                                    ) : <div className="h-16 w-16 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">無 Logo</div>}
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-muted-foreground" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Input label="實驗室簡稱" value={configState.labName} onChange={e => handleConfigChange('labName', e.target.value)} />
                                <Input label="實驗室全名" value={configState.labNameFull} onChange={e => handleConfigChange('labNameFull', e.target.value)} />
                            </div>
                            <Input label="系所名稱" value={configState.department} onChange={e => handleConfigChange('department', e.target.value)} />
                            <Input label="系所連結" value={configState.departmentLink} onChange={e => handleConfigChange('departmentLink', e.target.value)} />
                            <Input label="粉絲專頁連結" value={configState.fanPageUrl} onChange={e => handleConfigChange('fanPageUrl', e.target.value)} />
                            <div className="border-t border-border my-4"></div>
                            <Input label="Hero 大標題" value={configState.heroTitleLine1} onChange={e => handleConfigChange('heroTitleLine1', e.target.value)} />
                            <Input label="Hero 強調文字" value={configState.heroTitleHighlight} onChange={e => handleConfigChange('heroTitleHighlight', e.target.value)} />
                            <textarea value={configState.heroDescription} onChange={e => handleConfigChange('heroDescription', e.target.value)} rows="3" className="w-full px-4 py-3 rounded-xl border border-border bg-input font-ui text-foreground" />
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-foreground">關於我們 & 安全性</h3>
                        <div className="space-y-4">
                            <Input label="關於標題前綴" value={configState.aboutTitlePrefix} onChange={e => handleConfigChange('aboutTitlePrefix', e.target.value)} />
                            <Input label="關於標題強調" value={configState.aboutTitleHighlight} onChange={e => handleConfigChange('aboutTitleHighlight', e.target.value)} />
                            <Input label="關於標題後綴" value={configState.aboutTitleSuffix} onChange={e => handleConfigChange('aboutTitleSuffix', e.target.value)} />
                            <div className="border-t border-border my-4 pt-2">
                                <h4 className="font-bold text-sm text-foreground mb-3">後台管理設定</h4>
                                {/* 這裡的密碼欄位僅供參考，實際登入是依賴 Firebase Auth */}
                                <Input label="後台備註 (非登入密碼)" type="text" value={configState.adminPassword} onChange={e => handleConfigChange('adminPassword', e.target.value)} placeholder="可留空" />
                            </div>
                            <div className="border-t border-border my-4 pt-2">
                                <h4 className="font-bold text-sm text-foreground mb-3">教授列表</h4>
                                {configState.professors.map((prof, idx) => (
                                    <div key={idx} className="p-3 bg-muted rounded-lg border border-border space-y-2 mb-2">
                                        <div className="flex justify-between"><span className="text-xs font-mono-tech text-foreground">教授 {idx + 1}</span><button onClick={() => removeProf(idx)} className="text-red-500 text-xs">移除</button></div>
                                        <input className="w-full p-2 rounded border border-border text-sm bg-input text-foreground" placeholder="姓名" value={prof.name} onChange={e => handleProfChange(idx, 'name', e.target.value)} />
                                        <input className="w-full p-2 rounded border border-border text-sm bg-input text-foreground" placeholder="職稱" value={prof.title} onChange={e => handleProfChange(idx, 'title', e.target.value)} />
                                        <textarea className="w-full p-2 rounded border border-border text-sm bg-input text-foreground" rows="2" placeholder="專長描述" value={prof.description} onChange={e => handleProfChange(idx, 'description', e.target.value)} />
                                    </div>
                                ))}
                                <Button variant="secondary" onClick={addProf} className="w-full text-sm">+ 新增教授</Button>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-border">
                            <Button onClick={handleSaveGeneral} disabled={loading} className="w-full">{loading ? '儲存中...' : '儲存所有設定'}</Button>
                            {status && <p className="text-center text-sm text-[#0052FF] mt-2">{status}</p>}
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-foreground">新增 {activeTab === 'projects' ? '專案' : '活動'}</h3>
                        <div className="space-y-4">
                            <Input label="標題" value={formState.title} onChange={e => handleChange('title', e.target.value)} />
                            {activeTab === 'projects' ? (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex-1"><label className="text-xs text-muted-foreground">類型</label><select value={formState.type} onChange={e => handleChange('type', e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-input text-foreground"><option value="project">專案</option><option value="publication">出版物</option></select></div>
                                        <div className="flex-1"><label className="text-xs text-muted-foreground">分類</label><select value={formState.category} onChange={e => handleChange('category', e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-input text-foreground"><option value="VR">VR</option><option value="AR">AR</option><option value="Game">Game</option></select></div>
                                    </div>
                                    <Input label="簡短摘要" value={formState.abstract} onChange={e => handleChange('abstract', e.target.value)} />
                                    <div>
                                        <label className="text-xs text-muted-foreground block mb-2">封面照片 (單張)</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} className="block w-full text-sm text-muted-foreground" />
                                        {formState.coverImage && <img src={formState.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg mt-2 border border-border" />}
                                    </div>
                                    <Input label="影片連結 (YouTube)" value={formState.videoUrl} onChange={e => handleChange('videoUrl', e.target.value)} />
                                    <div className="bg-muted p-3 rounded-xl border border-border">
                                        <label className="text-xs font-bold text-foreground block mb-2">相關資源連結</label>
                                        {formState.relatedLinks.map((link, idx) => (
                                            <div key={idx} className="flex gap-2 items-center bg-card p-2 rounded border border-border mb-2"><span className="text-xs flex-1 truncate text-[#0052FF]">{link.text}</span><button onClick={() => removeRelatedLink(idx)} className="text-red-500 text-xs px-2">✕</button></div>
                                        ))}
                                        <div className="flex gap-2"><input className="flex-1 p-2 rounded border border-border text-sm" placeholder="名稱" value={newLinkState.text} onChange={e => setNewLinkState({...newLinkState, text: e.target.value})} /><input className="flex-1 p-2 rounded border border-border text-sm" placeholder="Url" value={newLinkState.url} onChange={e => setNewLinkState({...newLinkState, url: e.target.value})} /><Button variant="secondary" className="h-auto py-1 px-3 text-xs" onClick={addRelatedLink}>新增</Button></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-muted p-3 rounded-xl border border-border">
                                        <div className="flex items-center gap-4 mb-2"><span className="text-xs font-bold text-foreground">日期</span><label className="text-xs cursor-pointer text-muted-foreground"><input type="checkbox" checked={formState.isMultiDay} onChange={(e) => handleChange('isMultiDay', e.target.checked)} className="mr-1" />多日</label></div>
                                        <div className="flex flex-col gap-2">
                                            <Input label="開始日期" type="date" value={formState.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                                            {formState.isMultiDay && <Input label="結束日期" type="date" value={formState.endDate} onChange={e => handleChange('endDate', e.target.value)} />}
                                        </div>
                                    </div>
                                    <div className="bg-muted p-3 rounded-xl border border-border">
                                        <div className="flex items-center gap-4 mb-2"><span className="text-xs font-bold text-foreground">時間</span><label className="text-xs cursor-pointer text-muted-foreground"><input type="checkbox" checked={formState.isTimeRange} onChange={(e) => handleChange('isTimeRange', e.target.checked)} className="mr-1" />結束時間</label></div>
                                        <div className="flex flex-col gap-2">
                                            <Input label="開始" type="time" value={formState.startTime} onChange={e => handleChange('startTime', e.target.value)} />
                                            {formState.isTimeRange && <Input label="結束" type="time" value={formState.endTime} onChange={e => handleChange('endTime', e.target.value)} />}
                                        </div>
                                    </div>
                                    <Input label="地點" value={formState.location} onChange={e => handleChange('location', e.target.value)} />
                                    <Input label="外部連結" value={formState.link} onChange={e => handleChange('link', e.target.value)} />
                                    <Input label="按鈕文字" value={formState.linkText} onChange={e => handleChange('linkText', e.target.value)} />
                                </>
                            )}
                            <div>
                                <label className="text-xs text-muted-foreground block mb-2">相簿圖片</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} className="block w-full text-sm text-muted-foreground" />
                                {formState.galleryImages.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{formState.galleryImages.map((img, idx) => (<div key={idx} className="relative w-16 h-16 group"><img src={img} alt="Preview" className="w-full h-full object-cover rounded-lg border border-border" /><button onClick={() => removeGalleryImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button></div>))}</div>}
                            </div>
                            <label className="text-xs text-muted-foreground">詳細內容</label>
                            <textarea value={formState.description} onChange={e => handleChange('description', e.target.value)} rows="4" className="w-full px-4 py-3 rounded-xl border border-border bg-input font-ui text-foreground" />
                            <Button onClick={handleSaveContent} disabled={loading} className="w-full">{loading ? '處理中...' : '發佈內容'}</Button>
                            {status && <p className="text-center text-sm text-[#0052FF]">{status}</p>}
                        </div>
                    </Card>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4 text-foreground">列表</h3>
                        <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                            {(activeTab === 'projects' ? labContent : eventsContent).map(item => (
                                <div key={item.id} className="p-4 bg-card rounded-xl shadow-sm border border-border flex justify-between items-start">
                                    <div className="w-3/4 pr-2">
                                        <h4 className="font-bold text-foreground break-all whitespace-normal leading-snug">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 break-all whitespace-normal line-clamp-2">
                                            {activeTab === 'projects' ? item.abstract : item.date}
                                        </p>
                                    </div>
                                    <button onClick={() => handleDelete(activeTab === 'projects' ? 'lab_data' : 'lab_events', item.id)} className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-200 rounded whitespace-nowrap shrink-0">刪除</button>
                                </div>
                            ))}
                            {(activeTab === 'projects' ? labContent : eventsContent).length === 0 && <p className="text-muted-foreground text-center py-8">無資料</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;