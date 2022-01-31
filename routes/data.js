var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {                    
  fs.readFile('.\\data\\data.json', (err, data) => {          //reads the data.json file for the data, and returns a message in console
    if(err){
      console.log(err);
      res.send();
      return;
    }else{
      console.log(data);
      res.send(data)
    }
  })
});

module.exports = router;
