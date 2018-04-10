var express = require('express');
var router = express.Router();
var User = require('../models/user');

//GET Route for reading data

router.get('/', function(req, res, next)
{
return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});

//POST route for updating data
router.post('/', function(req, res, next){
//Check if same password has been typed 2x
if(req.body.passowrd !== req.body.passowrdConf)
{
    var err = new Error('Passwords do not match');
    err.status = 400;
    res.send("passwords do not match");
    return next(err);
}


if(req.body.email && req.body.username && req.body.passowrd && req.body.passowrdConf)
{
    var userData = {
        email:req.body.email,
        username: req.body.username,
        password: req.body.passowrd,
        passowrdConf: req.body.passowrdConf,
    }


    User.create(userData, function(error,user){

if(err){
    return next(err)} 
    else
    {return res.send('Logged In'); //res.redirect('/profile');
}
    });
}
else if (req.body.logemail && req.body.logpassword){

User.authenticate(req.body.logemail, req.body.logpassword,function(error,user){
    if (error|| !user){
        var err = new Error('wrong email or password');
        err.status = 401;
        return next(err);
    }else {
        req.session.userId = user._id;
        return res.redirect('/profile');
    }
});
} else{
    var err = new Error('All fields needed');
    err.status = 400;
    return next(err);
}


})

//Get route after registering
router.get('/profile', function(req, res,next){
User.findById(req.session.userId).exec(function(error,user){
    if(error){
        return next(error);
    }else{
        if(user === null){
            var err = new Error('not authorized');
            err.status = 400;
            return next(err);
        }else{
            return res.send('<h1>Name:</h1>' + user.username +'<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
    }
});
});


//GET FOO logout 
router.get('/logout', function(req,res,next){
    if(req.session){
        //delete session object
        req.session.destroy(function (err){
            if(err){
                return next(err);
            }
            else{
                return res.redirect('/');
            }
        });
    }
});



module.exports = router;