{
  let FormData = window.FormData
  class ImagePicker {
    constructor(options) {
      let defaultOptions = {
        element: null,
        upload: {
          url: '',
          methods: '',
          inputName: ''
        },
        parseResponse: null,
        fallbackImage: ''
      }
      this.options = Object.assign({}, defaultOptions, options)
      this.checkOptions()
      this.domRefs = {
        img: this.options.element.querySelector('img')
      }
      this.initHtml()
      this.bindEvents()
    }
    checkOptions() {
      let { element, upload: { url, methods, inputName } } = this.options
      if (!element || !url || !methods || !inputName) {
        throw new Error('Some option is required')
      }
      return this
    }
    initHtml() {
      let { element } = this.options
      let fileInput = (this.domRefs.fileInput = dom.create('<input type="file"/>'))
      dom.append(element, fileInput)
    }
    willUpload(formData) {
      this.options.element.classList.add('uploading')
      this.domRefs.fileInput.disabled = true
    }
    didUpload(formData) {
      let { element } = this.options
      element.classList.remove('uploading')
      this.domRefs.fileInput.disabled = false
      this.domRefs.fileInput.value = ''
      dom.dispatchEvent(element, 'uploaded')
    }
    willDownload(path) {
      this.options.element.classList.add('downloading')
    }
    upload(formData) {
      let { element, upload, parseResponse } = this.options
      http(upload.method, upload.url, formData).then(responseBody => {
        let path = parseResponse(responseBody)
        this.didUpload(formData)
        this.willDownload(path)        
      })
    }
    bindEvents() {
      this.domRefs.fileInput.addEventListener('change', e => {
        let { upload } = this.options
        let formData = new FormData()
        formData.append(upload.inputName, e.target.files[0])
        this.willUpload(formData)
        this.upload(formData)
      })
    }
  }

  function prefetch(url) {
    
  }

  function http(method, url, data) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()  
      xhr.open(method, url)
      xhr.onload = () => resolve(xhr.responseText, xhr)
      xhr.onerror = () => reject(xhr)
      xhr.send(data)
    })
  }
}