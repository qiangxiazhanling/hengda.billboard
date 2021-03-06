import React, { useState, useEffect } from 'react'

export const TextCheckbox = props => {

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (props.checked)
      setChecked(props.checked)
  }, 
  [props, checked])

  const changeChecked = () => {
    if (props.onChange)
      props.onChange({
        value:props.value,
        checked:!checked 
      })
    setChecked(!checked)
  }

  return (
    <span onClick={changeChecked} className={checked?'text-white bg-primary':'text-primary'}>
      {props.children}
    </span>
  )
}