import { createPass } from "passkit-generator";

try {
	const examplePass = await createPass({
		model: "path/to/exported/model/Untitled Project.pkpass",
		certificates: {
			wwdr: "./certs/wwdr.pem",
			signerCert: "./certs/signercert.pem",
			signerKey: {
				keyFile: "./certs/signerkey.pem",
				passphrase: "123456"
			}
		},
	});


	// Generate the stream, which gets returned through a Promise
	const stream: Stream = examplePass.generate();

	doSomethingWithTheStream(stream);
} catch (err) {
	doSomethingWithTheError(err);
}