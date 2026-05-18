import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useBotsStore } from '../store'
import io from 'socket.io-client'

const COLORS = ['av-green', 'av-purple', 'av-amber', 'av-blue']

export default function Layout() {
  const { user, logout } = useAuthStore()
  const { bots, currentBot, fetchBots, setCurrentBot } = useBotsStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { fetchBots() }, [])

  const nav = [
    { path: '/', label: 'Дашборд', icon: 'ti-layout-dashboard' },
    { path: '/dialogs', label: 'Диалоги', icon: 'ti-message-2' },
    { path: '/bots', label: 'Мои боты', icon: 'ti-robot' },
    { path: '/settings', label: 'Настройки', icon: 'ti-settings' },
    { path: '/pricing', label: 'Тарифы', icon: 'ti-credit-card' },
  ]

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <div style={{ display:'flex', height:'100vh' }}>
      {/* Sidebar */}
      <div style={{ width:220, background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:20, fontWeight:600, color:'var(--text)', letterSpacing:'-0.5px' }}>
            Bot<span style={{ color:'var(--green)' }}>.</span>kz
          </div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:2, fontFamily:'monospace' }}>AI платформа v1.0</div>
        </div>

        {/* Nav */}
        <div style={{ padding:'12px 10px', flex:1 }}>
          <div style={{ fontSize:10, color:'var(--text3)', padding:'10px 8px 5px', letterSpacing:'.08em', textTransform:'uppercase', fontWeight:500 }}>Главное</div>
          {nav.map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display:'flex', alignItems:'center', gap:9, padding:'8px 10px',
                borderRadius:'8px', cursor:'pointer', fontSize:13,
                color: isActive(item.path) ? 'var(--text)' : 'var(--text2)',
                background: isActive(item.path) ? 'var(--bg3)' : 'transparent',
                border: isActive(item.path) ? '1px solid var(--border2)' : '1px solid transparent',
                marginBottom:1, transition:'all .15s'
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize:16 }} />
              {item.label}
            </div>
          ))}
        </div>

        {/* Bots list */}
        <div style={{ padding:'10px', borderTop:'1px solid var(--border)' }}>
          <div style={{ fontSize:10, color:'var(--text3)', padding:'4px 8px 6px', letterSpacing:'.08em', textTransform:'uppercase', fontWeight:500 }}>Мои боты</div>
          {bots.map((bot, i) => (
            <div
              key={bot.id}
              onClick={() => { setCurrentBot(bot); navigate('/') }}
              style={{
                display:'flex', alignItems:'center', gap:8, padding:'7px 10px',
                borderRadius:8, fontSize:12, cursor:'pointer', transition:'all .15s',
                color: currentBot?.id === bot.id ? 'var(--text)' : 'var(--text2)',
                background: currentBot?.id === bot.id ? 'var(--bg3)' : 'transparent'
              }}
            >
              <div style={{ width:7, height:7, borderRadius:'50%', background: bot.isActive ? 'var(--green)' : 'var(--amber)', flexShrink:0 }} />
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{bot.name}</span>
            </div>
          ))}
          <div
            onClick={() => navigate('/bots')}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, fontSize:12, cursor:'pointer', color:'var(--text3)' }}
          >
            <i className="ti ti-plus" style={{ fontSize:13 }} /> Добавить бота
          </div>
        </div>

        {/* User */}
        <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize:10, color:'var(--text3)' }}>{user?.plan}</div>
          </div>
          <button onClick={logout} className="btn" style={{ padding:'5px 8px', fontSize:12 }}>
            <i className="ti ti-logout" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'var(--bg2)' }}>
          <div style={{ fontSize:15, fontWeight:500, color:'var(--text)' }}>
            {nav.find(n => isActive(n.path))?.label || 'Дашборд'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="pill pill-green">● Активен</span>
            {currentBot && <span className="pill pill-gray">{currentBot.name}</span>}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
