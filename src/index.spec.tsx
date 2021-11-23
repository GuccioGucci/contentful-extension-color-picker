/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { App } from './index'
import { render, fireEvent, cleanup, configure } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

configure({
  testIdAttribute: 'data-test-id'
})

function renderComponent(sdk: FieldExtensionSDK) {
  return render(<App sdk={sdk} />)
}

const sdk: any = {
  field: {
    getValue: jest.fn(),
    onSchemaErrorsChanged: jest.fn(),
    onValueChanged: jest.fn(),
    removeValue: jest.fn(),
    setValue: jest.fn()
  },
  window: {
    startAutoResizer: jest.fn()
  }
}

jest.useFakeTimers('modern')

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(cleanup)

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    sdk.field.getValue.mockImplementation(() => '#ff00ff')
    const { getByTestId } = renderComponent(sdk)

    expect(sdk.field.getValue).toHaveBeenCalled()
    expect(sdk.field.onValueChanged).toHaveBeenCalled()
    expect((getByTestId('color-picker-input') as HTMLInputElement).value).toEqual('#ff00ff')
  })

  it('should call starstartAutoResizer', () => {
    renderComponent(sdk)
    expect(sdk.window.startAutoResizer).toHaveBeenCalled()
  })

  it('should call setValue on every change in input and removeValue when input gets empty', async () => {
    const { getByTestId } = renderComponent(sdk)

    act(() => {
      fireEvent.change(getByTestId('color-picker-input'), {
        target: { value: '#ffffff' }
      })

      jest.advanceTimersByTime(350)
    })

    expect(sdk.field.setValue).toHaveBeenCalledWith('#ffffff')

    act(() => {
      fireEvent.change(getByTestId('color-picker-input'), {
        target: { value: undefined }
      })

      jest.advanceTimersByTime(350)
    })

    expect(sdk.field.setValue).toHaveBeenCalledTimes(1)
    expect(sdk.field.removeValue).toHaveBeenCalledTimes(1)
  })

  it('should call removeValue when clicking on "clear"', async () => {
    sdk.field.getValue.mockImplementation(() => '#ff00ff');

    const { getByTestId } = renderComponent(sdk)

    act(() => {
      fireEvent.click(getByTestId('clear-button'))
    })

    expect(sdk.field.setValue).toHaveBeenCalledTimes(1)
    expect(sdk.field.setValue).toHaveBeenCalledWith('#ff00ff')
    expect(sdk.field.removeValue).toHaveBeenCalledTimes(1)
  })
})
