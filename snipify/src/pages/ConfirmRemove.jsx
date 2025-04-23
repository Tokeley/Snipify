import React from 'react'
import MobileWrapper from '../components/MobileWrapper'

const ConfirmRemove = ({toRemoveUris}) => {
  return (
    <MobileWrapper>
      <div>ConfirmRemove</div>
      {
        toRemoveUris.map((uri) => (
          <div key={uri} className="flex items-center justify-between p-4 border-b">
            <span>{uri}</span>
            <button className="btn btn-danger">Remove</button>
          </div>
        ))
      }
    </MobileWrapper>
  )
}

export default ConfirmRemove