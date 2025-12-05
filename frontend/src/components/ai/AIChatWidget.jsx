/**
 * AIChatWidget Component
 * 
 * A floating chat widget that provides AI-powered assistance for users.
 * Features:
 * - Floating button in the bottom-right corner
 * - Expandable chat window with message history
 * - Auto-scroll to newest messages
 * - Loading animation during AI response
 * - Smooth animations and modern UI
 */

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Loader2, Minimize2 } from 'lucide-react'
import { sendChatMessage } from '../../services/ai'
import { useLanguage } from '../../contexts/LanguageContext'
import AIChatMessage from './AIChatMessage'

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { t } = useLanguage()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Add welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t('ai.welcomeMessage'),
        }
      ])
    }
  }, [isOpen, t])

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim()
    if (!trimmedInput || isLoading) return

    // Clear error
    setError(null)

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Prepare conversation history for context (exclude welcome message)
      const conversationHistory = messages
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }))

      // Send message to API
      const response = await sendChatMessage(trimmedInput, conversationHistory)

      if (response.success) {
        // Add assistant response
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(response.error || 'Failed to get response')
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError(err.error || t('ai.errorMessage'))
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai.errorMessage'),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[70vh] 
                     bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50
                     flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 
                          bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl 
                              flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{t('ai.title')}</h3>
                <p className="text-slate-400 text-xs">{t('ai.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label={t('ai.close')}
            >
              <Minimize2 className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <AIChatMessage
                key={message.id}
                message={message.content}
                isUser={message.role === 'user'}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 
                                flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-400" />
                </div>
                <div className="bg-slate-700/80 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                    <span className="text-sm text-slate-400">{t('ai.thinking')}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('ai.placeholder')}
                disabled={isLoading}
                className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3
                           text-white placeholder-slate-400 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl
                           text-white font-medium shadow-lg shadow-primary-500/25
                           hover:from-primary-600 hover:to-accent-600 hover:shadow-primary-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-500
                           transition-all duration-200 flex items-center justify-center"
                aria-label={t('ai.send')}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full
                    bg-gradient-to-r from-primary-500 to-accent-500
                    text-white shadow-xl shadow-primary-500/30
                    hover:shadow-primary-500/50 hover:scale-110
                    transition-all duration-300 z-50
                    flex items-center justify-center
                    ${isOpen ? 'rotate-0' : 'animate-bounce-subtle'}`}
        aria-label={isOpen ? t('ai.close') : t('ai.open')}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Custom animation styles */}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-in {
          animation-fill-mode: forwards;
        }
        .slide-in-from-bottom-5 {
          animation-name: slideInFromBottom;
        }
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default AIChatWidget
