import { useAuthStore } from '../store'

const plans = [
  {
    id: 'START', name: 'Старт', price: '9 900', period: '/ месяц',
    desc: 'Для ИП и малых команд',
    features: ['1 бот', '1 мессенджер', '500 диалогов/мес', 'AI на базе Claude', 'Базовая аналитика', 'Поддержка в рабочее время']
  },
  {
    id: 'BUSINESS', name: 'Бизнес', price: '24 900', period: '/ месяц',
    desc: 'Для растущих компаний', popular: true,
    features: ['3 бота', 'Все мессенджеры', '3 000 диалогов/мес', 'AI на базе Claude', 'CRM интеграции', 'Массовые рассылки', 'Приоритетная поддержка']
  },
  {
    id: 'AGENCY', name: 'Агентство', price: '59 900', period: '/ месяц',
    desc: 'Для агентств и ресейлеров',
    features: ['Безлимит ботов', 'Все мессенджеры', 'Безлимит диалогов', 'White label', 'API доступ', 'Выделенный менеджер', 'SLA поддержка']
  }
]

export default function Pricing() {
  const { user } = useAuthStore()

  return (
    <div style={{ flex:1, overflowY:'auto', padding:22, display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <div className="section-title">Тарифы</div>
        <div className="section-sub">Прозрачные цены без скрытых платежей</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {plans.map(plan => (
          <div key={plan.id} className="card" style={{
            border: plan.popular ? '1.5px solid var(--green)' : '1px solid var(--border)',
            position:'relative'
          }}>
            {plan.popular && (
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--green)', color:'#000', fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:20 }}>
                ПОПУЛЯРНЫЙ
              </div>
            )}
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:4 }}>{plan.name}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:16 }}>{plan.desc}</div>
            <div style={{ fontSize:30, fontWeight:600, color:'var(--text)', letterSpacing:'-1px', marginBottom:20 }}>
              {plan.price} ₸ <span style={{ fontSize:13, color:'var(--text2)', fontWeight:400 }}>{plan.period}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text2)' }}>
                  <i className="ti ti-check" style={{ color:'var(--green)', fontSize:14, flexShrink:0 }} /> {f}
                </div>
              ))}
            </div>
            {user?.plan === plan.id ? (
              <div style={{ padding:'9px 0', textAlign:'center', fontSize:13, color:'var(--green)', fontWeight:500 }}>
                ✓ Текущий тариф
              </div>
            ) : (
              <button className={`btn ${plan.popular ? 'btn-green' : ''}`} style={{ width:'100%', justifyContent:'center' }}>
                {plan.id === 'AGENCY' ? 'Связаться с нами' : 'Выбрать тариф'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ background:'var(--green-bg)', border:'1px solid var(--green-border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <i className="ti ti-sparkles" style={{ fontSize:24, color:'var(--green)' }} />
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:'var(--text)', marginBottom:4 }}>Нужно что-то особенное?</div>
            <div style={{ fontSize:13, color:'var(--text2)' }}>Свяжитесь с нами для индивидуального тарифа, интеграций с вашей CRM или white label решения.</div>
          </div>
          <button className="btn btn-green" style={{ flexShrink:0 }}>Написать нам</button>
        </div>
      </div>
    </div>
  )
}
