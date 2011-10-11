describe "Character", ->
  
  beforeEach ->
    @adama = new App.Character characters[1]
    
  it "has a name", ->
    (expect @adama.get('name')).toEqual("William Adama")
    
  it "has a valid type", ->
    (expect character_types).toContain(@adama.get('type'))
    
  describe "skill count", ->
    
    it "returns a positive value for a skill he has", ->
      (expect @adama.skillCount("leadership")).toEqual(3)
      
    it "returns 0 for a skill he doesn't have", ->
      (expect @adama.skillCount("piloting")).toEqual(0)

describe "Characters", ->
  
  beforeEach ->
    @characters = new App.Characters characters
    
  it "has 10 charachters", ->
    (expect @characters.length).toEqual(10)

describe "Crew", ->
  
  describe "empty crew", ->
    
    beforeEach ->
      @crew = new App.Crew
      
    describe "adds up skills", ->
      
      it "adds up politics", ->
        (expect @crew.skillCount("politics")).toEqual(0)
  
  describe "three man crew", ->
    beforeEach ->
      @characters = new App.Characters characters
      @crew = new App.Crew
      
      @adama = @characters.get(2)
      @helo = @characters.get(3)
      @roslin = @characters.get(5)
    
      @crew = new App.Crew [@helo, @adama, @roslin]
    
    describe "adds up skills", ->

      it "adds up politics", ->
        (expect @crew.skillCount("politics")).toEqual(4)
      
      it "adds up leadership", ->
        (expect @crew.skillCount("leadership")).toEqual(7)
      
      it "adds up tactics", ->
        (expect @crew.skillCount("tactics")).toEqual(4)
      
      it "adds up piloting", ->
        (expect @crew.skillCount("piloting")).toEqual(0)
      
      it "adds up engineering", ->
        (expect @crew.skillCount("engineering")).toEqual(0)
    
    describe "presidential leadership", ->
    
      it "has an order", ->
        console.log (@crew.presidentialOrder())
        (expect @crew.presidentialOrder()).toEqual([@roslin, @adama, @helo])

    describe "admiral leadership", ->

      it "has an order", ->
        (expect @crew.admiralOrder()).toEqual([@adama, @helo, @roslin])