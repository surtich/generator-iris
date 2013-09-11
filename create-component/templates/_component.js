iris.<%=component%>(function(self) {
	<% if (component === 'ui' || component === 'screen' ) { %>
		self.create = function() {
			self.tmpl(iris.path.ui.<%=name%>.html);
		};

		self.awake = function(){
		};
	<% } else { %>
		self.sampleCall = function(param, data, f_ok, f_error){
			return self.post('/sample/' + param, data, f_ok, f_error);
		};
	<% } %>
}, iris.path.<%=component%>.<%=name%>.js);