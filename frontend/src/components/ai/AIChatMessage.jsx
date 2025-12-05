/**
 * AIChatMessage Component
 * 
 * Displays a single chat message in the chat window.
 * Supports both user and assistant messages with different styling.
 */

import { Bot, User } from 'lucide-react'

function AIChatMessage({ message, isUser }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-primary-500 to-accent-500' 
            : 'bg-slate-700'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-primary-400" />
        )}
      </div>
      
      {/* Message bubble */}
      <div 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-tr-sm' 
            : 'bg-slate-700/80 text-slate-100 rounded-tl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}

export default AIChatMessage
