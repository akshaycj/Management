import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton';
import {Card , CardTitle} from 'material-ui/Card';
import './App.css';
import {jsonData} from './ProcesData';
import Snackbar from 'material-ui/Snackbar';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      imgData:'',
      bar:false,
    }
    this.styles={
      upload:{
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      },
    }
  }

  handleFile(event){

    console.log('file',event.target.files[0]);
    this.setState({imgData:event.target.value,});
    const self = this;
    var reader =new FileReader();
    reader.onload=function(evt){
      jsonData(evt.target.result)
      self.setState({bar:true})
    }
    reader.readAsText(event.target.files[0],'UTF-8')


  }

  render() {
    return (
      <div >

        <Card className="container">
          <CardTitle title="Add Admission List"  titleStyle={{fontWeight:'bold', color:'#00bcd4'}} />
          <RaisedButton label="Choose a file" secondary labelPosition="before" containerElement="label">
            <input id="upload" ref="upload"  type="file" style={this.styles.upload} onChange={this.handleFile.bind(this)}/>
            </RaisedButton>
        </Card>

        <Snackbar
          open={this.state.bar}
          message="Admission List Added!"
          autoHideDuration={4000}
        />
      </div>
    );
  }
}

export default App;
