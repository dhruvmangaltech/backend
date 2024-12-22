
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'

export class GameXlsUpload extends ServiceBase {
  async run () {
    const { gamexls } = this.args

    try {
      if (typeof (gamexls) === 'object' && gamexls.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const xlsx = require('node-xlsx')
        const data = xlsx.parse(gamexls.buffer)
        for (const dataItem of data) {
          if (dataItem.name !== 'Summary') {
            for (const rowData of dataItem.data.slice(1)) {
              const rowObject = {}

              // Iterate through each column in the row
              const columnHeaders = dataItem.data[0]
              const gameIDIndex = columnHeaders.indexOf('Game ID')
              const volatilityIndex = columnHeaders.indexOf('Volatility (x/5)')
              const maxBet = columnHeaders.indexOf('Max Bet (€)')
              const MinBet = columnHeaders.indexOf('Min Bet(€)')

              for (const [j, columnHeader] of columnHeaders.entries()) {
                rowObject[columnHeader] = rowData[j]
              }
              if (rowData[gameIDIndex] === '1178' || rowData[gameIDIndex] === 1178) {
                console.log('game')
              }

              // Check if "Game ID" is not undefined
              if (rowData[gameIDIndex] !== undefined) {
                let vat = null
                if (rowData[volatilityIndex]) {
                  vat = this.convertVatToDecimal(rowData[volatilityIndex] + '')
                }
                const findGame = await db.MasterCasinoGame.findOne({
                  where: { identifier: rowData[gameIDIndex] + '' },
                  attributes: ['moreDetails', 'masterCasinoGameId']
                })
                if (findGame) {
                  findGame.moreDetails = {
                    ...findGame.moreDetails,
                    volatility: vat,
                    maxBet: rowData[maxBet],
                    minBet: rowData[MinBet]
                  }
                  await findGame.save()
                }
              }
            }
          }
        }

        return { success: true }
      } else {
        return this.addError('SomethingWentWrongErrorType', 'Only xls format sheet is allowed')
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }

  convertVatToDecimal (vat) {
    let decimalValue = 0
    if (vat) {
      console.log(vat, 'vattt')
      if (vat?.includes('/')) {
      // If vat is in the format '3/5'
        const parts = vat.split('/')
        if (parts.length === 2) {
          decimalValue = parseFloat(parts[0]) / parseFloat(parts[1])
        }
      } else if (!isNaN(vat)) {
      // If vat is a number like '4'
        decimalValue = parseFloat(vat) / 5
      } else if (vat?.includes('\n')) {
      // If vat is in the format 'LV - 2\nEV - 5'
        const lines = vat.split('\n')
        for (const line of lines) {
          const parts = line.split('-')
          if (parts.length === 2 && parts[0].trim() === 'LV') {
            decimalValue = parseFloat(parts[1].trim()) / 5
            break
          }
        }
      } else if (vat.includes(' of ')) {
      // If vat is in the format '2 of 5'
        const parts = vat.split(' of ')
        if (parts.length === 2) {
          decimalValue = parseFloat(parts[0]) / parseFloat(parts[1])
        }
      }
    }
    return decimalValue.toFixed(2)
  }
}
