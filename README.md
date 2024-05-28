# Mirador Annotation Editor - Apache edition

## Presentation

### Generalities

`mirador-annotation-editor`(also known as "MAE") is a [Mirador 4](https://github.com/projectmirador/mirador) plugin that 
adds annotation creation tools to the user interface. 

It is based on the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin with a
lot of technical and functional modifications.

### Copyrights

#### Licence

Like the original [mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) plugin, this 
`mirador-annotation-editor` is distributed under the **Apache License Version 2.0**.

Beware that the extention plugin [mirador-annotation-editor-video](https://github.com/SCENE-CE/mirador-annotation-editor-video) 
that supports video annotation is released under the **GPL v3** license.

Please acknowledge that any modification you make must be distributed under a compatible licence and cannot be closed 
source.

If you need to integrate this code base in closed source pieces of software, please contact us, so we can discuss dual 
licencing. 

#### Property

The base of this software (up to V1) is the property of [SATT Ouest Valorisation](https://www.ouest-valorisation.fr/) 
that funded its development under the French public contract AO-MA2023-0004-DV5189.

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
- Loïs Poujade (especially the original modifications to annotate videos)

### General functionalities 

- Activate a panel with tools to create annotations on IIIF documents (manifests) containing images **and videos with 
MAEV**
- Spatial and temporal targets for annotations
- Overlay annotations (geometric forms, free hand drawing, text and images)
- Textual/semantic annotations and tags
- Annotation metadata (based on Dublin Core)
- Annotation with another manifest -> network of IIIF documents

### Technical aspects 

- Update to Material UI 5 and React 18 to follow latest Mirador upgrades (React 17 release also available)
- The [paperjs](http://paperjs.org/ ) library has been replaced with [Konvas](https://konvajs.org) 
- Major refactoring since the original `[mirador-annotations](https://github.com/ProjectMirador/mirador-annotations/) 
plugins`
- Works with the original [Mirador 4](https://github.com/projectmirador/mirador) if you need only image annotation

## Use in npm projects

```bash
npm install mirador-annotation-editor
```

## Use in existing npm project with previous plugins

You can override existing annotation plugin with your own versions by using npm. We support React 18 and MUI 5.

Update your `package.json` file to include the following dependencies and devDependencies:
```js
"mirador-annotations": "npm:mirador-annotation-editor@^1.0.10",
```

You need also to use the latest version of Mirador 4.

```js
"mirador" : "4.0.0-alpha.2",
```

You can find an example of integration in our Mirador-integration repository : 
https://github.com/SCENE-CE/mirador-integration

## Install (local)

This method requires `nvm`, `npm`.

```
git clone git@github.com:SCENE-CE/mirador-annotation-editor.git
cd mirador-annotation-editor
nvm use
npm install
```

Run a demo with Mirador and the MAE plugin :

```
npm start
```

## Use MAE with video annotation support
- If you need video annotation, you can use 
[our fork of Mirador: mirador-video](https://github.com/SCENE-CE/mirador-video)
- In addition, we have developed a wrapper of MAE to support video annotation. This wrapper is called **MAEV** and is
available in the [mirador-annotation-editor-video](https://github.com/SCENE-CE/mirador-annotation-editor-video)
repository.

### Install with video annotation support

Update your `package.json` file to include the following dependencies and devDependencies:

```js
"mirador": "npm:mirador-video@^1.0.6",
"mirador-annotations": "npm:mirador-annotation-editor-video@^1.0.21",
```

## Persisting Annotations
Persisting annotations requires implementing a IIIF annotation server. Several 
[examples of annotation servers](https://github.com/IIIF/awesome-iiif#annotation-servers) are available on iiif-awesome.

`mirador-annotation-editor` currently supports adapters for 
[annotot](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/AnnototAdapter.js) and 
[local storage](https://github.com/ProjectMirador/mirador-annotations/blob/master/src/LocalStorageAdapter.js). We 
welcome contributions of adapters for other annotation servers.


## Contribute

Our plugin follow the Mirador guidelines. Development, design, and maintenance is driven by community needs and ongoing
feedback and discussion.
To suggest features, report bugs, and clarify usage, please submit a GitHub issue.

