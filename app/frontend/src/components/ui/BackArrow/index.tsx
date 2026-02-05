import { useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { AppPath } from '@/types'
import type React from 'react'

interface Props {
  link?: AppPath
}

const BackArrow: React.FC<Props> = ({ link }) => {
  const router = useRouter()
  const navigate = useNavigate()

  const handleClick = () => {
    if (link === undefined) {
      router.history.back()
    } else {
      navigate(link)
    }
  }

  return (
    <button onClick={handleClick}>
      <ArrowLeft className="h-5 w-5" />
    </button>
  )
}

export default BackArrow
