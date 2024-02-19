# Mirador Annotation Editor - GPL edition

## Presentation

### Generalities

`mirador-annotation-editor`(also know as "MAE") is a [Mirador 3](https://github.com/projectmirador/mirador) plugin that adds annotation creation tools to the user interface. 

It is based on the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin with a lot of technical and functional modifications.

### Copyrights

#### Licence

Unlike the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin, this `mirador-annotation-editor` is distributed under the **GPL v3**.

Please acknoldge that any modification you make must be distributed under a compatible licence and cannot be closed source.

If you need to integrate this code base in closed source pieces of software, please contact us so we can discuss dual licencing. 

#### Property

The base of this software (up to V1) is the property of [SATT Ouest Valorisation](https://www.ouest-valorisation.fr/) that funded its development under the french public contract AO-MA2023-0004-DV5189.

#### Authors 

The authors of this software are :

- Clarisse Bardiot (concept and use cases)
- Jacob Hart (specifications)
- [Tétras Libre SARL](https://tetras-libre.fr) (development):
  - David Rouquet
  - Anthony Geourjon
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


## Integration with npm in existing project

You can override Mirador and existing annotation plugin with your own versions by using npm.
Our custom Mirador 3 version. https://github.com/SCENE-CE/mirador-video

```js
"mirador": "npm:mirador-video@^1.0.0",
"mirador-annotations": "npm:mirador-annotation-editor@^1.0.2",
```

You can find an example of integration in our Mirador-integration repository : https://gitlab.tetras-libre.fr/iiif/mirador/mirador-integration

## Install (local)

This method requires `nvm`, `npm`.

```
git clone gitlab@gitlab.tetras-libre.fr:iiif/mirador/mirador-annotations.git
cd mirador-annotations
nvm use
npm install
```
NPM Install will throw two errors  (https://gitlab.tetras-libre.fr/iiif/mirador/mirador-annotations/-/issues/12). To fix run : 

Use the following command to fix the issue (Will be fixed in future release) : 
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

## Installing `mirador-annotation-editor`

`mirador-annotation-editor` requires our custom version of Mirador 3 : https://github.com/SCENE-CE/mirador-video. 
Our version is up-to-date (at the 2024/15/02) with the master branch of Mirador and support React 17 and MUI5. We will soon make a pull request to the original Mirador 3 repository.

## Contribute

Our plugin follow the Mirador guidelines. Development, design, and maintenance is driven by community needs and ongoing feedback and discussion.
To suggest features, report bugs, and clarify usage, please submit a GitHub issue.

