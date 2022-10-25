const parseNsml = require('../inewsStoryParser');

describe('inewsStoryParser', () => {

	it('parses multi-line anchored element (ae)', () => {
		const nsml = `<nsml version="-//AVID//DTD NSML 1.0//EN">
		<story>
		<aeset>
		<ae id=0>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap>#kg bund TEST</ap>
		<ap>test</ap>
		<ap>;0.02</ap>
		</mc>
		</ae>
		</aeset>
		</story>
		`;
		let error;
		let output;

		parseNsml(nsml, (err, out) => { error = err; output = out });

		expect(error).toBeFalsy();
		expect(output).toEqual({
			fields: {},
			meta: {},
			cues: [
				['#kg bund TEST', 'test', ';0.02'],
			]
		});
	})
	it('omits empty paragraphs (ap) in a multi-line anchored element', () => {
		const nsml = `<nsml version="-//AVID//DTD NSML 1.0//EN">
		<story>
		<aeset>
		<ae id=0>
		<ap>]] S3.0 G 0 [[</ap>
		<ap>#kg bund TEST</ap>
		<ap></ap>
		<ap></ap>
		<ap>test</ap>
		<ap></ap>
		<ap>;0.02</ap>
		</ae>
		</aeset>
		</story>
		`;
		let error;
		let output;

		parseNsml(nsml, (err, out) => { error = err; output = out });

		expect(error).toBeFalsy();
		expect(output).toEqual({
			fields: {},
			meta: {},
			cues: [
				['#kg bund TEST', 'test', ';0.02'],
			]
		});
	})
	it('omits empty paragraphs (ap) in a multi-line anchored element with machine control (mc)', () => {
		const nsml = `<nsml version="-//AVID//DTD NSML 1.0//EN">
		<story>
		<aeset>
		<ae id=0>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap>#kg bund TEST</ap>
		<ap></ap>
		<ap></ap>
		<ap>test</ap>
		<ap></ap>
		<ap>;0.02</ap>
		</mc>
		</ae>
		</aeset>
		</story>
		`;
		let error;
		let output;

		parseNsml(nsml, (err, out) => { error = err; output = out });

		expect(error).toBeFalsy();
		expect(output).toEqual({
			fields: {},
			meta: {},
			cues: [
				['#kg bund TEST', 'test', ';0.02'],
			]
		});
	})
	it('maintains order (inserts empty cues in place of elements containing only an empty paragraph)', () => {
		const nsml = `<nsml version="-//AVID//DTD NSML 1.0//EN">
		<story>
		<aeset>
		<ae id=0>
		<ap></ap>
		</ae>
		<ae id=1>
		<ap>]] S3.0 G 0 [[</ap>
		<ap></ap>
		</ae>
		<ae id=2>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap></ap>
		</mc>
		</ae>
		<ae id=3>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap>#kg bund TEST</ap>
		<ap>test</ap>
		<ap>;0.02</ap>
		</mc>
		</ae>
		<ae id=4>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap></ap>
		</mc>
		</ae>
		<ae id=5>
		<ap>]] S3.0 G 0 [[</ap>
		<mc>
		<ap>#kg bund TEST2</ap>
		<ap>test2</ap>
		<ap>;0.11</ap>
		</mc>
		</ae>
		</aeset>
		</story>
		`;
		let error;
		let output;

		parseNsml(nsml, (err, out) => { error = err; output = out });

		expect(error).toBeFalsy();
		expect(output).toEqual({
			fields: {},
			meta: {},
			cues: [
				[],
				[],
				[],
				['#kg bund TEST', 'test', ';0.02'],
				[],
				['#kg bund TEST2', 'test2', ';0.11']
			]
		});
	})
});