'use strict';
// Dependencies
const express = require('express');
const GitHub = require('github');
const async = require('async');
const _ = require('lodash');

// Create server
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let github = new GitHub({
  version: '3.0.0'
});
github.authenticate({
  type: 'oauth',
  token: 'dd8fe677b60d5cbb6d0a53713821b60635caf0f5'
});
const githubPageSize = 100;

// Static: http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

// Socket.io API
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('check-github-username', function(username, fn) {
    github.user.getFrom({user: username}, fn);
  });

  socket.on('sync-github-user', function(username, fn) {

    socket.emit('status', {
      progress: 0,
      message: 'Syncing with GitHub'
    });

    // Get User
    github.user.getFrom({user: username}, (error, user) => {
      if (error) {
        return fn(error);
      }

      // Get all Repositories
      let pages = range(1, parseInt(user.public_repos/githubPageSize)+2, 1);
      async.map(pages, (page, cb) => {
        github.repos.getFromUser({
          user: username,
          page: page,
          per_page: githubPageSize
        }, cb);
      }, (error, repos) => {
        if (error) {
          return fn(error);
        }
        repos = _.flatten(repos);

        socket.emit('status', {
          progress: 0,
          message: 'Retrieved all repositories',
          user,
          repos
        });

        // Remove forks
        // _.remove(repos, {fork:true});
        // socket.emit('status', {
        //   progress: 0,
        //   message: 'Removed forked repositories'
        // });

        // Get languages for Repositories
        let completedCount = 0;
        async.map(repos, (repo, cb) => {
          github.repos.getLanguages({
            user: username,
            repo: repo.name,
            per_page: githubPageSize
          }, (error, langs) => {
            delete langs.meta;
            // console.log(repo.name, langs);
            repo.languages = langs;
            completedCount++;

            socket.volatile.emit('status', {
              progress: completedCount/repos.length,
              completed: completedCount,
              total: repos.length,
              message: `Processed repository '${repo.name}'`,
              user,
              repos
            });

            return cb(error, repo);
          });
        }, (error, repos) => {

          socket.emit('status', {
            progress: 1,
            message: 'Finished analyzing repositories',
            user,
            repos
          });

          return fn(error, {
            user,
            repos
          });
        });

      });

    });
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


// ===== Helpers =======

// http://davidarvelo.com/blog/array-number-range-sequences-in-javascript-es6/
// create a generator function returning an
// iterator to a specified range of numbers
function* range (begin, end, interval = 1) {
    for (let i = begin; i < end; i += interval) {
        yield i;
    }
}