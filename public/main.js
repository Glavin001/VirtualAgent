$(document).ready(function() {

  console.log('Simply Sift!');

  const tabPanes = {
    github: $('.tab-pane#github')
  };

  function showTab(tabId) {
    $('.tab-content .tab-pane').removeClass('active in');
    $('.tab-content .tab-pane#' + tabId).addClass('active in');
  }

  // Update progress bar
  socket.on('status', function(status) {
    console.log('status', status);
    $('.status-message').text(status.message);
    $('.progress-bar').width(status.progress * 100 + '%');
  });

  $('.sync-github-btn').click(function(event) {
    // Show tab
    showTab('syncing');
    let username = $('#github-username').val().trim();

    socket.emit('sync-github-user', username, function(error, results) {
      console.log(error, results);
      var projects = results.repos;
      var langMap = projectsByLanguage(projects);
      console.log('langMap', langMap);
      var langScores = _.mapValues(langMap, function(v, k) {
        return _.sumBy(v, 'languages.' + k);
      });
      console.log('langScores', langScores);
    });

  });

  $('input#github-username').keyup(function(event) {
    tabPanes.github.removeClass('invalid-username valid-username').addClass('checking-username');
    let username = $(this).val().trim();
    // console.log(username);
    socket.emit('check-github-username', username, function(error, user) {
      console.log(error, user);
      if (error) {
        tabPanes.github.removeClass('checking-username valid-username').addClass('invalid-username');
      } else {
        $('.github-user-full-name').text(user.name);
        $('img.github-user-avatar').attr('src', user.avatar_url);
        $('a.github-user-url').attr('href', user.html_url);
        tabPanes.github.removeClass('checking-username invalid-username').addClass('valid-username');
      }
    });

  });

  function projectsByLanguage(projects) {
    var langMap = {};
    for (var project of projects) {
      var langs = Object.keys(project.languages);
      for (var lang of langs) {
        if (langMap.hasOwnProperty(lang)) {
          // Has Language already
          // Add project
          langMap[lang].push(project)
        } else {
          langMap[lang] = [project]
        }
      }
    }
    return langMap;
  }


});