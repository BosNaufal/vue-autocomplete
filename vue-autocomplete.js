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
    label: String,

    // ajax URL will be get
    url: {
      type: String,
      required: true
    },

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

    // Netralize Autocomplete
    clearInput: function () {
      this.showList = false;
      this.type = "";
      this.json = [];
      this.focusList = "";
    },

    // Get the original data
    cleanUp: function (data) {
      return JSON.parse(JSON.stringify(data));
    },

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
        case 27: //esc
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
