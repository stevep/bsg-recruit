(function() {
  describe("Character", function() {
    beforeEach(function() {
      return this.adama = new App.Character(characters[1]);
    });
    it("has a name", function() {
      return (expect(this.adama.get('name'))).toEqual("William Adama");
    });
    it("has a valid type", function() {
      return (expect(character_types)).toContain(this.adama.get('type'));
    });
    return describe("skill count", function() {
      it("returns a positive value for a skill he has", function() {
        return (expect(this.adama.skillCount("leadership"))).toEqual(3);
      });
      return it("returns 0 for a skill he doesn't have", function() {
        return (expect(this.adama.skillCount("piloting"))).toEqual(0);
      });
    });
  });
  describe("Characters", function() {
    beforeEach(function() {
      return this.characters = new App.Characters(characters);
    });
    return it("has 10 charachters", function() {
      return (expect(this.characters.length)).toEqual(10);
    });
  });
  describe("Crew", function() {
    describe("empty crew", function() {
      beforeEach(function() {
        return this.crew = new App.Crew;
      });
      return describe("adds up skills", function() {
        return it("adds up politics", function() {
          return (expect(this.crew.skillCount("politics"))).toEqual(0);
        });
      });
    });
    return describe("three man crew", function() {
      beforeEach(function() {
        this.characters = new App.Characters(characters);
        this.crew = new App.Crew;
        this.adama = this.characters.get(2);
        this.helo = this.characters.get(3);
        this.roslin = this.characters.get(5);
        return this.crew = new App.Crew([this.helo, this.adama, this.roslin]);
      });
      describe("adds up skills", function() {
        it("adds up politics", function() {
          return (expect(this.crew.skillCount("politics"))).toEqual(4);
        });
        it("adds up leadership", function() {
          return (expect(this.crew.skillCount("leadership"))).toEqual(7);
        });
        it("adds up tactics", function() {
          return (expect(this.crew.skillCount("tactics"))).toEqual(4);
        });
        it("adds up piloting", function() {
          return (expect(this.crew.skillCount("piloting"))).toEqual(0);
        });
        return it("adds up engineering", function() {
          return (expect(this.crew.skillCount("engineering"))).toEqual(0);
        });
      });
      describe("presidential leadership", function() {
        return it("has an order", function() {
          console.log(this.crew.presidentialOrder());
          return (expect(this.crew.presidentialOrder())).toEqual([this.roslin, this.adama, this.helo]);
        });
      });
      return describe("admiral leadership", function() {
        return it("has an order", function() {
          return (expect(this.crew.admiralOrder())).toEqual([this.adama, this.helo, this.roslin]);
        });
      });
    });
  });
}).call(this);
