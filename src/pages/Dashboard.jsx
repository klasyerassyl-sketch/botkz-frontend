import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBotsStore, useDialogsStore } from '../store'
import api from '../api/client'

export default function Dashboard() {
  const { currentBot } = useBotsStore()
  const { dialogs, fetchDialogs } = useDialogsStore()
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentBot) return
    fetchDialogs(currentBot.id)
    api.get(`/bots/${currentBot.id}/stats`).then(r => setStats(r.data))
  }, [currentBot])

  if (!currentBot) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <i className="ti ti-robot" style={{ fontSize:48, color:'var(--text3)' }} />
      <div style={{ fontSize:15, color:'var(--text2)' }}>Создайте первого бота чтобы начать</div>
      <button className="btn btn-green" onClick={() => navigate('/bots')}>
        <i className="ti ti-plus" /> Создать бота
      </button>
    </div>
  )

  const metrics = [
    { label:'Диалогов', value: stats?.totalDialogs ?? '—', sub:'за всё время', icon:'ti-message-2' },
    { label:'AI закрыл', value: stats ? `${stats.aiClosedPercent}%` : '—', sub:'без менеджера', icon:'ti-robot' },
    { label:'Сообщений', value: stats?.totalMessages ?? '—', sub:'всего', icon:'ti-messages' },
    { label:'Каналов', value: currentBot._count?.dialogs !== undefined ? (currentBot.channels?.length ?? 0) : '—', sub:'подключено', icon:'ti-plug' },
  ]

  const recent = dialogs.slice(0, 5)
  const chClass = { WHATSAPP:'ch-wa', TELEGRAM:'ch-tg', INSTAGRAM:'ch-ig' }
  const chLabel = { WHATSAPP:'WA', TELEGRAM:'TG', INSTAGRAM:'IG' }

  return (
    <div style={{ flex:1, overflowY:'auto', padding:22, display:'flex', flexDirection:'column', gap:16 }}>
      {/* Metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding:'16px' }}>
            <i className={`ti ${m.icon}`} style={{ fontSize:18, color:'var(--green)', display:'block', marginBottom:10 }} />
            <div style={{ fontSize:26, fontWeight:600, color:'var(--text)', letterSpacing:'-1px' }}>{m.value}</div>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:4 }}>{m.label}</div>
            <div style={{ fontSize:11, color:'var(--green)', marginTop:3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Recent dialogs */}
        <div className="card">
          <div className="card-title"><i className="ti ti-messages" /> Последние диалоги</div>
          {recent.length === 0 && <div style={{ fontSize:13, color:'var(--text3)', textAlign:'center', padding:'20px 0' }}>Диалогов пока нет</div>}
          {recent.map(d => (
            <div
              key={d.id}
              onClick={() => navigate('/dialogs')}
              style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px', borderRadius:'var(--radius)', border:'1px solid var(--border)', cursor:'pointer', marginBottom:8, transition:'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div className="avatar av-green" style={{ width:30, height:30, fontSize:11 }}>
                {(d.clientName || d.clientId).slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500, color:'var(--text)', display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span>{d.clientName || d.clientId} <span className={`ch-badge ${chClass[d.channel?.type]}`}>{chLabel[d.channel?.type]}</span></span>
                  <span style={{ fontSize:10, color:'var(--text3)' }}>{new Date(d.updatedAt).toLocaleTimeString('ru', { hour:'2-digit', minute:'2-digit' })}</span>
                </div>
                <div style={{ fontSize:11, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {d.messages?.[0]?.text || 'Нет сообщений'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bot info */}
        <div className="card">
          <div className="card-title"><i className="ti ti-info-circle" /> Текущий бот</div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:500, color:'var(--text)', marginBottom:4 }}>{currentBot.name}</div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>{currentBot.description || 'Описание не задано'}</div>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <span className={`pill ${currentBot.isActive ? 'pill-green' : 'pill-gray'}`}>
              {currentBot.isActive ? '● Активен' : '○ Выключен'}
            </span>
            {currentBot.channels?.map(ch => (
              <span key={ch.id} className={`ch-badge ${chClass[ch.type]}`}>{chLabel[ch.type]}</span>
            ))}
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>Промпт:</div>
          <div style={{ fontSize:12, color:'var(--text)', padding:'10px 12px', background:'var(--bg3)', borderRadius:'var(--radius)', lineHeight:1.6, maxHeight:100, overflow:'hidden' }}>
            {currentBot.prompt || 'Не задан — перейдите в настройки'}
          </div>
          <button className="btn" style={{ marginTop:14 }} onClick={() => navigate('/settings')}>
            <i className="ti ti-settings" /> Настроить
          </button>
        </div>
      </div>
    </div>
  )
}
