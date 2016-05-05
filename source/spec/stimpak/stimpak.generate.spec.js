import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.generate()", () => {
	let stimpak,
			stepOne,
			stepTwo;

	beforeEach(() => {
		const asyncFunction = (generator, callback) => {
			callback();
		};

		stepOne = sinon.spy(asyncFunction);
		stepTwo = sinon.spy(asyncFunction);

		stimpak = new Stimpak();
		stimpak.then(stepOne, stepTwo);
	});

	it("should return itself to enable chaining", () => {
		stimpak.generate().should.eql(stimpak);
	});

	it("should run each step in series then callback", done => {
		stimpak
			.generate(() => {
				const results = {
					stepOne: stepOne.called,
					stepTwo: stepTwo.called
				};

				results.should.eql({
					stepOne: true,
					stepTwo: true
				});

				done();
			});
	});

	it("should call each step function with `this` as the first argument", done => {
		stimpak
			.generate(() => {
				const results = {
					stepOne: stepOne.calledWith(stimpak),
					stepTwo: stepTwo.calledWith(stimpak)
				};

				results.should.eql({
					stepOne: true,
					stepTwo: true
				});

				done();
			});
	});

	it("should add all answers from prompts to .answers");

	it("should callback with an error if one occurs");
});
