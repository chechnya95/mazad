import { EventEmitter, Injectable } from '@angular/core';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';
//import ProgressBar from '@uppy/progress-bar';
import Arabic from '@uppy/locales/lib/ar_SA';
import English from '@uppy/locales/lib/en_US';
import { ApiService } from './api.service'; // Import your API service
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UppyService {
  public isUploading = new EventEmitter<boolean>();
  
  lang = localStorage.getItem('lang');
  constructor(private api: ApiService,public translate: TranslateService) {
    //this.lang = localStorage.getItem('lang');
    if (!this.lang)
    this.lang = 'en';
    this.translate.use(this.lang);
  }

  initializeUppy(type: string, mediaId: string, token: string, dashboardSelector: string, is_new: boolean = false): Uppy {
    const uppyLocale = this.lang === 'ar' ? Arabic : English;

    const uppy = new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        maxFileSize: 100000000,
        allowedFileTypes: type === 'image' ? ['image/*'] : ['application/pdf', 'application/msword']
      },
      autoProceed: true,
      locale: uppyLocale
    });

    const endpoint = this.api.getItemUploadUrl(type, mediaId, 1) + (is_new ? '/new' : '');
    const tokenHeader = this.api.get_token_header(token);

    this.configureUppy(uppy, dashboardSelector, endpoint, tokenHeader);

    uppy.on('upload-success', (file, response) => {
      // Assuming the server responds with JSON data including an array of files
      if (response.body && response.body.files && response.body.files.length > 0) {
        const uploadedFile = response.body.files[0]; // Get the first file in the response
        const serverFileId = uploadedFile.id; // Extract the id
    
        // Store this identifier in the file's metadata
        uppy.setFileMeta(file.id, { serverFileId: serverFileId });
    
        console.log('File uploaded:', file.name, 'with ID:', serverFileId);
      } else {
        console.error('Invalid response format from server');
      }
    });

    uppy.on('file-removed', (file) => {
      // Handle file removal
      const serverFileId = file.meta.serverFileId;
      if (serverFileId) {
        this.api.delete('medias/' + serverFileId, token).subscribe({
          next: (response) => console.log('File deleted:', file.name),
          error: (error) => console.error('Error deleting file:', error)
        });
      }
    });

    uppy.on('upload', () => {
      this.isUploading.emit(true); // Set to true when upload starts
    });

    uppy.on('complete', (result) => {
      this.isUploading.emit(false); // Set to false when all uploads are complete
    });

    return uppy;
  }

  private configureUppy(uppy: Uppy, dashboardSelector: string, endpoint: string, tokenHeader: any): void {
    uppy.use(Dashboard, {
      trigger: `${dashboardSelector}-trigger`,
      inline: true,
      proudlyDisplayPoweredByUppy : false,
      target: dashboardSelector,
      showProgressDetails: true,
      showRemoveButtonAfterComplete: true,
      doneButtonHandler: null,
      hideUploadButton: false,
    });
/*
    uppy.use(ProgressBar, {
      target: `${dashboardSelector}-progress`,
      fixed: false,
      hideAfterFinish: false
    });
*/
    uppy.use(XHRUpload, {
      endpoint: endpoint,
      fieldName: 'file',
      formData: true,
      headers: tokenHeader['headers'],
      bundle: false,
      limit: 0,
    });
  }
}
