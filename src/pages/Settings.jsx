import { useState, useEffect } from 'react'
import { useBotsStore } from '../store'
import api from '../api/client'

export default function Settings() {
  const { currentBot, updateBot } = useBotsStore()
  const [prompt, setPrompt] = useState('')
  const [name, setName] = useState('')
  const [knowledge, setKnowledge] = useState([])
  const [tgToken, setTgToken] = useState('')
  const [waToken, setWaToken] = useState('')
  const [waPhoneId, setWaPhoneId] = useState('')
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [connecting, setConnecting] = useState('')

  useEffect(() => {
    if (!currentBot) return
    setName(currentBot.name)
    setPrompt(currentBot.prompt || '')
    api.get(`/knowledge/bot/${currentBot.id}`).then(r => setKnowledge(r.data))
  }, [currentBot])

  const handleSave = async () => {
    await updateBot(currentBot.id, { name, prompt })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('botId', currentBot.id)
    try {
      const { data } = await api.post('/knowledge/upload', form)
      setKnowledge(prev => [...prev, data])
    } catch { alert('Ошибка загрузки') } finally { setUploading(false) }
  }

  const handleDeleteKnowledge = async (id) => {
    await api.delete(`/knowledge/${id}`)
    setKnowledge(prev => prev.filter(k => k.id !== id))
  }

  const connectTelegram = async () => {
    if (!tgToken) return
    setConnecting('tg')
    try {
      await api.post('/channels/telegram', { botId: currentBot.id, token: tgToken })
      alert('Telegram подключён!')
      setTgToken('')
    } catch (err) { alert(err.response?.data?.error || 'Ошибка') } finally { setConnecting('') }
  }

  const connectWhatsApp = async () => {
    if (!waToken || !waPhoneId) return
    setConnecting('wa')
    try {
      const { data } = await api.post('/channels/whatsapp', { botId: currentBot.id, accessToken: waToken, phoneNumberId: waPhoneId })
      alert(`WhatsApp подключён!\n\nWebhook URL:\n${data.webhookUrl}\n\nVerify Token:\n${data.verifyToken}`)
      setWaToken(''); setWaPhoneId('')
    } catch (err) { alert(err.response?.data?.error || 'Ошибка') } finally { setConnecting('') }
  }

  if (!currentBot) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>Выберите бота</div>
  )

  return (
    <div style={{ flex:1, overflowY:'auto', padding:22, display:'flex', flexDirection:'column', gap:16 }}>
      <div>
        <div className="section-title">Настройки бота</div>
        <div className="section-sub">{currentBot.name}</div>
      </div>

      {/* Basic settings */}
      <div className="card">
        <div className="card-title"><i className="ti ti-brain" /> Промпт и настройки</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Название бота</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Системный промпт</label>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:8 }}>Опишите кто такой бот и как он должен отвечать</div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5}
              placeholder="Ты AI ассистент компании X. Отвечай вежливо на русском и казахском языках..." />
          </div>
          <button className={`btn ${saved ? '' : 'btn-green'}`} onClick={handleSave} style={{ alignSelf:'flex-start' }}>
            {saved ? <><i className="ti ti-check" /> Сохранено!</> : <><i className="ti ti-device-floppy" /> Сохранить</>}
          </button>
        </div>
      </div>

      {/* Knowledge */}
      <div className="card">
        <div className="card-title"><i className="ti ti-books" /> База знаний</div>
        <div style={{ fontSize:12, color:'var(--text2)', marginBottom:12 }}>Загрузите прайс, FAQ, описание услуг — AI будет отвечать на основе этих данных</div>
        <label style={{ cursor:'pointer' }}>
          <input type="file" accept=".pdf,.txt,.docx" onChange={handleUpload} style={{ display:'none' }} />
          <span className="btn" style={{ display:'inline-flex' }}>
            <i className="ti ti-upload" /> {uploading ? 'Загружаем...' : 'Загрузить документ'}
          </span>
        </label>
        {knowledge.length > 0 && (
          <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
            {knowledge.map(k => (
              <div key={k.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg3)', borderRadius:'var(--radius)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text)' }}>
                  <i className="ti ti-file" style={{ color:'var(--green)' }} /> {k.filename}
                </div>
                <button className="btn btn-danger" style={{ padding:'4px 8px', fontSize:11 }} onClick={() => handleDeleteKnowledge(k.id)}>
                  <i className="ti ti-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Channels */}
      <div className="card">
        <div className="card-title"><i className="ti ti-plug" /> Подключить каналы</div>

        {/* Telegram */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>✈️</span> Telegram
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', marginBottom:10 }}>
            Создайте бота через @BotFather и вставьте токен
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={tgToken} onChange={e => setTgToken(e.target.value)} placeholder="123456:ABC-DEF..." />
            <button className="btn btn-green" onClick={connectTelegram} disabled={connecting === 'tg' || !tgToken} style={{ flexShrink:0 }}>
              {connecting === 'tg' ? 'Подключаем...' : 'Подключить'}
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>💬</span> WhatsApp Business API
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', marginBottom:10 }}>
            Нужен доступ к Meta Business API. Access Token и Phone Number ID из Meta Developer Console.
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input value={waToken} onChange={e => setWaToken(e.target.value)} placeholder="Access Token" />
            <input value={waPhoneId} onChange={e => setWaPhoneId(e.target.value)} placeholder="Phone Number ID" />
            <button className="btn btn-green" onClick={connectWhatsApp} disabled={connecting === 'wa' || !waToken || !waPhoneId} style={{ alignSelf:'flex-start' }}>
              {connecting === 'wa' ? 'Подключаем...' : 'Подключить WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
