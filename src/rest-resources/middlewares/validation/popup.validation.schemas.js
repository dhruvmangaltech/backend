export const popupUploadSchemas = {
  bodySchema: {
    $ref: '/popup-upload.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createPopup: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const popupUpdateSchemas = {
  bodySchema: {
    $ref: '/popup-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatePopup: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const popupDeleteSchemas = {
  bodySchema: {
    $ref: '/popup-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const popupGetAllSchemas = {
  querySchema: {
    $ref: '/popup-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        popups: { type: 'object' }
      },
      required: ['message']
    }
  }
}

//   export const bannerKeysSchemas = {
//     bodySchema: {
//       $ref: '/banner-keys.json'
//     },
//     responseSchema: {
//       default: {
//         type: 'object',
//         properties: {
//           message: { type: 'string' },
//           bannerKey: { type: 'array' }
//         },
//         required: ['message']
//       }
//     }
//   }

//   export const bannerOrderSchemas = {
//     bodySchema: {
//       $ref: '/order-banner.json'
//     },
//     responseSchema: {
//       default: {
//         type: 'object',
//         properties: {
//           message: { type: 'string' },
//           success: { type: 'boolean' }
//         },
//         required: ['message', 'success']
//       }
//     }
//   }
