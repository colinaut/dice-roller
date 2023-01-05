# Dice Roller Web Component

This is a dice roller web component. I created this mainly for use with playing table top role playing games online. This can be used just as a simple web dice roller or incorporated into interactive rule books or character sheets.

## Installation

Add the dice-roller.js script to your web site, then add the `<dice-roller></dice-roller>` web component to your html.

### CDN

```
<script src="https://unpkg.com/@colinaut/dice-roller/dist/dice-roller.js"></script>
```

### NPM/PNPM/YARN

```
npm i @colinaut/dice-roller

pnpm i @colinaut/dice-roller

yarn add @colinaut/dice-roller

```

### Eleventy static site

If you are using [Eleventy](https://www.11ty.dev), and want to install locally rather than rely on the CDN, you can install via NPM/PNPM/YARN and then pass through the js file so that it is included in the output. Then you would just need to add it to the head.

```
eleventyConfig.addPassthroughCopy({
    "node_modules/@colinaut/dice-roller/dist/dice-roller.js": "js/dice-roller.js",
})
```
```
<script src="/js/dice-roller.js"></script>
```

### Attributes

1.  dice: string comma separated list of dice
2.  total: how the total is arrived at
3.  modifier: + or - after dice are rolled
4.  bonus-die: additional die added after dice are summed up
5.  difficulty: number required for success
6.  size: visual size of dice

## To Do

- [ ] add dice name attribute for each component
- [ ] make roll totals trigger custom event. Use dice name attribute for event name
- [x] add modifiers attribute for + or - to rolls
- [x] add bestOf attribute for best of 2 dice for Agon and some PbtA advantage rolls and for Blades in the Dark
- [x] add lowest die
- [x] add built in form field for adjusting dice values
- [ ] add svg for dice shape to match different polyhedrons
- [ ] highlight the highest dice when BestOf is set
- [x] Add Bonus die for Agon
- [x] Strip out form from dice-roller
- [ ] Create dice-box component for listing dice roll history
- [ ] Create dice-pbta, dice-agon, and dice-fitd components for each rolls in those systems
- [ ] Add clear total function with delay
- [ ] Add custom event handlers for roll and clearing totals
- [x] Add difficulty check
- [ ] Allow for multiple difficulty levels 
- [ ] Add way to remove header