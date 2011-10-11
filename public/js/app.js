(function() {
  var Characters, Chartacer, Crew, CrewPresidentialOrder, CrewSkillGraphView, CrewView, Recruit;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.App = {};
  App.CrewSkillGraphView = CrewSkillGraphView = (function() {
    __extends(CrewSkillGraphView, Backbone.View);
    function CrewSkillGraphView() {
      this.render = __bind(this.render, this);
      CrewSkillGraphView.__super__.constructor.apply(this, arguments);
    }
    CrewSkillGraphView.prototype.initialize = function() {
      this.crew = this.options.crew;
      this.crew.bind("reset", this.render);
      this.el = $("#skills");
      this.template = _.template("<div style=\"height:<%= level * 30 %>px;\"><label><%= skill %></label><span><%= level %></span></div>");
      return this.render();
    };
    CrewSkillGraphView.prototype.render = function() {
      var skill, skill_el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = skills.length; _i < _len; _i++) {
        skill = skills[_i];
        skill_el = this.el.find("." + skill);
        _results.push(skill_el != null ? skill_el.html(this.template({
          skill: skill,
          level: this.crew.skillCount(skill)
        })) : void 0);
      }
      return _results;
    };
    return CrewSkillGraphView;
  })();
  App.CrewPresidentialOrderView = CrewPresidentialOrder = (function() {
    __extends(CrewPresidentialOrder, Backbone.View);
    function CrewPresidentialOrder() {
      this.render = __bind(this.render, this);
      this.sortedOrder = __bind(this.sortedOrder, this);
      CrewPresidentialOrder.__super__.constructor.apply(this, arguments);
    }
    CrewPresidentialOrder.prototype.template = "#crew-order-template";
    CrewPresidentialOrder.prototype.tagName = "ol";
    CrewPresidentialOrder.prototype.container = "#president .crew";
    CrewPresidentialOrder.prototype.initialize = function() {
      this.crew = this.options.crew;
      this.crew.bind("reset", this.render);
      return this.initializeTemplate();
    };
    CrewPresidentialOrder.prototype.initializeTemplate = function() {
      if ($(this.template).length > 0) {
        return this.template = _.template($(this.template).html());
      }
    };
    CrewPresidentialOrder.prototype.sortedOrder = function() {
      return this.crew.presidentialOrder();
    };
    CrewPresidentialOrder.prototype.render = function() {
      var member, _i, _len, _ref;
      ($(this.el)).html("");
      _ref = this.sortedOrder();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        member = _ref[_i];
        ($(this.el)).append(this.template({
          member: member
        }));
      }
      $(this.container).html(this.el);
      return this;
    };
    return CrewPresidentialOrder;
  })();
  App.CrewAdmiralOrderView = App.CrewAdmiralOrderView = (function() {
    __extends(CrewAdmiralOrderView, App.CrewPresidentialOrderView);
    function CrewAdmiralOrderView() {
      this.sortedOrder = __bind(this.sortedOrder, this);
      CrewAdmiralOrderView.__super__.constructor.apply(this, arguments);
    }
    CrewAdmiralOrderView.prototype.container = "#admiral .crew";
    CrewAdmiralOrderView.prototype.sortedOrder = function() {
      return this.crew.admiralOrder();
    };
    return CrewAdmiralOrderView;
  })();
  App.CrewView = CrewView = (function() {
    __extends(CrewView, Backbone.View);
    function CrewView() {
      this.updateCrew = __bind(this.updateCrew, this);
      this.render = __bind(this.render, this);
      CrewView.__super__.constructor.apply(this, arguments);
    }
    CrewView.prototype.template = "#crew-member-template";
    CrewView.prototype.tagName = "ul";
    CrewView.prototype.events = {
      "change select": "chooseMember"
    };
    CrewView.prototype.initialize = function() {
      this.crew = this.options.crew;
      this.crew.bind("reset", this.updateCrew);
      this.presidential_order_view = new App.CrewPresidentialOrderView({
        crew: this.crew
      });
      this.admiral_order_view = new App.CrewAdmiralOrderView({
        crew: this.crew
      });
      this.sckill_graph_view = new App.CrewSkillGraphView({
        crew: this.crew
      });
      return this.initializeTemplate();
    };
    CrewView.prototype.initializeTemplate = function() {
      return this.template = _.template($(this.template).html());
    };
    CrewView.prototype.render = function() {
      var index;
      for (index = 1; index <= 6; index++) {
        ($(this.el)).append(this.template({
          chars: characters,
          slot: index
        }));
      }
      $("#members").html(this.el);
      return this;
    };
    CrewView.prototype.chooseMember = function(el) {
      var field, id, ids, new_crew;
      ids = (function() {
        var _i, _len, _ref, _results;
        _ref = ($(this.el)).find("select");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push(parseInt($(field).val()));
        }
        return _results;
      }).call(this);
      new_crew = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          id = ids[_i];
          if (id > 0) {
            _results.push(this.options.characters.get(id));
          }
        }
        return _results;
      }).call(this);
      return this.crew.reset(new_crew);
    };
    CrewView.prototype.updateCrew = function() {
      var member, _i, _len, _ref, _results;
      ($(this.el)).find("option").attr("disabled", false);
      _ref = this.crew.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        member = _ref[_i];
        _results.push(($(this.el)).find("option[value=" + (member.get("id")) + "]").attr("disabled", true));
      }
      return _results;
    };
    return CrewView;
  })();
  App.Character = Chartacer = (function() {
    __extends(Chartacer, Backbone.Model);
    function Chartacer() {
      Chartacer.__super__.constructor.apply(this, arguments);
    }
    Chartacer.prototype.skillCount = function(skill) {
      return this.get("skills")[skill] || 0;
    };
    return Chartacer;
  })();
  App.Characters = Characters = (function() {
    __extends(Characters, Backbone.Collection);
    function Characters() {
      Characters.__super__.constructor.apply(this, arguments);
    }
    Characters.prototype.model = App.Character;
    return Characters;
  })();
  App.Crew = Crew = (function() {
    __extends(Crew, App.Characters);
    function Crew() {
      Crew.__super__.constructor.apply(this, arguments);
    }
    Crew.prototype.skillCount = function(skill) {
      var skillCounts;
      skillCounts = this.map(function(model) {
        return model.skillCount(skill);
      });
      return skillCounts.reduce((function(sum, skillCount) {
        return sum + skillCount;
      }), 0);
    };
    Crew.prototype.presidentialOrder = function() {
      return this.sortBy(function(model) {
        return model.get("presidential_order");
      });
    };
    Crew.prototype.admiralOrder = function() {
      return this.sortBy(function(model) {
        return model.get("admiral_order");
      });
    };
    return Crew;
  })();
  App.Recruit = Recruit = (function() {
    __extends(Recruit, Backbone.Router);
    function Recruit() {
      Recruit.__super__.constructor.apply(this, arguments);
    }
    Recruit.prototype.routes = {
      '': 'home'
    };
    Recruit.prototype.initialize = function() {
      this.characters = new App.Characters(characters);
      this.crew = new App.Crew;
      return this.crewView = new App.CrewView({
        characters: this.characters,
        crew: this.crew
      });
    };
    Recruit.prototype.home = function() {
      return this.crewView.render();
    };
    return Recruit;
  })();
  ($(document)).ready(function() {
    window.Recruit = new App.Recruit();
    Backbone.history.start({
      pushState: true
    });
    return window.Recruit.home();
  });
}).call(this);
