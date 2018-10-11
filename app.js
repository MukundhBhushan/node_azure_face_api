
const request = require('request');
const express=require('express')
const bodyParser=require('body-parser')
const path = require('path')
const ejs=require('ejs')


var app = express();

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '<Subscription Key>';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
// const uriBase =
//     'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze';

// const imageUrl =
//     'http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';


// const params = {
//     'visualFeatures': 'Categories,Description,Color',
//     'details': '',
//     'language': 'en'
// };

//body: '{"url": ' + '"' + imageUrl + '"}',

// const options = {
//     uri: uriBase,
//     qs: params,
    
    
//     body: var st=`url:'${imageUrl}'`
//     headers: {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key' : subscriptionKey
//     }
// };

// request.post(options, (error, response, body) => {
//   if (error) {
//     console.log('Error: ', error);
//     return;
//   }
//   let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
//   console.log('JSON Response\n');
//   console.log(jsonResponse);
// });


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.set('view engine', 'ejs') 
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    res.render('homePage')
})


app.get('/uploaded',(req,res)=>{

    res.render('uploaded')

})



app.listen(process.env.PORT||3000)