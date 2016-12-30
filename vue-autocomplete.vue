<style>
  .transition, .autocomplete, .showAll-transition, .autocomplete ul, .autocomplete ul li a{
    transition:all 0.3s ease-out;
    -moz-transition:all 0.3s ease-out;
    -webkit-transition:all 0.3s ease-out;
    -o-transition:all 0.3s ease-out;
  }

  .autocomplete ul{
    font-family: sans-serif;
    position: absolute;
    list-style: none;
    background: #f8f8f8;
    padding: 10px 0;
    margin: 0;
    display: inline-block;
    min-width: 15%;
    margin-top: 10px;
  }

  .autocomplete ul:before{
    content: "";
    display: block;
    position: absolute;
    height: 0;
    width: 0;
    border: 10px solid transparent;
    border-bottom: 10px solid #f8f8f8;
    left: 46%;
    top: -20px
  }

  .autocomplete ul li a{
    text-decoration: none;
    display: block;
    background: #f8f8f8;
    color: #2b2b2b;
    padding: 5px;
    padding-left: 10px;
  }

  .autocomplete ul li a:hover, .autocomplete ul li.focus-list a{
    color: white;
    background: #2F9AF7;
  }

  .autocomplete ul li a span{
    display: block;
    margin-top: 3px;
    color: grey;
    font-size: 13px;
  }

  .autocomplete ul li a:hover span, .autocomplete ul li.focus-list a span{
    color: white;
  }

  .showAll-transition{
    opacity: 1;
    height: 50px;
    overflow: hidden;
  }

  .showAll-enter{
    opacity: 0.3;
    height: 0;
  }

  .showAll-leave{
    display: none;
  }

</style>

<template>
  <input   type="text"
          :id="id"
          :class="class"
          :name="name"
          :placeholder="placeholder"
          v-model="type"
          @input="input(type)"
          @dblclick="showAll"
          @blur="hideAll"
          @keydown="keydown"
          @focus="focus"
          autocomplete="off"/>

  <div class="autocomplete transition autocomplete-{{ name }}" id="autocomplete-{{ name }}" v-show="showList">
    <ul>
      <li v-for="data in json"
          transition="showAll"
          :class="activeClass($index)">

        <a   href="#"
            @click.prevent="$emit('selectList',data)"
            @mousemove="mousemove($index)">
          <b>{{ data[anchor] }}</b>
          <span>{{ data[label] }}</span>
        </a>

      </li>
    </ul>
  </div>
</template>

<script>
  /*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
  * Licensed Under MIT (http://opensource.org/licenses/MIT)
  *
  * Version 0.0.1
  *
  */

  // Transition (Optional)
  import Vue from 'vue'

  // Transition (Optional)
  Vue.transition('showAll',{});

  export default {
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

      // minimum length
      min: {
        type: Number,
        default: 0
      },

      // add 'limit' query to AJAX URL will be fetched
      limit: {
        type: String,
        default: ''
      },
    },

    data() {
      return {
        showList: false,
        type: "",
        json: [],
        focusList: ""
      };
    },

    watch:{
      type(val,old){
        // Sync parent model with $data.type
        return this.$parent.$data[this.model] = val;
      }
    },

    methods: {

      // Netralize Autocomplete
      clearInput() {
        this.showList = false
        this.type = ""
        this.json = []
        this.focusList = ""
      },

      // Get the original data
      cleanUp(data){
        return JSON.parse(JSON.stringify(data));
      },

      input(val){
        this.showList = true;

        // Callback Event
        this.$dispatch('autocomplete:input',this.$get('name'),val);
        this.$dispatch(`autocomplete-${this.$get('name')}:input`,val);

        this.$emit('getData',val);
        return this.$parent.$data[this.model] = val;
      },

      showAll(){
        this.json = [];
        this.$emit('getData',"");

        // Callback Event
        this.$dispatch('autocomplete:show',this.$get('name'));
        this.$dispatch(`autocomplete-${this.$get('name')}:show`);

        this.showList = true;
      },

      hideAll(e){
        // Callback Event
        this.$dispatch('autocomplete:blur',this.$get('name'),e);
        this.$dispatch(`autocomplete-${this.$get('name')}:blur`,e);

        setTimeout(() => {

          // Callback Event
          this.$dispatch('autocomplete:hide',this.$get('name'));
          this.$dispatch(`autocomplete-${this.$get('name')}:hide`);

          this.showList = false;
        },250);
      },

      focus(e){
        this.focusList = 0;

        // Callback Event
        this.$dispatch('autocomplete:focus',this.$get('name'),e);
        this.$dispatch(`autocomplete-${this.$get('name')}:focus`,e);

      },

      mousemove(i){
        this.focusList = i;
      },

      keydown(e){
        let key = e.keyCode;

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
        let listLength = this.json.length - 1;
        this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;

      },

      activeClass(i){
        return {
          'focus-list' : i == this.focusList
        };
      }

    },

    events: {

      selectList(data){
        let clean = this.cleanUp(data);

        // Put the selected data to type (model)
        this.type = clean[this.anchor];

        this.showList = false;

        /**
        * Callback Event
        * Deep clone of the original object
        */
        this.$dispatch('autocomplete:selected',this.$get('name'),clean);
        this.$dispatch(`autocomplete-${this.$get('name')}:selected`,clean);
      },

      getData(val){
        let self = this;

        if (val.length < this.min) return;

        if(this.url != null){

          // Callback Event
          this.$dispatch('autocomplete:before-ajax',self.$get('name'),val);
          this.$dispatch(`autocomplete-${self.$get('name')}:before-ajax`,val);

          let ajax = new XMLHttpRequest();

          var limit;
          if(this.$get('limit') != ''){
            this.limit = parseFloat(this.limit);
            limit = this.limit != "" ? '&limit=' + this.limit : '';
          }else{
            limit = '';
          }

          ajax.open('GET', `${this.url}?${this.param}=${val}${limit}`, true);
          ajax.send();

          ajax.addEventListener('progress', function (data) {
            if(data.lengthComputable){

              // Callback Event
              self.$dispatch('autocomplete:ajax-progress',self.$get('name'),data);
              self.$dispatch(`autocomplete-${self.$get('name')}:ajax-progress`,data);
            }
          });

          ajax.addEventListener('loadend', function (data) {
            let json = JSON.parse(this.responseText);

            // Callback Event
            self.$dispatch('autocomplete:ajax-loaded',self.$get('name'),this,json);
            self.$dispatch(`autocomplete-${self.$get('name')}:ajax-loaded`,this,json);

            self.json = json;
          });

        }
      }

    },

    created(){
      // Sync parent model with $data.type
      this.type = this.$parent.$data[this.model];
    }

  }
</script>
