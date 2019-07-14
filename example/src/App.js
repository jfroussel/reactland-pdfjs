import React, { Component } from 'react'

import ExampleComponent from 'reactland-pdfjs'

export default class App extends Component {
  render () {
    return (
      <div>
        <ExampleComponent url='http://www.pdf995.com/samples/pdf.pdf' />
      </div>
    )
  }
}
