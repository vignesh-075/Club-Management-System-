'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import {  React.createContext
>({
  size: 'default',
  variant: 'default',
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
} &
  VariantProps) {
  return (
    
      
        {children}
      
    
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
} &
  VariantProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    
      {children}
    
  )
}

export { ToggleGroup, ToggleGroupItem }


