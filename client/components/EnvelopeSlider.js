import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
})

function valuetext(value) {
  return `${value}°C`
}

const EnvelopeSlider = props => {
  const classes = useStyles()

  function updateEnvelope(event, value) {
    props.captureInfo(props.state.sound, props.envelope, value)
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        {props.envelope}
      </Typography>
      <Slider
        id={props.envelope}
        defaultValue={0}
        getAriaValueText={valuetext}
        onChange={updateEnvelope}
        //onDragEnd={console.log('i am dragging')}
        //onDragStart={props.updateEnv}
        // label= {props.envelope}
        valueLabelDisplay="auto"
        step={0.005}
        //marks
        min={0}
        max={1}
      />
    </div>
  )
}

export default EnvelopeSlider
