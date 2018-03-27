/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
  Button,
  Linking,
  NativeModules
} from 'react-native'
import Camera from 'react-native-camera'
import { styles } from './QRCodeScanner.Style'
import { Config } from './Config'

const {ReactManager} = NativeModules

type Props = {};
export default class QRCodeScanner extends Component<Props> {
  camera: Camera

  constructor (props) {
    super(props)
    this.watchId = 0
    this.locationSettingRequestShowing = false

    this.state = {
      processing: false,
      qrCode: '',
      flashOn: false,
      longitude: 0,
      latitude: 0,
      accuracy: 0,
      backCamera: true,
    }
  }

  static navigationOptions = ({navigation}) => ({
    headerLeft: <Button title={'Back'} onPress={() => {
      if (Config.rootTag != -1) {
        console.log('QRCodeScanner app rootTag ' + Config.rootTag)
        ReactManager.dismissPresentedViewController(Config.rootTag)
      }
    }}></Button>
  })

  componentDidMount () {
    this.getLocation()
  }

  componentWillUnmount () {
    console.log('componentWillUnmount: ' + this.watchId)
    navigator.geolocation.clearWatch(this.watchId)
  }

  goBackToLifeUp = () => {
    console.log('Go back to lifeup: rootTag ' + Config.rootTag)
    if (Config.rootTag != -1) {
      console.log('goBackToLifeUp app rootTag ' + Config.rootTag)
      ReactManager.dismissPresentedViewController(Config.rootTag)
    }
  }

  sendData (qrcode) {
    return new Promise((resolve, reject) => {
        if (this.state.qrCode === '' || this.state.longitude === 0 || this.state.latitude === 0) {
          reject('Data invalid')
        }
        let url = Config.baseURL + 'qr/door/open'
        var formData = new FormData()
        formData.append('code', qrcode)
        formData.append('lng', this.state.longitude)
        formData.append('lat', this.state.latitude)
        formData.append('accuracy', this.state.accuracy)
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: Config.token
          },
          body: formData
        }).then((response) => {
          console.log('HTTP Status: ' + response.status)
          if (response.status === 200) {
            resolve()
          } else {
            response.json().then((json) => {
              if (json.detail != null) {
                reject(json.detail)
              } else {
                reject('Server error, Please try again later')
              }
            }).catch((error) => {
              reject('Error: ' + error.message)
            })
          }
        }).catch((error) => {
          console.log(error.message)
          reject('Server error, Please try again later')
        })
      }
    )

  }

  getLocation = () => {
    const successCallback = (position) => {
      console.log(position)
      this.setState({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        accuracy: position.coords.accuracy
      })
    }
    const goToSetting = () => {
      this.locationSettingRequestShowing = false
      Linking.canOpenURL('app-settings:').then(supported => {
        if (!supported) {
          console.log('Can\'t handle settings url')
        } else {
          return Linking.openURL('app-settings:')
        }
      }).catch(err => console.error('An error occurred', err))
    }
    const errorCallback = (error) => {
      console.log(error)
      if (error.code == 1) {
        if (this.locationSettingRequestShowing == false) {
          this.locationSettingRequestShowing = true
          Alert.alert('App requires location info', 'Would you like to open the app setting?',
            [
              {text: 'Yes', onPress: () => goToSetting()},
              {
                text: 'Cancel', style: 'cancel', onPress: () => {
                this.locationSettingRequestShowing = false
                this.goBackToLifeUp()
              }
              },
            ], {cancelable: true})
        }

      } else {
        Alert.alert('Notice', 'Error code: ' + error.code + ': ' + error.message)
      }
    }
    const options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 50}
    this.watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    console.log('watchPosition: ' + this.watchId)
  }

  onBarCodeRead = (e) => {
    console.log('onBarCodeRead processing: ' + this.state.processing)
    if (this.state.processing === true) {
      return
    }
    this.setState({
      processing: true
    })
    const callback = async () => {
      try {
        let result = await this.sendData(e.data)
        this.goBackToLifeUp()
      } catch (error) {
        Alert.alert('Notice', 'Error: ' + error, [{
          text: 'Ok',
          onPress: () => this.goBackToLifeUp()
        }])
      }
      setTimeout(() => {
        this.setState({
          processing: false
        })
      }, 5000)

    }
    this.setState({qrCode: e.data}, callback)
  }

  renderMaskView = () => {
    return (
      <View style={styles.maskViewOuter}>
        <View style={styles.maskViewInnerTopDown}></View>
        <View style={styles.maskViewInnerMiddle}>
          <View style={styles.maskViewInnerMiddleOutside}></View>
          <View style={styles.qrcodeWindow}>
            <ActivityIndicator size={'large'} color={'black'} hidesWhenStopped={true}
                               animating={this.state.processing}/>

          </View>
          <View style={styles.maskViewInnerMiddleOutside}></View>
        </View>
        <View style={styles.maskViewInnerTopDown}></View>
      </View>
    )
  }
  renderNotAuthorizedView = () => {
    return (
      <View style={styles.notAuthorizedTextContainer}>
        <Text style={{textAlign: 'center'}}>
          Camera is not authorized for this app. Please enable it in Phone's settings.
        </Text>
      </View>
    )
  }

  render () {
    const cameraType = this.state.backCamera ? Camera.constants.Type.back : Camera.constants.Type.front

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.welcome}>Long: {this.state.longitude} Lat: {this.state.latitude} </Text>
        </View>
        <Camera
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          type={cameraType}
          ref={cam => this.camera = cam}
          aspect={Camera.constants.Aspect.fill}
          notAuthorizedView={this.renderNotAuthorizedView()}
          // flashMode={Camera.constants.FlashMode.torch}
          // torchMode={Camera.constants.TorchMode.on}
        >
          {this.renderMaskView()}

        </Camera>
      </View>
    )
  }
}

