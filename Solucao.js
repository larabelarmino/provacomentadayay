var fs   = require('fs')
var file = process.argv[2]
var extensao = file.split('.')[file.split('.').length-1]
var numeros = [];

function json()
{
  fs.readFile(__dirname + "/" + file, 'utf8', function(err, data)  {
    numeros = JSON.parse(data);
    numeros = numeros.valores;
    Processar();
  });
}
function csv()
{
	var csv = require('csv-string');
	var resul;

	fs.readFile(__dirname + "/" + file, 'utf8', function(err, data)  {
    resul = csv.parse(data);
    numeros  = resul[0];
    Processar();
	});
	
}
function xml()
{
	var xmlParser = require('xml2js').parseString;

    fs.readFile(__dirname + "/" + file, function(err, data) {
        xmlParser(data, function(err, result)
        	{
        		numeros = result.numeros.split(',');
            Processar();
        	});
    });
    
}
if(extensao == 'json')
	json();
if(extensao == 'csv')
	csv();
if(extensao == 'xml')
	xml();


function Processar()
{
  numeros = numeros.sort(function(a, b){return a-b});
  console.log(numeros.length)
var inicio = numeros[0];

var fim = [];
var resultado = "";
for(var i = 0; i < numeros.length;  i++)
{
	if(numeros[i + 1] - numeros[i] != 1)
	{
       		fim = numeros[i];
       		if(fim == inicio)
       		{
       			resultado += "[" + inicio + "]";
       		}
       		else {
       			resultado += "[" + inicio + "-" + fim + "]";	
       		}
       		inicio = numeros[i+1];
	}
}
fs.writeFile('resultado.json', JSON.stringify(resultado), function (err) {
	if (err) return console.log(err);
	console.log('Concluido');
});
}