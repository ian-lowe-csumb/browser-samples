// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// [START slides_image_merging]
function imageMerging(templatePresentationId, imageUrl, customerName, callback) {
  const logoUrl = imageUrl;
  const customerGraphicUrl = imageUrl;

  // Duplicate the template presentation using the Drive API.
  const copyTitle = customerName + ' presentation';
  try {
    gapi.client.drive.files.copy({
      fileId: templatePresentationId,
      resource: {
        name: copyTitle,
      },
    }).then((driveResponse) => {
      const presentationCopyId = driveResponse.result.id;

      // Create the image merge (replaceAllShapesWithImage) requests.
      const requests = [{
        replaceAllShapesWithImage: {
          imageUrl: logoUrl,
          replaceMethod: 'CENTER_INSIDE',
          containsText: {
            text: '{{company-logo}}',
            matchCase: true,
          },
        },
      }, {
        replaceAllShapesWithImage: {
          imageUrl: customerGraphicUrl,
          replaceMethod: 'CENTER_INSIDE',
          containsText: {
            text: '{{customer-graphic}}',
            matchCase: true,
          },
        },
      }];
        // Execute the requests for this presentation.
      gapi.client.slides.presentations.batchUpdate({
        presentationId: presentationCopyId,
        requests: requests,
      }).then((batchUpdateResponse) => {
        let numReplacements = 0;
        for (let i = 0; i < batchUpdateResponse.result.replies.length; ++i) {
          numReplacements += batchUpdateResponse.result.replies[i].replaceAllShapesWithImage.occurrencesChanged;
        }
        console.log(`Created merged presentation with ID: ${presentationCopyId}`);
        console.log(`Replaced ${numReplacements} shapes with images.`);
        if (callback) callback(batchUpdateResponse.result);
      });
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
}
// [END slides_image_merging]
