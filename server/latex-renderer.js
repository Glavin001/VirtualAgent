'use strict';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const exec = require('child_process').exec;

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
  'company_name': 'GitHub'
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
          let file = files[Math.floor(Math.random() * files.length)];
          filePath = path.resolve(dirPath, file);
          console.log(`Using ${filePath}`);
          return resolve(filePath);
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
    });

};


const generateCoverLetter = (username, context) => {
  let userDir = path.resolve(__dirname, '../build/', username);

  return new Promise((resolve, reject) => {
      // Make directory for Username
      mkdirp(userDir, {
        mode: '0777',
      }, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(userDir);
      });
    })
    .then(() => {
      // Generate Cover Letter
      console.log('Generating cover letter');
      return renderCoverLetter(context);
    })
    .then((coverLetter) => {
      console.log('Have cover letter!');
      return new Promise((resolve, reject) => {
        // Write cover letter to file
        let coverLetterPath = path.resolve(userDir, 'cover-letter.tex');
        fs.writeFile(coverLetterPath, coverLetter, (err) => {
          if (err) {
            return reject(err);
          }
          return resolve(coverLetterPath);
        });
      });
    })
    .then((coverLetterPath) => {
      // Cover LaTeX to PDF
      console.log('Generating PDF');
      return new Promise((resolve, reject) => {
        let args = ['-interaction=nonstopmode', `-output-directory="${path.dirname(coverLetterPath)}"`, `"${coverLetterPath}"`];
        let cwd = path.resolve(__dirname, '../template/');
        let cmd = `xelatex ${args.join(' ')}`;
        // console.log('args', args, cwd);
        console.log(cmd);
        exec(cmd, {
          cwd: cwd
        }, (error, stdout, stderr) => {
          console.log(error);
          console.log(stdout);
          console.log(stderr);
          if (error) {
            return reject(error);
          }
          return resolve();
        });
        // call(["xelatex", "-output-directory=" + os.path.abspath('build/' + username + '/'), "cover-letter.tex"], cwd = os.path.abspath('template/'))
        // call(["convert", "-density", "300", os.path.abspath('build/' + username + '/cover-letter.pdf'), "-quality", "100", os.path.abspath('build/' + username + '/cover-letter.png')])
      });

    });

};

generateCoverLetter('john-doe', context)
.then(() => {
  console.log('Done!');
})
.catch((error) => {
  console.log(error);
});