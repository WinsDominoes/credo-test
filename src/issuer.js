import { TypedArrayEncoder } from '@credo-ts/core'
import { agent } from './agent.js'

const seed = TypedArrayEncoder.fromString(`aMHY7OAXTLll9sUiQyxfbb3ilBl9Ep2B`);
const unqualifiedIndyDid = `TcRRwCMANqWjEz82s8wRwH` 
const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`

await agent.dids.import({
    did: indyDid,
    overwrite: true,
    privateKeys: [
        {
            privateKey: seed,
            keyType: KeyType.Ed25519,
        },
    ],
})

const schemaResult = await agent.modules.anoncreds.registerSchema({
    schema: {
        attrNames: ['name'],
        issuerId: indyDid,
        name: 'Example Schema to register',
        version: '1.0.0',
    },
    options: {}
})

if (schemaResult.schemaState.state === 'failed')
{
    throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
}

const credentialDefinitionResult = await agent.modules.anoncreds.registerCredentialDefinition({
    credentialDefinition: {
        tag: 'default',
        issuerId: did,
        schemaId: schemaResult.schemaState.schemaId,
    },
    options: {
        supportRevocation: false,
    },
})
  
if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
    throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
    )
}