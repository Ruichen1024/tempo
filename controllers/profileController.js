'use strict';
const User = require( '../models/User' );
const axios = require('axios');
var apikey = require('../config/apikey');
console.dir(apikey)


exports.update = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    console.dir(p)
    p.userName = req.body.userName
    p.profilePicURL = req.body.profilePicURL
    p.zipcode = req.body.zipcode
    p.wakeup = req.body.wakeup

    // make a call to zicode server to look up the city and state
    // and store them in the profile ....
    axios.get("https://www.zipcodeapi.com/rest/"+apikey.apikey.zipcode+"/info.json/"+p.zipcode+"/degrees")
      .then(function (response) {
        // handle success
        console.log(response);
        console.dir(response);
        p.city = response.data.city
        p.state = response.data.state
        p.lastUpdate = new Date()
        p.save()
        .then(() => {
          res.redirect( '/profile' );
        })

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  })
};

exports.getAllProfiles = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  User.find()
    .exec()
    .then( ( profiles ) => {
      res.render( 'profiles', {
        profiles:profiles, title:"Profiles"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

// this displays all of the skills
exports.getOneProfile = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  User.findOne({_id:id})
    .exec()
    .then( ( profile ) => {
      res.render( 'showProfile', {
        profile:profile, title:"Profile"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
