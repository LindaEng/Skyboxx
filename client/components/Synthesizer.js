import React from 'react'
import * as Tone from 'tone'
import EnvelopeSlider from './EnvelopeSlider'

import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import NativeSelect from '@material-ui/core/NativeSelect'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: '10px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

class Instrument {
  constructor() {
    this.synth = null
    this.gain = new Tone.Gain()
    this.gain.toMaster()
    this.tick = 0
    this.initializeTransport()
    this.counter = 0
  }

  get defaultSettings() {
    return {
      Synth: {
        oscillator: {type: 'triangle'},
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      },
      AMSynth: {
        harmonicity: 3,
        detune: 0,
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.5
        },
        modulation: {
          type: 'square'
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0,
          sustain: 1,
          release: 0.5
        }
      },
      FMSynth: {
        harmonicity: 3,
        modulationIndex: 10,
        detune: 0,
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.5
        },
        modulation: {
          type: 'square'
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0,
          sustain: 1,
          release: 0.5
        }
      }
    }
  }
  // play(){
  //   Tone.Transport.start()
  // }

  initializeTransport() {
    let notes = 'CDEFGAB'.split('').map(n => `${n}4`)
    Tone.Transport.scheduleRepeat(time => {
      let note = notes[(this.tick * 2) % notes.length]
      if (this.synth) this.synth.triggerAttackRelease(note, '8n', time)
      this.tick++
    }, '4n')
    // if(this.synth) this.synth.triggerAttackRelease('C4', '32n')
    Tone.Transport.start()
  }
  disconnect() {
    if (this.synth) {
      this.synth.disconnect(this.gain)
      this.synth.dispose()
    } else {
      console.log('there is no synth')
    }
  }

  updateSynth(synthType) {
    this.counter++
    //if we already defined a synth
    if (this.synth) {
      this.synth.disconnect(this.gain)
      this.synth.dispose()
    }

    let settings = this.defaultSettings[synthType] || {}
    this.synth = new Tone[synthType](settings)
    this.synth.connect(this.gain)
    //  this.initializeTransport()
  }

  updateOscillatorType(oscillatorType, oscillatorPartials) {
    let partials = oscillatorPartials === 'none' ? '' : oscillatorPartials
    this.synth.oscillator.type = `${oscillatorType}${partials}`
  }
}

////////////////////////////////////////////////////////////
const Synthesizer = props => {
  let inst = new Instrument()
  const classes = useStyles()
  const [state, setState] = React.useState({
    sound: 'Synth',
    oscillator: 'triangle',
    oscillatorPartials: '2',
    toggle: false
  })

  let $synthType = state.sound
  let $oscillatorType = state.oscillator
  let $oscillatorPartials = state.oscillatorPartials
  let envelopes = ['Attack', 'Decay', 'Sustain', 'Release']

  if (state.toggle) {
    inst.updateSynth($synthType)
    inst.updateOscillatorType($oscillatorType, $oscillatorPartials)
  }

  const handleChange = event => {
    const name = event.target.name
    setState({
      ...state,
      [name]: event.target.value
    })
    inst.disconnect()
  }

  const control = () => {
    setState({
      ...state,
      toggle: !state.toggle
    })
    inst.disconnect()
    console.log('TOGGLE A===', state.toggle)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Select Sound
            </InputLabel>
            <Select
              native
              defaultValue=""
              onChange={handleChange}
              label="Select Sound"
              id="synth-type"
              inputProps={{
                name: 'sound',
                id: 'outlined-age-native-simple'
              }}
            >
              <option value="Synth">Synth</option>
              <option value="AMSynth">AMSynth</option>
              <option value="FMSynth">FMSynth</option>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Select Wave
            </InputLabel>
            <Select
              native
              value={state.oscillator}
              onChange={handleChange}
              label="Select Oscillator"
              id="oscillator-type"
              inputProps={{
                name: 'oscillator',
                id: 'outlined-age-native-simple'
              }}
            >
              <option value="triangle">Triangle</option>
              <option value="sawtooth">sawtooth</option>
              <option value="sine">sine</option>
              <option value="square">square</option>
              <option value="pulse">pulse</option>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Select Partials
            </InputLabel>
            <Select
              native
              value={state.oscillatorPartials}
              onChange={handleChange}
              label="Select Oscillator Partials"
              id="oscillator-type-partials"
              inputProps={{
                name: 'oscillatorPartials',
                id: 'outlined-age-native-simple'
              }}
            >
              <option value="none">none</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={control}>
            {state.toggle === false ? 'Play' : 'Stop'}
          </Button>
        </Grid>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            {envelopes.map((env, id) => {
              return <EnvelopeSlider key={id} state={state} envelope={env} />
            })}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default Synthesizer
