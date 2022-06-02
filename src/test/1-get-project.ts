import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { GetProjectParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-PROJECT]';

log.info(component, env.alchemyApiKey);

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

    const signer = new Wallet(privateKey).connect(provider);

    const user = await ImmutableXClient.build({
        ...env.client,
        signer,
        enableDebug: true,
    });

    log.info(component, 'Test get own projects...');

    /**
     * Edit your values here
     */
    let PROJECT_id = 52057
    const params: GetProjectParams = {
        project_id: PROJECT_id
    };

    let project;
    try {
        project = await user.getProject(params);
    } catch (error) {
        throw new Error(JSON.stringify(error, null, 2));
    }

    log.info(component, `get project with ID[` + PROJECT_id + `]:
                                            id:${project.id}
                                            name:${project.name}
                                            company_name:${project.company_name}
                                            contact_email:${project.contact_email}
                                            collection_limit_expires_at:${project.collection_limit_expires_at}
                                            collection_monthly_limit:${project.collection_monthly_limit}
                                            collection_remaining:${project.collection_remaining}
                                            mint_limit_expires_at:${project.mint_limit_expires_at}
                                            mint_monthly_limit:${project.mint_monthly_limit}
                                            mint_remaining:${project.mint_remaining}\n`);
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
