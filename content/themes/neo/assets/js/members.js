
var PersonView = Backbone.View.extend({
	el: '#modal',

	template: _.template(
		'\
			<div class="modal-dialog modal-lg">\
				<div class="modal-content">\
				 	<div class="modal-header">\
				 	</div>\
				 	<div class="modal-body">\
				 		<div class="col-sm-6">\
					 		<img src="<%= person.image %>">\
				 		</div>\
				 		<div class="col-sm-6">\
				 		Hi\
				 		</div>\
				 	</div>\
				 	<div class="modal-footer">\
				 	</div>\
			 	</div>\
			</div>\
		'
	),

	events: {
		'click #closeButton': 'closeClick'
	},

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({person: this.model}));
		this.$el.modal();
	},

	closeClick: function() {
		this.$el.modal('hide');
	}
});

function initMembers() {
	$('.memberName').click(function(ev) {
		var person = $(ev.target).data('json');
		var personView = new PersonView({model: person});
	});
}