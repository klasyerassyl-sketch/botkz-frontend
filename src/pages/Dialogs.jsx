import { useEffect, useState, useRef } from 'react'
import { useBotsStore, useDialogsStore } from '../store'

const chClass = { WHATSAPP:'ch-wa', TELEGRAM:'ch-tg', INSTAGRAM:'ch-ig' }
const chLabel = { WHATSAPP:'WA', TELEGRAM:'TG', INSTAGRAM:'IG' }

export default function Dialogs() {
  const { currentBot } = useBotsStore()
  const { dialogs, currentDialog, messages, fetchDialogs, setCurrentDialog, sendMessage } = useDialogsStore()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEnd = useRef(null)

  useEffect(() => {
    if (currentBot) {
      fetchDialogs(currentBot.id)
      if (dialogs.length > 0) setCurrentDialog(dialogs[0])
    }
  }, [currentBot])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !currentDialog) return
    setSending(true)
    await sendMessage(currentDialog.id, text)
    setText('')
    setSending(false)
  }

  if (!currentBot) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'var(--text2)' }}>Выберите бота</div>
    </div>
  )

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
      {/* Dialog list */}
      <div style={{ width:240, borderRight:'1px solid var(--border)', overflowY:'auto', flexShrink:0, background:'var(--bg2)' }}>
        <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', fontSize:11, color:'var(--text3)', fontFamily:'monospace' }}>
          {dialogs.length} диалогов
        </div>
        {dialogs.length === 0 && (
          <div style={{ padding:20, fontSize:13, color:'var(--text3)', textAlign:'center' }}>Диалогов пока нет</div>
        )}
        {dialogs.map(d => (
          <div
            key={d.id}
            onClick={() => setCurrentDialog(d)}
            style={{
              padding:'12px 14px', borderBottom:'1px solid var(--border)', cursor:'pointer', transition:'all .15s',
              background: currentDialog?.id === d.id ? 'var(--bg3)' : 'transparent',
              borderLeft: currentDialog?.id === d.id ? '2px solid var(--green)' : '2px solid transparent'
            }}
          >
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text)', marginBottom:3, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span>
                {d.clientName || d.clientId}
                <span className={`ch-badge ${chClass[d.channel?.type]}`}>{chLabel[d.channel?.type]}</span>
              </span>
            </div>
            <div style={{ fontSize:11, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {d.messages?.[0]?.text || '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      {currentDialog ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12, background:'var(--bg2)', flexShrink:0 }}>
            <div className="avatar av-green">{(currentDialog.clientName || currentDialog.clientId).slice(0,2).toUpperCase()}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--text)' }}>{currentDialog.clientName || currentDialog.clientId}</div>
              <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'monospace' }}>
                {chLabel[currentDialog.channel?.type]} · {currentDialog.isAiClosed ? 'AI закрыл' : 'открыт'}
              </div>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:18, display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map(m => (
              <div key={m.id} style={{ alignSelf: m.role === 'CLIENT' ? 'flex-start' : 'flex-end' }}>
                <div style={{ fontSize:10, color:'var(--text3)', marginBottom:3, fontFamily:'monospace', textAlign: m.role === 'CLIENT' ? 'left' : 'right' }}>
                  {m.role === 'CLIENT' ? 'Клиент' : m.role === 'BOT' ? 'AI бот' : 'Менеджер'} · {new Date(m.createdAt).toLocaleTimeString('ru', { hour:'2-digit', minute:'2-digit' })}
                </div>
                <div style={{
                  maxWidth:'72%', padding:'10px 14px', borderRadius:'var(--radius)', fontSize:13, lineHeight:1.6,
                  background: m.role === 'CLIENT' ? 'var(--bg3)' : 'var(--green-bg)',
                  color: m.role === 'CLIENT' ? 'var(--text)' : '#e0fff0',
                  border: `1px solid ${m.role === 'CLIENT' ? 'var(--border)' : 'var(--green-border)'}`
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border)', display:'flex', gap:10, background:'var(--bg2)', flexShrink:0 }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Написать сообщение вручную..."
              style={{ flex:1 }}
            />
            <button className="btn btn-green" onClick={handleSend} disabled={sending || !text.trim()}>
              <i className="ti ti-send" /> Отправить
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)', fontSize:13 }}>
          Выберите диалог
        </div>
      )}
    </div>
  )
}
