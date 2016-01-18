(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Version 0.0.1
*
*/

// Transition (Optional)
Vue.transition('showAll',{});

var VueAutocomplete = Vue.extend ({
	template: '<input type="text" :id="id" :class="class" :name="name" :placeholder="placeholder" v-model="type" @input="input(type)" @dblclick="showAll" @blur="hideAll" @keydown="keydown" @focus="focus" /> <div class="autocomplete transition autocomplete-{{ name }}" id="autocomplete-{{ name }}" v-show="showList"> <ul> <li v-for="data in json" transition="showAll" :class="activeClass($index)"> <a href="#" @click.prevent="$emit(\'selectList\',data)" @mousemove="mousemove($index)"> <b>{{ data[anchor] }}</b> <span>{{ data[label] }}</span> </a> </li> </ul> </div>',

	props: {
		id: String,
		class: String,
		name: String,
		placeholder: String,

		model: String, // v-model like

		// Anchor of AJAX list
		anchor: {
			type: String,
			required: true
		},

		// Label of AJAX list
		label: {
			type: String,
			required: true
		},

		url: String, // ajax URL will be get

		// query param
		param: {
			type: String,
			default: 'q'
		},

		// add 'limit' query to AJAX URL will be fetched
		limit: {
			type: String,
			default: ''
		}

	},

	data: function () {
		return {
			showList: false,
			type: "",
			json: [],

			// Get the original data
			cleanUp: function (data) {
				return JSON.parse(JSON.stringify(data));
			},

			focusList: ""
		};
	},

	watch:{
		type: function (val,old){
			// Sync parent model with $data.type
			return this.$parent.$data[this.model] = val;
		}
	},

	methods: {

		input: function (val){
			this.showList = true;

			// Callback Event
			this.$dispatch('autocomplete:input',this.$get('name'),val);
			this.$dispatch('autocomplete-'+this.$get('name')+':input',val);

			this.$emit('getData',val);
			return this.$parent.$data[this.model] = val;
		},

		showAll: function () {
			this.json = [];
			this.$emit('getData',"");

			// Callback Event
			this.$dispatch('autocomplete:show',this.$get('name'));
			this.$dispatch('autocomplete-'+this.$get('name')+':show');

			this.showList = true;
		},

		hideAll: function (e) {
			var self = this;

			// Callback Event
			this.$dispatch('autocomplete:blur',this.$get('name'),e);
			this.$dispatch('autocomplete-'+this.$get('name')+':blur',e);

			setTimeout(function () {
				self.showList = false;

				// Callback Event
				self.$dispatch('autocomplete:hide',self.$get('name'));
				self.$dispatch('autocomplete-'+self.$get('name')+':hide');

			},250);
		},

		focus: function (e) {
			this.focusList = 0;

			// Callback Event
			this.$dispatch('autocomplete:focus',this.$get('name'),e);
			this.$dispatch('autocomplete-'+this.$get('name')+':focus',e);

		},

		mousemove: function (i) {
			this.focusList = i;
		},

		keydown: function (e) {
			var key = e.keyCode;

			// Disable when list isn't showing up
			if(!this.showList) return;

			switch (key) {
				case 40: //down
					this.focusList++;
				break;
				case 38: //up
					this.focusList--;
				break;
				case 13: //enter
					this.$emit('selectList', this.json[this.focusList]);
					this.showList = false;
				break;
			}

			// When cursor out of range
			var listLength = this.json.length - 1;
			this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;

		},

		activeClass: function (i) {
			return {
				'focus-list' : i == this.focusList
			};
		}

	},

	events: {

		selectList: function (data) {
			var clean = this.cleanUp(data);

			// Put the selected data to type (model)
			this.type = clean[this.anchor];

			this.showList = false;

			/**
			* Callback Event
			* Deep clone of the original object
			*/
			this.$dispatch('autocomplete:selected',this.$get('name'),clean);
			this.$dispatch('autocomplete-'+this.$get('name')+':selected',clean);
		},

		getData: function (val) {
			var self = this;

			if(this.url != null){

				// Callback Event
				this.$dispatch('autocomplete:before-ajax',self.$get('name'),val);
				this.$dispatch('autocomplete-'+self.$get('name')+':before-ajax',val);

				var ajax = new XMLHttpRequest();

				var limit;
				if(this.$get('limit') != ''){
					this.limit = parseFloat(this.limit);
					limit = this.limit != "" ? '&limit=' + this.limit : '';
				}else{
					limit = '';
				}

				ajax.open('GET', this.url+'?'+this.param+'='+val+limit, true);
				ajax.send();

				ajax.addEventListener('progress', function (data) {
					if(data.lengthComputable){

						// Callback Event
						self.$dispatch('autocomplete:ajax-progress',self.$get('name'),data);
						self.$dispatch('autocomplete-'+self.$get('name')+':ajax-progress',data);
					}
				});

				ajax.addEventListener('loadend', function (data) {
					var json = JSON.parse(this.responseText);

					// Callback Event
					self.$dispatch('autocomplete:ajax-loaded',self.$get('name'),this,json);
					self.$dispatch('autocomplete-'+self.$get('name')+':ajax-loaded',this,json);

					self.json = json;
				});

			}
		}

	},

	created: function () {
		// Sync parent model with $data.type
		this.type = this.$parent.$data[this.model];
	}

});

// Register
Vue.component('autocomplete',VueAutocomplete);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2dWVrdS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBDb3B5cmlnaHQgKGMpIDIwMTYgTmF1ZmFsIFJhYmJhbmkgKGh0dHA6Ly9naXRodWIuY29tL0Jvc05hdWZhbClcbiogTGljZW5zZWQgVW5kZXIgTUlUIChodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUKVxuKlxuKiBWZXJzaW9uIDAuMC4xXG4qXG4qL1xuXG4vLyBUcmFuc2l0aW9uIChPcHRpb25hbClcblZ1ZS50cmFuc2l0aW9uKCdzaG93QWxsJyx7fSk7XG5cbnZhciBWdWVBdXRvY29tcGxldGUgPSBWdWUuZXh0ZW5kICh7XG5cdHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgOmlkPVwiaWRcIiA6Y2xhc3M9XCJjbGFzc1wiIDpuYW1lPVwibmFtZVwiIDpwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyXCIgdi1tb2RlbD1cInR5cGVcIiBAaW5wdXQ9XCJpbnB1dCh0eXBlKVwiIEBkYmxjbGljaz1cInNob3dBbGxcIiBAYmx1cj1cImhpZGVBbGxcIiBAa2V5ZG93bj1cImtleWRvd25cIiBAZm9jdXM9XCJmb2N1c1wiIC8+IDxkaXYgY2xhc3M9XCJhdXRvY29tcGxldGUgdHJhbnNpdGlvbiBhdXRvY29tcGxldGUte3sgbmFtZSB9fVwiIGlkPVwiYXV0b2NvbXBsZXRlLXt7IG5hbWUgfX1cIiB2LXNob3c9XCJzaG93TGlzdFwiPiA8dWw+IDxsaSB2LWZvcj1cImRhdGEgaW4ganNvblwiIHRyYW5zaXRpb249XCJzaG93QWxsXCIgOmNsYXNzPVwiYWN0aXZlQ2xhc3MoJGluZGV4KVwiPiA8YSBocmVmPVwiI1wiIEBjbGljay5wcmV2ZW50PVwiJGVtaXQoXFwnc2VsZWN0TGlzdFxcJyxkYXRhKVwiIEBtb3VzZW1vdmU9XCJtb3VzZW1vdmUoJGluZGV4KVwiPiA8Yj57eyBkYXRhW2FuY2hvcl0gfX08L2I+IDxzcGFuPnt7IGRhdGFbbGFiZWxdIH19PC9zcGFuPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PicsXG5cblx0cHJvcHM6IHtcblx0XHRpZDogU3RyaW5nLFxuXHRcdGNsYXNzOiBTdHJpbmcsXG5cdFx0bmFtZTogU3RyaW5nLFxuXHRcdHBsYWNlaG9sZGVyOiBTdHJpbmcsXG5cblx0XHRtb2RlbDogU3RyaW5nLCAvLyB2LW1vZGVsIGxpa2VcblxuXHRcdC8vIEFuY2hvciBvZiBBSkFYIGxpc3Rcblx0XHRhbmNob3I6IHtcblx0XHRcdHR5cGU6IFN0cmluZyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fSxcblxuXHRcdC8vIExhYmVsIG9mIEFKQVggbGlzdFxuXHRcdGxhYmVsOiB7XG5cdFx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdH0sXG5cblx0XHR1cmw6IFN0cmluZywgLy8gYWpheCBVUkwgd2lsbCBiZSBnZXRcblxuXHRcdC8vIHF1ZXJ5IHBhcmFtXG5cdFx0cGFyYW06IHtcblx0XHRcdHR5cGU6IFN0cmluZyxcblx0XHRcdGRlZmF1bHQ6ICdxJ1xuXHRcdH0sXG5cblx0XHQvLyBhZGQgJ2xpbWl0JyBxdWVyeSB0byBBSkFYIFVSTCB3aWxsIGJlIGZldGNoZWRcblx0XHRsaW1pdDoge1xuXHRcdFx0dHlwZTogU3RyaW5nLFxuXHRcdFx0ZGVmYXVsdDogJydcblx0XHR9XG5cblx0fSxcblxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3dMaXN0OiBmYWxzZSxcblx0XHRcdHR5cGU6IFwiXCIsXG5cdFx0XHRqc29uOiBbXSxcblxuXHRcdFx0Ly8gR2V0IHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0XHRjbGVhblVwOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRmb2N1c0xpc3Q6IFwiXCJcblx0XHR9O1xuXHR9LFxuXG5cdHdhdGNoOntcblx0XHR0eXBlOiBmdW5jdGlvbiAodmFsLG9sZCl7XG5cdFx0XHQvLyBTeW5jIHBhcmVudCBtb2RlbCB3aXRoICRkYXRhLnR5cGVcblx0XHRcdHJldHVybiB0aGlzLiRwYXJlbnQuJGRhdGFbdGhpcy5tb2RlbF0gPSB2YWw7XG5cdFx0fVxuXHR9LFxuXG5cdG1ldGhvZHM6IHtcblxuXHRcdGlucHV0OiBmdW5jdGlvbiAodmFsKXtcblx0XHRcdHRoaXMuc2hvd0xpc3QgPSB0cnVlO1xuXG5cdFx0XHQvLyBDYWxsYmFjayBFdmVudFxuXHRcdFx0dGhpcy4kZGlzcGF0Y2goJ2F1dG9jb21wbGV0ZTppbnB1dCcsdGhpcy4kZ2V0KCduYW1lJyksdmFsKTtcblx0XHRcdHRoaXMuJGRpc3BhdGNoKCdhdXRvY29tcGxldGUtJyt0aGlzLiRnZXQoJ25hbWUnKSsnOmlucHV0Jyx2YWwpO1xuXG5cdFx0XHR0aGlzLiRlbWl0KCdnZXREYXRhJyx2YWwpO1xuXHRcdFx0cmV0dXJuIHRoaXMuJHBhcmVudC4kZGF0YVt0aGlzLm1vZGVsXSA9IHZhbDtcblx0XHR9LFxuXG5cdFx0c2hvd0FsbDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5qc29uID0gW107XG5cdFx0XHR0aGlzLiRlbWl0KCdnZXREYXRhJyxcIlwiKTtcblxuXHRcdFx0Ly8gQ2FsbGJhY2sgRXZlbnRcblx0XHRcdHRoaXMuJGRpc3BhdGNoKCdhdXRvY29tcGxldGU6c2hvdycsdGhpcy4kZ2V0KCduYW1lJykpO1xuXHRcdFx0dGhpcy4kZGlzcGF0Y2goJ2F1dG9jb21wbGV0ZS0nK3RoaXMuJGdldCgnbmFtZScpKyc6c2hvdycpO1xuXG5cdFx0XHR0aGlzLnNob3dMaXN0ID0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0aGlkZUFsbDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0Ly8gQ2FsbGJhY2sgRXZlbnRcblx0XHRcdHRoaXMuJGRpc3BhdGNoKCdhdXRvY29tcGxldGU6Ymx1cicsdGhpcy4kZ2V0KCduYW1lJyksZSk7XG5cdFx0XHR0aGlzLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlLScrdGhpcy4kZ2V0KCduYW1lJykrJzpibHVyJyxlKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYuc2hvd0xpc3QgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyBDYWxsYmFjayBFdmVudFxuXHRcdFx0XHRzZWxmLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlOmhpZGUnLHNlbGYuJGdldCgnbmFtZScpKTtcblx0XHRcdFx0c2VsZi4kZGlzcGF0Y2goJ2F1dG9jb21wbGV0ZS0nK3NlbGYuJGdldCgnbmFtZScpKyc6aGlkZScpO1xuXG5cdFx0XHR9LDI1MCk7XG5cdFx0fSxcblxuXHRcdGZvY3VzOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dGhpcy5mb2N1c0xpc3QgPSAwO1xuXG5cdFx0XHQvLyBDYWxsYmFjayBFdmVudFxuXHRcdFx0dGhpcy4kZGlzcGF0Y2goJ2F1dG9jb21wbGV0ZTpmb2N1cycsdGhpcy4kZ2V0KCduYW1lJyksZSk7XG5cdFx0XHR0aGlzLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlLScrdGhpcy4kZ2V0KCduYW1lJykrJzpmb2N1cycsZSk7XG5cblx0XHR9LFxuXG5cdFx0bW91c2Vtb3ZlOiBmdW5jdGlvbiAoaSkge1xuXHRcdFx0dGhpcy5mb2N1c0xpc3QgPSBpO1xuXHRcdH0sXG5cblx0XHRrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIGtleSA9IGUua2V5Q29kZTtcblxuXHRcdFx0Ly8gRGlzYWJsZSB3aGVuIGxpc3QgaXNuJ3Qgc2hvd2luZyB1cFxuXHRcdFx0aWYoIXRoaXMuc2hvd0xpc3QpIHJldHVybjtcblxuXHRcdFx0c3dpdGNoIChrZXkpIHtcblx0XHRcdFx0Y2FzZSA0MDogLy9kb3duXG5cdFx0XHRcdFx0dGhpcy5mb2N1c0xpc3QrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzg6IC8vdXBcblx0XHRcdFx0XHR0aGlzLmZvY3VzTGlzdC0tO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMzogLy9lbnRlclxuXHRcdFx0XHRcdHRoaXMuJGVtaXQoJ3NlbGVjdExpc3QnLCB0aGlzLmpzb25bdGhpcy5mb2N1c0xpc3RdKTtcblx0XHRcdFx0XHR0aGlzLnNob3dMaXN0ID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXaGVuIGN1cnNvciBvdXQgb2YgcmFuZ2Vcblx0XHRcdHZhciBsaXN0TGVuZ3RoID0gdGhpcy5qc29uLmxlbmd0aCAtIDE7XG5cdFx0XHR0aGlzLmZvY3VzTGlzdCA9IHRoaXMuZm9jdXNMaXN0ID4gbGlzdExlbmd0aCA/IDAgOiB0aGlzLmZvY3VzTGlzdCA8IDAgPyBsaXN0TGVuZ3RoIDogdGhpcy5mb2N1c0xpc3Q7XG5cblx0XHR9LFxuXG5cdFx0YWN0aXZlQ2xhc3M6IGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQnZm9jdXMtbGlzdCcgOiBpID09IHRoaXMuZm9jdXNMaXN0XG5cdFx0XHR9O1xuXHRcdH1cblxuXHR9LFxuXG5cdGV2ZW50czoge1xuXG5cdFx0c2VsZWN0TGlzdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjbGVhbiA9IHRoaXMuY2xlYW5VcChkYXRhKTtcblxuXHRcdFx0Ly8gUHV0IHRoZSBzZWxlY3RlZCBkYXRhIHRvIHR5cGUgKG1vZGVsKVxuXHRcdFx0dGhpcy50eXBlID0gY2xlYW5bdGhpcy5hbmNob3JdO1xuXG5cdFx0XHR0aGlzLnNob3dMaXN0ID0gZmFsc2U7XG5cblx0XHRcdC8qKlxuXHRcdFx0KiBDYWxsYmFjayBFdmVudFxuXHRcdFx0KiBEZWVwIGNsb25lIG9mIHRoZSBvcmlnaW5hbCBvYmplY3Rcblx0XHRcdCovXG5cdFx0XHR0aGlzLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlOnNlbGVjdGVkJyx0aGlzLiRnZXQoJ25hbWUnKSxjbGVhbik7XG5cdFx0XHR0aGlzLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlLScrdGhpcy4kZ2V0KCduYW1lJykrJzpzZWxlY3RlZCcsY2xlYW4pO1xuXHRcdH0sXG5cblx0XHRnZXREYXRhOiBmdW5jdGlvbiAodmFsKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmKHRoaXMudXJsICE9IG51bGwpe1xuXG5cdFx0XHRcdC8vIENhbGxiYWNrIEV2ZW50XG5cdFx0XHRcdHRoaXMuJGRpc3BhdGNoKCdhdXRvY29tcGxldGU6YmVmb3JlLWFqYXgnLHNlbGYuJGdldCgnbmFtZScpLHZhbCk7XG5cdFx0XHRcdHRoaXMuJGRpc3BhdGNoKCdhdXRvY29tcGxldGUtJytzZWxmLiRnZXQoJ25hbWUnKSsnOmJlZm9yZS1hamF4Jyx2YWwpO1xuXG5cdFx0XHRcdHZhciBhamF4ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cblx0XHRcdFx0dmFyIGxpbWl0O1xuXHRcdFx0XHRpZih0aGlzLiRnZXQoJ2xpbWl0JykgIT0gJycpe1xuXHRcdFx0XHRcdHRoaXMubGltaXQgPSBwYXJzZUZsb2F0KHRoaXMubGltaXQpO1xuXHRcdFx0XHRcdGxpbWl0ID0gdGhpcy5saW1pdCAhPSBcIlwiID8gJyZsaW1pdD0nICsgdGhpcy5saW1pdCA6ICcnO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRsaW1pdCA9ICcnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWpheC5vcGVuKCdHRVQnLCB0aGlzLnVybCsnPycrdGhpcy5wYXJhbSsnPScrdmFsK2xpbWl0LCB0cnVlKTtcblx0XHRcdFx0YWpheC5zZW5kKCk7XG5cblx0XHRcdFx0YWpheC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYoZGF0YS5sZW5ndGhDb21wdXRhYmxlKXtcblxuXHRcdFx0XHRcdFx0Ly8gQ2FsbGJhY2sgRXZlbnRcblx0XHRcdFx0XHRcdHNlbGYuJGRpc3BhdGNoKCdhdXRvY29tcGxldGU6YWpheC1wcm9ncmVzcycsc2VsZi4kZ2V0KCduYW1lJyksZGF0YSk7XG5cdFx0XHRcdFx0XHRzZWxmLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlLScrc2VsZi4kZ2V0KCduYW1lJykrJzphamF4LXByb2dyZXNzJyxkYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGFqYXguYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIGpzb24gPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcblxuXHRcdFx0XHRcdC8vIENhbGxiYWNrIEV2ZW50XG5cdFx0XHRcdFx0c2VsZi4kZGlzcGF0Y2goJ2F1dG9jb21wbGV0ZTphamF4LWxvYWRlZCcsc2VsZi4kZ2V0KCduYW1lJyksdGhpcyxqc29uKTtcblx0XHRcdFx0XHRzZWxmLiRkaXNwYXRjaCgnYXV0b2NvbXBsZXRlLScrc2VsZi4kZ2V0KCduYW1lJykrJzphamF4LWxvYWRlZCcsdGhpcyxqc29uKTtcblxuXHRcdFx0XHRcdHNlbGYuanNvbiA9IGpzb247XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0sXG5cblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdC8vIFN5bmMgcGFyZW50IG1vZGVsIHdpdGggJGRhdGEudHlwZVxuXHRcdHRoaXMudHlwZSA9IHRoaXMuJHBhcmVudC4kZGF0YVt0aGlzLm1vZGVsXTtcblx0fVxuXG59KTtcblxuLy8gUmVnaXN0ZXJcblZ1ZS5jb21wb25lbnQoJ2F1dG9jb21wbGV0ZScsVnVlQXV0b2NvbXBsZXRlKTtcbiJdfQ==
