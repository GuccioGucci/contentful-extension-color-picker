import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@contentful/forma-36-react-components';
import debounce from 'lodash.debounce';
import tokens from '@contentful/forma-36-tokens';

const ColorBox: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement> & { color?: string }> = ({ color, ...props }) => {
  return (
    <div {...props} style={{ display: 'inline-block' }}>
      <Card style={{
        backgroundColor: color,
        boxSizing: 'border-box',
        width: '40px',
        height: '40px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        fontSize: 22,
        borderColor: tokens.gray400,
        color: tokens.gray400,
        cursor: 'pointer'
      }}>{color ? ' ' : '?'}</Card>
    </div>
  )
}

type Props = {
  required: boolean | undefined
  value: string | undefined
  onChange: (value: string | undefined) => void
}

export const ColorPicker: React.FC<Props> = ({ required, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [realtimeValue, setRealtimeValue] = useState<string | undefined>(value)

  const debouncedOnChange = useMemo(() => debounce(value => onChange(value), 300), [onChange])
  
  useEffect(() => {
    setRealtimeValue(value)
  }, [value])

  useEffect(() => {
    debouncedOnChange(realtimeValue)
  }, [realtimeValue, debouncedOnChange])

  return (
    <div>
      <ColorBox color={realtimeValue} onClick={() => inputRef.current?.click()} />
      <input
        ref={inputRef}
        type="color"
        data-test-id="color-picker-input"
        value={value && value !== '' ? value : '#000000'}
        onChange={event => setRealtimeValue(event.target.value)}
        required={required}
        style={{
          display: 'block',
          opacity: 0,
          height: 8,
          border: 'none',
          padding: 0,
          margin: 0,
          width: 40
        }}
      />
    </div>
  );
}
