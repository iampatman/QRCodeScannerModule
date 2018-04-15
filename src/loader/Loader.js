import React from 'react'
import {
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator
} from 'react-native'

const Loader = props => {
  const {
    loading,
    text
  } = props
  return (
    <Modal
      visible={loading}
      animationType={'none'}
      transparent
      onRequestClose={() => {
        console.log('loader')
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator
            size={'large'}
            color={'white'}
            animating
          />
          {text !== null && text !== '' ? <Text style={styles.text}>{text}</Text> : null}

        </View>

      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    height: 100,
    width: 150
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  },
  text: {
    marginTop: 10,
    color: 'white',
    textAlign: 'center'
  }
})
export default Loader
