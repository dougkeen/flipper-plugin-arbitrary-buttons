# flipper-plugin-arbitrary-buttons

A React Native plugin for Flipper that allows you to create buttons in Flipper that do arbitrary tasks in your app, all configured from within the app itself.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Find and install the `arbitrary-buttons` plugin in Flipper

In your React Native app, make sure you have `react-native-flipper` installed

## Usage

In your app, you can configure arbitrary buttons in Flipper like so:

```javascript
if (__DEV__) {
  import('react-native-flipper').then(({addPlugin}) => {
    addPlugin({
      getId() {
        return 'arbitrary-buttons'
      },
      onConnect(connection) {
        connection.send('createButton', {
          buttonStyle: 'primary', // Can be any of the AntD button types, default is 'default'
          label: 'My custom debug task',
          methodName: 'customTask',
          usePayload: true, // Optional... when true, adds a text field where you can specify
                            // an arbitrary JSON payload to send to the client
          payloadPlaceholder: '{"custom": 1234}' // Optional... placeholder text for JSON payload field
        })

        connection.receive('customTask', (payload) => {
          // Do whatever you want!
        })
      },
      onDisconnect() { },
      runInBackground() {
        return false
      },
    })
  }
}
```

## Support

Please [open an issue](https://github.com/dougkeen/flipper-plugin-arbitrary-buttons/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/dougkeen/flipper-plugin-arbitrary-buttons/compare/).
