var express = require('express');
var router = express.Router();
var acordao = require('../controllers/acordao');
var autenticacao = require('../verifyAcess/acess');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/', function(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  acordao.list(page, limit)
    .then(result => res.jsonp({ acordaos: result.data, totalPages: result.totalPages }))
    .catch(error => res.jsonp(error));
});

router.get('/lista', function(req, res) {
  lista = req.body.lista;
  acordao.getAcordaosByIds(lista)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.get('/descritores', function(req, res) {
  acordao.getAllDescritores()
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.get('/tribunal/:id', function(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  acordao.listByTribunal(req.params.id, page, limit)
    .then(result => res.jsonp({ acordaos: result.data, totalPages: result.totalPages }))
    .catch(error => res.jsonp(error));
});



router.post('/', autenticacao.verificaAdmin,function(req, res) {
  acordao.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});


router.post('/file', autenticacao.verificaAdmin, upload.single('file'), function(req, res) {
  let dateParts = req.body.data_acordao.split('/');
  let formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`).toISOString();
  req.body.data_acordao = formattedDate;
  acordao.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});


router.put('/:id', autenticacao.verificaAdmin, function(req, res) {
  acordao.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.delete('/:id', autenticacao.verificaAdmin,function(req, res) {
  acordao.delete(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.get('/search', function(req, res) {
  let sort = req.query.sort || '';
  let descritor = req.query.descritor;
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let tribunal = '';
  if (req.query.tribunal) {
    tribunal = req.query.tribunal;
  }

  acordao.searchByDescritor(descritor, tribunal, sort, page, limit)
    .then(result => res.jsonp({ acordaos: result.data, totalPages: result.totalPages }))
    .catch(error => res.jsonp(error));
});

router.get('/:id', function(req, res) {
  acordao.lookUp(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

module.exports = router;
