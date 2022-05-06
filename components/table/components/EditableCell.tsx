import React, { useEffect, useState } from 'react'
import { IEditableCell } from 'types'

const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
  width: '100%',
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}: IEditableCell) => {
  const [value, setValue] = useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      style={inputStyle}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

export default EditableCell
