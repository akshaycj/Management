import React, { Component } from 'react';

import {storage, ref,str} from './helpers/constants';

import { Upload, Icon, Modal,Progress} from 'antd';
import './App.css'
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


const key_id='';


export default class Feed extends React.Component{
  constructor(props){
    super(props);

    this.state={
      dataList:[],
      title:'',
      desc:'',
      std:'All',
      key:'',
      img:1,
      imgData:'',
      open:false,
      click:false,
      previewVisible: false,
      progress:0,
      progress_vis:false,
      previewImage: '',
      fileList: [],
    }
  }


  componentDidMount(){
    this.fetchData();
  }

  fetchData(){
    var self = this;
    var fileList = [];
    ref.child('feed').once('value')
      .then(function(snapshot){
        snapshot.forEach(function(child){
          var data={
            desc:'',
            title:'',
            std:'',
            key:'',
            del:''
          }
          data.desc = child.val().desc;
          data.title = child.val().title
          data.std = child.val().std
          data.key = child.val().key
          data.del = child.key;
          fileList.push(data);
        })
        self.setState({dataList:fileList})

      })
  }

  handleDelete(key){
    var self =this;
    storage.ref('feed/').child('images/'+key+'.jpg').delete();
    ref.child('feed/'+key).remove();
    this.fetchData();
  }

  handleTitle(event,str){

    this.setState({title:str})
  }

  handleDesc(event,str){

    this.setState({desc:str})
  }
  handleUrl(event,str){

    this.setState({key:str,img:0})
  }

  handleStdChange(event,index,value){
    this.setState({std: value});
    //console.log('sub',value);
  };

  handleAdd(event){
    this.setState({open:!this.state.open})
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    console.log("origin",fileList);
    //const len = fileList.length;
    this.handleFile(fileList[0].originFileObj)
}

handlePreview = (file) => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
}
handleCancel = () => this.setState({ previewVisible: false })


handleFile(event){
  const name = event.uid;
  const self = this;
  var reader =new FileReader();
  reader.onload=function(evt){

    self.setState({imgData:evt.target.result,click:true});
    //console.log("imgD",evt.target.result);


  }
  reader.readAsDataURL(event)
}

uploadFile(){
  console.log("reached upload");
  var self = this;
  fetch(this.state.imgData)
    .then(function(result){return result.blob()})
    .then(function(blob){
      console.log("blob",blob);
      key_id = ref.child('feed').push().key;
      const uploadTask = storage.ref('feed/').child('images/'+key_id+'.jpg').put(blob);
        //.then(function(snapShot){ref.child('gallery').push().set({key:snapShot.downloadURL})})
        uploadTask.on(str.TaskEvent.STATE_CHANGED, // or 'state_changed'
                      function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        self.setState({progress_vis:true});
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("reached progress",progress);
                        self.setState({progress:Math.round(progress)});

                      }, function(error) {



                    }, function() {
                      // Upload completed successfully, now we can get the download URL
                      if(self.state.img){
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        self.setState({progress_vis:false,key:downloadURL});
                      }
                      var data={
                        desc:'',
                        title:'',
                        std:'',
                        key:'',
                      }

                      data.desc= self.state.desc;
                      data.title = self.state.title;
                      data.std = self.state.std;
                      data.key = self.state.key;
                      ref.child('feed/'+key_id).set(data);
                      //self.setState({progress_vis:false});
                      self.state.progress==100?self.setState({open:false}):null

                      self.fetchData();
                    });
    })
}


  render(){
    const fileList = this.state.dataList;
    const feed_items =[];
      for(let i=0; i<fileList.length;i++){
          feed_items.push(


            <ListItem style={{textAlign:'left'}} key={i}
            primaryText={fileList[i].title}   rightIconButton={<FlatButton label="Delete" labelStyle={{color:'#00bcd4',
            fontWeight: 'bold',}} primary  onTouchTap={this.handleDelete.bind(this,fileList[i].del)}   />} />
          )
      }

      const forItems = ['All','LKG','UKG','1','2','3','4','5','6','7','8','9','10'];
      const selectItems =[];

      for (let i = 0; i <forItems.length; i++ ) {
        selectItems.push(<MenuItem value={forItems[i]} key={i} primaryText={forItems[i]} />);
      };

      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleAdd.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.uploadFile.bind(this)}
      />,
    ];

    const { previewVisible, previewImage,} = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );

    return(
      <div>
        <div style={{margin:'auto' ,width:'50%',textAlign:'center'}} >
        <List style={{padding:10}} >
          {feed_items}
        </List>
        <FloatingActionButton mini={true} onTouchTap={this.handleAdd.bind(this)}>
              <ContentAdd />
        </FloatingActionButton>



        </div>




        <Dialog
           title="Add feed"
           actions={actions}
           modal={false}
           contentStyle={{minHeight:600,}}
           autoScrollBodyContent={true}
           titleStyle={{textAlign:'center'}}
           open={this.state.open}>

           <div>
           <div style={{textAlign:'center'}}>
             <TextField
               floatingLabelText="Title"
               onChange={this.handleTitle.bind(this)}
             />
           <br />
               <TextField
                   onChange={this.handleDesc.bind(this)}

                   floatingLabelText="Description"
                 />
               <br />
               <SelectField
                 value={this.state.std}
                 style={{maxWidth: 300, textAlign:'left'}}
                 hintText="For:"
                 onChange={this.handleStdChange.bind(this)}
                 maxHeight={200}>
                 {selectItems}
               </SelectField>
             <br />
             </div>



               {this.state.progress_vis ?
                 <div style={{margin:'auto',textAlign:'center'}} >
                   <Progress type="circle" percent={this.state.progress}  />
                 </div>
                 :
                 <div className="clearfix" style={{margin:'auto', width:'50%', marginRight:50}}>
                   <Upload

                     listType="picture-card"
                     fileList={this.state.fileList}
                     onPreview={this.handlePreview}
                     onChange={this.handleChange}

                   >
                     {this.state.fileList.length<1 ? uploadButton : null}
                   </Upload>

                 </div>
               }

               <div style={{textAlign:'center'}}>
                 Or<br/>
                  <TextField
                    onChange={this.handleUrl.bind(this)}
                    floatingLabelText="Youtube Url"
                    />
               </div>

           </div>

         </Dialog>
      </div>
    );
  }
}
