import { Injectable } from '@angular/core';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';
import ProgressBar from '@uppy/progress-bar';
import { ApiService } from './api.service'; // Import your API service

@Injectable({
  providedIn: 'root'
})
export class UppyService {

  constructor(private api: ApiService) {}

  initializeUppy(type: string, mediaId: string, token: string, dashboardSelector: string, is_new: boolean = false): Uppy {
    const uppy = new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: type === 'image' ? ['image/*'] : ['application/pdf', 'application/msword']
      },
      autoProceed: false
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
      bundle: false
    });
  }
}
