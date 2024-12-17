import { upsertAnnotationPage } from "../api/upsertAnnotationPage.ts";
import { gettingAnnotationPage } from "../api/gettingAnnotationPage.ts";

export default class MMUAdapter {
  /** */
  constructor(projectId,annotationPageId) {
    console.log("MMU Storage adapter")
    this.projectId = projectId;
    this.annotationPageId = annotationPageId;
  }

  /** */
  async create(annotation) {
    console.log('MMU adapter CREATE')
    const emptyAnnoPage = {
      id: this.annotationPageId,
      items: [],
      type: 'AnnotationPage',
    };
    let annotationPage = await this.all()
    if(annotationPage.length < 1) {
      annotationPage = emptyAnnoPage;
    }
    annotationPage.items.push(annotation);
    return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
  }

  /** */
  async update(annotation) {
    console.log('MMU adapter UPDATE')
    const annotationPage = await this.all();
    if (annotationPage) {
      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);
      annotationPage.items.splice(currentIndex, 1, annotation);
      return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
    }
    return null;
  }

  /** */
  async delete(annoId) {
    console.log('MMU adapter DELETE')
    const annotationPage = await this.all();
    if (annotationPage) {
      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);
    }
    return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
  }

  /** */
  async get(annoId) {
    console.log('MMU adapter GET')
    const annotationPage = await this.all();
    if (annotationPage) {
      return annotationPage.items.find((item) => item.id === annoId);
    }
    return null;
  }

  /** */
  async all() {
    console.log('MMU adapter GET ALL')
    return await gettingAnnotationPage(this.annotationPageId, this.projectId);
  }
}
