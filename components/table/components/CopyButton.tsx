import React, { useState } from 'react'
import { Tooltip, Button } from '@mui/material'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'

interface ICopyButton {
  tooltipText?: string
  copyArea?: 'row' | 'cell'
}

const CopyButton = ({
  tooltipText = 'Copy Cell',
  copyArea = 'cell',
}: ICopyButton) => {
  const [copied, setCopied] = useState<boolean>(false)

  const permissionName = 'clipboard-write' as PermissionName

  const copyToClipboard = (e, selector) => {
    e.preventDefault()
    e.stopPropagation()
    let selection = null

    navigator.permissions.query({ name: permissionName }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        let copyText: string

        if (selector === 'row') {
          selection =
            e.target.parentNode.parentNode.parentNode.getElementsByTagName('td')

          copyText = Array.prototype.slice
            .call(selection)
            .map((element) => element.innerText)
            .join()
        } else {
          selection = e.target.parentNode.parentNode.innerText
          copyText = selection
        }

        // Set copied status and clear it after a second
        navigator.clipboard.writeText(copyText).then(
          function () {
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 1000)
            console.log('clipboard write succeeded')
          },
          function () {
            console.log('clipboard write failed')
          }
        )
      }
    })
  }

  return (
    <Tooltip
      title={
        copied ? `${copyArea === 'row' ? 'Row' : 'Cell'} Copied` : tooltipText
      }
      arrow
      placement="top"
    >
      <Button
        color="secondary"
        aria-label="copy row"
        className={`copy${copyArea === 'row' ? 'Row' : 'Cell'}`}
        variant="infoIcon"
        onClick={(e) => {
          copyToClipboard(e, copyArea)
        }}
        onMouseOut={() => {
          setCopied(false)
        }}
      >
        <FileCopyOutlinedIcon style={{ pointerEvents: 'none' }} />
      </Button>
    </Tooltip>
  )
}

export default CopyButton
