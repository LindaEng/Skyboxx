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
  console.log('envelope PROOOPHHHSS===akfaa', props)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        {props.envelope}
      </Typography>
      <Slider
        defaultValue={30}
        getAriaValueText={valuetext}
        // onChange={updateEnvelope}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />
    </div>
  )
}

export default EnvelopeSlider
