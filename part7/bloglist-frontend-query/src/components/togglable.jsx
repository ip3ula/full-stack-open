import { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }
  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const toggleVisiblity = () => {
    setVisible(!visible)
  }
  return (
    <>
      <div style={hideWhenVisible} className="hover:bg-teal-700 bg-teal-600 text-white w-70 py-1 rounded my-10 font-medium mx-auto block text-center">
        <button data-testid="new" onClick={toggleVisiblity}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button className="hover:bg-red-800 bg-red-700 text-white w-70 py-1 rounded my-10 font-medium mx-auto block text-center" onClick={toggleVisiblity}>cancel</button>
      </div>
    </>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable