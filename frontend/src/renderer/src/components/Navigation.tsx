import { ActiveTab } from '@renderer/types/types'
import { useActiveTab } from './ContextProvider'

export default function Navigation({ prevTab }: { prevTab: ActiveTab }): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  return (
    <div className="navigation">
      <button onClick={(): void => setActiveTab(prevTab)} className="navigation__item">
        {'<'}
      </button>
    </div>
  )
}
