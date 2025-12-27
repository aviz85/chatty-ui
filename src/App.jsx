import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, MessageCircle, Users, Clock, Sparkles,
  CheckCircle, XCircle, Zap, Heart, Star,
  Phone, Image, FileText, Smile, RefreshCw,
  Volume2, Trash2, Copy, Plus, Settings,
  StarOff, Play, Pause, Timer, List
} from 'lucide-react'
import './App.css'

const WAHA_URL = 'http://localhost:3001'
const API_URL = 'http://localhost:3002'
const API_KEY = 'myapikey'

// WAHA API Helper (WhatsApp)
async function wahaApi(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY }
  const options = { method, headers, mode: 'cors' }
  if (body) options.body = JSON.stringify(body)
  const res = await fetch(`${WAHA_URL}${endpoint}`, options)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Backend API Helper (SQLite)
async function api(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const options = { method, headers, mode: 'cors' }
  if (body) options.body = JSON.stringify(body)
  const res = await fetch(`${API_URL}${endpoint}`, options)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Mascot Component
function Mascot({ status, size = 80 }) {
  const isConnected = status === 'WORKING'
  return (
    <motion.div
      className="mascot"
      style={{ width: size, height: size }}
      animate={isConnected ? { scale: [1, 1.05, 1] } : { rotate: [0, -5, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isConnected ? "#00D4AA" : "#FFD93D"} />
            <stop offset="100%" stopColor={isConnected ? "#00A88A" : "#FFA500"} />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
          </filter>
        </defs>
        <path
          d="M50 10 C75 10 90 30 90 50 C90 70 75 85 55 85 L40 85 L25 95 L30 80 C15 75 10 60 10 50 C10 30 25 10 50 10"
          fill="url(#bubbleGrad)"
          filter="url(#shadow)"
        />
        <motion.ellipse
          cx="35" cy="45" rx="6" ry="8" fill="white"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.ellipse
          cx="60" cy="45" rx="6" ry="8" fill="white"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <circle cx="36" cy="46" r="3" fill="#2D3436" />
        <circle cx="61" cy="46" r="3" fill="#2D3436" />
        <motion.path
          d={isConnected ? "M35 60 Q47 72 60 60" : "M35 65 Q47 60 60 65"}
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {isConnected && (
          <motion.text
            x="75" y="25"
            fontSize="15"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨
          </motion.text>
        )}
      </svg>
    </motion.div>
  )
}

// Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`toast toast-${type}`}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span>{message}</span>
    </motion.div>
  )
}

// Emoji Picker
const EMOJIS = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '✨', '💯', '🙏', '😍', '🤔', '👋', '💪', '🚀', '⭐', '🌟']

