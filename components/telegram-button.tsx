'use client'

import { Send } from 'lucide-react'

interface TelegramButtonProps {
  telegram: string
  message?: string
}

export function TelegramButton({ telegram, message }: TelegramButtonProps) {
  const telegramUsername = telegram.replace('@', '')
  const url = message 
    ? `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`
    : `https://t.me/${telegramUsername}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#0088cc] text-white rounded-full shadow-lg hover:bg-[#0077b5] transition-all hover:scale-105 group"
    >
      <Send className="h-5 w-5" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Написать нам
      </span>
    </a>
  )
}
