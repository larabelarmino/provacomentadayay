var fs   = require('fs') // FS(FILESYSTEM) É UMA BIBLIOTECA JAVASCRIPT PARA GERENCIAMENTO DE ARQUIVOS. AO FAZERMOS QUALQUER OPERAÇÃO COM ARQUIVOS EXTERNOS, PRECISAMOS CRIAR UM OBJETO FS
var file = process.argv[2] // PROCESS.ARGV PEGA OS ARGUMENTOS INSERIDOS AO EXECUTAR O ARQUIVO. FUNCIONA COMO UM VETOR. AS POSIÇÕES SÃO [NODE, NOMEDOARQUIVO, ...]. PEGANDO A POSIÇÃO DE NUMERO 2, PEGAMOS A PRIMEIRA PALAVRA DEPOIS DO NOME DO ARQUIVO
var extensao = file.split('.')[file.split('.').length-1] //FILE(VARIVAVEL COM NOME DO ARQUIVO) SPLIT(FUNÇÃO PRA CORTAR STRINGS)
//->ARGUMENTO INSERIDO: VAI CORTAR A PARTIR DO PRIMEIRO '.', ATE O FIM. ->ESTAMOS PEGANDO A EXTENSÃO DO ARQUIVO
var numeros = []; //CRIANDO O VETOR QUE ARMAZENARÁ A RESPOSTA

function json() //FUNÇÃO PARA CASO A VARIAVEL EXTENSÃO SEJA "json"
{
//(EMBAIXO) OBJETO FS SENDO CHAMADO COM SEU MÉTODO READFILE(USADA PARA LER ARQUIVOS E PASSADA COM CERTOS PARAMETROS)
//O MÉTODO READFILE É CHAMADO: "readFile(nomearquivo, codificação(opcional), função(argumentos){codigo})
  fs.readFile(__dirname + "/" + file, 'utf8', function(err, data)  { //TA LENDO O ARQUIVO. O RESULTADO É A VARIAVEL "data"
    //JSON.parse(argumento) transforma o argumento passado em json
    numeros = JSON.parse(data); //DEFINE O VETOR COMO UM OBJETO CONVERTIDO DO VALOR OBTIDO DA LEITURA(a variavel "data" declarada na função)
    numeros = numeros.valores; //DEFINE O VETOR COMO O VETOR(ATRIBUTO) QUE ESTÁ DENTRO DO ARQUIVO(no caso, nomeado como "valores")
    Processar(); //CHAMA A FUNÇÃO PRINCIPAL
  });//VARIAVEL "data" deletada após o fim da função
}
function csv() //FUNÇÃO PARA CASO A VARIAVEL EXTENSÃO SEJA "csv"
{
	var csv = require('csv-string'); //csv-string É UMA BIBLIOTECA JAVASCRIPT(QUE PRECISA SER INSTALADA). É USADA PARA MANIPULAÇÃO DE ARQUIVOS CSV
	var resul; //VARIAVEL PARA ARMAZENAR O RESULTADO DA LEITURA

	fs.readFile(__dirname + "/" + file, 'utf8', function(err, data)  {
    resul = csv.parse(data); //DEFINE A VARIAVEL COM O RESULTADO DA LEITURA E CONVERTE PARA CSV
//****CSV TEM AS POSIÇÕES[0,1,2,...] DEFINIDAS PELAS LINHAS DO ARQUIVO. **no nosso código há apenas uma linha
    numeros  = resul[0]; //DEFINE O VETOR COMO A PRIMEIRA(e no nosso caso, a única) POSIÇÃO DA VARIÁVEL RESUL
    Processar();
	});
	
}
function xml() //FUNÇÃO PARA CASO A VARIAVEL EXTENSÃO SEJA "xml"
{
	var xmlParser = require('xml2js').parseString;//xml2js É UMA BIBLIOTECA JAVASCRIPT(QUE PRECISA SER INSTALADA). É USADA PARA MANIPULAÇÃO DE ARQUIVOS XML

    fs.readFile(__dirname + "/" + file, function(err, data) {
        xmlParser(data, function(err, result)//NÃO SEI O QUE É ISSO. PORÉM PELA LÓGICA, É UMA FUNÇÃO PRA ADAPTAR O RESULTADO
        	{
        		numeros = result.numeros.split(',');//DIVIDE O RESULTADO EM PARTES E ATRIBUI ISSO AO VETOR
            Processar();
        	});
    });
    
}
//CHECANDO A VARIAVEL EXTENSÃO
if(extensao == 'json')
	json();//CHAMA A FUNÇÃO CASO JSON
if(extensao == 'csv')
	csv();//CHAMA A FUNÇÃO CASO CSV
if(extensao == 'xml')
	xml();//CHAMA A FUNÇÃO CASO XML


function Processar() // FUNÇÃO QUE VAI PROCESSAR TODO O CÓDIGO. CHAMADA A PARTIR DE UMA DAS FUNÇÕES DE EXTENSÕES.
{
  numeros = numeros.sort(function(a, b){return a-b});//ORGANIZA OS NÚMEROS
var inicio = numeros[0];//DEFINE UMA VARIÁVEL PARA OS INICIOS DOS INTERVALOS E A ATRIBUI COMO A PRIMEIRA POSIÇÃO DO VETOR
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
