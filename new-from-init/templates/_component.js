iris.<%=component%>(function(self) {
	<% if (component === 'ui' || component === 'screen' ) { %>
		self.create = function() {
			/*Check is this is correct
			*	self.tmpl(<%=hash.replace(/\.[^.]+$/, ".html")%>);
			*/
		};

		self.awake = function(){
		};
	<% } else { %>
		self.sampleCall = function(param, data, f_ok, f_error){
			return self.post('/sample/' + param, data, f_ok, f_error);
		};
	<% } %>
}, <%=hash%>);