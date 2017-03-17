var http = {
	post: function(url, headers, params, success, error, complete){
		http.request("post", url, headers, params, success, error, complete);
	},
	get: function(url, headers, params, success, error, complete){
		url = url + "?";
		$.each(params, function(index, value) {
			url = url + index + "=" + value + "&";
		});
		url = url.substring(0, url.length - 1);
		http.request("get", url, headers, params, success, error, complete);
	},
	request: function(method, url, headers, params, success, error, complete){
		$.ajax({
			type: method,
			url: url,
			async: true,
			data: JSON.stringify(params),
			headers: headers,
			success: function(e, a, b){
				if(typeof success == 'function'){
					success(e, a, b);
				}
			},
			error: function(e, a, b){
				if(typeof error == 'function'){
					error(e, a, b);
				}
			},
			complete: function(e, a, b){
				if(typeof complete == 'function'){
					complete(e, a, b);
				}
			}
		});
	}
}

var util = {
	json: function(url, complete){
		$.getJSON(url, function(data){
			if(typeof complete == 'function'){
				complete(data);
			}
		});
	},
	api: function(host, port, params){
		var api = {};
		var url = "http://" + host + ":" + port;
		$.each(params, function(index, value) {
			api[index] = url + value;
		});
		return api;
	}
}
