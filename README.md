# Frontend-3

Material for **Front-end 3 (data)**, mostly using [d3.js][d3].

Examples and assignments are in this Git repository. Course related
info can be found on Moodle.

## 0. Install

With [git][], do:

```sh
git clone https://github.com/nielsdB97/Frontend-3.git
```

**Or, click the big green button “Clone or download” and
install from there. Don’t forget to `cd` into the directory.**

## 1. Get Node

This project uses Node.js so you should have that installed to get started.

## 2. Dependencies

Now, install dependencies with NPM like so:

```sh
npm install
```

## 3. Server

We're using [budo][] as a live-reloading server. It can be initiated by running:
```sh
npm start
```

Since we're also using data from a specific Google Sheet, it's nice to always know we have the most up-to-date version.
To get the latest data and start the live-reloading server, run:

```sh
make start
```

You can then visit [localhost:9966][localhost].

This will print out an address the server is running on.

<small>Tip: you can
pass budo options, such as `--open`, like so:
`npm start -- --open`</small>

[d3]: https://github.com/d3/d3

[git]: https://git-scm.com

[node]: https://nodejs.org

[budo]: https://github.com/mattdesl/budo

[localhost]: http://localhost:9966
