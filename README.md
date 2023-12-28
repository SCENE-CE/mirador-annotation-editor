# mirador-annotations

## Install

```
git clone gitlab@gitlab.tetras-libre.fr:iiif/mirador/mirador-annotations.git
cd mirador-annotations/
git checkout mui5/React17
git clone gitlab@gitlab.tetras-libre.fr:iiif/mirador/mirador-video.git
rm -r mirador
mv mirador-video/ mirador
cd mirador/
git checkout 3def696e
npm install
cd ..
npm install
```

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

`mirador-annotations` is a [Mirador 3](https://github.com/projectmirador/mirador) plugin that adds annotation creation tools to the user interface. Users can` create rectangle, oval, and polygon annotations and add text descriptors. A [live demo](https://mirador-annotations.netlify.app/) that stores annotations in local storage is available for testing. See the [issue queue](https://github.com/ProjectMirador/mirador-annotations/issues) for design proposals for additional functionality.

![annotation creation panel](https://user-images.githubusercontent.com/5402927/86628717-23c3ae80-bf7f-11ea-8f0b-389c39eb4398.png)

## Persisting Annotations
Persisting annotations requires implementing an a IIIF annotation server. Several [examples of annotation servers](https://github.com/IIIF/awesome-iiif#annotation-servers) are available on iiif-awesome.

`mirador-annotations` currently supports adapters for [annotot](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/AnnototAdapter.js) and [local storage](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/LocalStorageAdapter.js). We welcome contributions of adapters for other annotation servers.

## Installing `mirador-annotations`

`mirador-annotations` requires an instance of Mirador 3. See the [Mirador wiki](https://github.com/ProjectMirador/mirador/wiki) for examples of embedding Mirador within an application. See the [live demo's index.js](https://github.com/ProjectMirador/mirador-annotations/blob/master/demo/src/index.js) for an example of importing the `mirador-annotations` plugin and configuring the adapter.

**You must use node v16.20.2**. You can `run nvm use` at the racine of the project to set your node version to 16.20.2.
## Contribute
Mirador's development, design, and maintenance is driven by community needs and ongoing feedback and discussion. Join us at our regularly scheduled community calls, on [IIIF slack #mirador](http://bit.ly/iiif-slack), or the [mirador-tech](https://groups.google.com/forum/#!forum/mirador-tech) and [iiif-discuss](https://groups.google.com/forum/#!forum/iiif-discuss) mailing lists. To suggest features, report bugs, and clarify usage, please submit a GitHub issue.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/mirador-annotations.png?style=flat-square
[npm]: https://www.npmjs.org/package/mirador-annotations

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
