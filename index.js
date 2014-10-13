var pathUtil = require('path');
var fs = require('fs-extra');
var inquirer = require('inquirer');
var facade = require('commander');

var pkg = require('./package.json');
// var pokemonList = fs.readdirSync('pokemon');


// primary comamnd , support type pokemon directly . [TODO]
facade
  .command('catch')
  .description('catch a pokemon')
  .action(handlerCatch);
facade
  .command('release')
  .description('release a pokemon')
	.action(handlerRelease)
facade
	.command('list')
	.description('list current pokemon')
	.action(showList)
facade
	.command('kill')
	.description('kill a pokemon')
	.action(temp)

facade
 .version(pkg.version)
 .usage('catch')
 .option('-f, --force', 'processing in force [TODO]')
 .option('-r, --rename', 'rename the pokemon [TODO]')
 .option('-m, --merge', 'merge two pokemon [TODO]')
 .parse(process.argv);

function showList(type, cb) {


	var isDictionary = function(name) {
		return fs.lstatSync(name).isDirectory();
	}

	inquirer.prompt([
	  {
	    type: "list",
	    name: "pokemon",
	    message: "pick a pokemon",
	    choices: type == 'catch' ?
	    						fs.readdirSync(process.cwd()).filter(isDictionary) :
	    						fs.readdirSync(pathUtil.join(__dirname, 'pokemon'))
	    						//.concat([ new inquirer.Separator(), 'exit'])
	  }
	], function( answers ) {
			
			cb && cb( answers.pokemon )
	    //console.log( JSON.stringify(answers, null, "  ") );
	  });	
}

function temp() {
	console.log('still in building');
}

//如果不是文件夹 抛出异常
function catchPoke(name, path) {

	var wild = pathUtil.join(process.cwd(), name);
	var nick = pathUtil.join(__dirname, 'pokemon', name);

	var exits = fs.existsSync(nick);

	if (!exits) {
		fs.copy(wild, nick, function(err) {
			if (err) {
				console.log('error when copy', err)
			}
			console.log('OKK')
		})
	} else {
		console.log('already exits');
	}
}

function handlerRelease() {
	showList( 'release', releasePoke )
	
}

function handlerCatch() {
	showList( 'catch', catchPoke )
}

function releasePoke(name, path) {
	
	var poke = pathUtil.join(__dirname, 'pokemon/' + name);
	var exits = fs.existsSync(poke);

	if (exits) {
		fs.copy(poke, pathUtil.join(process.cwd(), name), function(err) {
			if (err) {
				console.log('error when copy')
			}
			console.log('OKK')
		})
	} else {
		console.log('not exits');
	}
}

function killPoke(name) {

}

function listPoke(name) {

}
