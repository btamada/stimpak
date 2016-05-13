
npm install stimpak -g
npm install stimpak-new-project -g


// Help commands
$ stimpak
$ stimpak -h
$ stimpak --help

// Run single generatorB
$ stimpak new-project

// Run multiple generators
$ stimpak new-project something-else

// Answering questions via CLI
$ stimpak new-project
	--fileName="something"
	--useSomething=true


ASK QUESTIONS EHRERERE

GENERATE CODE


/////////////////////


import Stimpak from "stimpak";
import AdvancedProjectGenerator from "stimpak-advanced-project";

const generator = new Stimpak().use(AdvancedProjectGenerator);

generator
	.answers({
		something: "blah"
	})
	.generate(error => {
		if (error) { throw error; }
	});

const callFunction = Symbol();
