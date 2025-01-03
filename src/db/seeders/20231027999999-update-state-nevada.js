'use strict'
import db from '../../db/models'
import { getOne } from '../../utils/crud'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getCountryId = await getOne({
      model: db.Country,
      data: { code: 'US' }
    })
    const data = [
      {
        name: 'Nevada',
        stateCode: 'NV',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    await db.State.bulkCreate(data, {
      updateOnDuplicate: ['name']
    })

    const cityDataToPush = []
    const cityJson = [
      {
        'name': 'Alamo',
        'countryCode': 'US',
        'stateCode': 'NV',
        'latitude': '37.36496000',
        'longitude': '-115.16446000'
      },
      {
        'name': 'Battle Mountain',
        'countryCode': 'US',
        'stateCode': 'NV',
        'latitude': '40.64213000',
        'longitude': '-116.93427000'
      },
            {
                'name': 'Beatty',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.90856000',
                'longitude': '-116.75923000'
            },
            {
                'name': 'Boulder City',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '35.97859000',
                'longitude': '-114.83249000'
            },
            {
                'name': 'Bunkerville',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.77303000',
                'longitude': '-114.12802000'
            },
            {
                'name': 'Caliente',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '37.61496000',
                'longitude': '-114.51194000'
            },
            {
                'name': 'Carlin',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.71381000',
                'longitude': '-116.10397000'
            },
            {
                'name': 'Carson City',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.16380000',
                'longitude': '-119.76740000'
            },
            {
                'name': 'Churchill County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.58088000',
                'longitude': '-118.33578000'
            },
            {
                'name': 'Clark County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.21520000',
                'longitude': '-115.01356000'
            },
            {
                'name': 'Cold Springs',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.68019000',
                'longitude': '-119.97659000'
            },
            {
                'name': 'Dayton',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.23714000',
                'longitude': '-119.59295000'
            },
            {
                'name': 'Douglas County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.91224000',
                'longitude': '-119.61637000'
            },
            {
                'name': 'East Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.94340000',
                'longitude': '-119.69923000'
            },
            {
                'name': 'Elko',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.83242000',
                'longitude': '-115.76312000'
            },
            {
                'name': 'Elko County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '41.14583000',
                'longitude': '-115.35776000'
            },
            {
                'name': 'Ely',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.24744000',
                'longitude': '-114.88863000'
            },
            {
                'name': 'Enterprise',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.02525000',
                'longitude': '-115.24194000'
            },
            {
                'name': 'Esmeralda County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '37.78470000',
                'longitude': '-117.63237000'
            },
            {
                'name': 'Eureka',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.51271000',
                'longitude': '-115.96061000'
            },
            {
                'name': 'Eureka County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.98389000',
                'longitude': '-116.26856000'
            },
            {
                'name': 'Fallon',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.47353000',
                'longitude': '-118.77737000'
            },
            {
                'name': 'Fernley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.60797000',
                'longitude': '-119.25183000'
            },
            {
                'name': 'Gardnerville',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.94130000',
                'longitude': '-119.74962000'
            },
            {
                'name': 'Gardnerville Ranchos',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.88824000',
                'longitude': '-119.74129000'
            },
            {
                'name': 'Golden Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.61547000',
                'longitude': '-119.82658000'
            },
            {
                'name': 'Goldfield',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '37.70854000',
                'longitude': '-117.23563000'
            },
            {
                'name': 'Hawthorne',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.52464000',
                'longitude': '-118.62458000'
            },
            {
                'name': 'Henderson',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.03970000',
                'longitude': '-114.98194000'
            },
            {
                'name': 'Humboldt County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '41.40684000',
                'longitude': '-118.11197000'
            },
            {
                'name': 'Incline Village',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.25130000',
                'longitude': '-119.97297000'
            },
            {
                'name': 'Indian Hills',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.08602000',
                'longitude': '-119.78407000'
            },
            {
                'name': 'Jackpot',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '41.98324000',
                'longitude': '-114.67476000'
            },
            {
                'name': 'Johnson Lane',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.04796000',
                'longitude': '-119.72212000'
            },
            {
                'name': 'Kingsbury',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.97713000',
                'longitude': '-119.90685000'
            },
            {
                'name': 'Lander County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.93381000',
                'longitude': '-117.03791000'
            },
            {
                'name': 'Las Vegas',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.17497000',
                'longitude': '-115.13722000'
            },
            {
                'name': 'Laughlin',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '35.16778000',
                'longitude': '-114.57302000'
            },
            {
                'name': 'Lemmon Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.63602000',
                'longitude': '-119.84325000'
            },
            {
                'name': 'Lincoln County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '37.64335000',
                'longitude': '-114.87755000'
            },
            {
                'name': 'Lovelock',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.17935000',
                'longitude': '-118.47348000'
            },
            {
                'name': 'Lyon County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.02040000',
                'longitude': '-119.18920000'
            },
            {
                'name': 'McGill',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.40494000',
                'longitude': '-114.77863000'
            },
            {
                'name': 'Mesquite',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.80553000',
                'longitude': '-114.06719000'
            },
            {
                'name': 'Minden',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.95407000',
                'longitude': '-119.76573000'
            },
            {
                'name': 'Mineral County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.53881000',
                'longitude': '-118.43521000'
            },
            {
                'name': 'Moapa Town',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.68219000',
                'longitude': '-114.59416000'
            },
            {
                'name': 'Moapa Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.58053000',
                'longitude': '-114.47026000'
            },
            {
                'name': 'Mogul',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.51380000',
                'longitude': '-119.92603000'
            },
            {
                'name': 'Nellis Air Force Base',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.24607000',
                'longitude': '-115.05721000'
            },
            {
                'name': 'North Las Vegas',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.19886000',
                'longitude': '-115.11750000'
            },
            {
                'name': 'Nye County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.04238000',
                'longitude': '-116.47193000'
            },
            {
                'name': 'Pahrump',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.20829000',
                'longitude': '-115.98391000'
            },
            {
                'name': 'Paradise',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.09719000',
                'longitude': '-115.14666000'
            },
            {
                'name': 'Pershing County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.44036000',
                'longitude': '-118.40444000'
            },
            {
                'name': 'Pioche',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '37.92969000',
                'longitude': '-114.45221000'
            },
            {
                'name': 'Reno',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.52963000',
                'longitude': '-119.81380000'
            },
            {
                'name': 'Sandy Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '35.81692000',
                'longitude': '-115.63223000'
            },
            {
                'name': 'Silver Springs',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.41547000',
                'longitude': '-119.22461000'
            },
            {
                'name': 'Smith',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.80047000',
                'longitude': '-119.32738000'
            },
            {
                'name': 'Smith Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.78421000',
                'longitude': '-119.34425000'
            },
            {
                'name': 'Spanish Springs',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.64908000',
                'longitude': '-119.70741000'
            },
            {
                'name': 'Sparks',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.53491000',
                'longitude': '-119.75269000'
            },
            {
                'name': 'Spring Creek',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.72659000',
                'longitude': '-115.58590000'
            },
            {
                'name': 'Spring Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.10803000',
                'longitude': '-115.24500000'
            },
            {
                'name': 'Stagecoach',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.37380000',
                'longitude': '-119.37406000'
            },
            {
                'name': 'Storey County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.44653000',
                'longitude': '-119.52917000'
            },
            {
                'name': 'Summerlin South',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.11708000',
                'longitude': '-115.33001000'
            },
            {
                'name': 'Sun Valley',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.59630000',
                'longitude': '-119.77602000'
            },
            {
                'name': 'Sunrise Manor',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.21108000',
                'longitude': '-115.07306000'
            },
            {
                'name': 'Tonopah',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.06716000',
                'longitude': '-117.23008000'
            },
            {
                'name': 'Topaz Ranch Estates',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.73565000',
                'longitude': '-119.50079000'
            },
            {
                'name': 'Verdi',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.51824000',
                'longitude': '-119.98881000'
            },
            {
                'name': 'Virginia City',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.30963000',
                'longitude': '-119.64962000'
            },
            {
                'name': 'Washoe County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.66542000',
                'longitude': '-119.66430000'
            },
            {
                'name': 'Wells',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '41.11159000',
                'longitude': '-114.96449000'
            },
            {
                'name': 'West Wendover',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.73910000',
                'longitude': '-114.07335000'
            },
            {
                'name': 'White Pine County',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '39.44216000',
                'longitude': '-114.90159000'
            },
            {
                'name': 'Whitney',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.09831000',
                'longitude': '-115.03630000'
            },
            {
                'name': 'Winchester',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '36.12997000',
                'longitude': '-115.11889000'
            },
            {
                'name': 'Winnemucca',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '40.97296000',
                'longitude': '-117.73568000'
            },
            {
                'name': 'Yerington',
                'countryCode': 'US',
                'stateCode': 'NV',
                'latitude': '38.98575000',
                'longitude': '-119.16293000'
            }]
        for (const cityData of cityJson) {
            const getStateId = await getOne({
                model: db.State,
                data: { state_code: cityData.stateCode }
            })
            if (getStateId?.stateId) {
                cityDataToPush.push({
                    stateId: getStateId?.stateId,
                    name: cityData.name,
                    created_at: new Date(),
                    updated_at: new Date()
                })
            }
        }
        if (cityDataToPush.length) {
            await db.City.bulkCreate(cityDataToPush, {
                updateOnDuplicate: ['name']
            })
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkDelete('state', null, {})
        } catch (error) {
            console.log(error)
        }
    }
}
