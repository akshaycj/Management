import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {getData,setMarks} from './ProcesData';
import DatePicker from 'material-ui/DatePicker';
import {Card,CardTitle} from 'material-ui/Card';
import {Link} from 'react-router/lib';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

let DateTimeFormat;




const num = [];
export default class Marks extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      next:false,
      fetched:false,
      list:'',
      div:'',
      exam:'',
      sub:'',
      students:[],
      m:[],
      date:'',
      maxMark:'',
    }
  }

  listChange(event, index, value){
    //console.log('val',value);
    this.setState({list:value})
  }
  divChange(event, index, value){
    //console.log('val',value);
    this.setState({div:value})
  }
  examChange(event,value){
    //console.log('exam',value);
    this.setState({exam:value});
  }
  subjectChange(event,value){
    //console.log('sub',value);
    this.setState({sub:value});
  }
  dateChange(event,date){
    console.log('date',date);
    this.setState({date:date});
  }
  maxMarkChange(event,m){
    this.setState({maxMark:m});
  }
  onNext(){
    this.setState({next:true})
  }
  onFetch(){
    var self =this;
    getData(this.state.list,this.state.div).then(function(data){self.setState({students:data,fetched:true,next:true}); })
  }
  onMarkChange(event,value){


    num[event.target.name] = value;
    this.setState({m:num});

    for(let i = 0; i<this.state.m.length; i++){
      console.log("marks:"+i,this.state.m[i]);
    }

  }

  processForm(event){

    const finalMarks =[];
    const data= this.state.students;
    for(let i =0 ; i<num.length; i++){
      const marks={
        mark:'',
        num:'',
      };
      marks.mark = num[i];
      marks.num = data[i].admission;
      finalMarks.push(marks);
    }
    setMarks(finalMarks,this.state.exam,this.state.sub,this.state.date,this.state.maxMark,this.state.list,this.state.div);
  }

  render(){
    const students=[];
    const temp_students = this.state.students
    for(let i=0;i<temp_students.length;i++){
      students.push(
        <TableRow selectable={false}>
          <TableRowColumn>{temp_students[i].admission}</TableRowColumn>
          <TableRowColumn>{temp_students[i].name}</TableRowColumn>
          <TableRowColumn><TextField name={i} floatingLabelText='Mark' onChange={this.onMarkChange.bind(this)} /></TableRowColumn>
      </TableRow>)
    }
    const std =['LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XII'];
    const items =[];
    for(let i=0; i<std.length;i++){
      items.push(<MenuItem value={std[i]} key={std[i]} primaryText={std[i]} />)
    }
    const div = ['A','B','C','D','E','F'];
    const divItems =[];
    for(let i=0; i<div.length;i++){
      divItems.push(<MenuItem value={div[i]} key={div[i]} primaryText={div[i]} />)
    }
    return(
      <div>
        {this.state.fetched?
          <div></div>
          :
          <Card className="container" >
            <CardTitle title="Add New Exam:" />
            <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between', alignItems:'center',marginTop:20}}>
              <SelectField


                hintText="Class"
                floatingLabelFixed={true}
                value={this.state.list}
                onChange={this.listChange.bind(this)}
                maxHeight={200}>
                {items}
              </SelectField>
              <br />
              <SelectField


                hintText="Div"
                floatingLabelFixed={true}
                value={this.state.div}
                onChange={this.divChange.bind(this)}
                maxHeight={200}>
                {divItems}
              </SelectField>

              <TextField floatingLabelText="Exam Name" onChange={this.examChange.bind(this)}/>
              <TextField floatingLabelText='Subject' onChange={this.subjectChange.bind(this)}/>
              <TextField floatingLabelText='Maximum Mark' onChange={this.maxMarkChange.bind(this)} />
              <br />
              <DatePicker hintText="Exam Date"
                autoOk={true}
                onChange={this.dateChange.bind(this)}
                />

              <RaisedButton label='Next' onTouchTap={this.onFetch.bind(this)} style={{marginTop:20}} primary/>
            </div>
          </Card>

        }

        {this.state.next?<Card className="container" style={{minWidth:800}}>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between', alignItems:'center',marginTop:20}}>

            <div>

                <Table style={{maxWidth:700,overflow:'hidden'}}>
                  <TableHeader >
                    <TableHeaderColumn>No.</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Mark</TableHeaderColumn>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {students}
                  </TableBody>
                </Table>
                <br />
                <Link to='/'><RaisedButton label="Submit" onTouchTap={this.processForm.bind(this)} primary/></Link>

            </div>
          </div>
        </Card>:<div>

        </div>}

      </div>);
  }
}
