import * as React from 'react'
import { useCallback, useState } from 'react'

import { PanelComponent } from '../components'

import './style.scss'

export default function App() {
    const [isLeftPanelShown, setLeftPanelShown] = useState(false)
    const [isBottomPanelShown, setBottomPanelShown] = useState(true)

    const handleHideLeftPanel = useCallback(() => {
        setBottomPanelShown(false)
        setLeftPanelShown(!isLeftPanelShown)
    }, [isLeftPanelShown])

    const handleHideBottomPanel = useCallback(() => {
        setLeftPanelShown(false)
        setBottomPanelShown(!isBottomPanelShown)
    }, [isBottomPanelShown])

    return (
            <div className='main'>
                <PanelComponent
                        orientation='left'
                        isShown={isLeftPanelShown}
                        setShown={handleHideLeftPanel}
                />
                <PanelComponent
                        orientation='bottom'
                        isShown={isBottomPanelShown}
                        setShown={handleHideBottomPanel}
                />
            </div>
    )
}

App.displayName = 'App'
