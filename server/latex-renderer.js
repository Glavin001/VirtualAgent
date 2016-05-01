'use strict';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let user = {
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "picture": "",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "website": "http://johndoe.com",
    "summary": "A summary of John Doe...",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "http://twitter.com/john"
    }]
  },
  "work": [{
    "company": "Company",
    "position": "President",
    "website": "http://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description...",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "website": "http://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description...",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "gpa": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "website": "http://publication.com",
    "summary": "Description..."
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "Javascript"
    ]
  }],
  "languages": [{
    "name": "English",
    "level": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference..."
  }]
};
let job = {
  'title': 'Front End Web Developer',
  'source': 'GitHub Careers',
  'company': {
    'name': 'GitHub'
  }
};
let context = {
  user,
  job
};

const renderTemplate = (templatePath, context) => {
  return new Promise((resolve, reject) => {
      let filePath = path.resolve(__dirname, '../template/', templatePath)
        // Check for '*' suffix
      if (_.endsWith(filePath, '*')) {
        let dirPath = filePath.slice(0, -1);
        fs.readdir(dirPath, (err, files) => {
          if (err) {
            return reject(err);
          }
          // Pick random from list
          var file = files[Math.floor(Math.random() * files.length)];
          return resolve(path.resolve(dirPath, file));
        })
      } else {
        return resolve(filePath);
      }
    })
    .then((filePath) => {

      return new Promise((resolve, reject) => {
        fs.readFile(filePath, {
          encoding: 'utf8'
        }, (error, source) => {
          if (error) {
            return reject(error);
          }
          try {
            let template = Handlebars.compile(String(source));
            let results = template(context);
            return resolve(results);
          } catch (e) {
            return reject(e);
          }
        });
      });

    });

};

const renderCoverLetter = (context) => {
  return Promise.all([
      // Render 1 - Intro
      renderTemplate('cover-letter/1-intro/*', context),
      // renderTemplate('cover-letter/1-intro/1.tex', context),
      // Render 2 - Company Fit
      renderTemplate('cover-letter/2-company_fit/*', context),
      // renderTemplate('cover-letter/2-company_fit/1.tex', context),
      // Render 3 - Skills & Projects
      renderTemplate('cover-letter/3-skills_projects/*', context),
      // renderTemplate('cover-letter/3-skills_projects/1.tex', context),
      // Render 4 - Work Fit
      renderTemplate('cover-letter/4-work_fit/*', context),
      // renderTemplate('cover-letter/4-work_fit/1.tex', context),
      // Render 5 - Volunteer
      renderTemplate('cover-letter/5-volunteer/*', context),
      // renderTemplate('cover-letter/5-volunteer/1.tex', context),
      // Render 6 - Thanks
      renderTemplate('cover-letter/6-thanks/*', context),
      // renderTemplate('cover-letter/6-thanks/1.tex', context),
    ])
    .then(([intro, company, skills, work, volunteer, thanks]) => {
      // Render 7 - Complete Cover Letter
      return renderTemplate('cover-letter/template.tex', {
        user,
        job,
        paragraphs: {
          intro,
          company,
          skills,
          work,
          volunteer,
          thanks
        }
      });
    })
    .then((coverLetter) => {
      console.log(coverLetter);
    })
    .catch((error) => {
      console.log('Error: ', error);
    });

};

renderCoverLetter(context);