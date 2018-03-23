import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  notAuthorizedTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  maskViewOuter: {
    flex: 1
  },
  maskViewInnerTopDown: {
    flex: 1, backgroundColor: 'gray', opacity: 0.5
  },
  maskViewInnerMiddle: {
    flexDirection: 'row',
    height: 300,
    backgroundColor: 'transparent', opacity: 0.5
  },
  maskViewInnerMiddleOutside: {
    flex: 1, backgroundColor: 'gray'
  },
  qrcodeWindow: {
    height: 300,
    width: 300,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
