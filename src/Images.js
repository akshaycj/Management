import React, { Component } from 'react';

import {storage, ref,str} from './helpers/constants';

import { Upload, Icon, Modal,Progress } from 'antd';
import './App.css'

const key_id='';

export default class Image extends Component{
  constructor(props){
    super(props);
    this.state = {
      imgData:'',
      img:'',
      name:'',
      click:false,
      previewVisible: false,
      progress:0,
      progress_vis:false,
    previewImage: '',
    fileList: [],
    };

  }


  componentDidMount(){
    this.fetchData();
  }

  fetchData(){
    var self = this;
    var fileList = [];
    ref.child('gallery').once('value')
      .then(function(snapshot){

        snapshot.forEach(function(child){
          var data={
            uid:'',
            name:'',
            status:'',
            url:''
          }
          data.uid=child.key;
          data.name = child.key+'.jpg';
          data.status= 'done';
          data.url= child.val().key;
          fileList.push(data);
        })
        self.setState({fileList:fileList})

      })
  }

  handleFile(event){
    //console.log('file',event);
    const name = event.uid;
    const self = this;
    var reader =new FileReader();
    reader.onload=function(evt){
      //jsonData(evt.target.result)
      //console.log("event",evt);
      self.setState({img:evt.target.result,click:true,name:name});
      //console.log("imgD",evt.target.result);
      self.uploadFile();

    }
    reader.readAsDataURL(event)
  }

  uploadFile(){
    console.log("reached upload");
    var self = this;
    fetch(this.state.img)
      .then(function(result){return result.blob()})
      .then(function(blob){
        console.log("blob",blob);
        key_id = ref.child('gallery').push().key;
        const uploadTask = storage.ref('gallery/').child('images/'+key_id+'.jpg').put(blob);
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
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        ref.child('gallery/'+key_id).set({key:downloadURL})
                        self.setState({progress_vis:false});
                      });
      })
  }


  handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }

    handleChange = ({ fileList }) => {
      this.setState({ fileList })
      console.log("origin",fileList);
      const len = fileList.length;
      this.handleFile(fileList[len-1].originFileObj)
  }
  handleRemove(file){
    console.log("fileList",file);
    storage.ref('gallery/').child('images/'+file.name).delete();
    ref.child('gallery/'+file.uid).remove();
    this.fetchData();
  }



  render(){

    const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );


    return(
      <div style={{margin:'auto', width:'50%',marginTop:20,}}>

        <div className="clearfix">
          <Upload

            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove.bind(this)}
          >
            {uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Modal visible={this.state.progress_vis} footer={null} style={{margin:'auto',textAlign:'center'}} >
            <Progress type="circle" percent={this.state.progress}  />
          </Modal>

        </div>

      </div>
      );
  }
}
