# Mirador Revamped Annotations Plugin - GPL edition

## Presentation

### Generalities

`mirador-revamped-annotations` is a [Mirador 3](https://github.com/projectmirador/mirador) plugin that adds annotation creation tools to the user interface. 

It is based on the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin with a lot of technical and functional modifications.

### Copyrights

#### Licence

Unlike the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin, this `mirador-revamped-annotations` is distributed under the **GPL v3**.

Please acknoldge that any modification you make must be distributed under a compatible licence and cannot be closed source.

If you need to integrate this code base in closed source pieces of software, please contact us so we can discuss dual licencing. 

#### Property

The base of this software (up to V1) is the property of [SATT Ouest Valorisation](https://www.ouest-valorisation.fr/) that funded its development under the french public contract AO-MA2023-0004-DV5189.

#### Authors 

The authors of this software are :

- Clarisse Bardit (concept and use cases)
- Jacob Hart (specifications)
- [Tétras Libre SARL](https://tetras-libre.fr) (development):
  - David Rouquet
  - Anthony Geourgeon
  - Antoine Roy

#### Contributors (updated february 2024)

- AZOPSOFT SAS 
  - Samuel Jugnet (especially code for the Konvas part)
- Loïs Poujade (especially the original modifications to anotate videos)

### General functionatities 

- Activate a pannel with tools to create annotations on IIIF documents (manifests) containing images **and videos**
- Spatial and temporal targets for annotations
- Overlay annotations (geometric forms, free hand drawing, text and images)
- Textual/semantic annotations and tags
- Annotation metadata (based on Dublin Core)
- Annotation with anoter manifest -> network of IIIF documents

### Technical aspects 

- Update to Material UI 5 and React 18 to follow latest Mirador upgrades (React 17 release also available)
- The [paperjs](http://paperjs.org/ ) library has been replaced with [Konvas](https://konvajs.org) 
- Major refactorisation since the original `[mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugins`
- Works with the original [Mirador 3](https://github.com/projectmirador/mirador) if you need only image annotation
- If you need video annotation, you can use [our fork of Mirador: mirador-video](https://gitlab.tetras-libre.fr/iiif/mirador/mirador-video)


## Install (local)

This method requires `nvm`, `npm`.

```
git clone gitlab@gitlab.tetras-libre.fr:iiif/mirador/mirador-annotations.git
cd mirador-annotations
nvm use
npm install
```
NPM Install throw two errors  (https://gitlab.tetras-libre.fr/iiif/mirador/mirador-annotations/-/issues/12). To fix run : 

```
./cli post_install
```

Run mirador and the plugin :

```
npm start
```

## Persisting Annotations
Persisting annotations requires implementing an a IIIF annotation server. Several [examples of annotation servers](https://github.com/IIIF/awesome-iiif#annotation-servers) are available on iiif-awesome.

`mirador-annotations` currently supports adapters for [annotot](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/AnnototAdapter.js) and [local storage](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/LocalStorageAdapter.js). We welcome contributions of adapters for other annotation servers.

## Installing `mirador-annotations`

`mirador-annotations` requires an instance of Mirador 3. See the [Mirador wiki](https://github.com/ProjectMirador/mirador/wiki) for examples of embedding Mirador within an application. See the [live demo's index.js](https://github.com/ProjectMirador/mirador-annotations/blob/master/demo/src/index.js) for an example of importing the `mirador-annotations` plugin and configuring the adapter.

**You must use node v16.20.2**. You can `run nvm use` at the racine of the project to set your node version to 16.20.2.

## Contribute
Mirador's development, design, and maintenance is driven by community needs and ongoing feedback and discussion. Join us at our regularly scheduled community calls, on [IIIF slack #mirador](http://bit.ly/iiif-slack), or the [mirador-tech](https://groups.google.com/forum/#!forum/mirador-tech) and [iiif-discuss](https://groups.google.com/forum/#!forum/iiif-discuss) mailing lists. To suggest features, report bugs, and clarify usage, please submit a GitHub issue.

