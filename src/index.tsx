
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { TextInput } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

export const App = ({ sdk }: AppProps): JSX.Element => {
  const [value, setValue] = useState<string | undefined>(sdk.field.getValue())
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    sdk.field.onValueChanged(setValue);

    sdk.field.onSchemaErrorsChanged((errors) => setError(errors && errors.length > 0));
  }, [])

  useEffect(() => {
    if (value) {
      sdk.field.setValue(value)
    } else {
      sdk.field.removeValue()
    }
  }, [value, sdk.field])

  return (
    <TextInput
      id="my-field"
      testId="my-field"
      value={value}
      onChange={event => setValue(event.currentTarget.value)}
      required={sdk.field.required}
      error={error}
    />
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
