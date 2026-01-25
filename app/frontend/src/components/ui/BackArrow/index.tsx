import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { AppPath } from '@/types'
import type React from 'react'

interface Props {
  link?: AppPath
}

const BackArrow: React.FC<Props> = ({ link = { to: '..' } }) => {
  return (
    <Link {...link}>
      <ArrowLeft className="h-5 w-5" />
    </Link>
  )
}

export default BackArrow
