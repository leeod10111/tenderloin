import { IconButton } from '@mui/material'
import { Stop } from "@mui/icons-material"

import React from 'react'

export const StopButton = ({handleStopBoards}) => {
  return (
    <IconButton
        size="small"
        onClick={handleStopBoards}
    >
        <Stop className="stopButton" htmlColor="wheat" />
    </IconButton>
  )
}
