export const addRubyPlayGamesSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      masterCasinoProviderId: {
        type: 'string',
        pattern: '^[0-9]+$'
      }
    },
    required: ['masterCasinoProviderId']
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
