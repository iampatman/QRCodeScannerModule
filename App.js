/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
} from 'react-native'
import QRCodeScanner from './src/QRCodeScanner.Screen'
import { StackNavigator } from 'react-navigation'
import { Config } from './src/Config'

type Props = {};
const RootNavigator = StackNavigator({
  qrCodeScanner: {
    screen: QRCodeScanner,
    navigationOptions: {
      title: 'Scan QR Code',
      // header: null
    }
  }
}, {})

export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    Config.rootTag = props.rootTag ? props.rootTag : '1'
    Config.token = props.token ? props.token : 'Token 73c1f166171d74c9a2f833d16451064d55f7982f'
    // Config.baseURL = props.base_url ? props.base_url : 'http://13.250.247.107/v1/'
    Config.baseURL = props.base_url ? props.base_url : 'https://api.lifeup.com.sg/v1/'
    console.log('App rootTag loaded' + Config.rootTag)
    console.log('token rootTag' + Config.token)

  }

  render () {
    return (
      <RootNavigator/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

})
