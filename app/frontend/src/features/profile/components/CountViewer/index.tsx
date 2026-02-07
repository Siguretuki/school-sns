interface Props {
  label: string
  count: number
}

const CountViewer: React.FC<Props> = ({ label, count }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-lg font-semibold">{count}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}

export default CountViewer
