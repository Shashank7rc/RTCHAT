import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const {logout}=useAuthStore();
  return (
    <div className="relative z-10 bg-red-700">

      <button onClick={logout} >Logot</button>
    </div>
  )
}

export default ChatPage