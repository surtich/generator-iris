'use strict';
var path = require('path');
var fs = require('fs');

module.exports = {
	readObject: readObject,
	updateObject: updateObject
};

function readObject(filePath, objectName) {
  var file = fs.readFileSync(filePath, 'utf8');

  var regExp = new RegExp(escapeRegExp(objectName) + " *= *({([^;]|\n)*})[^;]*;");

  var result = regExp.exec(file);

  if (result) {
  	return {
  		object: JSON.parse(result[1]),
  		updater: function(objectValue, writer, caller) {
  			var start = file.substring(0, result.index);
    		var end = file.substring(result.index + result[0].length);

    		file = start + objectName + " = " + JSON.stringify(objectValue || this.object, null, "\t") + ";" + end;
    		if (writer && caller) {
    			writer.call(caller, filePath, file);
    		} else {
    			fs.writeFileSync(filePath, file);	
    		}
    	}
  	}
  } else {
  	return {
  		object: null,
  		updater: function() {
  			console.log("Error: No Object found")
  		}
  	}
  }
}

function updateObject(filePath, objectName, objectValue) {
	var file = fs.readFileSync(filePath, 'utf8');

}

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}