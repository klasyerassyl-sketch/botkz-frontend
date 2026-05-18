import { useState } from 'react'
import { useBotsStore } from '../store'

export default function Bots() {
  const { bots, createBot, updateBot, deleteBot } = useBotsStore()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createBot({ name, description })
      setName(''); setDescription(''); setShowCreate(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания')
    } finally { setLoading(false) }
  }

  const handleToggle = (bot) => updateBot(bot.id, { ...bot, isActive: !bot.isActive })
  const handleDelete = async (bot) => {
    if (confirm(`Удалить бота "${bot.name}"?`)) await deleteBot(bot.id)
  }

  const chClass = { WHATSAPP:'ch-wa', TELEGRAM:'ch-tg', INSTAGRAM:'ch-ig' }
  const chLabel = { WHATSAPP:'WA', TELEGRAM:'TG', INSTAGRAM:'IG' }

  return (
    <div style={{ flex:1, overflowY:'auto', padding:22, display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div className="section-title">Мои боты</div>
          <div className="section-sub">Управляйте AI-ботами для каждого бизнеса</div>
        </div>
        <button className="btn btn-green" onClick={() => setShowCreate(!showCreate)}>
          <i className="ti ti-plus" /> Создать бота
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="card">
          <div className="card-title"><i className="ti ti-plus" /> Новый бот</div>
          <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Название *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Например: Стоматология Smile" required />
            </div>
            <div>
              <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Описание</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Краткое описание бота" />
            </div>
            {error && <div style={{ fontSize:12, color:'var(--red)', padding:'8px 12px', background:'var(--red-bg)', borderRadius:'var(--radius)' }}>{error}</div>}
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" className="btn btn-green" disabled={loading}>{loading ? 'Создаём...' : 'Создать'}</button>
              <button type="button" className="btn" onClick={() => setShowCreate(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      {/* Bots list */}
      {bots.length === 0 && !showCreate && (
        <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text2)' }}>
          <i className="ti ti-robot" style={{ fontSize:40, display:'block', marginBottom:12, color:'var(--text3)' }} />
          <div>Ботов пока нет. Создайте первого!</div>
        </div>
      )}

      {bots.map(bot => (
        <div key={bot.id} className="card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div className="avatar av-green" style={{ width:38, height:38, fontSize:14 }}>
                {bot.name.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'var(--text)' }}>{bot.name}</div>
                <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{bot.description || 'Описание не задано'}</div>
              </div>
            </div>
            <div
              onClick={() => handleToggle(bot)}
              style={{
                width:34, height:20, borderRadius:10, cursor:'pointer', position:'relative', transition:'background .2s',
                background: bot.isActive ? 'var(--green)' : 'var(--bg4)'
              }}
            >
              <div style={{
                position:'absolute', width:16, height:16, borderRadius:'50%', background:'white', top:2, transition:'all .2s',
                left: bot.isActive ? 'auto' : 2, right: bot.isActive ? 2 : 'auto'
              }} />
            </div>
          </div>

          <div style={{ display:'flex', gap:16, marginBottom:14 }}>
            <div style={{ fontSize:12, color:'var(--text2)' }}>
              <span style={{ color:'var(--text)', fontWeight:500, fontFamily:'monospace' }}>{bot._count?.dialogs || 0}</span> диалогов
            </div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>
              <span style={{ color:'var(--text)', fontWeight:500, fontFamily:'monospace' }}>{bot.channels?.length || 0}</span> каналов
            </div>
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            {bot.channels?.map(ch => (
              <span key={ch.id} className={`ch-badge ${chClass[ch.type]}`}>{chLabel[ch.type]} подключён</span>
            ))}
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <button className="btn" onClick={() => window.location.href = '/settings'}>
              <i className="ti ti-settings" /> Настроить
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(bot)}>
              <i className="ti ti-trash" /> Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
