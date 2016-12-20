var path = require('path');
var webpack = require('webpack');
var express = require('express');
var static  = require('express-static');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors')
var config = require('./webpack.config');
var app = express();
var compiler = webpack(config);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
// 		res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
// 		res.write('{\"configurationId\": \"' + elev8req.dataValues.configurationId + '\"}');
// 		res.end();
// 	});
// });

var Users = sequelize.define('users', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  githubHandle: {
    type: Sequelize.STRING,
    field: 'gihub_handle'
  }
}, {
  freezeTableName: true
});

var Elev8Request = sequelize.define('elev8requests', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  message: {
    type: Sequelize.STRING,
    field: 'message'
  }
}, {
  freezeTableName: true
});

var NightShifts = sequelize.define('nightshifts', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  token: {
    type: Sequelize.STRING,
    field: 'token'
  }
}, {
  freezeTableName: true
});

app.get('/hey-franz/lift-please', function(req, res) {
  //USE { force: true } AFTER DROPING TABLES AND/OR CREATING
	//Elev8Request.sync({force: true}).then(function() {
  Elev8Request.sync().then(function() {
	  Elev8Request.create({
	    userId: 1,
	    message: 'Be a good chap, and let me up.  - ' + Date(),
	  }).then(function(elev8request){
	  	res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.write('{\"id\": \"' + elev8request.dataValues.id + '\"}');
		res.end();
	  });
	});
});

app.get('/timely-requests', function(req, res) {
  Elev8Request.findAll({
    createdAt: {
      $lt: new Date(),
      $gt: new Date(new Date() - 24 * 60 * 60 * 1000)//last 2 hours of requests
    },
    limit: 3,
    order: 'createdAt DESC'
  }).then(function(elev8requests) {

    console.log("Gathering requests...");
    const todaysRequests = [];
    Object.keys(elev8requests).forEach(function(req, i){
      const data = elev8requests[req].dataValues;
      console.log(data);
      const request = {
        userId: data.id,
        message: data.message,
      };
      todaysRequests.push(request);
    });
    res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.write(JSON.stringify(todaysRequests));
    res.end();
  });
});


app.get('/user', function(req, res) {
  Users.sync().then(function() {
    Users.create({
      userId: 1,
      githubHandle: 'shermancode',
    }).then(function(user){
      res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.write('{id: \"' + user.dataValues.id + '\"}');
    res.end();
    });
  });
});

app.get('/nightshifts/engage', function(req, res) {
  NightShifts.sync({ force: true }).then(function() {
    res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.write('{\"night-shift-status\": \"engaged\"}');
    res.end();
  });
});

app.get('/nightshift/status', (req, res) => {
  res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
  res.write('{\"nightowl\": \"' + req.cookies['nightowl'] + '\"}');
  res.end();
});

app.post("/nightshift/clock-in", (req, res) => {
  //first see if user has clocked in
  if (!req.cookies['nightowl'] || req.cookies['nightowl'] === "undefined") {
    Users.findOne({ where: { githubHandle: req.body.githubHandle } }).then(function(user) {
      if (user) {
        let token = user.dataValues.githubHandle + '-' + Date();
        NightShifts.create({
          userId: user.dataValues.id,
          token: token,
        });
        res.writeHead(200, {
          'Set-Cookie': 'nightowl='+user.dataValues.githubHandle,
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end('{\"nightowl\": \"shermancode\"}');
      } else {
        res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.write('{\"heading\": \"A funny thing...\", \"error\": \"We couldn\'t find that handle. Try again.\"}');
        res.end();
      }
    });
  }
});

app.all("/nightshift/clock-out", (req, res) => {
  // res.writeHeader(200, {'Content-Type': 'application/json; charset=utf-8'});
  // res.write('{\"nightowl\": \"undefined\"}');
  // res.end();

  res.writeHead(200, {
    'Set-Cookie': 'nightowl=undefined; expires=' + new Date(),
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end('{\"nightowl\": \"undefined\"}');
});

app.get('/lobby', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/lobby.html'));
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