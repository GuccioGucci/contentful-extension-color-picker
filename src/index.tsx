
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { Button, Card, Flex } from '@contentful/forma-36-react-components';
import debounce from 'lodash.debounce';
import tokens from '@contentful/forma-36-tokens';

interface AppProps {
  sdk: FieldExtensionSDK;
}

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

export const App = ({ sdk }: AppProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string | undefined>(sdk.field.getValue())
  const [realtimeValue, setRealtimeValue] = useState<string | undefined>(sdk.field.getValue())
  const [, setError] = useState<boolean>(false)

  const debouncedSetValue = useMemo(() => debounce(value => setValue(value), 300), [])

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    sdk.field.onValueChanged(setValue);

    sdk.field.onSchemaErrorsChanged((errors) => setError(errors && errors.length > 0));
  }, [])

  useEffect(() => {
    if (value && value !== '') {
      sdk.field.setValue(value)
    } else {
      sdk.field.removeValue()
    }
  }, [value, sdk.field])

  return (
    <>
      <Flex alignItems="end">
        <div>
          <ColorBox color={realtimeValue} onClick={() => inputRef.current?.click()} />
          <input
            ref={inputRef}
            type="color"
            data-test-id="color-picker-input"
            value={value && value !== '' ? value : '#000000'}
            onChange={e => (debouncedSetValue(e.target.value), setRealtimeValue(e.target.value))}
            required={sdk.field.required}
            style={{
              display: 'block',
              opacity: 0,
              height: 4,
              border: 'none',
              padding: 0,
              margin: 0
            }}
          />
        </div>
        <Button
          buttonType="muted"
          data-test-id="clear-button"
          size="small"
          onClick={() => (setValue(undefined), setRealtimeValue(undefined))}
          style={{ marginBottom: 4 }}
        >Clear</Button>
      </Flex>
    </>
  );
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
