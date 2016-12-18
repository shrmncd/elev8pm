var path = require('path');
var webpack = require('webpack');
var express = require('express');
var static  = require('express-static');
var cors = require('cors')
var config = require('./webpack.config');
var app = express();
var compiler = webpack(config);

app.use(cors());

/* Database ORM */
var Sequelize = require("sequelize");
var sequelize = new Sequelize('mysql://lobbyboy:m3ndlZ_b4k3ry@localhost:3306/elev8pm');

// /* Webpack */

// app.use(require('webpack-dev-middleware')(compiler, {
//   publicPath: config.output.publicPath
// }));

// app.use(require('webpack-hot-middleware')(compiler));

// /* Routes */

// app.get('/elev8reqs', function(req, res) {
// 	res.set('Content-Type', 'application/json');
// 	console.log("hitting /elev8reqs");
// 	Configuration.sync({force: true}).then(function () {
// 	  return Configuration.create({
// 	    userId: 1,
// 	    designId: 1,
// 	    countryId: 1,
// 	    name: 'Elevate Please!',
// 	    description: 'san bai ah!1',
// 	    createdDate: sequelize.fn('NOW'),
// 	    updatedDate: sequelize.fn('NOW')
// 	  });
// 	});
// 	res.end();
// });

// app.get('/elev8req/:id', function(req, res) {
// 	console.log("mac id: ", req.params.id);
// 	Machine.findOne({ where: {id: req.params.id} }).then(function(elev8req) {
// 		res.writeHeader(200, {'Content-Type': 'application/json; charset=UTF-8'});
// 		res.write('{\"configurationId\": \"' + elev8req.dataValues.configurationId + '\"}');
// 		res.end();
// 	});
// });

var Elev8Request = sequelize.define('elev8requests', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  message: {
    type: Sequelize.STRING,
    field: 'message'
  },
  requestTime: {
    type: Sequelize.DATE,
    field: 'request_time'
  },
  fulfillmentTime: {
    type: Sequelize.DATE,
    field: 'fulfillment_time'
  }
}, {
  freezeTableName: true
});

app.get('/hey-franz', function(req, res) {
  //USE { force: true } AFTER DROPING TABLES AND/OR CREATING
	//Elev8Request.sync({force: true}).then(function() {
  Elev8Request.sync().then(function() {
	  Elev8Request.create({
	    userId: 1,
	    message: 'Be a good chap, and let me up.',
	    requestTime: sequelize.fn('NOW'),
	    fulfillmentTime: sequelize.fn('NOW')
	  }).then(function(elev8request){
	  	res.writeHeader(200, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write('{id: \"' + elev8request.dataValues.id + '\"}');
		res.end();
	  });
	});
});

app.get('/timely-requests', function(req, res) {
  Elev8Request.findAll({
    createdAt: {
      $lt: new Date(),
      $gt: new Date(new Date() - 2 * 60 * 60 * 1000)//last 2 hours of requests
    }
  }).then(function(elev8requests) {
    console.log("Gathering requests...");
    const todaysRequests = [];
    Object.keys(elev8requests).forEach(function(req, i){
      const data = elev8requests[req].dataValues;
      const request = {
        userId: data.id,
        message: data.message,
        requestTime: data.requestTime,
        fulfillmentTime: data.fulfillmentTime,
      };
      todaysRequests.push(request);
    });
    res.writeHeader(200, {'Content-Type': 'application/json; charset=UTF-8'});
    res.write(JSON.stringify(todaysRequests));
    res.end();
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use(static(__dirname + '/public/'));

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})