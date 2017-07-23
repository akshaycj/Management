import React, { PropTypes, Component } from 'react';
import { Link, IndexLink } from 'react-router/lib';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import './App.css';



export default class Base extends React.Component{
  constructor(props){
    super(props);

  };
  componentDidMount(){

  }
  render(){
    const pr = this.props;
    return(

      <div>

        <AppBar  title={<IndexLink to="/"><FlatButton label="Informatia" labelStyle={{color:'white',
        fontWeight: 'bold',}}/></IndexLink>}
          iconElementRight={
            <div style={{marginTop:5,}}>
              <Link to="/marks"><FlatButton label="Marks" labelStyle={{color:'white',fontWeight: 'bold',}} /></Link>
              <Link to="/admission"><FlatButton label="Admission" labelStyle={{color:'white',fontWeight: 'bold',}} /></Link>
              <Link to="/images"><FlatButton label="Images" labelStyle={{color:'white',fontWeight: 'bold',}} /></Link>
            </div>}
          />
         <div >

          {pr.children}

         </div>

      </div>


    );
  }
}

/*{<IndexLink to="/"><FlatButton label="Informatia Management" labelStyle={{color:'white',
fontWeight: 'bold',}}/></IndexLink>}*/
