import { AlchemyProvider, InfuraProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
    ERC721TokenCodec,
    ERC721TokenType,
    ImmutableXClient,
    ImmutableXWallet,
    ImmutableXController,
    valueOrThrow,
    ImmutableMethodParams,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { NonceManager } from '@ethersproject/experimental'

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { BigNumber } from '@ethersproject/bignumber';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-DEPOSIT]';

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

    const signer = new Wallet(privateKey).connect(provider);
    const client = await ImmutableXClient.build({
        ...env.client,
        signer,
    });

    const param: ImmutableMethodParams.ImmutableStarkApproveNFTParamsTS = {
        tokenAddress: env.tokenAddress,
        tokenId: env.tokenId,
    };

    console.log(JSON.stringify(param, null, 2))

    const approve_result = await client.approveNFT(param);

    console.log(
        `approve nft: ${approve_result}`
    );
    console.log(JSON.stringify(approve_result, null, 2))
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
