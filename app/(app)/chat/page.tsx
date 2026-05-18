import { redirect } from 'next/navigation'
import { todayISO } from '@/lib/utils'

export default function ChatPage() {
  redirect(`/chat/${todayISO()}`)
}
