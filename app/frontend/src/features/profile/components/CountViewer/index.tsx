interface Props {
  label: string
  count: number
}

const CountViewer: React.FC<Props> = ({ label, count }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg font-semibold text-slate-900">{count}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}

export default CountViewer
