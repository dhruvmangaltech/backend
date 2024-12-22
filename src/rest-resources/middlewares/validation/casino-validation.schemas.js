export const casinoProviderCreateSchemas = {
  bodySchema: {
    $ref: '/casino-provider-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createCasinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoProviderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-provider-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateCasinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoProviderDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-provider-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const casinoProviderGetAllSchemas = {
  bodySchema: {
    $ref: '/casino-provider-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const casinoCategoryCreateSchemas = {
  bodySchema: {
    $ref: '/casino-category-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createCategory: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-category-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateCategory: { type: 'array' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryGetAllSchemas = {
  bodySchema: {
    $ref: '/casino-category-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryOrderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-category-order-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-category-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}
export const getSubCategorySchemas = {
  querySchema: {
    $ref: '/get-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        subCategory: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        }
      },
      required: ['message', 'success', 'subCategory']
    }
  }
}

export const createSubCategorySchemas = {
  bodySchema: {
    $ref: '/create-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const updateSubCategorySchemas = {
  bodySchema: {
    $ref: '/update-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const orderSubCategorySchemas = {
  bodySchema: {
    $ref: '/order-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const deleteSubCategorySchemas = {
  bodySchema: {
    $ref: '/delete-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}
export const casinoGameCreateSchemas = {
  bodySchema: {
    $ref: '/casino-game-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const casinoGameUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-game-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createGame: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoGameDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-game-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const casinoGameOrderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-game-order-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}
export const getCasinoTransactionsSchemas = {
  querySchema: {
    $ref: '/get-casino-transactions.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        sumOfAmount: { type: 'object' },
        transactionDetail: { type: 'object' }
      },
      required: []
    }
  }
}
