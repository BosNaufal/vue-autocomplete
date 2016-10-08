global.Vue = require('vue');

new Vue({
	el: 'body',

	data(){
		return {
			vModelLike: "",
			data: {}
		};
	},

	components: {
		autocomplete: require('./vue-autocomplete.vue')
	},

  methods: {
    clearAutocomplete() {
      this.$refs.myAutocomplete.clearInput()
    }
  },

	events: {

		/**
		*	Global Autocomplete Callback Event
		*
		*	@event-name autocomplete:{event-name}
		*	@param {String} name name of auto
		*	@param {Object} data
		*	@param {Object} json - ajax-loaded only
		*/

		// Autocomplete on before ajax progress
		'autocomplete:before-ajax': function (name,data){
			console.log('before-ajax',name,data);
		},

		// Autocomplete on ajax progress
		'autocomplete:ajax-progress': function(name,data){
			console.log('ajax-progress',data);
		},

		// Autocomplete on ajax loaded
		'autocomplete:ajax-loaded': function(name,data,json){
			console.log('ajax-loaded',data,json);
		},

		// Autocomplete on focus
		'autocomplete:focus': function(name,evt){
			console.log('focus',name,evt);
		},

		// Autocomplete on input
		'autocomplete:input': function(name,data){
			console.log('input',data);
		},

		// Autocomplete on blur
		'autocomplete:blur': function(name,evt){
			console.log('blur',evt);
		},

		// Autocomplete on show
		'autocomplete:show': function(name){
			console.log('show',name);
		},

		// Autocomplete on selected
		'autocomplete:selected': function(name,data){
			console.log('selected',data);
			this.data = data;
		},

		// Autocomplete on hide
		'autocomplete:hide': function(name){
			console.log('hide',name);
		},


		/**
		*	Spesific Autocomplete Callback Event By Name
		*
		*	@event-name autocomplete-{component-name}:{event-name}
		*	@param {String} name name of auto
		*	@param {Object} data
		*	@param {Object} json - ajax-loaded only
		*/

		// Autocomplete on before ajax progress
		'autocomplete-people:before-ajax': function(data){
			console.log('before-ajax-people',data);
		},

		// Autocomplete on ajax progress
		'autocomplete-people:ajax-progress': function(data){
			console.log('ajax-progress-people',data);
		},

		// Autocomplete on ajax loaded
		'autocomplete-people:ajax-loaded': function(data,json){
			console.log('ajax-loaded-people',data,json);
		},

		// Autocomplete-people on focus
		'autocomplete-people:focus': function(evt){
			console.log('focus-people',evt);
		},

		// Autocomplete-people on input
		'autocomplete-people:input': function(data){
			console.log('input-people',data);
		},

		// Autocomplete-people on blur
		'autocomplete-people:blur': function(evt){
			console.log('blur-people',evt);
		},

		// Autocomplete-people on show
		'autocomplete-people:show': function(){
			console.log('show-people');
		},

		// Autocomplete-people on selected
		'autocomplete-people:selected': function(data){
			console.log('selected-people',data);
		},

		// Autocomplete-people on hide
		'autocomplete-people:hide': function(){
			console.log('hide-people');
		},

	}
});
