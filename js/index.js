Vue.component('add-modal', {
  template: '#addTodoModal',
  props: ['addTodo','newTodoText','newTodoDate','newTodoPriority','changeStars','fillStar','unfillStar'],
  methods: {
    addTodo() {
      var text = this.newTodoText;
      var date = this.newTodoDate;
      this.$parent.addTodo(text, date);
      this.$emit('close');
    },
    changeStars(id) {
      this.$parent.changeStars(id);
    },
    fillStar(id) {
      this.$parent.fillStar(id);
    },
    unfillStar(id) {
      this.$parent.unfillStar(id);
    }
  }
});

Vue.component('update-modal', {
  template: '#updateTodoModal',
  props: ['updateTodo','updateTodoObj','changeStars','fillStar','unfillStar'],
  methods: {
    updateTodo() {
      var text = this.internalUpdateTodoText;
      var date = this.internalUpdateTodoDate;
      var status = this.internalUpdateTodoStatus;
      this.$parent.updateTodo(text, date, status);
      this.$emit('close');
    },
    changeStars(id) {
      this.$parent.changeStars(id);
    },
    fillStar(id) {
      this.$parent.fillStar(id);
    },
    unfillStar(id) {
      this.$parent.unfillStar(id);
    }
  },
  data: function() {
    return {
      internalUpdateTodoText: '',
      internalUpdateTodoDate: '',
      internalUpdateTodoPriority: '',
      internalUpdateTodoStatus: ''
    }
  },
  watch: {
    'internalUpdateTodoText': function() {
      this.$emit("updateTodoObj['text']", this.internalUpdateTodoText);
    },
    'internalUpdateTodoDate': function() {
      this.$emit("updateTodoObj['date']", this.internalUpdateTodoDate);
    },
    'internalUpdateTodoPriority': function() {
      this.$emit("updateTodoObj['priority']", this.internalUpdateTodoPriority);
    },
    'internalUpdateTodoStatus': function() {
      this.$emit("updateTodoObj['status']", this.internalUpdateTodoStatus);
    }
  },
  created: function() {
    this.internalUpdateTodoText = this.$parent.updateTodoObj['text'];
    this.internalUpdateTodoDate = this.$parent.updateTodoObj['date'];
    this.internalUpdateTodoPriority = this.$parent.updateTodoObj['priority'];
    this.internalUpdateTodoStatus = this.$parent.updateTodoObj['status'];
  }
});

Vue.component('delete-modal', {
  template: '#deleteTodoModal',
  props: ['deleteTodo','deletedTodoObj'],
  computed: {
    deletedTodoObj: function() {
      return this.$parent.deletedTodoObj;
    }
  },
  methods: {
    deleteTodo() {
      this.$parent.deleteTodo();
      this.$emit('close');
    }
  }
});

