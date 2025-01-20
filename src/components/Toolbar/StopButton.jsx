import { IconButton } from '@mui/material'
import { Stop } from "@mui/icons-material"

import React from 'react'

export const StopButton = ({handleStop}) => {
  return (
    <IconButton
        size="small"
        onClick={handleStop}
    >
        <Stop className="stopButton" htmlColor="wheat" />
    </IconButton>
  )
}
