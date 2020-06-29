import * as React from 'react'

import './bordered-header.scss'

interface Props {
    children: React.ReactNode
}

export const BorderedHeader = ({children}: Props) => (
        <div className='header'>
            {children}
        </div>
)

BorderedHeader.displayName = 'BorderedHeader'
