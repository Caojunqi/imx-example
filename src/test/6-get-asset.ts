import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
    ImmutableMethodParams,
    ImmutableXClient,
    MetadataTypes,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
    const collectionContractAddress = requireEnvironmentVariable(
        'COLLECTION_CONTRACT_ADDRESS',
    );

    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(provider);

    const user = await ImmutableXClient.build({
        ...env.client,
        signer,
        enableDebug: true,
    });

    const param: ImmutableMethodParams.ImmutableGetAssetParamsTS = {
        address: collectionContractAddress,
        id:env.tokenId
    };

    const asset = await user.getAsset(param);

    console.log(JSON.stringify(asset, null, 2));
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
