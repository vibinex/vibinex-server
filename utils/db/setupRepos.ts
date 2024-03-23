import conn from '.';

export interface SetupReposArgs {
    repo_owner: string;
    repo_provider: string;
    repo_names: string[];
    install_id: string;
}

interface SetupResponse {
    message: string;
}

const saveSetupReposInDb = async (args: SetupReposArgs): Promise<SetupResponse> => {
    const { repo_owner, repo_provider, repo_names, install_id } = args;
    const query = `SELECT EXISTS(SELECT 1 FROM repos WHERE repo_owner = $1 AND repo_provider = $2)`

    return conn.query(query, [repo_owner, repo_provider])
        .then(async (orgExistsResult) => {
        const orgExists = orgExistsResult.rows[0].exists;

        if (!orgExists) {
            await addOrganization(repo_owner, repo_provider, repo_names, install_id).catch(error => {
                console.error(`[saveSetupReposInDb] Could not add organisation in repos table for: ${repo_provider}/${repo_owner} for install_id ${install_id}`, error );
                throw new Error('Failed to add organization', error);
            });
        } else {
            await handleRepoSetupAndRemoveExtra(repo_names, repo_owner, repo_provider, install_id).catch(error => {
                console.error(`[saveSetupreposInDb] error in handleReposetupAndRemoveExtra function: ${repo_provider}/${repo_owner} for install_id ${install_id}`, error);
                throw new Error('Failed to handle repo setup and remove extra repositories', error);
            });
        }
        return { message: 'setup repos are saved in db successfully' };
        })
        .catch(error => {
            console.error(`[saveSetupReposInDb] Could not save setup repos in db for: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, error );
            throw new Error('Failed to save set up repos in db', error);
        });
};


const addOrganization = async (repo_owner: string, repo_provider: string, repo_names: string[], install_id: string) => {
    await conn.query('BEGIN').catch(err => {
        console.error(`[addOrganisation] Could not start db transaction: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to begin transaction');
    })
    const query = `INSERT INTO repos (repo_name, repo_owner, repo_provider, install_id) VALUES ($1, $2, $3, $4)`
    await Promise.all(repo_names.map(repo_name => conn.query(query, [repo_name, repo_owner, repo_provider, [install_id]])
        .catch(error => {
            console.error(`[addOrganisation] Could not add repos data in repos table for: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, error);
            throw new Error('Failed to insert repos data');
        })));
    await conn.query('COMMIT').catch(err => {
        console.error(`[addOrganisation] Could not commit db transaction: ${repo_provider}/${repo_owner}  `, { pg_query: query }, err);
        throw new Error('Failed to commit transaction');
    })
};

// Function to handle setup for a single repository and remove extra repositories
const handleRepoSetupAndRemoveExtra = async (repo_names: string[], repo_owner: string, repo_provider: string, install_id: string) => {
    await Promise.all(repo_names.map(repo_name => handleRepoSetup(repo_name, repo_owner, repo_provider, install_id)
        .catch(error => {
            console.error(`[handleReposetupAndRemoveExtra] Error in handleRepoSetup: ${repo_provider}/${repo_owner} for install_id ${install_id}`, error);
            throw new Error('Failed to handle repo setup');
        })));
    await removeExtraRepositories(repo_names, repo_owner, repo_provider, install_id).catch(error => {
        console.error(`[handleReposetupAndRemoveExtra] Error in removeExtraRepositories: ${repo_provider}/${repo_owner} for install_id ${install_id}`, error);
        throw new Error('Failed to remove extra repositories');
    });
};

// Function to handle setup for a single repository
const handleRepoSetup = async (repo_name: string, repo_owner: string, repo_provider: string, install_id: string) => {
    await conn.query('BEGIN').catch(err => {
        console.error(`[handleRepoSetup] Could not start db transaction: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to begin transaction');
    });
    const query = `SELECT install_id FROM repos WHERE repo_name = $1 AND repo_owner = $2 AND repo_provider = $3`;
    const existingInstallationsResult = await conn.query(query, [repo_name, repo_owner, repo_provider]).catch(err => {
        console.error(`[handleRepoSetup] Could not get the install-id for repository: ${repo_provider}/${repo_owner}/${repo_name} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error("Error in getting install-id from db");
    });

    const existingInstallations = existingInstallationsResult.rows.map(row => row.install_id);

    // Iterate over each row
    if (existingInstallations && existingInstallations.length > 0) {
        for (const installations of existingInstallations) {
            // Check if the install_id is already present in the array
            if (!installations.includes(install_id)) {
                installations.push(install_id);
                const updateQuery = 'UPDATE repos SET install_id = $1 WHERE repo_name = $2 AND repo_owner = $3 AND repo_provider = $4';
                await conn.query(updateQuery, [installations, repo_name, repo_owner, repo_provider])
                    .catch(err => {
                        console.error(`[handleRepoSetup] Could not update the install-id array for repository: ${repo_provider}/${repo_owner}/${repo_name} for install_id ${install_id}`, { pg_query: query }, err);
                        throw new Error('Failed to update install-id array for repo');
                    });
            }
        }
    } else {
        //If no installation exist that means add that repo into repos table with the upcoming install_id
        const query = `INSERT INTO repos (repo_name, repo_owner, repo_provider, install_id) VALUES ($1, $2, $3, $4)`
        await conn.query(query, [repo_name, repo_owner, repo_provider, [install_id]]).catch(err => {
            console.error(`[handleRepoSetup] could not insert repo into repos table: ${repo_provider}/${repo_owner}/${repo_name} for install_id ${install_id}`, { pg_query: query }, err);
            throw new Error("Error in inserting repo in db");
        })
    }

    await conn.query('COMMIT').catch(err => {
        console.error(`[handleRepoSetup] Could not commit DB transaction: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to commit db transaction');
    });
};

const removeExtraRepositories = async (incomingRepoNames: string[], repo_owner: string, repo_provider: string, install_id: string) => {
    await conn.query('BEGIN').catch(err => {
        console.error(`[removeExtraRepositories] Could not start db transaction: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to begin db transaction');
    });

    const query = `SELECT repo_name FROM repos WHERE repo_owner = $1 AND repo_provider = $2 AND $3 = ANY(install_id)`;

    const existingReposResult = await conn.query(query, [repo_owner, repo_provider, install_id]).catch(err => {
        console.error(`[removeExtraRepositories] Could not get existing repositories from db for: ${repo_provider}/${repo_owner} for install_id: ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to get existing repos from db');
    });

    const existingRepos = existingReposResult.rows.map(row => row.repo_name);
    const extraRepos = existingRepos.filter(repo => !incomingRepoNames.includes(repo));


    for (const repo_name of extraRepos) {
        // Check if the current extra repo is the only one associated with the install_id
        const singleRepoQuery = `SELECT install_id FROM repos WHERE repo_name = $1 AND repo_owner = $2 AND repo_provider = $3`;
        const singleRepoResult = await conn.query(singleRepoQuery, [repo_name, repo_owner, repo_provider]).catch(err => {
            console.error(`[removeExtraRepositories] Error checking if repo is the only one: ${repo_provider}/${repo_owner}/${repo_name} for install_id ${install_id}`, { pg_query: singleRepoQuery }, err);
            throw new Error('Failed to check if repo is the only one associated with install_id');
        });

        const install_ids = singleRepoResult.rows[0]?.install_id || [];
        const updatedInstallIds = install_ids.filter((id: String) => id !== install_id);
        await conn.query('UPDATE repos SET install_id = $1 WHERE repo_name = $2 AND repo_owner = $3 AND repo_provider = $4', [updatedInstallIds, repo_name, repo_owner, repo_provider])
        .catch(err => {
            console.error(`[removeExtraRepositories] Could not remove install_id from extra repo: ${repo_provider}/${repo_owner}/${repo_name} for install_id ${install_id}`, { pg_query: query }, err);
            throw new Error('Failed to remove install_id from extra repo');
        });
    }

    await conn.query('COMMIT').catch(err => {
        console.error(`[removeExtraRepositories] Could not commit DB transaction: ${repo_provider}/${repo_owner} for install_id ${install_id}`, { pg_query: query }, err);
        throw new Error('Failed to commit db transaction');
    });
};

export default saveSetupReposInDb;
