import { Config } from './Config'

export const sendData = async (data) => {
  return new Promise((resolve, reject) => {
      if (data.qrCode === '' || data.longitude === 0 || data.latitude === 0) {
        reject('Data invalid')
      }
      let url = Config.baseURL + 'qr/door/open'
      var formData = new FormData()
      formData.append('code', data.qrCode)
      formData.append('lng', data.longitude)
      formData.append('lat', data.latitude)
      formData.append('accuracy', data.accuracy)
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
            reject('Server error, Please try again later', 'Detail: ' + error.message)
          })
        }
      }).catch((error) => {
        console.log(error.message)
        reject('Server error, Please try again later')
      })
    }
  )
}