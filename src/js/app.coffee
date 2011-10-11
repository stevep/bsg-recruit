window.App = {}

App.CrewSkillGraphView = class CrewSkillGraphView extends Backbone.View
  
  initialize: ->
    @crew = @options.crew
    @crew.bind "reset", @render
    @el = $ "#skills"
    @template = _.template("<div style=\"height:<%= level * 30 %>px;\"><label><%= skill %></label><span><%= level %></span></div>")
    @render()
    
  render: =>
    for skill in skills
      skill_el = @el.find(".#{skill}")
      skill_el?.html(@template {skill: skill, level: @crew.skillCount(skill) })

App.CrewPresidentialOrderView = class CrewPresidentialOrder extends Backbone.View
  template: "#crew-order-template"
  tagName: "ol"
  
  container: "#president .crew"
  
  initialize: ->
    @crew = @options.crew
    @crew.bind "reset", @render
    @initializeTemplate()
  
  initializeTemplate: ->
    @template = _.template($(@template).html()) if $(@template).length > 0
    
  sortedOrder: =>  
    @crew.presidentialOrder()
    
  render: =>  
    ($ @el).html("")
    for member in @sortedOrder()
      ($ @el).append( @template({member: member}) )
    $(@container).html(@el)
    @
    
App.CrewAdmiralOrderView = class App.CrewAdmiralOrderView extends App.CrewPresidentialOrderView
  container: "#admiral .crew"
  
  sortedOrder: =>  
    @crew.admiralOrder()

App.CrewView = class CrewView extends Backbone.View
  template: "#crew-member-template"
  tagName: "ul"
  
  events:
    "change select": "chooseMember"
  
  initialize: ->
    @crew = @options.crew
    @crew.bind "reset", @updateCrew
    
    @presidential_order_view = new App.CrewPresidentialOrderView
      crew: @crew
      
    @admiral_order_view = new App.CrewAdmiralOrderView
      crew: @crew   
      
    @sckill_graph_view = new App.CrewSkillGraphView
      crew: @crew
      
    @initializeTemplate()
  
  initializeTemplate: ->
    @template = _.template($(@template).html())
    
  render: =>
    for index in [1..6]
      ($ @el).append( @template({chars: characters, slot: index}) )
    $("#members").html(@el)
    @
    
  chooseMember: (el) ->
    ids = for field in ($ @el).find("select")
      parseInt $(field).val()

    new_crew = for id in ids when id > 0
      @options.characters.get(id)

    @crew.reset(new_crew)
      
  updateCrew: =>
    ($ @el).find("option").attr("disabled", false)
    for member in @crew.models
      ($ @el).find("option[value=#{member.get("id")}]").attr("disabled", true)

App.Character = class Chartacer extends Backbone.Model
  skillCount: (skill) ->
    @get("skills")[skill] || 0
  
App.Characters = class Characters extends Backbone.Collection
  model: App.Character
  
App.Crew = class Crew extends App.Characters 
  
  skillCount: (skill) ->
    skillCounts = @map (model) -> model.skillCount(skill)
    skillCounts.reduce( ((sum, skillCount) -> sum + skillCount), 0)
  
  presidentialOrder: ->
    @sortBy (model) -> 
      model.get "presidential_order"
  
  admiralOrder: ->
    @sortBy (model) -> 
      model.get "admiral_order"
      
App.Recruit = class Recruit extends Backbone.Router
  routes:
    '': 'home'

  initialize: ->
    @characters = new App.Characters characters
    @crew = new App.Crew
    @crewView = new App.CrewView
      characters: @characters 
      crew: @crew

  home: ->
    @crewView.render()
      


($ document).ready ->
    window.Recruit = new App.Recruit()
    Backbone.history.start {pushState: true}
    window.Recruit.home()
