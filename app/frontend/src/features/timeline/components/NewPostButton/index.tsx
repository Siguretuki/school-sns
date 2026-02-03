import { Plus, Reply } from 'lucide-react'

interface Props {
  variant?: 'new' | 'reply'
}

const NewPostButton: React.FC<Props> = ({ variant = 'new' }) => {
  const Icon = variant === 'new' ? Plus : Reply

  return (
    <button className="flex rounded-full bg-sky-400 p-2.5">
      <Icon className="h-6 w-6 text-white" />
    </button>
  )
}

export default NewPostButton
