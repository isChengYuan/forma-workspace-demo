import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, Sparkles, BookOpen, ListTodo, CheckCheck, FolderOpen, Bell, ChartNoAxesCombined, ChevronDown, ChevronRight, ArrowUpRight, ArrowRight, Search, Plus, X, Clock3, Users, Wallet, ArrowUp, ArrowDown, SlidersHorizontal, Upload, FileText, Check, MoreHorizontal, LogOut, Settings, ShieldCheck, Send, CornerDownLeft, Download, CheckCircle2, Circle, BriefcaseBusiness, Scale, UserRound, CalendarDays, PanelLeftClose, PanelLeftOpen, CircleHelp, ExternalLink, Copy, ThumbsUp, RefreshCw, Eye, EyeOff, LockKeyhole, Mail, CircleAlert, Trash2, Archive, FileCheck2, Menu, Cpu, TrendingUp, Leaf, Layers, Globe2, Shield, ListFilter } from 'lucide-react';
import { USERS, SPACES, COMMON, dayKey, dateBefore, rangeFor, permittedDocs, makeDocs, makeEvents, filterEvents, totals, series, makeTasks, loadState } from './model.js';
import './styles.css';

const icons = [LayoutDashboard,Sparkles,BookOpen,ListTodo,CheckCheck,FileCheck2,FolderOpen,Bell,ChartNoAxesCombined];
const businessIcons = {
 hr:[Search,Users,RefreshCw,CalendarDays,Wallet,TrendingUp],
 sales:[ListFilter,Users,BriefcaseBusiness,Send,FileText,Wallet,TrendingUp],
 legal:[FileText,ShieldCheck,Check,RefreshCw,Scale,CircleAlert,Shield],
};
const money = n => Number(n).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});
const num = n => Number(n).toLocaleString('zh-CN',{maximumFractionDigits:1});
const EVENTS=makeEvents();
function IconButton({icon:Icon,onClick,label,className=''}) { return <button className={`icon-button ${className}`} onClick={onClick} title={label} aria-label={label}>
<Icon size={19}/>
</button>; }
function Brand({light=false}) { return <div className={`brand ${light?'light':''}`}>
<span className="brand-icon">
<Layers size={22}/>
</span>
<span>序间</span>
</div>; }
function Badge({children,tone=''}) { const label=typeof children==='string'?children:'';const semantic=label==='高优先级'?'priority-high':label==='常规'?'priority-normal':label==='低优先级'?'priority-low':label.includes('待')?'status-pending':label.includes('完成')||label.includes('通过')||label==='已入库'?'status-success':label.includes('驳回')?'status-danger':label.includes('审核')?'status-warning':label.includes('进行')?'status-info':tone;return <span className={`badge ${semantic}`}>{children}</span>; }
function Empty({title='还没有相关内容',description='试试调整筛选条件，或创建一条新记录。'}) { return <div className="empty">
<FolderOpen size={34}/>
<h3>{title}</h3>
<p>{description}</p>
</div>; }
function Modal({title,children,onClose,wide=false}) { useEffect(()=>{const h=e=>{if(e.key==='Escape')onClose();};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h);},[onClose]); return <div className="modal-backdrop" onClick={onClose}>
<section role="dialog" aria-modal="true" aria-label={title} className={`modal ${wide?'wide':''}`} onClick={e=>e.stopPropagation()}>
<div className="modal-head">
<h2>{title}</h2>
<IconButton icon={X} label="关闭" onClick={onClose}/>
</div>{children}</section>
</div>; }
function exportCSV(name,rows){const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

function Login({onLogin,accounts}) {
 const [id,setId]=useState('');const [password,setPassword]=useState('');const [show,setShow]=useState(false);const [error,setError]=useState('');const [remember,setRemember]=useState(true);
 useEffect(()=>{setId(localStorage.getItem('forma-remember')||'');},[]);
 function submit(e){e.preventDefault();const user=accounts.find(u=>u.id===id.trim());if(!user||password!=='123456'){setError('账号或密码不正确，请检查后重试。');return;}if(remember)localStorage.setItem('forma-remember',id);else localStorage.removeItem('forma-remember');onLogin(user);}
 return <div className="login-page">
<header>
<Brand/>
</header>
<div className="login-orb orb-one"/>
<div className="login-orb orb-two"/>
<main className="login-center">
<form className="login-card" onSubmit={submit}>
<div className="login-card-top">
<span className="small-logo">
<Layers size={24}/>
</span>
<div>
<h2>欢迎回到序间</h2>
<p>登录，开启轻盈高效的一天</p>
</div>
</div>
<label>登录账号<div className="input-with-icon">
<UserRound size={18}/>
<input required value={id} onChange={e=>{setId(e.target.value);setError('');}} placeholder="请输入账号，例如 demo001" autoComplete="username"/>
</div>
</label>
<label>登录密码<div className="input-with-icon">
<LockKeyhole size={18}/>
<input required type={show?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="请输入密码" autoComplete="current-password"/>
<button type="button" className="bare" aria-label="显示或隐藏密码" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>
</div>
</label>
<div className="remember">
<label>
<input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>记住账号</label>
<span>安全连接已就绪 <ShieldCheck size={13}/>
</span>
</div>{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary login-submit" type="submit">进入工作空间 <ArrowRight size={18}/>
</button>
<div className="test-accounts">
<div className="test-heading">快速填入测试账号 <span>统一密码 123456</span>
</div>
<div className="account-options">{USERS.map(u=>
<button type="button" key={u.id} className={id===u.id?'selected':''} onClick={()=>{setId(u.id);setPassword('123456');setError('');}}>
<span>{u.name}<small>{u.role}</small>
</span>
<span>{u.id}</span>
</button>)}</div>
</div>
</form>
</main>
</div>;
}

function App(){
 const [accounts,setAccounts]=useState(()=>loadState('forma-accounts-v1',USERS));
 const [user,setUser]=useState(()=>{const id=sessionStorage.getItem('forma-user');return loadState('forma-accounts-v1',USERS).find(u=>u.id===id)||null;});
 useEffect(()=>{localStorage.setItem('forma-accounts-v1',JSON.stringify(accounts));},[accounts]);
 const [space,setSpace]=useState(()=>localStorage.getItem('forma-space')||'hr');const [page,setPage]=useState('首页');const [switchOpen,setSwitchOpen]=useState(false);const [collapsed,setCollapsed]=useState(false);const [mobile,setMobile]=useState(false);
 const [docs,setDocs]=useState(()=>loadState('forma-docs-v1',makeDocs()));const [tasks,setTasks]=useState(()=>loadState('forma-tasks-v1',makeTasks()));const [extraEvents,setExtraEvents]=useState(()=>loadState('forma-events-v1',[]));const [toast,setToast]=useState('');const [search,setSearch]=useState('');const [globalSearch,setGlobalSearch]=useState(false);const [modal,setModal]=useState(null);const [preset,setPreset]=useState('最近7天');const [grain,setGrain]=useState('日');const [custom,setCustom]=useState({start:dateBefore(6),end:dateBefore(0)});const [allScope,setAllScope]=useState(false);const [readMessages,setReadMessages]=useState(()=>loadState('forma-read-v1',[]));
 const notify=msg=>setToast(msg);
 useEffect(()=>{if(toast){const id=setTimeout(()=>setToast(''),3600);return()=>clearTimeout(id);}},[toast]);
 useEffect(()=>localStorage.setItem('forma-docs-v1',JSON.stringify(docs)),[docs]);useEffect(()=>localStorage.setItem('forma-tasks-v1',JSON.stringify(tasks)),[tasks]);useEffect(()=>localStorage.setItem('forma-events-v1',JSON.stringify(extraEvents)),[extraEvents]);useEffect(()=>localStorage.setItem('forma-read-v1',JSON.stringify(readMessages)),[readMessages]);
 useEffect(()=>{if(user&&!user.spaces.includes(space))setSpace(user.spaces[0]);},[user,space]);
 const currentSpace=user?.spaces.includes(space)?space:(user?.spaces[0]||'hr');const config=SPACES[currentSpace];const range=rangeFor(preset,custom);const events=useMemo(()=>[...EVENTS,...extraEvents],[extraEvents]);const filtered=filterEvents(events,range,currentSpace);const stats=totals(filtered);const visibleDocs=docs.filter(d=>d.space==='public'||d.space===currentSpace);const currentTasks=tasks.filter(t=>t.space===currentSpace);const pending=currentTasks.filter(t=>t.status==='待处理').length;
 function navigate(p){setPage(p==='数据分析'?'效能中心':p);setMobile(false);setSearch('');setAllScope(false);window.scrollTo(0,0);}
 function login(u){sessionStorage.setItem('forma-user',u.id);setUser(u);setSpace(u.spaces.includes(localStorage.getItem(`forma-last-${u.id}`))?localStorage.getItem(`forma-last-${u.id}`):u.spaces[0]);setPage('首页');setPreset('最近7天');setGrain('日');setAllScope(false);}
 function switchSpace(s){if(!user.spaces.includes(s))return;setSpace(s);setPage('首页');setSwitchOpen(false);setAllScope(false);localStorage.setItem('forma-space',s);localStorage.setItem(`forma-last-${user.id}`,s);notify(`已切换至${SPACES[s].name}工作台`);}
 function logout(){sessionStorage.removeItem('forma-user');setUser(null);setModal(null);setPage('首页');}
 function updateTask(id,status){setTasks(prev=>prev.map(t=>t.id===id?{...t,status}:t));setModal(null);notify(`事项已${status==='已完成'?'完成':status==='已通过'?'审批通过':status==='已驳回'?'驳回':'更新'}`);}
 function taskDetail(task){setModal({kind:'task',task});}
 if(!user)return <Login onLogin={login} accounts={accounts}/>;
 const commonProps={user,space:currentSpace,config,notify,docs,setDocs,visibleDocs,tasks:currentTasks,setTasks,taskDetail,range,preset,setPreset,grain,setGrain,custom,setCustom,events,stats,filtered,allScope,setAllScope,accounts,setAccounts};
 const currentIcon=icons[COMMON.indexOf(page)]||BriefcaseBusiness;const PageIcon=currentIcon;
 return <div className={`app theme-${currentSpace} ${collapsed?'collapsed':''}`}>
   {mobile&&<div className="mobile-overlay" onClick={()=>setMobile(false)}/>}
   <aside className={`sidebar ${mobile?'mobile-open':''}`}>
<Brand/>
<div className="workspace-wrap">
<button className="workspace-switch" onClick={()=>user.spaces.length>1&&setSwitchOpen(!switchOpen)} disabled={user.spaces.length===1}>
<span className="workspace-avatar">{currentSpace==='hr'?<Users size={21}/>:currentSpace==='sales'?<BriefcaseBusiness size={21}/>:<Scale size={21}/>}</span>
<span className="workspace-label">
<strong>{config.name}工作台</strong>
</span>{user.spaces.length>1&&<ChevronDown size={15}/>}</button>{switchOpen&&<div className="workspace-menu">{user.spaces.map(s=>
<button key={s} onClick={()=>switchSpace(s)}>
<span>{SPACES[s].name}工作台</span>{s===currentSpace&&<Check size={15}/>}</button>)}</div>}</div>
<div className="nav-section-label">工作空间</div>
<nav>{COMMON.map((name,i)=>{const Icon=icons[i];return <button key={name} title={name} className={`nav-item ${page===name?'active':''}`} onClick={()=>navigate(name)}>
<Icon size={18}/>
<span>{name}</span>{name==='待办中心'&&pending>0&&<b>{pending}</b>}{name==='知识问答'&&<span className="ai-label">AI</span>}</button>;})}</nav>
<div className="nav-section-label business-label">{config.name}业务中心</div>
<nav>{config.modules.map((name,i)=>{const Icon=businessIcons[currentSpace][i];return <button key={name} title={name} className={`nav-item ${page===name?'active':''}`} onClick={()=>navigate(name)}>
<Icon size={18}/>
<span>{name}</span>
</button>;})}</nav>
<div className="sidebar-bottom">{user.admin&&<button className={`nav-item ${page==='管理后台'?'active':''}`} onClick={()=>navigate('管理后台')} title="管理后台">
<Settings size={18}/>
<span>管理后台</span>
</button>}<button className="profile" onClick={()=>navigate('个人账号')} title="个人账号">
<span className="avatar">{user.name.slice(-1)}</span>
<span>
<strong>{user.name}</strong>
<small>{user.role}</small>
</span>
<MoreHorizontal size={19}/>
</button>
</div>
</aside>
   <div className="main-shell">
<header className="topbar">
<div className="breadcrumbs">
<IconButton icon={Menu} label="打开菜单" onClick={()=>setMobile(!mobile)} className="mobile-menu-button"/>
<IconButton icon={collapsed?PanelLeftOpen:PanelLeftClose} label="折叠侧边栏" onClick={()=>setCollapsed(!collapsed)} className="desktop-collapse"/>
<span>{config.name}工作台</span>
<ChevronRight size={13}/>
<strong>{page}</strong>
</div>
<div className="top-actions">
<button className="global-search" aria-label="搜索工作空间" onClick={()=>setGlobalSearch(true)}>
<Search size={16}/>
<span>搜索工作空间</span>
</button>
<IconButton icon={CircleHelp} label="使用帮助" onClick={()=>setModal({kind:'help'})}/>
<button className="notification-button" aria-label="消息中心" onClick={()=>navigate('消息中心')}>
<Bell size={19}/>{readMessages.length<3&&<i/>}</button>
</div>
</header>
   <main className="page-content" key={`${currentSpace}-${page}`}>
   {page==='首页'?<Dashboard {...commonProps} navigate={navigate} pending={pending}/>:page==='知识问答'?<Knowledge {...commonProps} setExtraEvents={setExtraEvents} onSource={doc=>setModal({kind:'source',doc})}/>:page==='知识库导入'?<KnowledgeImport {...commonProps} onSource={doc=>setModal({kind:'source',doc})}/>:page==='效能中心'?<Analytics {...commonProps}/>:['待办中心','任务中心','审批中心'].includes(page)?<WorkItems {...commonProps} page={page}/>:page==='文档中心'?<Documents {...commonProps} onSource={doc=>setModal({kind:'source',doc})} navigate={navigate}/>:page==='消息中心'?<Messages {...commonProps} read={readMessages} setRead={setReadMessages} navigate={navigate}/>:page==='个人账号'?<Account {...commonProps} logout={logout}/>:page==='管理后台'&&user.admin?<Admin {...commonProps}/>:<Business {...commonProps} page={page}/>} 
   </main>
</div>
   {toast&&<div className="toast" role="status">
<CheckCircle2 size={18}/>{toast}</div>}
   {globalSearch&&<SearchModal user={user} space={currentSpace} docs={visibleDocs} tasks={currentTasks} onClose={()=>setGlobalSearch(false)} onNavigate={p=>{navigate(p);setGlobalSearch(false);}} onSource={d=>{setGlobalSearch(false);setModal({kind:'source',doc:d});}} onTask={t=>{setGlobalSearch(false);taskDetail(t);}}/>}
   {modal?.kind==='source'&&<SourceModal doc={modal.doc} onClose={()=>setModal(null)}/>}
   {modal?.kind==='help'&&<Modal title="欢迎使用序间" onClose={()=>setModal(null)}>
<div className="help-content">
<div className="help-hero">
<Sparkles size={28}/>
<h3>给工作，多一点从容。</h3>
</div>
<p>使用左侧菜单探索业务、知识与数据。总经理账号可以通过左上角切换工作台。</p>
<p>试试在「知识库导入」上传 TXT 或 Markdown，发布后到「知识问答」提问并查看原文引用。</p>
<p>本 Demo 使用浏览器本地存储保存交互。AI回答、文档解析示例与模型费用均为模拟；没有连接真实模型和企业系统。</p>
<button className="primary" onClick={()=>setModal(null)}>开始体验 <ArrowRight size={16}/>
</button>
</div>
</Modal>}
   {modal?.kind==='task'&&<Modal title="事项详情" onClose={()=>setModal(null)}>
<div className="detail-content">
<div className="detail-code">{modal.task.code}</div>
<h2>{modal.task.title}</h2>
<div className="detail-grid">
<span>所属工作台<strong>{config.name}工作台</strong>
</span>
<span>当前状态<Badge>{modal.task.status}</Badge>
</span>
<span>负责人<strong>{modal.task.owner}</strong>
</span>
<span>截止日期<strong>{modal.task.date}</strong>
</span>
</div>
<h4>事项说明</h4>
<p>请核对相关材料与业务信息，确认内容完整后完成处理。处理结果将同步到待办中心与审批记录。</p>
<div className="timeline">
<div>
<CheckCircle2 size={18}/>
<span>已提交申请<small>材料已就绪，等待负责人处理</small>
</span>
</div>
<div>
<Clock3 size={18}/>
<span>{modal.task.status==='待处理'?'待你处理':modal.task.status}<small>{modal.task.owner} · {config.dept}</small>
</span>
</div>
</div>{modal.task.status==='待处理'&&<div className="modal-actions">{modal.task.category==='审批'&&<button className="secondary" onClick={()=>updateTask(modal.task.id,'已驳回')}>驳回申请</button>}<button className="primary" onClick={()=>updateTask(modal.task.id,modal.task.category==='审批'?'已通过':'已完成')}>{modal.task.category==='审批'?'审批通过':'标记完成'}<Check size={16}/>
</button>
</div>}</div>
</Modal>}
   <KeyboardSearch open={()=>setGlobalSearch(true)}/>
 </div>;
}
function KeyboardSearch({open}){useEffect(()=>{const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();open();}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[open]);return null;}
function PageHeading({title,description,children}){return <div className="page-heading">
<div>
<h1>{title==='数据分析'?'效能中心':title}</h1>{description&&<p>{description}</p>}</div>
<div className="heading-actions">{children}</div>
</div>;}
function TimeFilter({preset,setPreset,grain,setGrain,custom,setCustom,range}){const [draft,setDraft]=useState(custom);const [error,setError]=useState('');const [customOpen,setCustomOpen]=useState(false);return <>
<div className="time-filter">
<CalendarDays size={16}/>
<select aria-label="时间范围" value={preset} onChange={e=>{if(e.target.value==='自定义'){setDraft(custom);setCustomOpen(true);}else{setPreset(e.target.value);setGrain(e.target.value==='今天'?'小时':e.target.value==='本年'?'月':'日');}}}>{['今天','最近7天','最近30天','本周','本月','本季度','本年','自定义'].map(p=>
<option key={p}>{p}</option>)}</select>
<span className="filter-divider"/>
<select value={grain} aria-label="展示粒度" onChange={e=>setGrain(e.target.value)}>{['小时','日','周','月','季度','年'].filter(g=>g!=='小时'||range.start===range.end).map(g=>
<option key={g} value={g}>按{g}</option>)}</select>{preset==='自定义'&&<button className="bare" aria-label="修改日期" onClick={()=>setCustomOpen(true)}>
<SlidersHorizontal size={15}/>
</button>}</div>{customOpen&&<Modal title="自定义时间范围" onClose={()=>setCustomOpen(false)}>
<form className="form-body" onSubmit={e=>{e.preventDefault();if(draft.start>draft.end){setError('开始日期不能晚于结束日期');return;}if((new Date(draft.end)-new Date(draft.start))/86400000>366){setError('演示支持最长366天的时间范围');return;}setCustom(draft);setPreset('自定义');setGrain('日');setCustomOpen(false);}}>
<label>开始日期<input required type="date" value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/>
</label>
<label>结束日期<input required type="date" value={draft.end} onChange={e=>setDraft({...draft,end:e.target.value})}/>
</label>{error&&<p className="form-error">{error}</p>}<button className="primary">应用时间范围</button>
</form>
</Modal>}</>;}
function StatsCards({stats,pending,approvals=0,config,analysis=false}){return <div className="stats-grid">
<div className="stat-card green-stat">
<div className="stat-top">
<span>AI 节省工时</span>
<span className="stat-icon">
<Clock3 size={18}/>
</span>
</div>
<div className="stat-number">{num(stats.saved/60)}<small>小时</small>
</div>
</div>
<div className="stat-card">
<div className="stat-top">
<span>模型使用费用</span>
<span className="stat-icon">
<Wallet size={18}/>
</span>
</div>
<div className="stat-number">
<small className="currency">¥</small>{money(stats.cost)}<small>CNY</small>
</div>
</div>
<div className="stat-card">
<div className="stat-top">
<span>{analysis?'AI 调用次数':'待审批'}</span>
<span className="stat-icon">
<Users size={18}/>
</span>
</div>
<div className="stat-number">{analysis?num(stats.calls):String(approvals).padStart(2,'0')}<small>{analysis?'次':'项'}</small>
</div>
</div>
<div className="stat-card">
<div className="stat-top">
<span>{analysis?'Token 使用量':'待处理事项'}</span>
<span className="stat-icon">{analysis?<Cpu size={18}/>:<ListTodo size={18}/>}</span>
</div>
<div className="stat-number">{analysis?num((stats.input+stats.output)/1000):String(pending).padStart(2,'0')}<small>{analysis?'K':'项'}</small>
</div>
</div>
</div>;}
function TrendChart({data,unit='小时',ariaLabel='按所选时间粒度统计的节省工时趋势'}){const [hover,setHover]=useState(null);const max=Math.max(1,...data.map(d=>d.value))*1.25;const W=680,H=192,left=40,right=16,top=18,bottom=30;const plotH=H-top-bottom;const points=data.map((d,i)=>[left+(i/Math.max(1,data.length-1))*(W-left-right),top+plotH*(1-d.value/max)]);const path=points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ');return <div className="trend-chart">
<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
<defs>
<linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopColor="#81bca2" stopOpacity=".35"/>
<stop offset="100%" stopColor="#b9ddc8" stopOpacity="0"/>
</linearGradient>
</defs>{[0,1,2,3].map(i=>{const y=top+plotH*i/3;return <g key={i}>
<line x1={left} x2={W-right} y1={y} y2={y} stroke="#e8eeeb" strokeDasharray="4 5"/>
<text x={left-12} y={y+4} textAnchor="end">{Math.round(max*(1-i/3))}</text>
</g>;})}{points.length>0&&<>
<path d={`${path} L${points.at(-1)[0]},${top+plotH} L${left},${top+plotH} Z`} fill="url(#chartFill)"/>
<path d={path} fill="none" stroke="#317761" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
</>}{data.map((d,i)=>{if(i%Math.max(1,Math.ceil(data.length/7))!==0&&i!==data.length-1)return null;return <text key={i} x={points[i][0]} y={H-7} textAnchor="middle">{d.label.length===10?d.label.slice(5).replace('-','/'):d.label.length>10?d.label.slice(11):d.label}</text>;})}{data.map((d,i)=>
<circle key={i} cx={points[i][0]} cy={points[i][1]} r={hover===i?5:3} fill={hover===i?'#173b35':'#fff'} stroke="#317761" strokeWidth="2" onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}>
<title>{d.label}：{num(d.value)} {unit}</title>
</circle>)}</svg>
<div className="chart-caption">{hover!==null?`${data[hover].label} · ${num(data[hover].value)} ${unit}`:`单位：${unit} · 将鼠标移至节点查看详情`}</div>
</div>;}

function Dashboard(props){const {user,config,navigate,stats,pending,filtered,range,grain,tasks,taskDetail}=props;const data=series(filtered,range,grain);const costData=series(filtered.map(e=>({...e,saved:e.cost*60})),range,grain);const approvals=tasks.filter(t=>t.category==='审批'&&t.status==='待处理');return <>
<PageHeading eyebrow="A LITTLE MORE SPACE. A LOT MORE POSSIBILITY." title={`你好，${user.name} 👋`} description="今天也留一点时间，给更重要的事。">
<div className="today-label">
<span className="status-dot"/> {new Date().toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}</div>
</PageHeading>
<section className="welcome-banner">
<div className="welcome-copy">
<span className="hero-pill">
<Sparkles size={13}/> YOUR INTELLIGENT WORKSPACE</span>
<h2>让繁琐变轻，<br/>让专注发生。</h2>
<p>{config.caption}</p>
<button className="dark-pill" onClick={()=>navigate('知识问答')}>与知识对话 <ArrowUpRight size={17}/>
</button>
</div>
<div className="hero-art" aria-hidden="true">
<div className="art-orbit orbit-a"/>
<div className="art-orbit orbit-b"/>
<div className="glass-tile tile-back">
<Layers/>
</div>
<div className="glass-tile tile-mid">
<span/>
</div>
<div className="glass-tile tile-front">
<Sparkles size={55} strokeWidth={1.3}/>
</div>
<div className="art-bubble bubble-one"/>
<div className="art-bubble bubble-two"/>
<div className="floating-label">
<span className="status-dot"/> 知识，让协作更有力量</div>
<span className="art-plus plus-one">+</span>
<span className="art-plus plus-two">+</span>
</div>
<div className="hero-corner">THINK CLEAR. WORK LIGHT.</div>
</section>
<div className="section-bar">
<h2>工作概览 <span>OVERVIEW</span>
</h2>
<TimeFilter {...props}/>
</div>
<StatsCards stats={stats} pending={pending} approvals={approvals.length} config={config}/>
<div className="dashboard-middle">
<section className="card trend-card">
<div className="card-head">
<div>
<h3>把时间，慢慢省回来 <span className="subtle-badge">AI 效能</span>
</h3>
<p>{range.start.replaceAll('-','.')} — {range.end.replaceAll('-','.')}</p>
</div>
<button className="text-button" onClick={()=>navigate('数据分析')}>查看分析 <ArrowUpRight size={15}/>
</button>
</div>
<div className="chart-legend">
<span>
<i/> 节省工时</span>
<span className="muted">{num(stats.calls)} 次 AI 协作</span>
</div>
<TrendChart data={data}/>
</section>
<section className="card trend-card">
<div className="card-head"><div><h3>模型消耗趋势</h3><p>{range.start.replaceAll('-','.')} — {range.end.replaceAll('-','.')}</p></div><button className="text-button" onClick={()=>navigate('效能中心')}>查看分析 <ArrowUpRight size={15}/></button></div>
<div className="chart-legend"><span><i/> 模型费用</span><span className="muted">¥ {money(stats.cost)}</span></div>
<TrendChart data={costData} unit="元" ariaLabel="按所选时间粒度统计的模型消耗趋势"/>
</section>
</div>
<div className="dashboard-bottom">
<section className="card tasks-card">
<div className="card-head">
<h3>接下来，做这些 <span className="count-badge">{pending}</span>
</h3>
<button className="text-button" onClick={()=>navigate('待办中心')}>全部待办 <ArrowUpRight size={15}/>
</button>
</div>
<div className="compact-table">
<div className="compact-row table-heading">
<span>事项</span>
<span>截止时间</span>
<span>优先级</span>
<span/>
</div>{tasks.filter(t=>t.status==='待处理').slice(0,3).map((t,i)=>
<button className="compact-row task-row" key={t.id} onClick={()=>taskDetail(t)}>
<span>
<span className={`task-symbol ts-${i}`}>
<FileCheck2 size={17}/>
</span>
<span>
<strong>{t.title}</strong>
<small>{t.category} · {t.code}</small>
</span>
</span>
<span>{t.date===dateBefore(0)?'今天':t.date.slice(5).replace('-','/')}</span>
<span>
<Badge tone={t.priority==='高优先级'?'orange':'neutral'}>{t.priority}</Badge>
</span>
<ChevronRight size={16}/>
</button>)}{pending===0&&<Empty title="所有事项都处理完了" description="享受这份清爽，新的进展正在路上。"/>}</div>
</section>
<section className="card approval-card">
<div className="card-head"><h3>待审批 <span className="count-badge">{approvals.length}</span></h3><button className="text-button" onClick={()=>navigate('审批中心')}>查看全部 <ArrowUpRight size={15}/></button></div>
<div className="approval-list">{approvals.slice(0,4).map(t=><button key={t.id} onClick={()=>taskDetail(t)}><span><strong>{t.title}</strong><small>{t.code} · {t.date}</small></span><Badge tone={t.priority==='高优先级'?'orange':'neutral'}>{t.priority}</Badge><ChevronRight size={15}/></button>)}{approvals.length===0&&<Empty title="暂无待审批" description="新的审批事项会显示在这里。"/>}</div>
</section>
</div>
</>;}

function SourceModal({doc,onClose}){return <Modal title="引用溯源 · 原文预览" onClose={onClose} wide>
<div className="source-layout">
<aside>
<span className="file-icon">
<FileText size={28}/>
</span>
<h3>{doc.title}</h3>
<Badge>{doc.space==='public'?'公司公共知识库':`${SPACES[doc.space].name}知识库`}</Badge>
<dl>
<dt>文档版本</dt>
<dd>{doc.version}</dd>
<dt>文档状态</dt>
<dd>{doc.status}</dd>
<dt>更新日期</dt>
<dd>{doc.date}</dd>
<dt>文档负责人</dt>
<dd>{doc.owner}</dd>
<dt>引用位置</dt>
<dd>第 {doc.page} 页 · 相关条款</dd>
</dl>
</aside>
<div className="source-paper-wrap">
<div className="source-toolbar">
<span>原文摘录 · 第 {doc.page} 页</span>
<Badge tone="neutral">{doc.type}</Badge>
</div>
<article className="source-paper">
<span className="paper-brand">FORMA / INTERNAL DOCUMENT</span>
<h2>{doc.title}</h2>
<div className="paper-rule"/>
<h4>相关制度与操作要求</h4>
<mark>{doc.content}</mark>
<p className="paper-footnote">本材料为虚构演示资料，用于展示知识引用与溯源交互。</p>
<span className="paper-page">— {doc.page} —</span>
</article>
</div>
</div>
</Modal>;}

function Knowledge({user,space,config,docs,notify,setExtraEvents,onSource}){
 const historySeeds={hr:['年假应该提前多久申请？','员工转正需要哪些流程？','招聘面试有哪些环节？','考勤异常如何补卡？','员工档案如何更新？','培训申请需要谁审批？'],sales:['客户折扣如何审批？','重点商机多久跟进一次？','回款逾期应该如何处理？','报价单如何发起审批？','客户资料如何归档？','合同签署前需要检查什么？'],legal:['合同审查需要哪些材料？','用印申请有哪些要求？','合规事件应该如何上报？','供应商合同如何归档？','案件进度如何更新？','授权委托书如何申请？']};
 const [input,setInput]=useState('');const [extra,setExtra]=useState(false);const [busy,setBusy]=useState(false);const [conversation,setConversation]=useState(()=>loadState(`forma-chat-${user.id}-${space}`,[]));const [history,setHistory]=useState(()=>{const saved=loadState(`forma-chat-history-${user.id}-${space}`,[]);const titles=new Set(saved.map(h=>h.title));return [...saved,...historySeeds[space].filter(title=>!titles.has(title)).map((title,i)=>({id:`seed-${space}-${i}`,title,at:Date.now()-(saved.length+i)*86400000}))];});const [historyPage,setHistoryPage]=useState(0);const [liked,setLiked]=useState([]);const end=useRef(null);
 const available=permittedDocs(docs,user,space,extra);const orderedHistory=useMemo(()=>[...history].sort((a,b)=>b.at-a.at),[history]);const historyPages=Math.max(1,Math.ceil(orderedHistory.length/6));useEffect(()=>{localStorage.setItem(`forma-chat-${user.id}-${space}`,JSON.stringify(conversation));end.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[conversation,user.id,space]);useEffect(()=>{localStorage.setItem(`forma-chat-history-${user.id}-${space}`,JSON.stringify(history));},[history,user.id,space]);
 const suggestions=space==='hr'?['员工转正需要哪些流程？','年假应该提前多久申请？','招聘面试有哪些环节？']:space==='sales'?['客户折扣如何审批？','重点商机多久跟进一次？','回款逾期应该如何处理？']:['合同审查需要哪些材料？','用印申请有哪些要求？','合规事件应该如何上报？'];
 async function ask(question=input){
   if(!question.trim()||busy)return;
   const q=question.trim();setInput('');setHistoryPage(0);setHistory(prev=>[{id:crypto.randomUUID(),title:q,at:Date.now()},...prev.filter(h=>h.title!==q)]);setConversation(prev=>[...prev,{role:'user',text:q,id:crypto.randomUUID()}]);setBusy(true);
   await new Promise(r=>setTimeout(r,650));
   const matched=available.filter(d=>d.keywords.some(k=>q.toLowerCase().includes(k.toLowerCase()))||q.includes(d.title)||d.title.includes(q)).slice(0,2);
   const message={id:crypto.randomUUID(),role:'assistant',sources:matched.map(d=>d.id),text:matched.length?'根据当前工作台已发布的内部知识，相关要求如下：':'当前知识库中未找到足够依据，无法生成可靠回答。请尝试更具体的关键词，或先导入并发布相关制度文档。',time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})};
   setConversation(prev=>[...prev,message]);
   setExtraEvents(prev=>{const duplicate=prev.some(e=>e.question===q&&e.employee===user.name&&e.space===space&&e.date===dateBefore(0));return [...prev,{id:crypto.randomUUID(),question:q,date:dateBefore(0),hour:new Date().getHours(),space,dept:config.dept,employee:user.name,feature:'知识问答',model:'模型 A · Lite',calls:1,saved:matched.length&&!duplicate?12:0,cost:.026,input:1300,output:420}];});
   setBusy(false);
 }
 function copyMessage(m){const text=[m.text,...(m.sources||[]).map(id=>available.find(d=>d.id===id)?.content||'')].join('\n');navigator.clipboard.writeText(text).then(()=>notify('回答已复制'),()=>notify('当前浏览器无法复制，请手动选择文本'));}
 return <>
<PageHeading eyebrow="KNOWLEDGE, CONNECTED." title="知识问答" description="每个好答案，都有据可循。">
<button className="secondary" onClick={()=>{setConversation([]);setInput('');}}>
<Plus size={16}/> 新建对话</button>
</PageHeading>
<div className="chat-layout">
<section className="card chat-panel">
<div className="chat-toolbar">
<div>
<span className="status-dot"/>
<strong>{config.name}知识助手</strong>
<Badge>内部知识问答</Badge>
</div>
<span className="muted">
<ShieldCheck size={14}/> 权限范围内检索</span>
</div>
<div className="chat-messages">{conversation.length===0?<div className="chat-welcome">
<div className="chat-orb">
<Sparkles size={40} strokeWidth={1.3}/>
</div>
<span className="eyebrow">LESS SEARCHING. MORE KNOWING.</span>
<h2>你的问题，<br/>值得一个有来源的答案。</h2>
<p>从制度流程到工作指南，与企业知识直接对话。</p>
<div className="suggestion-list">{suggestions.map((q,i)=>
<button key={q} onClick={()=>ask(q)}>
<span className="suggestion-number">0{i+1}</span>{q}<ArrowUpRight size={17}/>
</button>)}</div>
</div>:conversation.map(m=>{const sources=(m.sources||[]).map(id=>available.find(d=>d.id===id)).filter(Boolean);const revoked=m.role==='assistant'&&m.sources?.length>0&&sources.length===0;return <div key={m.id} className={`chat-message ${m.role}`}>
<span className="message-avatar">{m.role==='user'?user.name.slice(-1):<Sparkles size={18}/>}</span>
<div className="message-body">
<div className="message-author">{m.role==='user'?user.name:'序间知识助手'}{m.role==='assistant'&&<span>模拟检索回答</span>}</div>
<p>{revoked?'该回答引用的文档已暂停或不在当前检索范围，内容暂不可见。':m.text}</p>{sources.map((d,i)=>
<p key={d.id} className="answer-paragraph">{d.content}<button className="cite" aria-label={`查看引用${i+1}`} onClick={()=>onSource(d)}>{i+1}</button>
</p>)}{sources.length>0&&<div className="answer-sources">
<div>
<BookOpen size={13}/> 参考了 {sources.length} 份内部文档</div>{sources.map((d,i)=>
<button key={d.id} onClick={()=>onSource(d)}>
<span>{i+1}</span>
<FileText size={14}/>{d.title}<small>第{d.page}页</small>
<ArrowUpRight size={14}/>
</button>)}</div>}{m.role==='assistant'&&<div className="message-tools">
<IconButton icon={Copy} label="复制回答" onClick={()=>copyMessage(m)}/>
<IconButton icon={ThumbsUp} label="有帮助" className={liked.includes(m.id)?'liked':''} onClick={()=>{setLiked(prev=>prev.includes(m.id)?prev: [...prev,m.id]);notify('感谢反馈，已标记为有帮助');}}/>
<span>{m.time} · 引用内容请结合原文核对</span>
</div>}</div>
</div>;})}{busy&&<div className="thinking">
<Sparkles size={18}/>
<span>正在检索已授权的内部知识</span>
<i/>
<i/>
<i/>
</div>}<div ref={end}/>
</div>
<form className="chat-composer" onSubmit={e=>{e.preventDefault();ask();}}>
<textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask();}}} placeholder="向企业知识提问，例如：员工转正需要哪些流程？" aria-label="输入知识问题" rows="2"/>
<div className="composer-bottom">
<span>
<BookOpen size={14}/> {available.length} 份可用文档 <span className="composer-separator">/</span> Enter 发送</span>
<button className="send-button" disabled={!input.trim()||busy} aria-label="发送问题">
<ArrowUp size={19}/>
</button>
</div>
</form>
<p className="chat-disclaimer">回答来自演示知识文档 · 未接入真实大模型 · 请勿用于实际业务决策</p>
</section>
<aside className="chat-context">
<div className="card context-card">
<h3>
<Layers size={17}/> 知识范围</h3>
<p>只检索你有权限访问的知识</p>
<div className="scope-item">
<span className="scope-icon">
<Globe2 size={17}/>
</span>
<div>
<strong>公司公共知识库</strong>
<small>公司制度与通用流程</small>
</div>
<CheckCircle2 size={16}/>
</div>
<div className="scope-item">
<span className="scope-icon">
<Users size={17}/>
</span>
<div>
<strong>{config.name}知识库</strong>
<small>专业知识与业务指南</small>
</div>
<CheckCircle2 size={16}/>
</div>{user.spaces.length>1&&<label className="checkbox-row">
<input type="checkbox" checked={extra} onChange={e=>setExtra(e.target.checked)}/>同时检索其他已授权工作台</label>}</div>
<div className="card context-card history-card">
<h3>
<Clock3 size={17}/> 历史对话 <span className="count-badge">{history.length}</span>
</h3>
<p>最近的提问排在最前</p>
<div className="history-list">{orderedHistory.slice(historyPage*6,historyPage*6+6).map(h=>
<button key={h.id} onClick={()=>setInput(h.title)}>
<span>{h.title}<small>{new Date(h.at).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})}</small>
</span>
<ChevronRight size={14}/>
</button>)}</div>{historyPages>1&&<div className="history-pagination"><button disabled={historyPage===0} onClick={()=>setHistoryPage(p=>Math.max(0,p-1))} aria-label="上一页">‹</button><span>{historyPage+1} / {historyPages}</span><button disabled={historyPage===historyPages-1} onClick={()=>setHistoryPage(p=>Math.min(historyPages-1,p+1))} aria-label="下一页">›</button></div>}
</div>
</aside>
</div>
</>;
}

