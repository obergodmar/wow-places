import * as React from 'react'
import { useCallback, useState } from 'react'

import { PanelComponent, PreviewComponent, ViewComponent } from '../components'
import places from '../assets'

import './style.scss'

const delay = () => new Promise(resolve => setTimeout(resolve, 800))

export default function App() {
    const [isLoading, setLoading] = useState(false)
    const [isLeftPanelShown, setLeftPanelShown] = useState(false)
    const [isBottomPanelShown, setBottomPanelShown] = useState(false)
    const [activePlace, setActivePlace] = useState(0)
    const [activeView, setActiveView] = useState(0)

    const handleHideLeftPanel = useCallback(() => {
        setBottomPanelShown(false)
        setLeftPanelShown(!isLeftPanelShown)
    }, [isLeftPanelShown])

    const handleHideBottomPanel = useCallback(() => {
        setLeftPanelShown(false)
        setBottomPanelShown(!isBottomPanelShown)
    }, [isBottomPanelShown])

    const handleLeftPreviewClick = useCallback((value: number) => {
        setActivePlace(value)
    }, [])

    const handleBottomPreviewClick = (value: number) => {
        if (isLoading) {
            return
        }
        setActiveView(value)
        setLoading(true)
        delay().then(() => {
            setLoading(false)
        })
    }

    return (
            <div className='main'>
                <ViewComponent src={places[activePlace].view[activeView]}/>
                <PanelComponent
                        orientation='left'
                        isShown={isLeftPanelShown}
                        setShown={handleHideLeftPanel}
                >
                    {places.map((place, index) => (
                            <PreviewComponent
                                    isLoading={isLoading}
                                    key={index}
                                    value={index}
                                    handleChange={handleLeftPreviewClick}
                                    src={place.preview[0]}
                            />
                    ))}
                </PanelComponent>
                <PanelComponent
                        orientation='bottom'
                        isShown={isBottomPanelShown}
                        setShown={handleHideBottomPanel}
                >
                    {places[activePlace].preview.map((preview, index) => (
                            <PreviewComponent
                                    isLoading={isLoading}
                                    key={index}
                                    value={index}
                                    handleChange={handleBottomPreviewClick}
                                    src={preview}
                            />
                    ))}
                </PanelComponent>
            </div>
    )
}

App.displayName = 'App'
