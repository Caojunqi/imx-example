import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { UpdateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: UpdateCollectionParams = {
    // name: 'CC_NFT_TEST_TOKEN',
    // description: 'Caojunqi NFT TEST FOR LEARNING!!',
    // icon_url: 'https://gateway.pinata.cloud/ipfs/QmQahB7u4CeUZmEvsFYj3Sps1Zbr9GUFN62qtrArru8TH2',
    // metadata_api_url: 'https://gateway.pinata.cloud/ipfs/Qmc5vDduvReZUq2mA1cyLprS8pnofhd2BuaZvjjyt43vqo',
    collection_image_url: 'https://gateway.pinata.cloud/ipfs/QmUNjkyhKA86QfTavrCb3MoZr4k9usTe4qrfVKfcLKYuKK'
  };

  let collection;
  try {
    collection = await user.updateCollection(collectionContractAddress, params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
