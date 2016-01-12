var uploadView = require("../views/uploadview.js");
var contentLoader = require("../contentloader.js");
var modals = require("../modals.js");

function start() {
	uploadView.render().then(function() {
		bindEvents();
	});
}

function bindEvents() {
	var form = document.getElementById("upload");
	var dropbox = document.getElementById("dropbox");
	var iframe = document.getElementById("upload-iframe");
	var dropboxSpan = dropbox.getElementsByTagName("span")[0];
	var originalDropboxText = dropboxSpan.innerHTML;

	var formOpts = {descriptionEntered: false};

	form.target = "upload-iframe";

	form.addEventListener("change", 
		handleFormChange.bind(
			undefined, form, formOpts, dropboxSpan), true);

	form.addEventListener("focus", 
		handleFormFocus.bind(
			undefined, form, formOpts), true);

	form.addEventListener("submit", 
		handleSubmit.bind(undefined, form), true);

	iframe.addEventListener("load", 
		handleIFrameLoad.bind(
			undefined, form, dropboxSpan, originalDropboxText), true);
}

function handleFormChange(form, formOpts, dropboxSpan, evt) {
	var input = evt.target;

	if (input == form.description) {
		if (!input.value && formOpts.descriptionEntered) {
			input.value = "Description";
			formOpts.descriptionEntered = false;
		}
	}

	if (input == form.fileselect) {
		var files = input.files;

		// for IE
		if (!files) {
			files = [];            
			files.push({
				name: input.value.substring(input.value.lastIndexOf("\\") + 1),
				size: 0,
				type: input.value.substring(input.value.lastIndexOf(".") + 1)
			});

			input.files = files;
		}

		showFileInfo(dropboxSpan, files[0]);
	}
}

function handleFormFocus(form, formOpts, evt) {
	var input = evt.target;

	if (input == form.description) {
		if (!formOpts.descriptionEntered) {
			input.value = "";
			formOpts.descriptionEntered = true;
		}
	}
}


function showFileInfo(dropboxSpan, file) {
	var text = file.name;
	text += file.size ? " (" + (file.size / (1024 * 1024)).toFixed(2) + " MB)" : "";

	dropboxSpan.innerHTML = text;
}

function handleSubmit(form, evt) {
	if (!validate(form)) { 
		evt.preventDefault();
		return; 
	}
}

function handleIFrameLoad(form, dropboxSpan, originalDropboxText, formOpts, evt) {
	if (form.fileselect.files[0]) {
		modals.showInfo("File uploaded", 2000);
	}

	form.reset();
	formOpts.descriptionEntered = false;

	dropboxSpan.innerHTML = originalDropboxText;
}

function validate(form) {
	var file = form.fileselect.files[0];
	var errorContainer = form.getElementsByClassName("form-heading")[0];
	
	if (file.size > 5 * 1024 * 1024) {
		modals.showError("File size cannot be greater than 5 MB.");
		return;
	}
	
	if (!file.type.match(/(^image\/|jpg|jpeg|png|bmp|gif)/)) {
		modals.showError("Only image files are accepted.");
		return false;
	}
	
	return true;
}

module.exports = {start: start};