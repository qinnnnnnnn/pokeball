var pathUtil = require('path');

var fs = require('fs-extra');
// var pokemonList = fs.readdirSync('pokemon');

//如果不是文件夹 抛出异常
function catchPoke (name, path) {

	var wild = pathUtil.join(process.cwd(), name);
	var nick = pathUtil.join(__dirname, 'pokemon', name);


	var exits = fs.existsSync(nick);

	if (! exits) {
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

function releasePoke (name, path) {
	var poke = pathUtil.join(__dirname, 'pokemon/' + name);

	console.log(poke)

	var exits = fs.existsSync(storePath);

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

catchPoke('t')