function KnowledgeImport({user,space,config,docs,setDocs,visibleDocs,notify,onSource}){
 const [query,setQuery]=useState('');const [tab,setTab]=useState('全部文档');const [upload,setUpload]=useState(false);const [draft,setDraft]=useState({title:'',content:'',type:'TXT',category:'操作指南'});const [files,setFiles]=useState([]);const [error,setError]=useState('');const fileRef=useRef(null);const rows=visibleDocs.filter(d=>d.title.includes(query)&&(tab==='全部文档'||d.status===tab));
 async function pickFiles(list){const incoming=Array.from(list);const valid=incoming.filter(f=>/\.(pdf|docx?|xlsx?|pptx?|txt|md)$/i.test(f.name));if(valid.length!==incoming.length)setError('部分文件格式不支持，请选择 PDF、Office、TXT 或 Markdown。');if(valid.some(f=>f.size>20*1024*1024)){setError('单个文件请控制在20MB以内');return;}const parsed=await Promise.all(valid.map(async f=>({title:f.name.replace(/\.[^.]+$/,''),type:f.name.split('.').at(-1).toUpperCase(),size:`${Math.max(.01,f.size/1024/1024).toFixed(2)} MB`,content:/\.(txt|md)$/i.test(f.name)?await f.text():'',needsExcerpt:!(/\.(txt|md)$/i.test(f.name))})));setFiles(parsed);setUpload(true);}
 function submit(e){e.preventDefault();const items=files.length?files:[{...draft,size:'0.01 MB'}];if(items.some(f=>!f.title.trim()||!(f.content||draft.content).trim())){setError('请填写标题和可用于问答的原文内容。Office/PDF 演示需手动粘贴摘录。');return;}const newDocs=items.map((f,i)=>({id:crypto.randomUUID(),space,title:f.title,content:f.content||draft.content,type:f.type,category:draft.category,version:'v1.0',status:'待审核',date:dateBefore(0),size:f.size,owner:user.name,page:'1',keywords:[f.title,...(f.content||draft.content).split(/[，。\s]+/).filter(s=>s.length>1&&s.length<12)]}));if(JSON.stringify([...newDocs,...docs]).length>1000000){setError('演示知识库文本总量不能超过100万字符，请缩短文档摘录后重试。');return;}setDocs(prev=>[...newDocs,...prev]);setUpload(false);setFiles([]);setDraft({title:'',content:'',type:'TXT',category:'操作指南'});setError('');notify(`已导入 ${newDocs.length} 份文档，请审核并发布`);}
 function changeStatus(d,status){if(d.space==='public'&&!user.admin){notify('公共知识库由管理中心维护');return;}setDocs(prev=>prev.map(item=>item.id===d.id?{...item,status}:item));notify(status==='已入库'?'文档已发布，可在知识问答中检索':status==='已暂停'?'已暂停，该文档不再参与问答检索':'文档已归档');}
 return <>
<PageHeading eyebrow="A HOME FOR WHAT YOUR TEAM KNOWS." title="知识库导入" description="把分散的经验，变成团队共同的知识。">
<button className="primary" onClick={()=>{setUpload(true);setFiles([]);setError('');}}>
<Plus size={16}/> 导入知识</button>
</PageHeading>
<div className="knowledge-summary">
<div className="card">
<span className="summary-symbol mint">
<BookOpen size={24}/>
</span>
<div>
<p>知识文档</p>
<strong>{visibleDocs.length}<small>份</small>
</strong>
</div>
<span className="summary-caption">公共 + {config.name}知识库</span>
</div>
<div className="card">
<span className="summary-symbol lavender">
<CheckCircle2 size={24}/>
</span>
<div>
<p>已发布知识</p>
<strong>{visibleDocs.filter(d=>d.status==='已入库').length}<small>份</small>
</strong>
</div>
<span className="summary-caption">可用于知识问答</span>
</div>
<div className="card">
<span className="summary-symbol peach">
<Clock3 size={24}/>
</span>
<div>
<p>待审核文档</p>
<strong>{visibleDocs.filter(d=>d.status==='待审核').length}<small>份</small>
</strong>
</div>
<span className="summary-caption">审核后即可发布</span>
</div>
</div>
{error&&!upload&&<div className="form-error">{error}</div>}<section className="card">
<div className="list-toolbar">
<div className="tabs">{['全部文档','已入库','待审核','已暂停','已归档'].map(t=>
<button className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
<div className="search-field">
<Search size={16}/>
<input placeholder="搜索文档名称" value={query} onChange={e=>setQuery(e.target.value)}/>
</div>
</div>
<div className="table-scroll">
<table>
<thead>
<tr>
<th>文档名称</th>
<th>所属知识库</th>
<th>状态</th>
<th>更新日期</th>
<th>操作</th>
</tr>
</thead>
<tbody>{rows.map(d=>
<tr key={d.id}>
<td>
<button className="doc-title-button" onClick={()=>onSource(d)}>
<span className="table-file">
<FileText size={20}/>
</span>
<span>
<strong>{d.title}</strong>
<small>{d.type} · {d.size} · {d.version}</small>
</span>
</button>
</td>
<td>{d.space==='public'?'公司公共':config.name}知识库</td>
<td>
<Badge tone={d.status==='待审核'?'orange':d.status==='已暂停'?'neutral':''}>{d.status}</Badge>
</td>
<td className="muted">{d.date}</td>
<td>
<div className="row-actions">
<button onClick={()=>onSource(d)}>预览</button>{(d.space!=='public'||user.admin)&&<>
<button onClick={()=>changeStatus(d,d.status==='已入库'?'已暂停':'已入库')}>{d.status==='已入库'?'暂停':'发布'}</button>{d.status!=='已归档'&&<button onClick={()=>changeStatus(d,'已归档')}>归档</button>}</>}</div>
</td>
</tr>)}</tbody>
</table>{rows.length===0&&<Empty/>}</div>
<div className="table-footer">共 {rows.length} 份文档<span>
<ShieldCheck size={13}/> 文档权限与知识问答实时同步</span>
</div>
</section>{upload&&<Modal title="导入知识文档" onClose={()=>{setUpload(false);setError('');}}>
<form className="form-body" onSubmit={submit}>
<input hidden ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md" onChange={e=>{pickFiles(e.target.files);e.target.value='';}}/>
<div className="info-banner">
<ShieldCheck size={17}/>
<span>将导入至 {config.name}知识库，发布后可被本工作台问答引用。</span>
</div>{files.length>0?<div className="file-upload-list">{files.map((f,i)=>
<div key={i}>
<FileText size={18}/>
<span>{f.title}<small>{f.type} · {f.size} {f.needsExcerpt?'· 请补充原文摘录':'· 文本读取完成'}</small>
</span>
<CheckCircle2 size={17}/>
</div>)}</div>:<label>文档标题<input required placeholder="例如：员工差旅报销管理制度" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
</label>}<label>文档分类<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>
<option>操作指南</option>
<option>部门制度</option>
<option>业务模板</option>
<option>培训资料</option>
</select>
</label>{(!files.length||files.some(f=>f.needsExcerpt))&&<label>原文内容 / 摘录<textarea required rows="6" placeholder="粘贴可用于知识问答的原文。演示不会自动解析 Office 或 PDF。" value={draft.content} onChange={e=>setDraft({...draft,content:e.target.value})}/>
</label>}{files.length>0&&files.every(f=>!f.needsExcerpt)&&<div className="excerpt-preview">{files[0].content.slice(0,500)}</div>}{error&&<div className="form-error">{error}</div>}<div className="modal-actions">
<button type="button" className="secondary" onClick={()=>fileRef.current.click()}>选择文件</button>
<button className="primary">提交审核 <ArrowRight size={16}/>
</button>
</div>
</form>
</Modal>}</>;
}

function Analytics(props){const {user,space,config,events,range,grain,allScope,setAllScope,notify}=props;const [tab,setTab]=useState('业务概览');const [dimension,setDimension]=useState('员工');const filtered=filterEvents(events,range,allScope?'all':space);const stats=totals(filtered);const data=series(filtered,range,grain);const groups=Object.values(filtered.reduce((a,e)=>{const k=tab==='部门分析'||(['业务概览','节省工时','员工分析'].includes(tab)&&dimension==='部门')?e.dept:tab==='模型费用'?e.model:tab==='AI使用情况'?e.feature:e.employee; a[k]||={name:k,dept:e.dept,calls:0,saved:0,cost:0};a[k].calls+=e.calls;a[k].saved+=e.saved;a[k].cost+=e.cost;return a;},{})).sort((a,b)=>b.saved-a.saved);const features=Object.values(filtered.reduce((a,e)=>{a[e.feature]||={name:e.feature,calls:0,saved:0};a[e.feature].calls+=e.calls;a[e.feature].saved+=e.saved;return a;},{}));
 return <>
<PageHeading eyebrow="SMALL IMPROVEMENTS. MEASURABLE IMPACT." title="数据分析" description="看见每一份效率，也看清每一笔投入。">
<button className="secondary" onClick={()=>{exportCSV('序间效能分析', [['维度','部门','调用次数','节省工时（估算）','费用（模拟CNY）'],...groups.map(g=>[g.name,g.dept,g.calls,(g.saved/60).toFixed(2),g.cost.toFixed(2)])]);notify('已导出当前范围的统计报表');}}>
<Download size={16}/> 导出报表</button>
</PageHeading>
<div className="analytics-tabs tabs">{['业务概览','AI使用情况','节省工时','模型费用','员工分析','部门分析'].map(t=>
<button className={t===tab?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
<div className="section-bar">
<div className="analysis-scope">
<h2>{tab}</h2>{user.admin&&<select aria-label="统计工作台范围" value={allScope?'all':space} onChange={e=>setAllScope(e.target.value==='all')}>
<option value={space}>{config.name}工作台</option>
<option value="all">全公司 · 三个工作台</option>
</select>}</div>
<TimeFilter {...props}/>
</div>
<StatsCards stats={stats} config={config} analysis/>
<div className="analytics-grid">
<section className="card">
<div className="card-head">
<div>
<h3>{tab==='模型费用'?'模型费用趋势':'AI 节省工时趋势'}</h3>
<p>{range.start} — {range.end} · 按{grain}统计</p>
</div>
<Badge>{allScope?'全公司':config.dept}</Badge>
</div>{tab==='模型费用'?<CostBars events={filtered} range={range} grain={grain}/>:<TrendChart data={data}/>}</section>
<section className="card composition-card">
<div className="card-head">
<h3>AI 应用构成</h3>
<Sparkles size={18}/>
</div>
<div className="donut-wrap">
<div className="donut" style={{background: stats.calls ? `conic-gradient(#285a48 0 ${(features[0]?.calls||0)/stats.calls*100}%, #a8c9b7 ${(features[0]?.calls||0)/stats.calls*100}% ${((features[0]?.calls||0)+(features[1]?.calls||0))/stats.calls*100}%, #e1e9dd ${((features[0]?.calls||0)+(features[1]?.calls||0))/stats.calls*100}% 100%)` : "#e1e9dd"}}>
<div>
<strong>{num(stats.calls)}</strong>
<span>调用次数</span>
</div>
</div>
<div className="donut-legend">{features.map((f,i)=>
<div key={f.name}>
<span>
<i style={{background:['#285a48','#a8c9b7','#e1e9dd'][i]}}/>{f.name}</span>
<strong>{stats.calls?Math.round(f.calls/stats.calls*100):0}%</strong>
</div>)}</div>
</div>
</section>
</div>
<section className="card">
<div className="card-head">
<div>
<h3>{tab==='模型费用'?'模型费用明细':tab==='AI使用情况'?'AI 功能表现':tab==='部门分析'?'部门效能对比':'员工效能明细'}</h3>
<p>统计按调用时的部门归属和模拟单价汇总</p>
</div>{['业务概览','节省工时','员工分析'].includes(tab)&&<div className="segmented">{['员工','部门'].map(d=>
<button className={dimension===d?'active':''} key={d} onClick={()=>setDimension(d)}>{d}</button>)}</div>}</div>
<div className="table-scroll">
<table>
<thead>
<tr>
<th>名称</th>
<th>AI 调用</th>
<th>节省工时（估算）</th>
<th>模型费用</th>
<th>每节省小时成本</th>
<th>效率贡献</th>
</tr>
</thead>
<tbody>{groups.map((g,i)=>
<tr key={g.name}>
<td>
<div className="person-cell">
<span className={`person-avatar pa-${i%3}`}>{g.name.slice(-2)}</span>
<span>
<strong>{g.name}</strong>
<small>{tab==='部门分析'?`${g.calls} 次协作`:g.dept}</small>
</span>
</div>
</td>
<td>{num(g.calls)} 次</td>
<td>
<strong>{num(g.saved/60)}</strong> <span className="muted">小时</span>
</td>
<td>¥ {money(g.cost)}</td>
<td>¥ {money(g.saved?g.cost/(g.saved/60):0)}</td>
<td>
<div className="progress-cell">
<div>
<i style={{width:`${stats.saved?g.saved/stats.saved*100:0}%`}}/>
</div>
<span>{stats.saved?Math.round(g.saved/stats.saved*100):0}%</span>
</div>
</td>
</tr>)}</tbody>
</table>{!groups.length&&<Empty title="所选日期暂无数据" description="演示数据覆盖最近366天，试试切换时间范围。"/>}</div>
<div className="table-footer">
<span>工时 = 人工基准耗时 − AI处理与复核耗时；重复生成不重复计入任务节省量。</span>
</div>
</section>
<div className="info-banner analysis-note">
<CircleHelp size={17}/>
<span>本页费用为演示估算，模型 A / B 为虚构模型；已保存每次调用的费用记录，不受未来价格配置影响。</span>
</div>
</>;
}
function CostBars({events,range,grain}){const scaled=events.map(e=>({...e,saved:e.cost*60}));const data=series(scaled,range,grain);const max=Math.max(1,...data.map(d=>d.value));return <div className="cost-chart">
<div className="cost-bars">{data.slice(-40).map((d,i)=>
<div key={i} className="bar-column">
<span>¥{d.value.toFixed(0)}</span>
<div style={{height:`${Math.max(2,d.value/max*130)}px`}} title={`${d.label} ¥${money(d.value)}`}/>
<small>{d.label.slice(-5)}</small>
</div>)}</div>
<p className="chart-caption">单位：CNY · 超过40个分组时展示最近40组，汇总包含完整范围</p>
</div>;}

function WorkItems({page,user,space,config,tasks,setTasks,taskDetail,notify}){const [tab,setTab]=useState('待处理');const [q,setQ]=useState('');const [create,setCreate]=useState(false);const [title,setTitle]=useState('');const [date,setDate]=useState(dateBefore(0));const [priority,setPriority]=useState('常规');const relevant=tasks.filter(t=>page==='任务中心'?t.category==='任务':page==='审批中心'?t.category==='审批':true);const rows=relevant.filter(t=>(tab==='全部'||(tab==='已处理'?t.status!=='待处理':t.status==='待处理'))&&t.title.includes(q));return <>
<PageHeading eyebrow="ONE STEP CLOSER, EVERY DAY." title={page} description={page==='审批中心'?'让每一次决策，都清晰有序。':'把重要的事情，放在看得见的地方。'}>
<button className="primary" onClick={()=>setCreate(true)}>
<Plus size={16}/>{page==='任务中心'?'新建任务':'发起申请'}</button>
</PageHeading>
<div className="work-summary">{[['待你处理',relevant.filter(t=>t.status==='待处理').length,Clock3],['已经完成',relevant.filter(t=>t.status!=='待处理').length,CheckCircle2],['高优先级',relevant.filter(t=>t.priority==='高优先级'&&t.status==='待处理').length,TrendingUp]].map(([label,value,I],i)=>
<div className="card" key={label}>
<span className={`summary-symbol ${['mint','lavender','peach'][i]}`}>
<I size={22}/>
</span>
<div>
<p>{label}</p>
<strong>{String(value).padStart(2,'0')}</strong>
</div>
</div>)}</div>
<section className="card">
<div className="list-toolbar">
<div className="tabs">{['待处理','已处理','全部'].map(t=>
<button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
<div className="search-field">
<Search size={16}/>
<input placeholder="搜索事项" value={q} onChange={e=>setQ(e.target.value)}/>
</div>
</div>
<div className="table-scroll">
<table>
<thead>
<tr>
<th>事项名称</th>
<th>类型</th>
<th>负责人</th>
<th>截止时间</th>
<th>优先级</th>
<th>状态</th>
<th>操作</th>
</tr>
</thead>
<tbody>{rows.map(t=>
<tr key={t.id}>
<td>
<button className="table-title" onClick={()=>taskDetail(t)}>
<strong>{t.title}</strong>
<small>{t.code}</small>
</button>
</td>
<td>{t.category}</td>
<td>{t.owner}</td>
<td>{t.date}</td>
<td>
<Badge tone={t.priority==='高优先级'?'orange':'neutral'}>{t.priority}</Badge>
</td>
<td>
<Badge tone={t.status==='已驳回'?'orange':''}>{t.status}</Badge>
</td>
<td>
<button className="text-button" onClick={()=>taskDetail(t)}>{t.status==='待处理'?'立即处理':'查看详情'}<ChevronRight size={14}/>
</button>
</td>
</tr>)}</tbody>
</table>{!rows.length&&<Empty title="这里已经清爽了" description="暂无符合条件的事项，可以创建新任务或切换筛选。"/>}</div>
<div className="table-footer">共 {rows.length} 条事项<span>仅展示当前工作台授权范围内的记录</span>
</div>
</section>{create&&<Modal title={page==='任务中心'?'新建任务':'发起申请'} onClose={()=>setCreate(false)}>
<form className="form-body" onSubmit={e=>{e.preventDefault();setTasks(prev=>[{id:crypto.randomUUID(),space,title,category:page==='任务中心'?'任务':'审批',priority,status:'待处理',owner:user.name,date,code:`${space.toUpperCase()}-${Date.now().toString().slice(-8)}`},...prev]);setCreate(false);setTitle('');setTab('待处理');notify('已创建，可在待办中心处理');}}>
<label>事项名称<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="请输入需要协作的事项"/>
</label>
<label>截止日期<input required type="date" value={date} onChange={e=>setDate(e.target.value)}/>
</label>
<label>优先级<select value={priority} onChange={e=>setPriority(e.target.value)}>
<option>常规</option>
<option>高优先级</option>
<option>低优先级</option>
</select>
</label>
<div className="info-banner">负责人：{user.name} · {config.name}工作台</div>
<button className="primary">提交 <ArrowRight size={16}/>
</button>
</form>
</Modal>}</>;}

function Documents({user,space,visibleDocs,setDocs,onSource,notify}){const [q,setQ]=useState('');const [tab,setTab]=useState('全部文档');const [selecting,setSelecting]=useState(false);const [selected,setSelected]=useState([]);const [upload,setUpload]=useState(false);const [draft,setDraft]=useState({title:'',type:'PDF',category:'团队文档',size:'—',content:''});const docs=visibleDocs.filter(d=>d.title.includes(q)&&(tab==='全部文档'||(tab==='公共文档'?d.space==='public':d.space!=='public')));function toggle(id){setSelected(prev=>prev.includes(id)?prev.filter(item=>item!==id):[...prev,id]);}function importSelected(){setDocs(prev=>prev.map(d=>selected.includes(d.id)?{...d,status:'已入库',date:dateBefore(0)}:d));notify(`已将 ${selected.length} 份文档导入知识库`);setSelected([]);setSelecting(false);}function addDocument(e){e.preventDefault();setDocs(prev=>[{id:crypto.randomUUID(),space,title:draft.title.trim(),content:draft.content.trim()||'该文档已导入文档中心，尚未添加知识内容。',type:draft.type,category:draft.category,version:'v1.0',status:'未入库',date:dateBefore(0),size:draft.size,owner:user.name,page:'1',keywords:[draft.title.trim()]},...prev]);setDraft({title:'',type:'PDF',category:'团队文档',size:'—',content:''});setUpload(false);notify('文档已导入文档中心');}return <>
<PageHeading eyebrow="EVERYTHING, IN ITS PLACE." title="文档中心" description="一个清晰有序的地方，收纳团队的每一份沉淀。">
<div className="document-heading-actions"><button className="secondary" onClick={()=>setUpload(true)}><Upload size={16}/> 导入文档</button><button className="primary" disabled={selecting&&!selected.length} onClick={()=>selecting?importSelected():setSelecting(true)}><BookOpen size={16}/>{selecting?`确认导入知识库${selected.length?`（${selected.length}）`:''}`:'导入知识库'}</button></div>
</PageHeading>
<div className="list-toolbar standalone">
<div className="tabs">{['全部文档','部门文档','公共文档'].map(t=>
<button key={t} onClick={()=>setTab(t)} className={tab===t?'active':''}>{t}</button>)}{selecting&&<button className="cancel-selection" onClick={()=>{setSelecting(false);setSelected([]);}}>取消选择</button>}</div>
<div className="search-field">
<Search size={16}/>
<input placeholder="搜索文档" value={q} onChange={e=>setQ(e.target.value)}/>
</div>
</div>
<div className="document-grid">{docs.map((d,i)=>
<div className={`document-select-card ${selecting&&selected.includes(d.id)?'selected':''}`} key={d.id}>
{selecting&&<label className="document-check"><input type="checkbox" checked={selected.includes(d.id)} onChange={()=>toggle(d.id)}/><span>{selected.includes(d.id)?'已选择':'选择'}</span></label>}
<button className="card document-card" onClick={()=>onSource(d)}>
<div className={`document-preview dp-${i%3}`}>
<div className="mini-paper">
<FileText size={25}/>
<span/>
<span/>
<span/>
<span/>
</div>
<span className="document-type">{d.type}</span>
</div>
<div className="document-info">
<h3>{d.title}</h3>
<p>{d.category} · {d.version}</p>
<div>
<span>{d.owner} · {d.date.slice(5)}</span>
<ArrowUpRight size={17}/>
</div>
</div>
</button></div>)}</div>{!docs.length&&<Empty/>}{upload&&<Modal title="导入到文档中心" onClose={()=>setUpload(false)}><form className="form-body" onSubmit={addDocument}><label>选择本地文档<input required type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>20*1024*1024){notify('单个文件请控制在20MB以内');e.target.value='';return;}const type=file.name.split('.').at(-1).toUpperCase();const content=/\.(txt|md)$/i.test(file.name)?await file.text():'';setDraft({...draft,title:file.name.replace(/\.[^.]+$/,''),type,size:`${Math.max(.01,file.size/1024/1024).toFixed(2)} MB`,content});}}/></label><label>文档名称<input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="选择文件后自动填写"/></label><label>文档分类<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}><option>团队文档</option><option>制度文件</option><option>业务资料</option><option>培训资料</option></select></label><div className="info-banner"><FolderOpen size={17}/><span>文件将先保存到当前工作台的文档中心，不会自动进入知识库。</span></div><button className="primary">导入文档 <ArrowRight size={16}/></button></form></Modal>}</>;}
function Messages({space,config,read,setRead,navigate,notify}){const [tab,setTab]=useState('全部消息');const messages=[{id:`${space}-1`,title:'本周 AI 效能简报已更新',text:`${config.dept}的工时节省与模型费用已汇总，来看看团队的新进展。`,type:'数据通知',target:'数据分析',icon:ChartNoAxesCombined},{id:`${space}-2`,title:'知识库文档已就绪',text:'部门制度与操作指南已发布，你可以在知识问答中直接提问并查看原文。',type:'知识通知',target:'知识问答',icon:BookOpen},{id:`${space}-3`,title:'你有待处理的工作事项',text:'新的任务和审批等待处理，请前往待办中心查看。',type:'事项提醒',target:'待办中心',icon:ListTodo}];const rows=messages.filter(m=>tab!=='未读消息'||!read.includes(m.id));return <>
<PageHeading eyebrow="STAY IN THE LOOP." title="消息中心" description="不错过重要进展，也不被无关消息打扰。">
<button className="secondary" onClick={()=>{setRead(prev=>[...new Set([...prev,...messages.map(m=>m.id)])]);notify('当前工作台消息已全部标记已读');}}>
<CheckCheck size={16}/> 全部已读</button>
</PageHeading>
<section className="card">
<div className="list-toolbar">
<div className="tabs">{['全部消息','未读消息'].map(t=>
<button className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
</div>{rows.map(m=>
<button className={`message-row ${read.includes(m.id)?'read':''}`} key={m.id} onClick={()=>{setRead(prev=>[...new Set([...prev,m.id])]);navigate(m.target);}}>
<span className="summary-symbol mint">
<m.icon size={23}/>
</span>
<div>
<h3>{m.title}{!read.includes(m.id)&&<span className="unread-dot"/>}</h3>
<p>{m.text}</p>
<span>{m.type} · 今天</span>
</div>
<ArrowUpRight size={18}/>
</button>)}{!rows.length&&<Empty title="所有消息都已读完" description="新的消息会出现在这里。"/>}</section>
</>;}

function Account({user,stats,logout,notify}){const [defaultSpace,setDefaultSpace]=useState(localStorage.getItem(`forma-last-${user.id}`)||user.spaces[0]);return <>
<PageHeading eyebrow="YOUR OWN CORNER." title="个人账号" description="管理你的身份、工作空间和个人偏好。"/>
<div className="account-layout">
<section className="card account-profile">
<div className="large-avatar">{user.name.slice(-1)}</div>
<h2>{user.name}</h2>
<p>{user.role} · {user.dept}</p>
<Badge>账号正常</Badge>
<div className="account-divider"/>
<button className="secondary" onClick={logout}>
<LogOut size={17}/> 退出登录</button>
</section>
<section className="card account-details">
<h3>账号信息</h3>
<div className="detail-grid">
<span>登录账号<strong>{user.id}</strong>
</span>
<span>姓名<strong>{user.name}</strong>
</span>
<span>职位<strong>{user.role}</strong>
</span>
<span>所属部门<strong>{user.dept}</strong>
</span>
</div>
<h3>已授权工作台</h3>
<div className="authorized-spaces">{user.spaces.map(s=>
<span key={s}>
<ShieldCheck size={18}/>{SPACES[s].name}工作台<Check size={16}/>
</span>)}</div>
<h3>默认工作台</h3>
<div className="default-space">
<select value={defaultSpace} onChange={e=>{setDefaultSpace(e.target.value);localStorage.setItem(`forma-last-${user.id}`,e.target.value);notify('默认工作台已保存');}}>{user.spaces.map(s=>
<option key={s} value={s}>{SPACES[s].name}工作台</option>)}</select>
<span>下次登录时优先进入此工作台</span>
</div>
<div className="info-banner">
<ShieldCheck size={17}/> 当前为测试账号，密码统一为 123456；工作台授权由管理员维护。</div>
</section>
</div>
</>;}

function Admin({notify,accounts,setAccounts}) {
 const [tab,setTab]=useState('工作台授权');
 const [logs,setLogs]=useState(()=>loadState('forma-admin-logs',[]));
 const [budget,setBudget]=useState(()=>loadState('forma-budget',3000));
 const [limit,setLimit]=useState(()=>loadState('forma-limit',80));
 const [editing,setEditing]=useState(null);
 function log(action){const next=[{date:new Date().toLocaleString('zh-CN'),action,user:'张三'},...logs];setLogs(next);localStorage.setItem('forma-admin-logs',JSON.stringify(next));}
 return <>
<PageHeading eyebrow="A WELL-ORGANIZED WORKSPACE." title="管理后台" description="统一配置权限、知识与模型，让协作有序运转。"/>
 <div className="analytics-tabs tabs">{['工作台授权','模型与预算','操作记录'].map(t=>
<button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
 {tab==='工作台授权'?<section className="card">
<div className="card-head">
<div>
<h3>工作台白名单</h3>
<p>为测试账号添加或回收工作台权限，重新登录后生效</p>
</div>
<Badge>4 个用户</Badge>
</div>
<div className="table-scroll">
<table>
<thead>
<tr>
<th>用户</th>
<th>职位 / 部门</th>
<th>人事工作台</th>
<th>销售工作台</th>
<th>法务工作台</th>
<th>操作</th>
</tr>
</thead>
<tbody>{accounts.map(u=>
<tr key={u.id}>
<td>
<div className="person-cell">
<span className="person-avatar">{u.name.slice(-1)}</span>
<span>
<strong>{u.name}</strong>
<small>{u.id}</small>
</span>
</div>
</td>
<td>{u.role}<small className="block muted">{u.dept}</small>
</td>{['hr','sales','legal'].map(s=>
<td key={s}>{u.spaces.includes(s)?<span className="permission-check">
<Check size={17}/> 已授权</span>:<span className="muted">—</span>}</td>)}<td>{u.admin?<Badge>管理员</Badge>:<button className="text-button" onClick={()=>setEditing({...u,spaces:[...u.spaces]})}>调整白名单 <SlidersHorizontal size={14}/>
</button>}</td>
</tr>)}</tbody>
</table>
</div>
<div className="table-footer">授权关系仅保存在当前浏览器；账号仍限定为四个测试 ID。</div>
</section>
 :tab==='模型与预算'?<div className="settings-grid">
<section className="card settings-card">
<h3>部门预算与预警</h3>
<p>本地保存，用于展示管理配置交互</p>
<form className="form-body" onSubmit={e=>{e.preventDefault();localStorage.setItem('forma-budget',JSON.stringify(budget));localStorage.setItem('forma-limit',JSON.stringify(limit));log(`更新部门预算 ¥${budget}，预警阈值 ${limit}%`);notify('预算配置已保存到本地演示');}}>
<label>月度预算（CNY）<input required type="number" min="1" value={budget} onChange={e=>setBudget(Number(e.target.value))}/>
</label>
<label>预算预警阈值（%）<input required type="number" min="1" max="100" value={limit} onChange={e=>setLimit(Number(e.target.value))}/>
</label>
<button className="primary">保存配置 <Check size={16}/>
</button>
</form>
</section>
<section className="card settings-card">
<h3>演示模型</h3>{[['模型 A · Lite','知识问答、智能分析','轻量型'],['模型 B · Pro','文档摘要、复杂任务','专业型']].map(([name,use,label])=>
<div className="model-item" key={name}>
<span className="summary-symbol mint">
<Cpu size={23}/>
</span>
<div>
<h4>{name}</h4>
<p>{use}</p>
</div>
<Badge>{label}</Badge>
</div>)}<div className="info-banner">模拟模型不产生真实费用，无需配置 API Key。</div>
</section>
</div>
 :<section className="card">
<div className="card-head">
<h3>管理配置变更记录</h3>
</div>{logs.length?logs.map((l,i)=>
<div className="log-row" key={i}>
<ShieldCheck size={18}/>
<div>
<strong>{l.action}</strong>
<p>{l.user} · {l.date}</p>
</div>
</div>):<Empty title="暂无配置变更" description="调整授权或保存预算后，操作记录会出现在这里。"/>}</section>}
 {editing&&<Modal title={`调整白名单 · ${editing.name}`} onClose={()=>setEditing(null)}>
<form className="form-body" onSubmit={e=>{e.preventDefault();if(!editing.spaces.length){notify('请至少保留一个工作台');return;}setAccounts(prev=>prev.map(u=>u.id===editing.id?editing:u));log(`调整 ${editing.name} 的授权：${editing.spaces.map(s=>SPACES[s].name).join('、')}`);setEditing(null);notify('工作台白名单已保存，该用户重新登录后生效');}}>
<div className="info-banner">{editing.id} · {editing.role}。两个及以上工作台授权会启用切换器。</div>{Object.entries(SPACES).map(([s,c])=>
<label className="grant-option" key={s}>
<span>
<strong>{c.name}工作台</strong>
<small>{c.en}</small>
</span>
<input type="checkbox" checked={editing.spaces.includes(s)} onChange={e=>setEditing({...editing,spaces:e.target.checked?[...editing.spaces,s]:editing.spaces.filter(x=>x!==s)})}/>
</label>)}<button className="primary">保存授权 <Check size={16}/>
</button>
</form>
</Modal>}</>;
}

const businessData={
 '招聘管理':[['产品设计师','产品设计部','面试中','3 人'],['前端工程师','技术研发部','筛选中','2 人'],['客户成功经理','客户成功部','Offer 待发','1 人'],['品牌策划师','市场品牌部','已完成','1 人']],
 '员工档案':[['林沐','产品设计部','在职','产品设计师'],['陈嘉宁','人事部','在职','人事专员'],['周予安','销售部','试用期','客户经理'],['沈知行','研发部','在职','前端工程师']],
 '入转调离':[['林沐 · 转正申请','产品设计部','待审批','转正'],['周予安 · 入职办理','销售部','办理中','入职'],['沈知行 · 岗位调整','研发部','已完成','调岗']],
 '考勤休假':[['陈嘉宁 · 年假申请','人事部','待审批','2 天'],['林沐 · 出差申请','产品设计部','已通过','3 天'],['周予安 · 考勤补录','销售部','待核验','1 次']],
 '薪酬福利':[['10月薪资核算','全公司','核算中','128 人'],['季度绩效奖金','人事部','待审批','12 人'],['年度健康体检','全公司','进行中','128 人']],
 '绩效与培训':[['Q4 绩效目标设定','全公司','进行中','86% 完成'],['新员工文化培训','人事部','待开展','12 人'],['管理者领导力工作坊','管理层','已完成','8 人']],
 '线索管理':[['云栖科技','官网咨询','待跟进','A级线索'],['北辰集团','行业展会','联系中','A级线索'],['山海传媒','客户转介','已转商机','B级线索'],['星河设计','官网咨询','待跟进','B级线索']],
 '客户管理':[['云栖科技有限公司','软件与科技','合作中','战略客户'],['北辰集团','企业服务','洽谈中','重点客户'],['山海传媒','文化创意','合作中','优质客户']],
 '商机管理':[['云栖科技 · 年度方案','云栖科技','商务谈判','¥ 280,000'],['北辰集团 · 平台升级','北辰集团','方案报价','¥ 160,000'],['山海传媒 · 增值服务','山海传媒','需求确认','¥ 85,000']],
 '跟进活动':[['云栖科技方案演示','云栖科技','已安排','线上会议'],['北辰集团需求访谈','北辰集团','待跟进','客户拜访'],['山海传媒合作回访','山海传媒','已完成','电话沟通']],
 '报价与订单':[['云栖科技年度服务报价','云栖科技','待审批','¥ 280,000'],['北辰集团平台订单','北辰集团','执行中','¥ 160,000'],['星河设计咨询报价','星河设计','已发送','¥ 48,000']],
 '合同与回款':[['云栖科技年度服务合同','云栖科技','待回款','¥ 140,000'],['北辰集团首期款','北辰集团','已到账','¥ 80,000'],['山海传媒续约合同','山海传媒','签署中','¥ 85,000']],
 '销售目标':[['Q4 团队销售目标','销售部','进行中','¥ 2,000,000'],['10月回款目标','销售部','进行中','¥ 500,000'],['新客户拓展目标','销售部','进行中','20 家']],
 '合同管理':[['云栖科技服务合同','销售部','审查中','¥ 280,000'],['年度采购框架协议','采购协同','履约中','¥ 360,000'],['品牌合作协议','市场品牌部','待签署','¥ 120,000']],
 '合同审查':[['云栖科技服务合同审查','销售部','待审查','标准合同'],['供应商补充协议审查','采购协同','审查中','非标条款'],['品牌合作协议审查','市场品牌部','已完成','标准合同']],
 '用印管理':[['品牌合作协议用印','市场品牌部','待审批','公章 · 2份'],['服务合同骑缝章','销售部','待用印','合同章 · 3份'],['资质证明文件盖章','行政协同','已完成','公章 · 1份']],
 '履约管理':[['云栖科技项目一期交付','销售部','进行中','节点 2/4'],['供应商年度服务验收','采购协同','待验收','节点 3/3'],['品牌合作续签确认','市场品牌部','待确认','30天后到期']],
 '案件与纠纷':[['服务结算争议协商','销售部','协商中','一般风险'],['商标异议材料准备','法务部','处理中','一般风险'],['供应商交付纠纷','采购协同','已结案','已解决']],
 '合规风险':[['供应商资质复核','采购协同','待整改','中风险'],['客户数据处理检查','销售部','检查中','低风险'],['内部制度年度复核','全公司','已完成','低风险']],
 '知识产权':[['Forma 品牌商标','法务部','已注册','商标'],['智能协作软件著作权','研发部','申请中','著作权'],['知识检索交互专利','研发部','审查中','专利']],
};
function Business({page,space,config,user,notify}){const storageKey=`forma-business-${space}-${page}`;const [rows,setRows]=useState(()=>loadState(storageKey,(businessData[page]||[]).map((r,i)=>({id:`BIZ-${space.toUpperCase()}-${1200+i}`,title:r[0],dept:r[1],status:r[2],value:r[3],owner:config.person,date:dateBefore(i)}))));const [q,setQ]=useState('');const [filter,setFilter]=useState('全部状态');const [detail,setDetail]=useState(null);const [create,setCreate]=useState(false);const [draft,setDraft]=useState({title:'',dept:config.dept,value:'',status:'进行中'});useEffect(()=>{localStorage.setItem(storageKey,JSON.stringify(rows));},[rows,storageKey]);const filtered=rows.filter(r=>(r.title.includes(q)||r.dept.includes(q))&&(filter==='全部状态'||r.status===filter));return <>
<PageHeading eyebrow={`${config.en} / BUSINESS`} title={page} description={`从每一个细节开始，让${config.name}工作更有条理。`}>
<button className="secondary" onClick={()=>{exportCSV(page,[['编号','名称','关联部门/客户','状态','信息','负责人','日期'],...filtered.map(r=>[r.id,r.title,r.dept,r.status,r.value,r.owner,r.date])]);notify('已导出当前列表');}}>
<Download size={16}/> 导出</button>
<button className="primary" onClick={()=>setCreate(true)}>
<Plus size={16}/> 新建记录</button>
</PageHeading>
<div className="business-overview">
<div className="business-count">
<strong>{rows.length}</strong>
<span>全部记录</span>
</div>
<div className="business-count">
<strong>{rows.filter(r=>!['已完成','已结案','已到账','已通过','已注册'].includes(r.status)).length}</strong>
<span>持续跟进</span>
</div>
<div className="business-count">
<strong>{rows.filter(r=>['已完成','已结案','已到账','已通过','已注册','已签署'].includes(r.status)).length}</strong>
<span>已完成</span>
</div>
</div>
<section className="card">
<div className="list-toolbar">
<div className="search-field">
<Search size={16}/>
<input value={q} placeholder="搜索名称、部门或客户" onChange={e=>setQ(e.target.value)}/>
</div>
<div className="filter-select">
<ListFilter size={15}/>
<select value={filter} onChange={e=>setFilter(e.target.value)}>
<option>全部状态</option>{[...new Set(rows.map(r=>r.status))].map(s=>
<option key={s}>{s}</option>)}</select>
</div>
</div>
<div className="table-scroll">
<table>
<thead>
<tr>
<th>名称 / 编号</th>
<th>关联部门或客户</th>
<th>状态</th>
<th>业务信息</th>
<th>负责人</th>
<th>更新日期</th>
<th/>
</tr>
</thead>
<tbody>{filtered.map(r=>
<tr key={r.id}>
<td>
<button className="table-title" onClick={()=>setDetail(r)}>
<strong>{r.title}</strong>
<small>{r.id}</small>
</button>
</td>
<td>{r.dept}</td>
<td>
<Badge tone={r.status.includes('待')?'orange':''}>{r.status}</Badge>
</td>
<td>{r.value}</td>
<td>
<span className="owner-inline">
<span>{r.owner.slice(-1)}</span>{r.owner}</span>
</td>
<td className="muted">{r.date}</td>
<td>
<IconButton icon={ArrowUpRight} label={`查看${r.title}`} onClick={()=>setDetail(r)}/>
</td>
</tr>)}</tbody>
</table>{!filtered.length&&<Empty/>}</div>
<div className="table-footer">共 {filtered.length} 条记录<span>演示数据 · 本地保存</span>
</div>
</section>{create&&<Modal title={`新建${page}记录`} onClose={()=>setCreate(false)}>
<form className="form-body" onSubmit={e=>{e.preventDefault();setRows(prev=>[{...draft,id:`BIZ-${Date.now().toString().slice(-8)}`,owner:user.name,date:dateBefore(0)},...prev]);setCreate(false);setDraft({title:'',dept:config.dept,value:'',status:'进行中'});notify('业务记录已创建');}}>
<label>记录名称<input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="请输入记录名称"/>
</label>
<label>关联部门 / 客户<input required value={draft.dept} onChange={e=>setDraft({...draft,dept:e.target.value})}/>
</label>
<label>业务信息<input required value={draft.value} onChange={e=>setDraft({...draft,value:e.target.value})} placeholder="例如金额、岗位、类型等"/>
</label>
<label>状态<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}>
<option>进行中</option>
<option>待审批</option>
<option>已完成</option>
</select>
</label>
<button className="primary">保存记录 <Check size={16}/>
</button>
</form>
</Modal>}{detail&&<Modal title={`${page} · 记录详情`} onClose={()=>setDetail(null)}>
<div className="detail-content">
<span className="detail-code">{detail.id}</span>
<h2>{detail.title}</h2>
<div className="detail-grid">
<span>关联部门 / 客户<strong>{detail.dept}</strong>
</span>
<span>业务信息<strong>{detail.value}</strong>
</span>
<span>负责人<strong>{detail.owner}</strong>
</span>
<span>更新日期<strong>{detail.date}</strong>
</span>
</div>
<label className="form-label">更新状态<select value={detail.status} onChange={e=>setDetail({...detail,status:e.target.value})}>{[...new Set([detail.status,'进行中','待审批','已完成','已归档'])].map(s=>
<option key={s}>{s}</option>)}</select>
</label>
<div className="info-banner">修改会保存到当前浏览器，并同步更新本页列表。</div>
<div className="modal-actions">
<button className="primary" onClick={()=>{setRows(prev=>prev.map(r=>r.id===detail.id?{...detail,date:dateBefore(0)}:r));setDetail(null);notify('记录状态已更新');}}>保存更新 <Check size={16}/>
</button>
</div>
</div>
</Modal>}</>;}

function SearchModal({user,space,docs,tasks,onClose,onNavigate,onSource,onTask}){const [q,setQ]=useState('');const menus=[...COMMON,...SPACES[space].modules];const pages=menus.filter(m=>m.includes(q));const sources=docs.filter(d=>d.title.includes(q));const jobs=tasks.filter(t=>t.title.includes(q));return <Modal title="搜索工作空间" onClose={onClose}>
<div className="search-modal-content">
<div className="search-field large">
<Search size={20}/>
<input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索页面、文档或待办事项…"/>
</div>
<div className="search-results">
<h4>功能入口</h4>{pages.slice(0,5).map(p=>
<button key={p} onClick={()=>onNavigate(p)}>
<LayoutDashboard size={16}/>{p}<ArrowRight size={15}/>
</button>)}<h4>知识文档</h4>{sources.slice(0,4).map(d=>
<button key={d.id} onClick={()=>onSource(d)}>
<FileText size={16}/>{d.title}<ArrowUpRight size={15}/>
</button>)}<h4>待办事项</h4>{jobs.slice(0,3).map(t=>
<button key={t.id} onClick={()=>onTask(t)}>
<ListTodo size={16}/>{t.title}<ChevronRight size={15}/>
</button>)}{!pages.length&&!sources.length&&!jobs.length&&<Empty title="没有找到相关内容" description="试试其他关键词，搜索仅在当前工作台范围内进行。"/>}</div>
<div className="search-foot">
<ShieldCheck size={13}/>仅搜索{SPACES[space].name}工作台授权内容<span>ESC 关闭</span>
</div>
</div>
</Modal>;}

createRoot(document.getElementById('root')).render(<App/>);
