/* eslint-disable @typescript-eslint/no-empty-function */

import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Button, Flex } from '@contentful/forma-36-react-components';
import { ColorPicker } from './ColorPicker';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

type SubsetFieldExtensionSDK = Pick<FieldExtensionSDK, 'window' | 'field'>

interface AppProps {
  sdk: SubsetFieldExtensionSDK;
}

export const App = ({ sdk }: AppProps): JSX.Element => {
  const [value, setValue] = useState<string | undefined>(sdk.field.getValue())
  const [, setError] = useState<boolean>(false)

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
      <Flex>
        <ColorPicker value={value} onChange={v => setValue(v)} required={sdk.field.required} />
        <Button
          buttonType="muted"
          data-test-id="clear-button"
          size="small"
          onClick={() => (setValue(undefined))}
          style={{ margin: 4 }}
        >Clear</Button>
      </Flex>
    </>
  );
}

const root = document.getElementById('root')

if (root) {
  const isInIframe = window.self !== window.top;

  if (isInIframe) {

    init(sdk => render(<App sdk={sdk as SubsetFieldExtensionSDK} />, root));

  } else {
    const mockSdk: SubsetFieldExtensionSDK = ({
      field: {
        getValue: () => { },
        onSchemaErrorsChanged: () => () => { },
        onValueChanged: () => () => { },
        removeValue: () => Promise.resolve(),
        setValue: () => Promise.resolve(undefined),
        id: 'field-id',
        locale: 'field-locale',
        onIsDisabledChanged: () => () => { },
        required: false,
        setInvalid: () => () => { },
        type: 'field-type',
        validations: []
      },
      window: {
        startAutoResizer: () => { },
        stopAutoResizer: () => { },
        updateHeight: () => { }
      }
    })

    render((
      <div style={{ maxWidth: '768px', margin: '20px auto 0' }}>
        <App sdk={mockSdk} />
      </div>
    ), root);
  }
}


/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
