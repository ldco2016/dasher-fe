import React, { useEffect, forwardRef } from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }: CheckboxProps, ref: any) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} sx={{ padding: 0 }} />
      </>
    )
  }
)

export default IndeterminateCheckbox
