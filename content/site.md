theTube is a serverless publishing platform. No server. No database. Everything is a file and a URL. The CDN is the platform — it serves content, handles auth, ingests events, and scales globally. What looks like a static site supports user input, real-time writes, and role-based access. Works in Lynx. Costs about a dollar a month.

The architecture is its own argument for how much of the web doesn't need to be as complicated as it is.

## Files at URLs

The contract is three words: files at URLs. Writers put data at a path. Readers fetch from that path. Nothing cares what built the file or what reads it. S3 is the pipe between them.

Posts are Markdown files. Comments are text files. Logs are HTTP requests the CDN records. The feed is a JSON manifest. All files. All URLs. All decoupled.

## Journal-driven development

The development methodology: vague idea → journal → spec → code, where the last three are a loop. The journal entry is the unit of work — one file, whole story. AI is the bridge between prose and implementation. The spec is the source code. The code is the object code — disposable, regenerable.

The journal stays current because it _is_ the work. You can't build something without writing about it first. Five years later you can open the file and reconstruct the what, the why, and the how.

## The Unix pipe model

GitHub Actions is the shell. The content repo writes Markdown. The renderer reads it and produces HTML. CloudFront serves it. The log ingests events. Lambdas process them. Each step does one thing. None of them need to know about each other beyond the format.

Doug McIlroy's pipe model applied to publishing. Small tools, clear interfaces, compose at the shell.

## Built with AI

Written completely by AI, directed by a human. The human role is direction, judgment, and writing. The AI role is code, debugging, and implementation. The skills and specs give AI enough context to build without constant correction.

## Source

- App: [github.com/trsvax/theTube](https://github.com/trsvax/theTube)
- Content: [github.com/trsvax/theTube-content](https://github.com/trsvax/theTube-content)
