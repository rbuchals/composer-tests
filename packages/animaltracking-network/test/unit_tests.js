'use strict';

const rewire = require('rewire'), contracts = rewire('../lib/model.cto'), sinon = require('sinon');

require('chai').should();

describe('Unit tests for smart contracts', function() {
    describe('#onAnimalMovementDeparture', () => {
        let private_onAnimalMovementDeparture;
        let updateAnimalMock = sinon.mock();
        let updateBusinessMock = sinon.mock();

        beforeEach(async () => {
            // Use the special '__get__' accessor to get your private function.
            private_onAnimalMovementDeparture = contracts.__get__('onAnimalMovementDeparture');
            // Use the special '__set__' accessor to set mock instead of your private function.
            contracts.__set__('updateAnimal', updateAnimalMock);
            contracts.__set__('updateBusiness', updateBusinessMock);
        });

        it('should fail if the animal is not IN_FIELD', async () => {
            let animalDeparture = {
                animal: {
                    movementStatus: 'IN_TRANSIT'
                }
            };

            try {
                await private_onAnimalMovementDeparture(animalDeparture);
            } catch(err) {
                err.message.should.equal('Animal is already IN_TRANSIT');
            }
        });

        it('should change some value', async () => {
            let animalDeparture = {
                animal: {
                    movementStatus: 'IN_FIELD'
                },
                to: {
                    incomingAnimals: []
                }
            };

            await private_onAnimalMovementDeparture(animalDeparture);

            animalDeparture.animal.movementStatus.should.equal('IN_TRANSIT');
        });
    });
});