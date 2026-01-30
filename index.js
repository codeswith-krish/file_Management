const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    res.render("index", {
      files: files,
      editStatus: req.query.edit
    });
  });
});

app.get('/files/:filename', (req, res) => {
  fs.readFile(`files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render('show', { filename: req.params.filename, filedata: filedata });
  })
})

app.get('/edit/:filename', (req, res) => {
  res.render('edit', { filename: req.params.filename });
})

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.text, (err) => {
    res.redirect('/');
    console.log("file created");
  });
  console.log(req.body);
});


app.post('/edit', (req, res) => {
  let newName = req.body.new;

  if (!newName.endsWith('.txt')) {
    newName += '.txt';
  }

  fs.rename(
    path.join(__dirname, 'files', req.body.previous),
    path.join(__dirname, 'files', newName),
    (err) => {
      if (err) {
        return res.redirect('/?edit=failed');
      }
      res.redirect('/?edit=success');
    }
  );

  console.log(req.body);
});


app.post('/delete', (req, res) => {
  fs.rm(
    path.join(__dirname, 'files', req.body.previous),
    (err) => {
      if (err) {
        return res.send("invalid operation");
      }
      res.redirect('/');
    }
  );
});


app.listen(port, (req, res) => {
  console.log("server is running ");
});