const request = require('request');
const path = require('path');
const azureStorage = require('azure-storage');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).single('originalname')
const getStream = require('into-stream')
const containerName = 'faceapi'//'cognitiveapifile'//
const azure = require('azure')
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')


var app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.set('view engine', 'ejs') 
app.set('views',path.join(__dirname,'views'))


const blobService = azureStorage.createBlobService('cognitiveapifile','KdF8+Qj3b3dWCKs9NXtCvXhiGnOB1FkJiUPs3uD2+1dnEhAf/k68BBkX0ivu4tgOv0equeJ1+qXqsz+P1pDIlw==')


//const imageUrl ='https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';
subscriptionKeyFaceApi = '3cbd061045ef453b871aadaba12835c8';
uriBaseFaceApi = 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect';

const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'gender,' +
        'emotion'
};




const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${originalName}-${identifier}`;
};


// var tempUrl = blobService.getUrl('cognitiveapifile', "faceapi",  { AccessPolicy: {
//     Start: Date.now(),
//     Expiry: azure.date.minutesFromNow(60),
//     Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.READ
// }});

var hostName = 'https://cognitiveapifile.blob.core.windows.neti/cognitiveapifile/faceapi'

app.get('/',(req,res)=>{
    res.render('homePage')
})

app.post('/uploaded', uploadStrategy, (req, res) => {
    console.log(req.file)
    const blobName = getBlobName(req.body.originalname)
    const stream = getStream(req.file.buffer)
    const streamLength = req.file.buffer.length
    var tempUrl = blobService.getUrl(containerName, blobName, hostName);
    console.log(tempUrl)
    
    const options = {
        uri: uriBaseFaceApi,
        qs: params,
        body: '{"url": ' + '"' + tempUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKeyFaceApi
        }
    };


    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength,err => {
        request.post(options, (error, response, body) => {
            if (error) {
              console.log('Error: ', error);
              return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('JSON Response\n');
            jsonPar=JSON.parse(body)
            len_json=jsonPar[0].lenght
            console.log(jsonPar[0].faceAttributes.gender)
            var gen=JSON.stringify(jsonPar[0].faceAttributes.gender)
            var emotion=JSON.stringify(jsonPar[0].faceAttributes.emotion)
            var emoj=jsonPar[0].faceAttributes.emotion
            console.log("emoj",emoj)


            // var i;
            // for(i=0;i<len_json;i++){
            //     console.log(i)
            //     //gen.push(jsonPar[i].faceAttributes.gender)
            //     gen.push(i)
            //     jsonPar[i].emotion.forEach(j => {
            //         if(j !=0){
            //             console.log(j)
            //             emotion.push(j)
            //         }
            //     });  
            // }
            // console.log(gen,emotion)
            //var a = [jsonResponse[0].faceAttributes]
            //console.log("a",a)

            res.render('uploaded',{
                downloadBlob:tempUrl,
                gender: gen,
                anger: emoj['anger']*100,
                contempt: emoj['contempt']*100,
                disgust:emoj['disgust']*100 ,
                fear: emoj['fear']*100,
                happiness:emoj['happiness']*100 ,
                neutral:emoj['neutral']*100,
                sadness:emoj['sadness']*100 ,
                surprise:emoj['surprise']*100 
            })
          }) ;

        if(err) {
            handleError(err);
            return;
        }

        // res.render('uploaded',{

        //     downloadBlob:tempUrl
        // })
    });

    // const options = {
    //     uri: uriBaseFaceApi,
    //     qs: params,
    //     body: '{"url": ' + '"' + tempUrl + '"}',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Ocp-Apim-Subscription-Key' : subscriptionKeyFaceApi
    //     }
    // };
    // request.post(options, (error, response, body) => {
    //     if (error) {
    //       console.log('Error: ', error);
    //       return;
    //     }
    //     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    //     console.log('JSON Response\n');
    //     console.log(jsonResponse);
    //   });
    
});


// const options = {
//     uri: uriBaseFaceApi,
//     qs: params,
//     body: '{"url": ' + '"' + tempUrl + '"}',
//     headers: {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key' : subscriptionKeyFaceApi
//     }
// };

// request.post(options, (error, response, body) => {
//     if (error) {
//       console.log('Error: ', error);
//       return;
//     }
//     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
//     console.log('JSON Response\n');
//     console.log(jsonResponse);
//   });

  




app.listen(process.env.PORT||3000)