import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import {Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(3),
    height: '100px',
    width: '100px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#f9f9f9',
    fontSize: 20,
    justifyItems: 'center'
  },
  typography: {
    fontSize: 50,
    justifyContent: 'center'
  }
}))

const Arpeggiator = props => {
  console.log('arpeggiator props', props)
  const classes = useStyles()

  function FormRow() {
    return (
      <React.Fragment>
        <Grid item xs={3}>
          <Paper className={classes.paper}>Sound</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>Sound</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>Sound</Paper>
        </Grid>
      </React.Fragment>
    )
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.typography} container spacing={1}>
        <img
          src="https://res.cloudinary.com/electronic-beats/w_1364,h_710.41666666667,c_crop,q_auto,f_auto,g_auto/stage/uploads/2017/10/synthmonster.jpg"
          onClick={props.control}
        />
      </Grid>
    </div>
  )
}

export default Arpeggiator