var vue = new Vue({
  el: '#app',
  data: {
    showAddModal: false,
    showUpdateModal: false,
    showDeleteModal: false,

    newTodoText: '',
    newTodoDate: '',
    newTodoPriority: '',

    filter: 'all',
    sort: 'none',
    search: '',

    updateTodoObj: '',
    updateTodoPriority: '',

    deletedTodoObj: '',

    todoList: [
    { uuid: 5,
      text: '繳費',
      date: '2017-12-25',
      priority: 4,
      status: 'todo'
    },
    { uuid: 1,
      text: '寫作業',
      date: '2018-01-01',
      priority: 4,
      status: 'inprogress'
    },
    { uuid: 2,
      text: '聯絡同學',
      date: '2017-12-28',
      priority: 5,
      status: 'done'
    },
    { uuid: 3,
      text: '12345',
      date: '2018-01-15',
      priority: 2,
      status: 'done'
    },
    { uuid: 4,
      text: 'aaaaa',
      date: '2018-01-10',
      priority: 1,
      status: 'done'
    },
    { uuid: 6,
      text: 'VusJS practice',
      date: '2018-02-05',
      priority: 3,
      status: 'inprogress'
    }
    ]
  },
  computed: {
    todo_all: function() {
      return this.todoList.length;
    },
    todo_todo: function() {
      return this.todoList.filter(item => item.status == 'todo').length;
    },
    todo_inprogress: function() {
      return this.todoList.filter(item => item.status == 'inprogress').length;
    },
    todo_done: function() {
      return this.todoList.filter(item => item.status == 'done').length;
    },
    todoList_: function() {
      if (this.sort == 'none'){
        return this.todoList
        .sort((a, b) => a.uuid > b.uuid)
        .filter(item => item.text.indexOf(this.search) > -1);
      }
      else if (this.sort == 'date_first'){
        return this.todoList
        .sort((a, b) => a.date > b.date)
        .filter(item => item.text.indexOf(this.search) > -1);
      }
      else if (this.sort == 'date_last'){
        return this.todoList
        .sort((a, b) => a.date < b.date)
        .filter(item => item.text.indexOf(this.search) > -1);
      }
      else if (this.sort == 'priority_first'){
        return this.todoList
        .sort((a, b) => a.priority < b.priority)
        .filter(item => item.text.indexOf(this.search) > -1);
      }
      else if (this.sort == 'priority_last'){
        return this.todoList
        .sort((a, b) => a.priority > b.priority)
        .filter(item => item.text.indexOf(this.search) > -1);
      }
    }
  },
  methods: {
    addTodo: function(text, date) {
      var id = 100;
      this.todoList.push({
        uuid: id,
        text: text,
        priority: this.newTodoPriority,
        date: date,
        status: 'todo'
      });
      this.newTodoText = '';
      this.newTodoPriority = '';
      this.newTodoDate = '';
    },
    deleteTodo: function() {
      var index = this.todoList.indexOf(this.deletedTodoObj);
      this.todoList.splice(index, 1);
    },
    updateTodo: function(text, date, status) {
      var index = this.todoList.indexOf(this.updateTodoObj);
      this.todoList[index].text = text;
      this.todoList[index].priority = this.updateTodoPriority;
      this.todoList[index].date = date;
      this.todoList[index].status = status;
    },
    setDeleteTodo: function(todo) {
      this.deletedTodoObj = todo;
    },
    setUpdateTodo: function(todo) {
      this.updateTodoObj = todo;
    },
    changeStars: function(id) {
      var num = parseInt(document.getElementsByClassName(id)[0].getAttribute('data-value'));
      for (var n = 1; n < 6; n++) {
        var star = document.getElementsByClassName('star-' + n)[0];
        star.style.backgroundColor = '#FFFFFF';
      }
      for (var n = 1; n < num + 1; n++) {
        var star = document.getElementsByClassName('star-' + n)[0];
        star.style.backgroundColor = '#FFD700';
      }
      document.getElementsByClassName('star-number')[0].setAttribute('data-value', num);
      this.newTodoPriority = num;
      this.updateTodoPriority = num;
    },
    fillStar: function(id) {
      var num = parseInt(document.getElementsByClassName(id)[0].getAttribute('data-value'));
      var stars_clicked = document.getElementsByClassName('star-number')[0].getAttribute('data-value');
      if (stars_clicked <= num) {
        for (n = 1; n < num + 1; n++) {
          var star = document.getElementsByClassName('star-' + n)[0];
          star.style.backgroundColor = '#FFD700';
        }
        for (n = num + 1; n < 6; n++) {
          var star = document.getElementsByClassName('star-' + n)[0];
          star.style.backgroundColor = '#FFFFFF';
        }
      }
    },
    unfillStar: function(id) {
      var num = parseInt(document.getElementsByClassName(id)[0].getAttribute('data-value'));
      var stars_clicked = document.getElementsByClassName('star-number')[0].getAttribute('data-value');
      if (stars_clicked == 0) {
        for (n = 1; n < 6; n++) {
          var star = document.getElementsByClassName('star-' + n)[0];
          star.style.backgroundColor = '#FFFFFF';
        }
      }
      else if (stars_clicked < num) {
        for (n = parseInt(stars_clicked) + 1; n < 6; n++) {
          var star = document.getElementsByClassName('star-' + n)[0];
          star.style.backgroundColor = '#FFFFFF';
        }
      }
    }
  }
});
