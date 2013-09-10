iris.path = {
	screens : {
		welcome : { js:'screen/welcome.js', html:'screen/welcome.html'}
	},
	ui : {
	},
	resource : {
	}
};

iris.evts = {
};

$(document).ready(
	function () {
		iris.translations('en-US', './app/lang/en-us.js');

		iris.baseUri('/www/app/');

		iris.locale(
			'en-US', {
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				dateFormat: 'd M Y H:i:s',
				currency: {
					formatPos: 'n',
					formatNeg: '-n',
					decimal: '.',
					thousand: ',',
					precision: 2
				}
			}
			);

		iris.welcome(iris.path.screens.welcome.js);
	}
);