function EmojiPicker({ onSelect, onClose }) {
  return (
    <motion.div
      className="emoji-picker"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
    >
      <div className="emoji-grid">
        {EMOJIS.map(emoji => (
          <motion.button
            key={emoji}
            className="emoji-btn"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { onSelect(emoji); onClose(); }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Feature Card
function FeatureCard({ icon: Icon, title, color, children, delay = 0 }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      style={{ '--accent-color': color }}
    >
      <div className="feature-header">
        <div className="feature-icon" style={{ background: color }}>
          <Icon size={24} color="white" />
        </div>
        <h3>{title}</h3>
      </div>
      <div className="feature-content">
        {children}
      </div>
    </motion.div>
  )
}

// Favorite Card
function FavoriteCard({ favorite, onUse, onRemove }) {
  return (
    <motion.div
      className="favorite-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="favorite-info">
        <span className="favorite-name">{favorite.name || 'Unknown'}</span>
        <span className="favorite-phone">{favorite.phone}</span>
      </div>
      <div className="favorite-actions">
        <motion.button
          className="icon-btn use"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onUse(favorite)}
          title="Send message"
        >
          <Send size={16} />
        </motion.button>
        <motion.button
          className="icon-btn remove"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(favorite.phone)}
          title="Remove"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Queue Item
function QueueItem({ item, index }) {
  const statusColors = {
    pending: '#FFD93D',
    sending: '#6C9FFF',
    sent: '#00D4AA',
    failed: '#FF6B6B'
  }

  return (
    <motion.div
      className="queue-item"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ '--status-color': statusColors[item.status] }}
    >
      <div className="queue-number">#{index + 1}</div>
      <div className="queue-info">
        <span className="queue-phone">{item.phone}</span>
        <span className={`queue-status ${item.status}`}>
          {item.status === 'pending' && <Clock size={12} />}
          {item.status === 'sending' && <RefreshCw size={12} className="spinning" />}
          {item.status === 'sent' && <CheckCircle size={12} />}
          {item.status === 'failed' && <XCircle size={12} />}
          {item.status}
        </span>
      </div>
      {item.delay && item.status === 'pending' && (
        <span className="queue-delay">~{item.delay}s</span>
      )}
    </motion.div>
  )
}

// Template Card
function TemplateCard({ template, onUse }) {
  return (
    <motion.div
      className="template-card"
      style={{ '--card-color': template.color }}
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onUse(template)}
    >
      <div className="template-emoji">{template.emoji}</div>
      <div className="template-info">
        <h4>{template.name}</h4>
        <p>{template.preview}</p>
      </div>
    </motion.div>
  )
}

// Main App
function App() {
  const [session, setSession] = useState(null)
  const [toasts, setToasts] = useState([])
  const [activeTab, setActiveTab] = useState('send')

  // Quick Send
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [sending, setSending] = useState(false)

  // Favorites
  const [favorites, setFavorites] = useState([])
  const [newFavName, setNewFavName] = useState('')
  const [newFavPhone, setNewFavPhone] = useState('')

  // Bulk Send
  const [bulkPhones, setBulkPhones] = useState('')
  const [bulkMessage, setBulkMessage] = useState('')
  const [useQueue, setUseQueue] = useState(true)
  const [minDelay, setMinDelay] = useState(3)
  const [maxDelay, setMaxDelay] = useState(10)
  const [queue, setQueue] = useState([])
  const [queueRunning, setQueueRunning] = useState(false)
  const queueRef = useRef(null)

  // Check Number
  const [checkPhone, setCheckPhone] = useState('')
  const [checkResult, setCheckResult] = useState(null)

  // Templates
  const [templates] = useState([
    { id: 1, name: 'Welcome', emoji: '👋', color: '#00D4AA', preview: 'Hey! Welcome aboard...', text: 'Hey! 👋 Welcome aboard! We\'re so excited to have you here. Let us know if you need anything!' },
    { id: 2, name: 'Thank You', emoji: '🙏', color: '#FF6B6B', preview: 'Thank you so much...', text: 'Thank you so much for your support! 🙏 It really means a lot to us. Have an amazing day! ✨' },
    { id: 3, name: 'Reminder', emoji: '⏰', color: '#FFD93D', preview: 'Quick reminder...', text: 'Quick reminder! ⏰ Don\'t forget about our meeting today. See you soon! 🚀' },
    { id: 4, name: 'Celebration', emoji: '🎉', color: '#A66CFF', preview: 'Congratulations...', text: 'Congratulations! 🎉🎊 You did it! So proud of you! Keep shining! ⭐' },
  ])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Load favorites from SQLite
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await api('/api/favorites')
        setFavorites(data)
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    }
    loadFavorites()
  }, [])

  // Fetch session status from WAHA
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessions = await wahaApi('/api/sessions?all=true')
        if (sessions.length > 0) setSession(sessions[0])
      } catch (e) {
        console.error('Failed to fetch session:', e)
      }
    }
    fetchSession()
    const interval = setInterval(fetchSession, 5000)
    return () => clearInterval(interval)
  }, [])

  // Favorites Management
  const addFavorite = async () => {
    if (!newFavPhone) {
      showToast('Please enter a phone number', 'error')
      return
    }
    try {
      const result = await api('/api/favorites', 'POST', {
        phone: newFavPhone,
        name: newFavName || newFavPhone.replace(/\D/g, '')
      })
      setFavorites(prev => [...prev, result])
      setNewFavName('')
      setNewFavPhone('')
      showToast('Added to favorites! ⭐')
    } catch (e) {
      if (e.message.includes('409')) {
        showToast('This number is already in favorites', 'error')
      } else {
        showToast('Failed to add favorite', 'error')
      }
    }
  }

  const removeFavorite = async (phone) => {
    try {
      await api(`/api/favorites/${phone}`, 'DELETE')
      setFavorites(prev => prev.filter(f => f.phone !== phone))
      showToast('Removed from favorites')
    } catch (e) {
      showToast('Failed to remove favorite', 'error')
    }
  }

  const useFavorite = (fav) => {
    setPhone(fav.phone)
    setActiveTab('send')
    showToast(`Selected ${fav.name}`)
  }

  const addCurrentToFavorites = async () => {
    if (!phone) {
      showToast('Enter a phone number first', 'error')
      return
    }
    try {
      const result = await api('/api/favorites', 'POST', {
        phone: phone,
        name: phone.replace(/\D/g, '')
      })
      setFavorites(prev => [...prev, result])
      showToast('Added to favorites! ⭐')
    } catch (e) {
      if (e.message.includes('409')) {
        showToast('Already in favorites!', 'error')
      } else {
        showToast('Failed to add favorite', 'error')
      }
    }
  }

  // Send Message via WAHA
  const sendMessage = async () => {
    if (!phone || !message) {
      showToast('Please enter phone and message', 'error')
      return
    }
    setSending(true)
    try {
      await wahaApi('/api/sendText', 'POST', {
        session: 'default',
        chatId: `${phone.replace(/\D/g, '')}@c.us`,
        text: message
      })
      // Log to history
      await api('/api/history', 'POST', { phone: phone.replace(/\D/g, ''), message, status: 'sent' })
      showToast('Message sent! 🚀')
      setMessage('')
    } catch (e) {
      showToast('Failed to send message', 'error')
    }
    setSending(false)
  }

  // Queue Processing
  const processQueue = useCallback(async () => {
    setQueueRunning(true)

    for (let i = 0; i < queue.length; i++) {
      // Check if stopped
      if (!queueRef.current) break

      const item = queue[i]
      if (item.status !== 'pending') continue

      // Update status to sending
      setQueue(prev => prev.map((q, idx) =>
        idx === i ? { ...q, status: 'sending' } : q
      ))

      try {
        await wahaApi('/api/sendText', 'POST', {
          session: 'default',
          chatId: `${item.phone.replace(/\D/g, '')}@c.us`,
          text: bulkMessage
        })
        // Log to history
        await api('/api/history', 'POST', { phone: item.phone, message: bulkMessage, status: 'sent' })

        setQueue(prev => prev.map((q, idx) =>
          idx === i ? { ...q, status: 'sent' } : q
        ))
      } catch (e) {
        setQueue(prev => prev.map((q, idx) =>
          idx === i ? { ...q, status: 'failed' } : q
        ))
      }

      // Wait for random delay before next message (if not last)
      if (i < queue.length - 1 && queueRef.current) {
        const delay = item.delay * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    setQueueRunning(false)
    queueRef.current = false
    showToast('Queue completed! 🎉')
  }, [queue, bulkMessage])

  // Start Bulk Send with Queue
  const startBulkSend = () => {
    const phones = bulkPhones.split('\n').filter(p => p.trim())
    if (phones.length === 0 || !bulkMessage) {
      showToast('Please enter phones and message', 'error')
      return
    }

    if (useQueue) {
      // Create queue with random delays
      const queueItems = phones.map((phone, idx) => ({
        phone: phone.trim().replace(/\D/g, ''),
        status: 'pending',
        delay: idx === 0 ? 0 : Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
      }))

      setQueue(queueItems)
      queueRef.current = true
      showToast(`Queue created with ${phones.length} messages! 🚀`)
    } else {
      // Send immediately (old behavior)
      sendBulkImmediate(phones)
    }
  }

  const sendBulkImmediate = async (phones) => {
    setSending(true)
    let success = 0
    for (const p of phones) {
      try {
        await wahaApi('/api/sendText', 'POST', {
          session: 'default',
          chatId: `${p.replace(/\D/g, '')}@c.us`,
          text: bulkMessage
        })
        await api('/api/history', 'POST', { phone: p.replace(/\D/g, ''), message: bulkMessage, status: 'sent' })
        success++
      } catch (e) { /* continue */ }
    }
    showToast(`Sent to ${success}/${phones.length} contacts! 🎉`)
    setSending(false)
  }

  const startQueue = () => {
    queueRef.current = true
    processQueue()
  }

  const pauseQueue = () => {
    queueRef.current = false
    setQueueRunning(false)
    showToast('Queue paused ⏸️')
  }

  const clearQueue = () => {
    queueRef.current = false
    setQueueRunning(false)
    setQueue([])
    showToast('Queue cleared')
  }

  // Load favorites to bulk
  const loadFavoritesToBulk = () => {
    if (favorites.length === 0) {
      showToast('No favorites saved', 'error')
      return
    }
    setBulkPhones(favorites.map(f => f.phone).join('\n'))
    showToast(`Loaded ${favorites.length} favorites!`)
  }

  // Check Contact via WAHA
  const checkContact = async () => {
    if (!checkPhone) {
      showToast('Please enter a phone number', 'error')
      return
    }
    try {
      const result = await wahaApi(`/api/contacts/check-exists?phone=${checkPhone}&session=default`)
      setCheckResult(result)
      showToast(result.numberExists ? 'Number exists! ✅' : 'Number not found ❌', result.numberExists ? 'success' : 'error')
    } catch (e) {
      showToast('Failed to check number', 'error')
    }
  }

  const useTemplate = (template) => {
    setMessage(template.text)
    setActiveTab('send')
    showToast(`Loaded "${template.name}" template! ✨`)
  }

  // Stats
  const queueStats = {
    total: queue.length,
    pending: queue.filter(q => q.status === 'pending').length,
    sent: queue.filter(q => q.status === 'sent').length,
    failed: queue.filter(q => q.status === 'failed').length
  }

  return (
    <div className="app">
      {/* Background Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Header */}
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-left">
          <Mascot status={session?.status} size={60} />
          <div className="header-title">
            <h1>Chatty</h1>
            <p>WhatsApp Magic ✨</p>
          </div>
        </div>
        <div className="header-right">
          <motion.div
            className={`status-badge ${session?.status === 'WORKING' ? 'connected' : 'disconnected'}`}
            animate={session?.status === 'WORKING' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="status-dot" />
            <span>{session?.status === 'WORKING' ? 'Connected' : session?.status || 'Offline'}</span>
          </motion.div>
          {session?.me && (
            <div className="user-info">
              <span className="user-name">{session.me.pushName}</span>
            </div>
          )}
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <motion.nav
        className="tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { id: 'send', icon: Send, label: 'Quick Send' },
          { id: 'favorites', icon: Star, label: 'Favorites' },
          { id: 'bulk', icon: Users, label: 'Bulk Send' },
          { id: 'templates', icon: Sparkles, label: 'Templates' },
          { id: 'check', icon: Phone, label: 'Check' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
            {tab.id === 'favorites' && favorites.length > 0 && (
              <span className="tab-badge">{favorites.length}</span>
            )}
          </motion.button>
        ))}
      </motion.nav>

      {/* Main Content */}
      <main className="main">
        <AnimatePresence mode="wait">
          {/* Quick Send */}
          {activeTab === 'send' && (
            <motion.div
              key="send"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="content-panel"
            >
              <FeatureCard icon={Send} title="Quick Send" color="var(--teal)">
                <div className="form-group">
                  <label>📱 Phone Number</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., 972501234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <motion.button
                      className="icon-btn-inline"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={addCurrentToFavorites}
                      title="Add to favorites"
                    >
                      <Star size={20} />
                    </motion.button>
                  </div>
                </div>
                <div className="form-group">
                  <label>💬 Message</label>
                  <div className="message-input-wrapper">
                    <textarea
                      className="input textarea"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="emoji-trigger"
                      onClick={() => setShowEmoji(!showEmoji)}
                    >
                      <Smile size={24} />
                    </button>
                    <AnimatePresence>
                      {showEmoji && (
                        <EmojiPicker
                          onSelect={(emoji) => setMessage(prev => prev + emoji)}
                          onClose={() => setShowEmoji(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <motion.button
                  className="btn btn-primary btn-large"
                  onClick={sendMessage}
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={20} />
                    </motion.div>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                      <Zap size={18} />
                    </>
                  )}
                </motion.button>
              </FeatureCard>
            </motion.div>
          )}

          {/* Favorites */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="content-panel"
            >
              <FeatureCard icon={Star} title="Favorites" color="var(--yellow)">
                <div className="add-favorite-form">
                  <input
                    type="text"
                    className="input"
                    placeholder="Name (optional)"
                    value={newFavName}
                    onChange={(e) => setNewFavName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Phone number"
                    value={newFavPhone}
                    onChange={(e) => setNewFavPhone(e.target.value)}
                  />
                  <motion.button
                    className="btn btn-yellow"
                    onClick={addFavorite}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={20} />
                    Add
                  </motion.button>
                </div>

                <div className="favorites-list">
                  <AnimatePresence>
                    {favorites.length === 0 ? (
                      <motion.div
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Star size={48} />
                        <p>No favorites yet</p>
                        <span>Add your frequently contacted numbers here!</span>
                      </motion.div>
                    ) : (
                      favorites.map(fav => (
                        <FavoriteCard
                          key={fav.phone}
                          favorite={fav}
                          onUse={useFavorite}
                          onRemove={removeFavorite}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.div>
          )}

          {/* Bulk Send */}
          {activeTab === 'bulk' && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="content-panel"
            >
              <FeatureCard icon={Users} title="Bulk Send" color="var(--coral)">
                <div className="form-group">
                  <div className="label-with-action">
                    <label>📱 Phone Numbers (one per line)</label>
                    <button className="link-btn" onClick={loadFavoritesToBulk}>
                      Load Favorites
                    </button>
                  </div>
                  <textarea
                    className="input textarea"
                    placeholder="972501234567&#10;972509876543&#10;972507654321"
                    value={bulkPhones}
                    onChange={(e) => setBulkPhones(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="form-group">
                  <label>💬 Message to All</label>
                  <textarea
                    className="input textarea"
                    placeholder="Your bulk message..."
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                  />
                </div>

                {/* Queue Options */}
                <div className="queue-options">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={useQueue}
                      onChange={(e) => setUseQueue(e.target.checked)}
                    />
                    <span className="toggle-switch"></span>
                    <span>Use Queue with Random Delays</span>
                    <Timer size={16} />
                  </label>

                  {useQueue && (
                    <motion.div
                      className="delay-settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="delay-inputs">
                        <div className="delay-input">
                          <label>Min delay (sec)</label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={minDelay}
                            onChange={(e) => setMinDelay(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <span className="delay-separator">to</span>
                        <div className="delay-input">
                          <label>Max delay (sec)</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={maxDelay}
                            onChange={(e) => setMaxDelay(parseInt(e.target.value) || 10)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bulk-stats">
                  <div className="stat">
                    <Users size={18} />
                    <span>{bulkPhones.split('\n').filter(p => p.trim()).length} recipients</span>
                  </div>
                </div>

                {queue.length === 0 ? (
                  <motion.button
                    className="btn btn-coral btn-large"
                    onClick={startBulkSend}
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                    ) : (
                      <>
                        <Zap size={20} />
                        {useQueue ? 'Create Queue' : 'Send to All'}
                        <Heart size={18} />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="queue-controls">
                    {!queueRunning ? (
                      <motion.button
                        className="btn btn-primary"
                        onClick={startQueue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play size={20} />
                        Start Queue
                      </motion.button>
                    ) : (
                      <motion.button
                        className="btn btn-yellow"
                        onClick={pauseQueue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Pause size={20} />
                        Pause
                      </motion.button>
                    )}
                    <motion.button
                      className="btn btn-secondary"
                      onClick={clearQueue}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 size={20} />
                      Clear
                    </motion.button>
                  </div>
                )}

                {/* Queue Display */}
                {queue.length > 0 && (
                  <motion.div
                    className="queue-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="queue-header">
                      <h4><List size={18} /> Queue Progress</h4>
                      <div className="queue-stats">
                        <span className="stat-sent">{queueStats.sent} sent</span>
                        <span className="stat-pending">{queueStats.pending} pending</span>
                        {queueStats.failed > 0 && (
                          <span className="stat-failed">{queueStats.failed} failed</span>
                        )}
                      </div>
                    </div>
                    <div className="queue-progress-bar">
                      <motion.div
                        className="queue-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(queueStats.sent / queueStats.total) * 100}%` }}
                      />
                    </div>
                    <div className="queue-list">
                      {queue.map((item, i) => (
                        <QueueItem key={i} item={item} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </FeatureCard>
            </motion.div>
          )}

          {/* Templates */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="content-panel"
            >
              <FeatureCard icon={Sparkles} title="Message Templates" color="var(--purple)">
                <div className="templates-grid">
                  {templates.map((template, i) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TemplateCard template={template} onUse={useTemplate} />
                    </motion.div>
                  ))}
                </div>
              </FeatureCard>
            </motion.div>
          )}

          {/* Check Number */}
          {activeTab === 'check' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="content-panel"
            >
              <FeatureCard icon={Phone} title="Check Number" color="var(--blue)">
                <div className="form-group">
                  <label>📱 Phone Number to Check</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., 972501234567"
                    value={checkPhone}
                    onChange={(e) => setCheckPhone(e.target.value)}
                  />
                </div>
                <motion.button
                  className="btn btn-blue btn-large"
                  onClick={checkContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone size={20} />
                  Check if Exists
                  <Sparkles size={18} />
                </motion.button>

                <AnimatePresence>
                  {checkResult && (
                    <motion.div
                      className={`check-result ${checkResult.numberExists ? 'exists' : 'not-exists'}`}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      {checkResult.numberExists ? (
                        <>
                          <CheckCircle size={40} />
                          <h4>Number Exists! 🎉</h4>
                          <p>This number is on WhatsApp</p>
                        </>
                      ) : (
                        <>
                          <XCircle size={40} />
                          <h4>Not Found 😔</h4>
                          <p>This number is not on WhatsApp</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </FeatureCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast Container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
