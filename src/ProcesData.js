import csv from 'csvjson';
import {ref} from './helpers/constants';

export function jsonData(data){
  var options = {
        delimiter : ',' ,
        quote     : '"' ,

    };
  var result = csv.toObject(data, options);
  for(let i =0; i<result.length; i++){
    console.log("addd",result[i]);
    var data={
      name:'',
      admission:'',
      std:'',
      div:'',
    };
    data.name = result[i].NAME;
    data.admission = result[i].ADMISSION;
    data.std =result[i].CLASS;
    data.div =result[i].DIV;
    ref.child('admissions/'+result[i].ADMISSION).set(data);
    ref.child('students/'+result[i].CLASS+'/'+result[i].DIV+'/'+result[i].ADMISSION).set(data);
  }
}

export function getData(std,div){
  const result=[];
  return ref.child('students/'+std+'/'+div).once('value')
    .then(function(snapshot){
      snapshot.forEach(function(child){
        var data={
          div:'',
          name:'',
          std:'',
          admission:''
        }
        data.div=child.val().div;
        data.name = child.val().name;
        data.std = child.val().std;
        data.admission = child.val().admission;
        result.push(data);
      })
    })
    .then(function(data){
      return result;
    })
}

export function setMarks(marks,exam,sub,date,max,std,div){
  for(let i = 0; i<marks.length; i++){
    ref.child('marks/'+std+'/'+div+'/'+marks[i].num+'/'+exam).push().set({
      sub:sub,
      mark:marks[i].mark,
      date:''+date,
      maxMark:max
    })

  }
}
