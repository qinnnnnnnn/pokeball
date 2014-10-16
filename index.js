#!/usr/bin/env node
var pathUtil = require('path');
var fs = require('fs-extra');
var inquirer = require('inquirer');
var facade = require('commander');

var pkg = require('./package.json');

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
  .action(handlerKill)
facade
  .command('catch')
  .description('run setup commands for all envs')
  .option("-n, --name [type]", "set nickname of the pokemon")
  .option("-p, --path [path]", "set path of source folder")
  .action(
  function(options){
    if (options.path) {
      var path = options.path || process.cwd();
      catchPoke('', options.name, path);
    }else{
      handlerCatch(options.name);
    };
  });


facade
 .version(pkg.version)
 .usage('catch')
 .option('-f, --force', 'processing in force [TODO]')
 .option('-r, --rename', 'rename the pokemon [TODO]')
 .option('-m, --merge', 'merge two pokemon [TODO]')
 .parse(process.argv);

if (!facade.args.length) facade.help();

function showList(type, cb, nickname) {

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
    }
  ], function( answers ) {
      cb && cb( answers.pokemon,nickname )
    }); 
}

function temp() {
  console.log('still in building');
}

//如果不是文件夹 抛出异常
function catchPoke(name, nickname, path) {

  var wild = (path && path!= process.cwd()) ? 
      pathUtil.normalize(path) : 
      pathUtil.join(process.cwd(), name);
  var nick = nickname ? 
      pathUtil.join(__dirname, 'pokemon', nickname) : 
      pathUtil.join(__dirname, 'pokemon', name ? name : pathUtil.basename(path));
  var nickExits = fs.existsSync(nick),
      wildExits = fs.existsSync(wild);

  if (wildExits) {
    if (!nickExits) {
      fs.copy(wild, nick, function(err) {
        if (err) {
          console.log('error when copy', err)
        }
        console.log('OKK')
      })
    } else {
      console.log('already exits');
    }
  }else{
      console.log(wild + ' hasn\'t exit');
  };
  
}

function handlerRelease() {
  showList( 'release', releasePoke )
  
}

function handlerCatch(nickname, path) {
  showList( 'catch', catchPoke, nickname )
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

function handlerKill() {
  showList( 'kill', killPoke )
}

function killPoke(name) {
  var poke = pathUtil.join(__dirname, 'pokemon/' + name);
  var exits = fs.existsSync(poke);

  if (exits) {
    fs.remove(poke, function(err){
      if (err) return console.error(err);

      console.log("success!")
    });
  } else {
    console.log('no ' + name);
  }
}