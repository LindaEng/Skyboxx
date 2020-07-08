import React from 'react'
import * as Tone from 'tone'
import EnvelopeSlider from './EnvelopeSlider'
import Arpeggiator from './Arpeggiator'

import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

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
    color: theme.palette.text.primary,
    marginTop: '10px',
    backgroundColor: '#f9f9f9'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

export class Instrument {
  constructor() {
    this.synth = null
    this.gain = new Tone.Gain()
    this.gain.toMaster()
    this.tick = 0
    this.initializeTransport()
  }

  defaultSettings() {
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
      },
      MembraneSynth: {
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
          attackCurve: 'exponential'
        }
      }
    }
  }
  // play(){
  //   Tone.Transport.start()
  // }

  initializeTransport(notes = 'CDEFGAB') {
    let newNotes = notes.split('').map(n => `${n}4`)
    Tone.Transport.scheduleRepeat(time => {
      let note = newNotes[(this.tick * 2) % newNotes.length]
      if (this.synth) this.synth.triggerAttackRelease(note, '2n', time)
      this.tick++
    }, '4n')
    // if(this.synth) this.synth.triggerAttackRelease('C4', '32n')
    Tone.Transport.start()
  }
  // initializeTransport() {
  //   let notes = 'CDEFGAB'.split('').map(n => `${n}4`)
  //   Tone.Transport.scheduleRepeat(time => {
  //     let note = notes[(this.tick * 2) % notes.length]
  //     if (this.synth) this.synth.triggerAttackRelease(note, '2n', time)
  //     this.tick++
  //   }, '4n')
  //   // if(this.synth) this.synth.triggerAttackRelease('C4', '32n')
  //   Tone.Transport.start()
  // }
  arpeggiator() {
    var pattern = new Tone.Pattern(
      function(time, note) {
        synth.triggerAttackRelease(note, 0.25)
      },
      ['C4', 'D4', 'E4', 'G4', 'A4']
    )
    pattern.start(0)
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

  updateSynth(synthType, envelope, value) {
    console.log('UPDATE synthType=', this.synth)
    if (this.synth) {
      this.synth.disconnect(this.gain)
      this.synth.dispose()
    }

    let settings = this.defaultSettings[synthType] || {}

    this.synth = new Tone[synthType](envelope)
    console.log('updateSynth this.synth=', this.synth.envelope)
    for (let key in envelope) {
      this.synth.envelope[key] = envelope[key]
    }
    console.log('updateSynth this.synth=', this.synth.envelope)
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
    toggle: false,
    envelopes: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  })

  let $synthType = state.sound
  let $oscillatorType = state.oscillator
  let $oscillatorPartials = state.oscillatorPartials
  let envelopes = ['attack', 'decay', 'sustain', 'release']

  if (state.toggle) {
    inst.updateSynth($synthType, state.envelopes)
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
  }

  const captureInfo = (sound, env, val) => {
    setState({
      ...state,
      envelopes: Object.assign({}, state.envelopes, {
        [env]: val
      })
    })
    console.log('capture Info State=', state)
    inst.updateSynth(sound, env, val)
    inst.updateOscillatorType($oscillatorType, $oscillatorPartials)
    inst.disconnect()
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={2}>
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
              <option value="MembraneSynth">MembraneSynth</option>
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
          <Box>
            <Button variant="outlined" onClick={control}>
              {state.toggle === false ? 'Play' : 'Stop'}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className={classes.paper}>
            {envelopes.map((env, id) => {
              return (
                <EnvelopeSlider
                  key={id}
                  state={state}
                  envelope={env}
                  captureInfo={captureInfo}
                />
              )
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Arpeggiator inst={inst} play={control} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Synthesizer
