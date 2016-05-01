console.log('Simply Sift!');

$('.sync-github-btn').click(function(event) {
  // Show tab
  $('.tab-content .tab-pane').removeClass('active in');
  $('.tab-content .tab-pane#syncing').addClass('active in');

  // Fetch
  fetch('/api/user/glavin001', { method: 'post' })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(error) {
    console.log(error);
  });
});
